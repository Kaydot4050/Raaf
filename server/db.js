import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

function sanitizeDatabaseUrl(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete('channel_binding');
    if (parsed.hostname.includes('neon.tech') && !parsed.searchParams.has('sslmode')) {
      parsed.searchParams.set('sslmode', 'require');
    }
    return parsed.toString();
  } catch {
    return url.replace(/[&?]channel_binding=[^&]*/g, '');
  }
}

const connectionString = sanitizeDatabaseUrl(process.env.DATABASE_URL);

if (!connectionString) {
  console.warn('DATABASE_URL is not set — API will fail until .env is configured.');
}

function poolSsl(connectionString) {
  if (!connectionString) return undefined;
  if (connectionString.includes('neon.tech')) return { rejectUnauthorized: false };
  try {
    const sslmode = new URL(connectionString).searchParams.get('sslmode');
    if (sslmode === 'require' || sslmode === 'verify-full' || sslmode === 'verify-ca') {
      return { rejectUnauthorized: false };
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

export const pool = new Pool({
  connectionString,
  ssl: poolSsl(connectionString),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

export async function query(text, params) {
  return pool.query(text, params);
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    farm_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT,
    image TEXT,
    price_min DOUBLE PRECISION NOT NULL,
    price_max DOUBLE PRECISION NOT NULL,
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    rating DOUBLE PRECISION DEFAULT 0,
    best_seller BOOLEAN DEFAULT FALSE,
    new_arrival BOOLEAN DEFAULT FALSE,
    on_sale BOOLEAN DEFAULT FALSE,
    original_price_min DOUBLE PRECISION,
    original_price_max DOUBLE PRECISION,
    in_stock BOOLEAN DEFAULT TRUE
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    region TEXT,
    address TEXT NOT NULL,
    notes TEXT,
    payment_method TEXT NOT NULL,
    subtotal DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT,
    name TEXT NOT NULL,
    qty INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    image TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS phone_otps (
    phone TEXT PRIMARY KEY,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(page, section)
  )`,
  `CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    body TEXT,
    image TEXT,
    post_date DATE NOT NULL DEFAULT CURRENT_DATE,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
];

const MIGRATIONS = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL`,
  `ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS farm_type TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS farm_region TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS flock_size TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS farm_notes TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_settings JSONB NOT NULL DEFAULT '{"orderUpdates":true,"promotions":true,"farmTips":false,"smsAlerts":false}'::jsonb`,
  `CREATE TABLE IF NOT EXISTS user_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Farm',
    contact_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    region TEXT NOT NULL,
    address TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_user_addresses_user ON user_addresses(user_id)`,
  `CREATE TABLE IF NOT EXISTS user_wishlist (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
  )`,
  `CREATE TABLE IF NOT EXISTS product_reviews (
    id SERIAL PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id)`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB NOT NULL DEFAULT '[]'::jsonb`,
];

export async function initDb() {
  for (const sql of SCHEMA) {
    await query(sql);
  }
  for (const sql of MIGRATIONS) {
    try {
      await query(sql);
    } catch (e) {
      console.warn('[DB migration]', e.message);
    }
  }

  try {
    await query(
      `UPDATE products
       SET images = jsonb_build_array(image)
       WHERE image IS NOT NULL AND image <> ''
         AND (images IS NULL OR images = '[]'::jsonb)`,
    );
    const { syncProductGalleriesFromCatalog } = await import('./syncProductGalleries.js');
    await syncProductGalleriesFromCatalog();
  } catch (e) {
    console.warn('[DB migration] product images backfill:', e.message);
  }
}

export function formatUser(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    email: row.email,
    name: row.name,
    phone: row.phone,
    farmName: row.farm_name,
    role: row.role || 'user',
    createdAt: row.created_at,
  };
}

export function rowToBlogPost(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    image: row.image,
    date: row.post_date,
    published: !!row.published,
  };
}

function parseProductImages(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((u) => u && String(u).trim());
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((u) => u && String(u).trim()) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function productFromBody(body) {
  const images = parseProductImages(body.images).slice(0, 5);
  const image = (body.image && String(body.image).trim()) || images[0] || null;
  const gallery = images.length ? images : image ? [image] : [];

  return {
    id: body.id,
    name: body.name,
    category: body.category,
    type: body.type || null,
    image,
    images: gallery,
    price_min: Number(body.priceMin ?? body.price_min),
    price_max: Number(body.priceMax ?? body.price_max),
    description: body.description || null,
    featured: !!body.featured,
    rating: Number(body.rating ?? 0),
    best_seller: !!body.bestSeller,
    new_arrival: !!body.newArrival,
    on_sale: !!body.onSale,
    original_price_min: body.originalPriceMin != null ? Number(body.originalPriceMin) : null,
    original_price_max: body.originalPriceMax != null ? Number(body.originalPriceMax) : null,
    in_stock: body.inStock !== false,
  };
}

export function rowToProduct(row) {
  if (!row) return null;
  let images = parseProductImages(row.images);
  if (!images.length && row.image) images = [row.image];
  const image = row.image || images[0] || null;

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    type: row.type,
    image,
    images,
    priceMin: Number(row.price_min),
    priceMax: Number(row.price_max),
    description: row.description,
    featured: !!row.featured,
    rating: Number(row.rating),
    bestSeller: !!row.best_seller,
    newArrival: !!row.new_arrival,
    onSale: !!row.on_sale,
    originalPriceMin: row.original_price_min != null ? Number(row.original_price_min) : undefined,
    originalPriceMax: row.original_price_max != null ? Number(row.original_price_max) : undefined,
    inStock: !!row.in_stock,
  };
}

export function rowToOrder(row, items = []) {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
      region: row.region,
      address: row.address,
      notes: row.notes,
    },
    payment: row.payment_method,
    subtotal: Number(row.subtotal),
    items,
  };
}
