import { Router } from 'express';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getFarmNews } from '../lib/farmNews.js';
import { isGoogleNewsUrl, resolveGoogleNewsUrl } from '../lib/googleNews.js';
import { absolutizeNewsImage, proxyNewsImage } from '../lib/newsImageUrl.js';
import {
  cleanArticleText,
  extractMetaArticle,
  feedItemToArticle,
  findFeedItem,
  proxyArticleImages,
} from '../lib/articleParse.js';
import { fetchGoogleWeather, isGoogleWeatherConfigured } from '../lib/googleWeather.js';
import { fetchOpenMeteoWeather } from '../lib/openMeteoWeather.js';

const router = Router();

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
  const latitude = Number.parseFloat(req.query.lat) || 5.6037;
  const longitude = Number.parseFloat(req.query.lon) || -0.187;

  let data;
  if (isGoogleWeatherConfigured()) {
    try {
      data = await fetchGoogleWeather(latitude, longitude);
    } catch (err) {
      console.warn('Google Weather failed, using Open-Meteo:', err.message);
      data = await fetchOpenMeteoWeather(latitude, longitude);
    }
  } else {
    data = await fetchOpenMeteoWeather(latitude, longitude);
  }

  res.json(data);
}));

router.get('/news', asyncHandler(async (req, res) => {
  try {
    const region = req.query.region || 'all';
    const category = req.query.category || 'all';
    const items = await getFarmNews({ region, category });
    res.json({
      items: items.map((item) => ({
        ...item,
        image: absolutizeNewsImage(item.image),
        imageUrl: absolutizeNewsImage(item.imageUrl || item.image),
      })),
    });
  } catch (error) {
    console.error('Error fetching farm news:', error);
    res.status(500).json({ error: 'Failed to fetch news feed' });
  }
}));

// Proxy for fetching article content (to bypass CORS) and parse with Readability
router.get('/news/article', asyncHandler(async (req, res) => {
  let { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  url = decodeURIComponent(url);

  const respondWithFeedFallback = async () => {
    const feedItem = await findFeedItem(url);
    if (!feedItem) return false;
    res.json(feedItemToArticle(feedItem));
    return true;
  };

  try {
    const resolvedUrl = await resolveGoogleNewsUrl(url);
    if (isGoogleNewsUrl(resolvedUrl)) {
      if (await respondWithFeedFallback()) return;
      return res.status(422).json({ error: 'Could not resolve article URL' });
    }

    const response = await fetch(resolvedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(12000),
      redirect: 'follow',
    });

    if (!response.ok) {
      if (await respondWithFeedFallback()) return;
      return res.status(502).json({ error: 'Failed to fetch article' });
    }

    const html = await response.text();
    const doc = new JSDOM(html, { url: resolvedUrl });
    const reader = new Readability(doc.window.document);
    let article = reader.parse();

    if (!article?.content) {
      article = extractMetaArticle(html, resolvedUrl) || article;
    }

    if (!article?.title && !article?.content) {
      if (await respondWithFeedFallback()) return;
      return res.status(422).json({ error: 'Failed to parse article' });
    }

    const isGoogleLanding =
      article.title === 'Google News' ||
      /Comprehensive, up-to-date news coverage/i.test(article.excerpt || article.content || '');
    if (isGoogleLanding) {
      if (await respondWithFeedFallback()) return;
      return res.status(422).json({ error: 'Article source blocked inline reading' });
    }

    article.content = proxyArticleImages(cleanArticleText(article.content || ''));
    article.excerpt = cleanArticleText(article.excerpt || '');
    article.partial = Boolean(article.partial);

    res.json(article);
  } catch (error) {
    console.error('Error parsing article:', error);
    if (await respondWithFeedFallback()) return;
    res.status(500).json({ error: 'Failed to parse article' });
  }
}));

// Image proxy — fetches external images server-side to bypass hotlink protection
router.get('/image', asyncHandler(async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL required');

  const decodedUrl = decodeURIComponent(url);
  const targetUrl = new URL(decodedUrl);

  const response = await fetch(targetUrl.href, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': targetUrl.origin + '/',
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
