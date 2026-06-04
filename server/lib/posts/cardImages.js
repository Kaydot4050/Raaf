/** Hero/thumbnail image per post (blog grid & listing API). Keep in sync with src/data/blogCardImages.js */
export const blogCardImages = {
  'brooding-and-chicks-ghana-guide': '/images/Raafortagro-2.png',
  'starter-grower-finisher-feed-ghana': '/images/Raafortagro-3.png',
  'store-poultry-feed-rainy-season-ghana': '/images/Raafortagro-3.png',
  'common-poultry-diseases-ghana-early-signs': '/images/Raafortagro-2.png',
  'goat-feed-ratios-smallholders-ghana': '/images/Raafortagro.png',
  'chick-delivery-day-counting-mortality-claims-ghana': '/images/1-Howo-Cargo-Truck-1.jpg',
  'why-balanced-feeding-is-key-to-animal-health': '/images/Raafortagro-2.png',
  'getting-the-best-start-with-day-old-chicks': '/images/Raafortagro-2.png',
  'why-quality-chicks-and-feeds-matter-for-every-farmer': '/images/Raafortagro.png',
  'livestock-feed-management': '/images/Raafortagro-3.png',
};

export function cardImageForPost(id) {
  return blogCardImages[id] || '/images/Raafortagro-2.png';
}
