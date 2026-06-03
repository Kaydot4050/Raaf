import { products as staticCatalog } from '../data/products.js';

const SIZE_VARIANTS = ['300x300', '150x150', '100x100', '50x50'];

/** Build /images/foo-150x150.png siblings from /images/foo-300x300.png (Woo-style assets). */
export function inferGalleryVariants(url) {
  if (!url || typeof url !== 'string') return [];
  if (!url.startsWith('/images/')) return [url];
  const match = url.match(/^(.+)-(\d+x\d+)(\.[^.]+)$/i);
  if (!match) return [url];
  const [, base, , ext] = match;
  return SIZE_VARIANTS.map((size) => `${base}-${size}${ext}`);
}

/** Unique gallery URLs — same list for shop hover and product detail. */
export function getProductGallery(product) {
  if (!product) return [];

  const staticMatch = staticCatalog.find((p) => p.id === product.id);
  const apiImages = [...new Set((product.images || []).filter(Boolean).map(String))];

  if (apiImages.length >= 2) {
    return apiImages.slice(0, 5);
  }

  const seeded = [
    ...apiImages,
    ...(staticMatch?.images || []),
    product.image,
    staticMatch?.image,
  ]
    .filter(Boolean)
    .map(String);
  const deduped = [...new Set(seeded)];
  const primary = deduped[0];
  if (!primary) return [];

  if (!primary.includes('cloudinary.com')) {
    const inferred = inferGalleryVariants(primary);
    if (inferred.length >= 2) return inferred.slice(0, 5);
  }

  return deduped.slice(0, 5);
}

export function enrichProduct(product) {
  if (!product) return product;
  const images = getProductGallery(product);
  return {
    ...product,
    images,
    image: images[0] || product.image || null,
  };
}

/** Prefer catalog entry so detail matches the shop card the user hovered. */
export function getProductGalleryForId(product, catalog, productId) {
  const catalogItem = catalog?.find((p) => p.id === productId);
  return getProductGallery(catalogItem || product);
}

export const GALLERY_HOVER_MS = 550;
