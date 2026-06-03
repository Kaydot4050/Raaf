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

/** Unique gallery URLs for a product (API + static fallback + size variants). */
export function getProductGallery(product) {
  if (!product) return [];
  const staticMatch = staticCatalog.find((p) => p.id === product.id);
  const list = [
    ...(product.images || []),
    ...(staticMatch?.images || []),
    product.image,
    staticMatch?.image,
  ]
    .filter(Boolean)
    .map(String);

  const primary = list[0];
  if (primary && !primary.includes('cloudinary.com')) {
    list.push(...inferGalleryVariants(primary));
  }

  return [...new Set(list)].slice(0, 5);
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

export const GALLERY_HOVER_MS = 550;
