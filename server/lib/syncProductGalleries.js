import { query } from '../db.js';

/** Fill empty or single-image DB rows from static catalog so hover galleries work. */
export async function syncProductGalleriesFromCatalog() {
  let catalog;
  try {
    const mod = await import('../../src/data/products.js');
    catalog = mod.products;
  } catch {
    // Production deploy has no src/ — skip silently.
    return;
  }
  if (!catalog?.length) return;

  let updated = 0;
  for (const p of catalog) {
    const gallery = (p.images || []).filter(Boolean);
    if (gallery.length < 2) continue;

    const result = await query(
      `UPDATE products
       SET images = $1::jsonb,
           image = COALESCE(NULLIF(image, ''), $2)
       WHERE id = $3
         AND (
           images IS NULL
           OR images = '[]'::jsonb
           OR jsonb_array_length(images) < 2
         )`,
      [JSON.stringify(gallery), gallery[0], p.id],
    );
    updated += result.rowCount || 0;
  }
  if (updated > 0) {
    console.log(`Synced product galleries for ${updated} product(s).`);
  }
}
