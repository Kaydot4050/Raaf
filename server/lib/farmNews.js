import Parser from 'rss-parser';
import { query } from '../db.js';
import { isGoogleNewsUrl } from './googleNews.js';
import { proxyNewsImage } from './newsImageUrl.js';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure', 'content:encoded'],
  },
});

const MEMORY_CACHE_MS = 15 * 60 * 1000;
const DB_CACHE_MS = 3 * 60 * 60 * 1000;

let memoryCache = { items: null, fetchedAt: 0 };

/**
 * Direct publisher feeds only, so every article has a real URL we can open in-site.
 * `filter: true` feeds are general-news sources — keep only farm/agri items.
 */
const FEEDS = {
  ghana: [
    { url: 'https://www.myjoyonline.com/business/feed/', filter: true },
    { url: 'https://www.ghanabusinessnews.com/feed/', filter: true },
    { url: 'https://thebftonline.com/feed/', filter: true },
    { url: 'https://3news.com/feed/', filter: true },
    { url: 'https://www.myjoyonline.com/feed/', filter: true },
  ],
  africa: [
    { url: 'https://allafrica.com/tools/headlines/rdf/agriculture/headlines.rdf', filter: false },
    { url: 'https://www.farmersreviewafrica.com/feed/', filter: false },
  ],
  global: [
    { url: 'https://poultrytimes.com/feed', filter: false },
  ],
};

/** Farm/agri relevance gate for general-news feeds. */
const FARM_TOPIC =
  /\b(poultry|broiler|layer|chicken|egg|hen|hatchery|livestock|cattle|goat|sheep|pig|swine|cow|farm|farmer|farming|agric\w*|crop|maize|cocoa|harvest|grain|soybean|fertili[sz]er|feed|veterinary|avian|irrigation|aquaculture|agribusiness|cashew)\b/i;

/** GNews free tier = 100 requests/day. Off by default — RSS feeds cover the news list. */
function gnewsEnabled() {
  return process.env.GNEWS_ENABLED === 'true' && Boolean(process.env.GNEWS_API_KEY);
}

const GNEWS_REQUESTS = {
  ghana: [{ endpoint: 'search', params: { q: 'agriculture OR poultry OR farming', country: 'gh', max: '10' } }],
  africa: [{ endpoint: 'search', params: { q: 'agriculture OR poultry OR livestock Africa', max: '10' } }],
  global: [{ endpoint: 'search', params: { q: 'poultry OR agriculture OR farming', max: '10' } }],
};

const CATEGORY_RULES = [
  { id: 'disease', label: 'Disease Alerts', re: /\b(disease|outbreak|avian|flu|influenza|biosecurity|vaccination|woah|oie)\b/i },
  { id: 'market', label: 'Market Prices', re: /\b(price|prices|market|cost|maize|feed cost|commodity|inflation)\b/i },
  { id: 'poultry', label: 'Poultry', re: /\b(poultry|broiler|layer|chicken|egg|chick|hen|rooster)\b/i },
  { id: 'livestock', label: 'Livestock', re: /\b(livestock|cattle|goat|sheep|pig|swine|cow)\b/i },
  { id: 'crops', label: 'Crops', re: /\b(crop|maize|harvest|grain|soybean|fertilizer|planting)\b/i },
  { id: 'equipment', label: 'Farm Equipment', re: /\b(equipment|tractor|machinery|automation|technology|tech)\b/i },
];

const GHANA_HINTS = /\b(ghana|accra|kumasi|tamale|tema|cape coast|greater accra|ashanti|northern region)\b/i;
const AFRICA_HINTS = /\b(africa|nigeria|kenya|ethiopia|tanzania|uganda|senegal|ivory coast|côte d'ivoire|south africa|zambia|mozambique)\b/i;

const BOILERPLATE = [
  /Join \d+,?\d*\+? subscribers/gi,
  /Subscribe to our newsletter[^.]*\.?/gi,
  /.*?indicates required fields.*/gi,
];

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&#8217;': '\u2019',
  '&#8216;': '\u2018',
  '&#8220;': '\u201c',
  '&#8221;': '\u201d',
  '&#8211;': '\u2013',
  '&#8212;': '\u2014',
  '&hellip;': '\u2026',
};

function decodeEntities(text = '') {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&[a-z]+;/gi, (m) => ENTITIES[m] ?? m);
}

function cleanText(text = '') {
  let out = decodeEntities(text);
  BOILERPLATE.forEach((p) => {
    out = out.replace(p, '');
  });
  return out.trim();
}

function detectCategory(text) {
  for (const rule of CATEGORY_RULES) {
    if (rule.re.test(text)) return { id: rule.id, label: rule.label };
  }
  return { id: 'agriculture', label: 'Agriculture' };
}

function detectRegion(text, fallback = 'global') {
  if (GHANA_HINTS.test(text)) return 'ghana';
  if (AFRICA_HINTS.test(text)) return 'africa';
  return fallback;
}

function extractRssImage(item) {
  if (item['media:content']?.$?.url) return proxyNewsImage(decodeURIComponent(item['media:content'].$.url));
  if (item['media:thumbnail']?.$?.url) return proxyNewsImage(decodeURIComponent(item['media:thumbnail'].$.url));
  if (item.enclosure?.url && /\.(jpe?g|png|webp|gif)/i.test(item.enclosure.url)) {
    return proxyNewsImage(decodeURIComponent(item.enclosure.url));
  }
  const html = item['content:encoded'] || item.content || item.summary || '';
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)/i);
  if (imgMatch?.[1]?.startsWith('http')) return proxyNewsImage(imgMatch[1]);
  return null;
}

const PUBLISHER_NAMES = {
  'myjoyonline.com': 'MyJoyOnline',
  'ghanabusinessnews.com': 'Ghana Business News',
  'thebftonline.com': 'B&FT Online',
  '3news.com': '3News',
  'allafrica.com': 'AllAfrica',
  'farmersreviewafrica.com': 'Farmers Review Africa',
  'poultrytimes.com': 'Poultry Times',
};

/** Turn author emails / "email (Name)" / messy creators into a clean publisher label. */
function cleanSource(source, url) {
  let host = '';
  try {
    host = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    /* ignore */
  }
  if (PUBLISHER_NAMES[host]) return PUBLISHER_NAMES[host];

  const raw = (source || '').trim();
  if (!raw || /@/.test(raw) || /\.(com|org|net|gh)\b/i.test(raw)) {
    return host || raw || 'Farm News';
  }
  return raw;
}

function normalizeItem(raw) {
  const summary = cleanText(raw.summary || raw.contentSnippet || raw.description || '');
  const text = `${raw.title || ''} ${summary}`;
  const category = detectCategory(text);
  const region = raw.region || detectRegion(text, 'global');

  const image = raw.image || raw.imageUrl || null;

  return {
    title: decodeEntities(raw.title || 'Untitled'),
    summary,
    image,
    source: raw.source || 'Farm News',
    publishedAt: raw.publishedAt || raw.pubDate || new Date().toISOString(),
    category: category.label,
    categoryId: category.id,
    region,
    url: raw.url || raw.link,
    link: raw.url || raw.link,
    contentSnippet: summary,
    imageUrl: image,
    pubDate: raw.publishedAt || raw.pubDate,
  };
}

function publishableItem(item) {
  return Boolean(item?.title && item?.url);
}

async function fetchRssFeeds(region) {
  const feeds = FEEDS[region] || [];
  const batches = await Promise.all(
    feeds.map(async ({ url, filter }) => {
      try {
        const feed = await parser.parseURL(url);
        return (feed?.items || [])
          .map((item) => {
            const articleLink = item.link;
            if (!articleLink || isGoogleNewsUrl(articleLink)) return null;

            const text = `${item.title || ''} ${item.contentSnippet || ''}`;
            if (filter && !FARM_TOPIC.test(text)) return null;

            const rawSource =
              (typeof item.source === 'string'
                ? item.source
                : item?.source?.title) ||
              item.creator ||
              feed.title ||
              'RSS';

            return normalizeItem({
              title: item.title,
              url: articleLink,
              link: articleLink,
              summary: item.contentSnippet,
              publishedAt: item.pubDate,
              image: extractRssImage(item),
              source: cleanSource(rawSource, articleLink),
              region,
            });
          })
          .filter(Boolean);
      } catch (err) {
        console.warn(`[farmNews] RSS failed (${region}):`, url, err.message);
        return [];
      }
    }),
  );
  return batches.flat();
}

async function fetchGNews(region) {
  if (!gnewsEnabled()) return [];
  const apiKey = process.env.GNEWS_API_KEY;

  const requests = GNEWS_REQUESTS[region] || [];
  const articles = [];

  for (const req of requests) {
    try {
      const params = new URLSearchParams({ ...req.params, lang: 'en', apikey: apiKey });
      const res = await fetch(`https://gnews.io/api/v4/${req.endpoint}?${params}`, {
        signal: AbortSignal.timeout(12_000),
      });
      if (!res.ok) {
        console.warn(`[farmNews] GNews ${region}/${req.endpoint} HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      for (const a of data.articles || []) {
        if (!a.url || isGoogleNewsUrl(a.url)) continue;
        articles.push(
          normalizeItem({
            title: a.title,
            url: a.url,
            summary: a.description,
            publishedAt: a.publishedAt,
            image: a.image ? proxyNewsImage(a.image) : null,
            source: a.source?.name || 'GNews',
            region,
          }),
        );
      }
    } catch (err) {
      console.warn(`[farmNews] GNews ${region}:`, err.message);
    }
  }

  return dedupeItems(articles);
}

function dedupeItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = (item.title || '').toLowerCase().replace(/\W+/g, '').slice(0, 80);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortByDate(items) {
  return [...items].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

/** Target mix: ~65% Ghana, ~25% Africa, ~10% global */
function balanceRegions(items, limit = 24) {
  const buckets = { ghana: [], africa: [], global: [] };
  for (const item of sortByDate(items)) {
    buckets[item.region]?.push(item);
  }

  const targets = {
    ghana: Math.round(limit * 0.65),
    africa: Math.round(limit * 0.25),
    global: Math.max(2, limit - Math.round(limit * 0.65) - Math.round(limit * 0.25)),
  };

  const picked = [];
  const used = new Set();

  const take = (region, count) => {
    for (const item of buckets[region]) {
      if (picked.length >= limit || picked.filter((i) => i.region === region).length >= count) break;
      const key = item.url || item.title;
      if (used.has(key)) continue;
      used.add(key);
      picked.push(item);
    }
  };

  take('ghana', targets.ghana);
  take('africa', targets.africa);
  take('global', targets.global);

  for (const item of sortByDate(items)) {
    if (picked.length >= limit) break;
    const key = item.url || item.title;
    if (used.has(key)) continue;
    used.add(key);
    picked.push(item);
  }

  return sortByDate(picked);
}

function hasExternalImage(image) {
  return image && (image.includes('/external/image?') || image.startsWith('http'));
}

async function enrichMissingImages(items) {
  if (process.env.NEWS_SNAPSHOT_MODE === '1') return items;
  return Promise.all(
    items.map(async (item) => {
      if (hasExternalImage(item.image)) return item;
      if (!item.url || isGoogleNewsUrl(item.url)) return item;
      try {
        const articleUrl = item.url;
        const resp = await fetch(articleUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(8000),
          redirect: 'follow',
        });
        if (!resp.ok) return item;
        const html = await resp.text();
        const og =
          html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) ||
          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        let foundUrl = og?.[1];
        if (foundUrl?.includes('aa-logo-rgba-no-text-square.png')) foundUrl = null;
        if (foundUrl?.startsWith('http')) {
          item.image = proxyNewsImage(foundUrl);
          item.imageUrl = item.image;
        }
      } catch {
        /* optional */
      }
      return item;
    }),
  );
}

async function readDbCache() {
  try {
    const result = await query('SELECT items, fetched_at FROM farm_news_cache WHERE id = 1');
    const row = result.rows[0];
    if (!row) return null;
    const age = Date.now() - new Date(row.fetched_at).getTime();
    if (age > DB_CACHE_MS) return null;
    const items = (row.items || []).filter(publishableItem);
    return items.length ? items : null;
  } catch {
    return null;
  }
}

async function writeDbCache(items) {
  try {
    await query(
      `INSERT INTO farm_news_cache (id, items, fetched_at) VALUES (1, $1, NOW())
       ON CONFLICT (id) DO UPDATE SET items = EXCLUDED.items, fetched_at = NOW()`,
      [JSON.stringify(items)],
    );
  } catch (err) {
    console.warn('[farmNews] DB cache write failed:', err.message);
  }
}

export async function fetchFreshNews() {
  const [ghanaRss, africaRss, globalRss, ghanaG, africaG, globalG] = await Promise.all([
    fetchRssFeeds('ghana'),
    fetchRssFeeds('africa'),
    fetchRssFeeds('global'),
    fetchGNews('ghana'),
    fetchGNews('africa'),
    fetchGNews('global'),
  ]);

  const combined = dedupeItems([
    ...ghanaG,
    ...ghanaRss,
    ...africaG,
    ...africaRss,
    ...globalG,
    ...globalRss,
  ]).filter(publishableItem);

  const balanced = balanceRegions(combined, 24);
  return enrichMissingImages(balanced);
}

function applyCategoryFilter(items, category) {
  if (!category || category === 'all') return items;
  return items.filter((i) => i.categoryId === category);
}

/**
 * @param {{ region?: string, category?: string }} [filters]
 */
export async function getFarmNews(filters = {}) {
  const region = filters.region && filters.region !== 'all' ? filters.region : null;
  const category = filters.category && filters.category !== 'all' ? filters.category : null;

  if (!region && !category) {
    if (memoryCache.items && Date.now() - memoryCache.fetchedAt < MEMORY_CACHE_MS) {
      const cached = memoryCache.items.filter(publishableItem);
      if (cached.length) return cached;
    }
    const dbItems = await readDbCache();
    if (dbItems?.length) {
      memoryCache = { items: dbItems, fetchedAt: Date.now() };
      return dbItems;
    }
    const items = await fetchFreshNews();
    memoryCache = { items, fetchedAt: Date.now() };
    await writeDbCache(items);
    return items;
  }

  if (region) {
    const pool = await getFarmNews({});
    let items = applyCategoryFilter(
      pool.filter((i) => i.region === region),
      category,
    );
    if (!items.length) {
      const rss = await fetchRssFeeds(region);
      items = applyCategoryFilter(dedupeItems(rss).filter(publishableItem), category);
    }
    return enrichMissingImages(sortByDate(items).slice(0, 18));
  }

  let items = memoryCache.items?.filter(publishableItem);
  if (!items?.length) {
    const dbItems = await readDbCache();
    items = dbItems?.length ? dbItems : await fetchFreshNews();
  }
  let filtered = applyCategoryFilter(items, category);
  if (!filtered.length && category) filtered = items.slice(0, 18);
  return filtered;
}
