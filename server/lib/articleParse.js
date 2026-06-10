import { getFarmNews } from './farmNews.js';
import { isGoogleNewsUrl, resolveGoogleNewsUrl } from './googleNews.js';
import { absolutizeNewsImage, proxyNewsImage } from './newsImageUrl.js';

function metaContent(html, prop) {
  const re1 = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, 'i');
  const re3 = new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)`, 'i');
  return html.match(re1)?.[1] || html.match(re2)?.[1] || html.match(re3)?.[1] || '';
}

function escapeHtml(text = '') {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function feedItemToArticle(item) {
  const summary = item.summary || item.contentSnippet || '';
  const image = absolutizeNewsImage(item.image || item.imageUrl);
  let content = summary ? `<p>${escapeHtml(summary)}</p>` : '';
  if (image) {
    content = `<figure><img src="${image}" alt=""></figure>${content}`;
  }
  return {
    title: item.title || 'News article',
    excerpt: summary,
    content,
    byline: item.source || '',
    publishedTime: item.publishedAt || item.pubDate || null,
    partial: true,
  };
}

export function extractMetaArticle(html, url) {
  const title = metaContent(html, 'og:title') || metaContent(html, 'twitter:title');
  const excerpt =
    metaContent(html, 'og:description') ||
    metaContent(html, 'twitter:description') ||
    metaContent(html, 'description');
  const image = metaContent(html, 'og:image') || metaContent(html, 'twitter:image');

  if (!title && !excerpt) return null;

  let content = excerpt ? `<p>${escapeHtml(excerpt)}</p>` : '';
  if (image?.startsWith('http')) {
    const imgSrc = absolutizeNewsImage(proxyNewsImage(image));
    content = `<figure><img src="${imgSrc}" alt=""></figure>${content}`;
  }

  return {
    title: title || 'News article',
    excerpt,
    content,
    byline: '',
    publishedTime: null,
    partial: true,
    sourceUrl: url,
  };
}

function normalizeUrl(u) {
  if (!u) return '';
  try {
    const parsed = new URL(u);
    return `${parsed.hostname}${parsed.pathname}`.replace(/^www\./, '').toLowerCase();
  } catch {
    return u.replace(/\?.*$/, '').toLowerCase();
  }
}

export async function findFeedItem(url) {
  const items = await getFarmNews({});
  const matchUrl = (candidate) => {
    const key = normalizeUrl(candidate);
    return items.find((item) => normalizeUrl(item.url) === key || normalizeUrl(item.link) === key);
  };

  let item = matchUrl(url);
  if (item) return item;

  if (isGoogleNewsUrl(url)) {
    const resolved = await resolveGoogleNewsUrl(url);
    if (resolved !== url) item = matchUrl(resolved);
  }

  return item || null;
}

const BOILERPLATE = [
  /Join \d+,?\d*\+? subscribers/gi,
  /Subscribe to our newsletter to stay updated about all the need-to-know content in the poultry sector, three times a week\.?/gi,
  /.*?indicates required fields.*/gi,
  /Subscribe to our newsletter/gi,
];

export function cleanArticleText(text = '') {
  let out = text;
  BOILERPLATE.forEach((pattern) => {
    out = out.replace(pattern, '');
  });
  return out.trim();
}

export function proxyArticleImages(content) {
  return content.replace(
    /(<img[^>]+src=["'])([^"']+)(["'])/gi,
    (match, before, imgUrl, quote) => {
      if (imgUrl.startsWith('http')) {
        return `${before}${absolutizeNewsImage(proxyNewsImage(imgUrl))}${quote}`;
      }
      if (imgUrl.startsWith('/api/')) {
        return `${before}${absolutizeNewsImage(imgUrl)}${quote}`;
      }
      return match;
    },
  );
}
