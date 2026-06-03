import { query } from '../db.js';
import { products as catalog } from '../../src/data/products.js';

/** Fill empty or single-image DB rows from static catalog so hover galleries work. */
export async function syncProductGalleriesFromCatalog() {
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
