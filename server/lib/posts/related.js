/** Curated related-article links by post id (topic clusters). */
export const blogRelatedIds = {
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

export function resolveRelatedPosts(currentId, allPosts, limit = 3) {
  const byId = new Map(allPosts.map((p) => [p.id, p]));
  const picked = [];
  const wanted = blogRelatedIds[currentId] || [];

  for (const rid of wanted) {
    if (rid === currentId) continue;
    const p = byId.get(rid);
    if (p && !picked.some((x) => x.id === p.id)) picked.push(p);
    if (picked.length >= limit) return picked;
  }

  for (const p of allPosts) {
    if (p.id === currentId || picked.some((x) => x.id === p.id)) continue;
    picked.push(p);
    if (picked.length >= limit) break;
  }

  return picked.slice(0, limit);
}
