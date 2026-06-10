import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.NEWS_SNAPSHOT_MODE = '1';

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'news-snapshot.json');
const SNAPSHOT_TIMEOUT_MS = 45_000;
const isCi = process.env.CI === 'true';
const forceRefresh = process.env.FORCE_NEWS_SNAPSHOT === '1';

function readExisting() {
  if (!existsSync(out)) return [];
  try {
    return JSON.parse(readFileSync(out, 'utf8')).items || [];
  } catch {
    return [];
  }
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`timed out after ${ms / 1000}s`)), ms);
    }),
  ]);
}

let items = [];

if (isCi && !forceRefresh) {
  items = readExisting();
  console.log(`[news-snapshot] CI: using committed snapshot (${items.length} items)`);
} else {
  try {
    const { fetchFreshNews } = await import('../server/lib/farmNews.js');
    items = await withTimeout(fetchFreshNews(), SNAPSHOT_TIMEOUT_MS);
    console.log(`[news-snapshot] ${items.length} items`);
  } catch (err) {
    console.warn('[news-snapshot] fetch failed:', err.message);
    items = readExisting();
    if (items.length) console.log(`[news-snapshot] fallback: ${items.length} items from file`);
  }
}

writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), items }));
