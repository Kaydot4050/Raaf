import { Router } from 'express';
import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure', 'content:encoded'],
  },
});

// RSS Feed URLs for agriculture/poultry news (ordered by relevance)
const NEWS_FEEDS = [
  'https://poultrytimes.com/feed',
  'https://news.google.com/rss/search?q=poultry+farming+agriculture&hl=en-US&gl=US&ceid=US:en',
  'https://farmpolicynews.illinois.edu/feed',
];

// In-memory cache to avoid hammering feeds on every page load
let newsCache = { items: null, fetchedAt: 0 };
const NEWS_CACHE_MS = 15 * 60 * 1000; // 15 minutes

const geocodeSearchCache = new Map();
const GEOCODE_CACHE_MS = 10 * 60 * 1000;

function formatGeocodeLabel({ name, admin1, admin2, country }) {
  return [name, admin2 || admin1, country].filter(Boolean).join(', ');
}

router.get('/geocode/search', asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) return res.json({ results: [] });

  const cacheKey = q.toLowerCase();
  const cached = geocodeSearchCache.get(cacheKey);
  if (cached && Date.now() - cached.at < GEOCODE_CACHE_MS) {
    return res.json({ results: cached.results });
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
  const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!response.ok) {
    return res.status(502).json({ error: 'Location search unavailable.' });
  }

  const data = await response.json();
  const results = (data.results || []).map((row) => ({
    lat: String(row.latitude),
    lon: String(row.longitude),
    display_name: formatGeocodeLabel(row),
    address: {
      suburb: row.name,
      town: row.name,
      city: row.admin2 || row.admin1,
      county: row.admin1,
      country: row.country,
    },
  }));

  geocodeSearchCache.set(cacheKey, { at: Date.now(), results });
  res.json({ results });
}));

router.get('/geocode/reverse', asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' });

  const url = `https://photon.komoot.io/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!response.ok) {
    return res.status(502).json({ error: 'Could not resolve location name.' });
  }

  const data = await response.json();
  const p = data.features?.[0]?.properties || {};
  res.json({
    address: {
      suburb: p.district || p.suburb,
      neighbourhood: p.district,
      town: p.city,
      village: p.city,
      city: p.city,
      county: p.county || p.state,
      country: p.country,
    },
    display_name: [p.district || p.city, p.state, p.country].filter(Boolean).join(', '),
  });
}));

router.get('/weather', asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;
  
  // Default to Accra, Ghana coordinates if not provided
  const latitude = lat || '5.6037';
  const longitude = lon || '-0.1870';

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

  const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  res.json(data);
}));

/**
 * Try each RSS feed in order until one succeeds.
 * Returns the parsed feed or throws if all fail.
 */
async function fetchFirstWorkingFeed(urls) {
  let lastError;
  for (const url of urls) {
    try {
      const feed = await parser.parseURL(url);
      if (feed && feed.items && feed.items.length > 0) {
        return feed;
      }
    } catch (err) {
      console.warn(`RSS feed failed (${url}):`, err.message);
      lastError = err;
    }
  }
  throw lastError || new Error('All RSS feeds failed');
}

router.get('/news', asyncHandler(async (req, res) => {
  try {
    // Return cached data if still fresh
    if (newsCache.items && Date.now() - newsCache.fetchedAt < NEWS_CACHE_MS) {
      return res.json({ items: newsCache.items });
    }

    const feed = await fetchFirstWorkingFeed(NEWS_FEEDS);
    
    const items = feed.items.slice(0, 10).map(item => {
      // Try to extract an image if available in standard RSS fields
      let imageUrl = null;
      if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
        const raw = decodeURIComponent(item['media:content']['$'].url);
        imageUrl = `/api/external/image?url=${encodeURIComponent(raw)}`;
      } else if (item.enclosure && item.enclosure.url) {
        const raw = decodeURIComponent(item.enclosure.url);
        imageUrl = `/api/external/image?url=${encodeURIComponent(raw)}`;
      }

      // Fallback: try to find an <img> in the HTML content
      if (!imageUrl) {
        const htmlContent = item['content:encoded'] || item.content || '';
        const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)/i);
        if (imgMatch && imgMatch[1].startsWith('http')) {
          imageUrl = `/api/external/image?url=${encodeURIComponent(imgMatch[1])}`;
        }
      }

      let cleanSnippet = item.contentSnippet || '';
      const boilerplatePatterns = [
        /Join \d+,?\d*\+? subscribers/gi,
        /Subscribe to our newsletter to stay updated about all the need-to-know content in the poultry sector, three times a week\.?/gi,
        /.*?indicates required fields.*/gi,
        /Subscribe to our newsletter/gi
      ];

      boilerplatePatterns.forEach(pattern => {
        cleanSnippet = cleanSnippet.replace(pattern, '');
      });

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: cleanSnippet.trim(),
        imageUrl,
        source: item.creator || feed.title || 'Agriculture News'
      };
    });

    // For items still missing images, scrape article pages in parallel
    const fetchPromises = items.map(async (item) => {
      if (item.imageUrl || !item.link) return item;
      try {
        const resp = await fetch(item.link, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(6000),
          redirect: 'follow',
        });
        if (!resp.ok) return item;
        const html = await resp.text();

        let foundUrl = null;

        // 1. og:image
        const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)
                || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (og) foundUrl = og[1];

        // 2. twitter:image
        if (!foundUrl) {
          const tw = html.match(/<meta[^>]+(?:name|property)=["']twitter:image["'][^>]+content=["']([^"']+)/i)
                  || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']twitter:image["']/i);
          if (tw) foundUrl = tw[1];
        }

        // 3. First <img> inside <article>
        if (!foundUrl) {
          const artImg = html.match(/<article[^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)/i);
          if (artImg) foundUrl = artImg[1];
        }

        // 4. WordPress featured image (wp-post-image class)
        if (!foundUrl) {
          const wpImg = html.match(/<img[^>]+class=["'][^"']*wp-post-image[^"']*["'][^>]+src=["']([^"']+)/i);
          if (wpImg) foundUrl = wpImg[1];
        }

        if (foundUrl && foundUrl.startsWith('http')) {
          item.imageUrl = `/api/external/image?url=${encodeURIComponent(foundUrl)}`;
        }
      } catch {
        // Silently skip — image is optional
      }
      return item;
    });

    const enrichedItems = await Promise.all(fetchPromises);

    // Update cache
    newsCache = { items: enrichedItems, fetchedAt: Date.now() };

    res.json({ items: enrichedItems });
  } catch (error) {
    console.error('Error fetching RSS:', error);
    // If cache exists but is stale, serve stale data rather than error
    if (newsCache.items) {
      return res.json({ items: newsCache.items });
    }
    res.status(500).json({ error: 'Failed to fetch news feed' });
  }
}));

router.get('/news/article', asyncHandler(async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch article');
    
    const html = await response.text();
    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article) throw new Error('Failed to parse article content');

    // Clean up known newsletter boilerplate from PoultryWorld
    const boilerplatePatterns = [
      /Join \d+,?\d*\+? subscribers/gi,
      /Subscribe to our newsletter to stay updated about all the need-to-know content in the poultry sector, three times a week\.?/gi,
      /.*?indicates required fields.*/gi,
      /Subscribe to our newsletter/gi
    ];

    let cleanContent = article.content || '';
    let cleanExcerpt = article.excerpt || '';

    boilerplatePatterns.forEach(pattern => {
      cleanContent = cleanContent.replace(pattern, '');
      cleanExcerpt = cleanExcerpt.replace(pattern, '');
    });

    article.content = cleanContent;
    article.excerpt = cleanExcerpt;

    // Rewrite all img src attributes in article body to go through our image proxy
    article.content = article.content.replace(
      /(<img[^>]+src=["'])([^"']+)(["'])/gi,
      (match, before, imgUrl, quote) => {
        // Only proxy absolute external URLs
        if (imgUrl.startsWith('http')) {
          return `${before}/api/external/image?url=${encodeURIComponent(imgUrl)}${quote}`;
        }
        return match;
      }
    );

    res.json(article);
  } catch (error) {
    console.error('Error parsing article:', error);
    res.status(500).json({ error: 'Failed to parse article' });
  }
}));

// Image proxy — fetches external images server-side to bypass hotlink protection
router.get('/image', asyncHandler(async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL required');

  const response = await fetch(decodeURIComponent(url), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.poultryworld.net/',
      'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
  });

  if (!response.ok) return res.status(502).send('Failed to fetch image');

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=86400');

  const buffer = await response.arrayBuffer();
  res.send(Buffer.from(buffer));
}));

export default router;
