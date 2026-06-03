import { products as staticCatalog } from '../data/products.js';

const SIZE_VARIANTS = ['300x300', '150x150', '100x100', '50x50'];
const GALLERY_SESSION_PREFIX = 'raafort-gallery:';

/** Build /images/foo-150x150.png siblings from /images/foo-300x300.png (Woo-style assets). */
export function inferGalleryVariants(url) {
  if (!url || typeof url !== 'string') return [];
  if (!url.startsWith('/images/')) return [url];
  const match = url.match(/^(.+)-(\d+x\d+)(\.[^.]+)$/i);
  if (!match) return [url];
  const [, base, , ext] = match;
  return SIZE_VARIANTS.map((size) => `${base}-${size}${ext}`);
}

/** Unique gallery URLs — DB/API data only; static catalog is fallback when API is unreachable. */
export function getProductGallery(product, { allowStaticFallback = false } = {}) {
  if (!product) return [];

  const apiImages = [...new Set((product.images || []).filter(Boolean).map(String))];
  if (apiImages.length >= 2) return apiImages.slice(0, 5);

  const primary = (apiImages[0] || product.image || '').trim();
  if (primary) {
    if (!primary.includes('cloudinary.com') && primary.startsWith('/images/')) {
      const inferred = inferGalleryVariants(primary);
      if (inferred.length >= 2) return inferred.slice(0, 5);
    }
    return [primary];
  }

  if (!allowStaticFallback) return [];

  const staticMatch = staticCatalog.find((p) => p.id === product.id);
  const seeded = [...(staticMatch?.images || []), staticMatch?.image].filter(Boolean).map(String);
  const deduped = [...new Set(seeded)];
  if (!deduped.length) return [];
  const staticPrimary = deduped[0];
  if (!staticPrimary.includes('cloudinary.com') && staticPrimary.startsWith('/images/')) {
    const inferred = inferGalleryVariants(staticPrimary);
    if (inferred.length >= 2) return inferred.slice(0, 5);
  }
  return deduped.slice(0, 5);
}

export function enrichProduct(product, options) {
  if (!product) return product;
  const images = getProductGallery(product, options);
  return {
    ...product,
    images,
    image: images[0] || product.image || null,
  };
}

/** Persist gallery when leaving shop so detail matches what was hovered. */
export function storeProductGallery(productId, gallery) {
  if (!productId || !gallery?.length) return;
  try {
    sessionStorage.setItem(`${GALLERY_SESSION_PREFIX}${productId}`, JSON.stringify(gallery));
  } catch {
    /* ignore */
  }
}

export function readStoredProductGallery(productId) {
  if (!productId) return null;
  try {
    const raw = sessionStorage.getItem(`${GALLERY_SESSION_PREFIX}${productId}`);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

/** Same images as shop card hover — prefer link state, then live API product, then session fallback. */
export function resolveProductGallery({ productId, product, catalog, linkGallery }) {
  if (linkGallery?.length) return linkGallery;

  const live = product || catalog?.find((p) => p.id === productId);
  const fromApi = getProductGallery(live);
  if (fromApi.length) return fromApi;

  return readStoredProductGallery(productId) || [];
}

export const GALLERY_HOVER_MS = 550;

export const productLinkState = (gallery) => ({ gallery });
