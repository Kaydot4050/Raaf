import { products as staticCatalog } from '../data/products.js';

/** Unique gallery URLs for a product (API + static fallback). */
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
