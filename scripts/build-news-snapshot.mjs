import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.NEWS_SNAPSHOT_MODE = '1';

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'news-snapshot.json');

let items = [];
try {
  const { fetchFreshNews } = await import('../server/lib/farmNews.js');
  items = await fetchFreshNews();
  console.log(`[news-snapshot] ${items.length} items`);
} catch (err) {
  console.warn('[news-snapshot] fetch failed:', err.message);
}

writeFileSync(
  out,
  JSON.stringify({ generatedAt: new Date().toISOString(), items }),
);
