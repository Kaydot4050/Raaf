import { posts } from './blog.js';

/** Client fallback when API omits related (matches server/lib/posts/related.js). */
const blogRelatedIds = {
  'brooding-and-chicks-ghana-guide': [
    'chick-delivery-day-counting-mortality-claims-ghana',
    'getting-the-best-start-with-day-old-chicks',
    'common-poultry-diseases-ghana-early-signs',
  ],
  'chick-delivery-day-counting-mortality-claims-ghana': [
    'brooding-and-chicks-ghana-guide',
    'common-poultry-diseases-ghana-early-signs',
    'why-quality-chicks-and-feeds-matter-for-every-farmer',
  ],
  'starter-grower-finisher-feed-ghana': [
    'store-poultry-feed-rainy-season-ghana',
    'why-balanced-feeding-is-key-to-animal-health',
    'livestock-feed-management',
  ],
  'store-poultry-feed-rainy-season-ghana': [
    'starter-grower-finisher-feed-ghana',
    'why-balanced-feeding-is-key-to-animal-health',
    'brooding-and-chicks-ghana-guide',
  ],
  'common-poultry-diseases-ghana-early-signs': [
    'brooding-and-chicks-ghana-guide',
    'chick-delivery-day-counting-mortality-claims-ghana',
    'starter-grower-finisher-feed-ghana',
  ],
  'goat-feed-ratios-smallholders-ghana': [
    'livestock-feed-management',
    'why-balanced-feeding-is-key-to-animal-health',
    'store-poultry-feed-rainy-season-ghana',
  ],
  'why-balanced-feeding-is-key-to-animal-health': [
    'starter-grower-finisher-feed-ghana',
    'store-poultry-feed-rainy-season-ghana',
    'livestock-feed-management',
  ],
  'getting-the-best-start-with-day-old-chicks': [
    'brooding-and-chicks-ghana-guide',
    'chick-delivery-day-counting-mortality-claims-ghana',
    'why-quality-chicks-and-feeds-matter-for-every-farmer',
  ],
  'why-quality-chicks-and-feeds-matter-for-every-farmer': [
    'brooding-and-chicks-ghana-guide',
    'chick-delivery-day-counting-mortality-claims-ghana',
    'starter-grower-finisher-feed-ghana',
  ],
  'livestock-feed-management': [
    'goat-feed-ratios-smallholders-ghana',
    'why-balanced-feeding-is-key-to-animal-health',
    'starter-grower-finisher-feed-ghana',
  ],
};

export function getRelatedPosts(currentId, limit = 3) {
  const byId = new Map(posts.map((p) => [p.id, p]));
  const picked = [];
  for (const rid of blogRelatedIds[currentId] || []) {
    const p = byId.get(rid);
    if (p && p.id !== currentId && !picked.some((x) => x.id === p.id)) picked.push(p);
    if (picked.length >= limit) return picked;
  }
  for (const p of posts) {
    if (p.id === currentId || picked.some((x) => x.id === p.id)) continue;
    picked.push(p);
    if (picked.length >= limit) break;
  }
  return picked.slice(0, limit);
}
