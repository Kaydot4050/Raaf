/** Base URL for proxied news images (must hit the API host in production). */
export function publicApiBase() {
  const raw = process.env.PUBLIC_API_URL?.trim();
  return raw ? raw.replace(/\/$/, '') : null;
}

export function proxyNewsImage(externalUrl) {
  if (!externalUrl?.startsWith('http')) return null;
  const path = `external/image?url=${encodeURIComponent(externalUrl)}`;
  const base = publicApiBase();
  return base ? `${base}/${path}` : `/api/${path}`;
}

/** Rewrite relative /api/external/image paths to the public API host. */
export function absolutizeNewsImage(src) {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  const base = publicApiBase();
  if (!base) return src;
  if (src.startsWith('/api/')) return `${base}${src.slice(4)}`;
  return src;
}
