import { Router } from 'express';
import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure'],
  },
});

// RSS Feed URLs for agriculture/poultry news
const NEWS_FEEDS = [
  'https://www.poultryworld.net/feed/',
  'https://www.thepoultrysite.com/articles/feed'
];

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

router.get('/news', asyncHandler(async (req, res) => {
  try {
    // We try the first feed, if it fails, we can fallback, or just fetch one
    const feed = await parser.parseURL(NEWS_FEEDS[0]);
    
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
        source: feed.title || 'Agriculture News'
      };
    });

    res.json({ items });
  } catch (error) {
    console.error('Error fetching RSS:', error);
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
