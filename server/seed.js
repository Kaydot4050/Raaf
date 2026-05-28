import 'dotenv/config';
import { query, initDb, pool } from './db.js';
import { products } from '../src/data/products.js';

await initDb();

const count = (await query('SELECT COUNT(*)::int AS c FROM products')).rows[0].c;
if (count > 0) {
  console.log(`Database already has ${count} products — skipping seed.`);
  await pool.end();
  process.exit(0);
}

for (const p of products) {
  await query(
    `INSERT INTO products (
      id, name, category, type, image, price_min, price_max, description,
      featured, rating, best_seller, new_arrival, on_sale,
      original_price_min, original_price_max, in_stock
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    ON CONFLICT (id) DO NOTHING`,
    [
      p.id,
      p.name,
      p.category,
      p.type || null,
      p.image || null,
      p.priceMin,
      p.priceMax,
      p.description || null,
      !!p.featured,
      p.rating ?? 0,
      !!p.bestSeller,
      !!p.newArrival,
      !!p.onSale,
      p.originalPriceMin ?? null,
      p.originalPriceMax ?? null,
      p.inStock !== false,
    ],
  );
}

console.log(`Seeded ${products.length} products.`);
await pool.end();
