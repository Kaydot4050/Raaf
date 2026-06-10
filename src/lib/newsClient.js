import { externalApi } from './api.js';

function filterNews(items, { region, category } = {}) {
  let out = items;
  if (region && region !== 'all') out = out.filter((i) => i.region === region);
  if (category && category !== 'all') out = out.filter((i) => i.categoryId === category);
  return out;
}

export async function loadIndustryNews(params = {}) {
  try {
    const data = await externalApi.news(params);
    if (data?.items?.length) return { items: data.items, source: 'api' };
  } catch {
    /* API down — use build-time snapshot */
  }

  const res = await fetch('/news-snapshot.json');
  if (!res.ok) throw new Error('Could not load industry news');
  const snap = await res.json();
  const items = filterNews(snap.items || [], params);
  if (!items.length) throw new Error('Could not load industry news');
  return { items, source: 'snapshot' };
}

export function industryNewsError(err) {
  const msg = err?.message || '';
  const apiDown =
    msg.includes('Cannot reach') ||
    err?.status === 503 ||
    err?.status === 502 ||
    err?.status === 504;
  if (apiDown) {
    return 'Industry news needs the API online. Open api.raafortagro.com/api/health — you should see JSON, not 503.';
  }
  return msg || 'Could not load industry news.';
}
