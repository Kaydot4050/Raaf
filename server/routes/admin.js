import fs from 'node:fs/promises';
import path from 'node:path';
import { Router } from 'express';
import { query, rowToProduct, rowToOrder, rowToBlogPost, productFromBody } from '../db.js';
import { requireAdmin } from '../middleware/admin.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { uploadsDir } from '../lib/upload.js';
import { memoryImageUpload } from '../lib/uploadMemory.js';
import {
  isCloudinaryEnabled,
  isCloudinaryUrl,
  uploadBuffer,
  uploadRemoteUrl,
  getCloudinaryPublicConfig,
} from '../lib/cloudinary.js';

const router = Router();
router.use(requireAdmin);

router.get(
  '/upload-config',
  asyncHandler(async (_req, res) => {
    res.json(getCloudinaryPublicConfig());
  }),
);

router.post(
  '/upload',
  memoryImageUpload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    if (isCloudinaryEnabled()) {
      const result = await uploadBuffer(req.file.buffer);
      return res.status(201).json({ url: result.secure_url, provider: 'cloudinary' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    await fs.writeFile(path.join(uploadsDir, filename), req.file.buffer);
    res.status(201).json({ url: `/uploads/${filename}`, provider: 'local' });
  }),
);

const IMAGE_EXT = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

router.post(
  '/upload-from-url',
  asyncHandler(async (req, res) => {
    const raw = req.body?.url;
    if (!raw || typeof raw !== 'string') {
      return res.status(400).json({ error: 'Image URL is required.' });
    }
    const url = raw.trim();

    if (url.startsWith('/')) {
      return res.json({ url, provider: 'local' });
    }

    if (isCloudinaryUrl(url)) {
      return res.json({ url, provider: 'cloudinary' });
    }

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL.' });
    }
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'URL must start with http:// or https://' });
    }

    const response = await fetch(url, {
      headers: { 'User-Agent': 'RaafortAgro-Admin/1.0' },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      return res.status(400).json({ error: 'Could not download image from that link.' });
    }

    const contentType = (response.headers.get('content-type') || '').split(';')[0].toLowerCase();
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'That link does not point to an image.' });
    }

    if (isCloudinaryEnabled()) {
      const result = await uploadRemoteUrl(url);
      return res.status(201).json({ url: result.secure_url, provider: 'cloudinary' });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image must be 5 MB or smaller.' });
    }

    const ext =
      IMAGE_EXT[contentType] || path.extname(parsed.pathname).toLowerCase() || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    await fs.writeFile(path.join(uploadsDir, filename), buffer);
    res.status(201).json({ url: `/uploads/${filename}`, provider: 'local' });
  }),
);

async function getOrderItems(orderId) {
  const result = await query(
    'SELECT product_id, name, qty, price, image FROM order_items WHERE order_id = $1',
    [orderId],
  );
  return result.rows.map((i) => ({
    id: i.product_id,
    name: i.name,
    qty: i.qty,
    price: Number(i.price),
    image: i.image,
  }));
}

router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const [orders, revenue, users, pending] = await Promise.all([
      query('SELECT COUNT(*)::int AS c FROM orders'),
      query(`SELECT COALESCE(SUM(subtotal), 0)::float AS s FROM orders WHERE status = 'completed'`),
      query(`SELECT COUNT(*)::int AS c FROM users WHERE created_at > NOW() - INTERVAL '30 days'`),
      query(`SELECT COUNT(*)::int AS c FROM orders WHERE status = 'pending'`),
    ]);
    res.json({
      totalOrders: orders.rows[0].c,
      revenue: revenue.rows[0].s,
      newCustomers: users.rows[0].c,
      pendingOrders: pending.rows[0].c,
    });
  }),
);

router.get(
  '/content',
  asyncHandler(async (_req, res) => {
    const result = await query('SELECT page, section, data, updated_at FROM site_content ORDER BY page, section');
    const pages = {};
    for (const row of result.rows) {
      if (!pages[row.page]) pages[row.page] = { sections: {} };
      pages[row.page].sections[row.section] = { data: row.data, updatedAt: row.updated_at };
    }
    res.json({ pages });
  }),
);

router.put(
  '/content/:page/:section',
  asyncHandler(async (req, res) => {
    const { page, section } = req.params;
    const data = req.body?.data ?? req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Content data object is required.' });
    }
    const result = await query(
      `INSERT INTO site_content (page, section, data, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (page, section) DO UPDATE SET data = $3, updated_at = NOW()
       RETURNING page, section, data, updated_at`,
      [page, section, data],
    );
    res.json({ section: result.rows[0] });
  }),
);

router.get(
  '/products',
  asyncHandler(async (_req, res) => {
    const result = await query('SELECT * FROM products ORDER BY name');
    res.json({ products: result.rows.map(rowToProduct) });
  }),
);

router.post(
  '/products',
  asyncHandler(async (req, res) => {
    const p = productFromBody(req.body);
    if (!p.id || !p.name || !p.category) {
      return res.status(400).json({ error: 'id, name, and category are required.' });
    }
    await query(
      `INSERT INTO products (
        id, name, category, type, image, price_min, price_max, description,
        featured, rating, best_seller, new_arrival, on_sale,
        original_price_min, original_price_max, in_stock
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        p.id, p.name, p.category, p.type, p.image, p.price_min, p.price_max, p.description,
        p.featured, p.rating, p.best_seller, p.new_arrival, p.on_sale,
        p.original_price_min, p.original_price_max, p.in_stock,
      ],
    );
    const row = (await query('SELECT * FROM products WHERE id = $1', [p.id])).rows[0];
    res.status(201).json({ product: rowToProduct(row) });
  }),
);

router.put(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const p = productFromBody({ ...req.body, id: req.params.id });
    const result = await query(
      `UPDATE products SET
        name=$2, category=$3, type=$4, image=$5, price_min=$6, price_max=$7, description=$8,
        featured=$9, rating=$10, best_seller=$11, new_arrival=$12, on_sale=$13,
        original_price_min=$14, original_price_max=$15, in_stock=$16
       WHERE id=$1 RETURNING *`,
      [
        p.id, p.name, p.category, p.type, p.image, p.price_min, p.price_max, p.description,
        p.featured, p.rating, p.best_seller, p.new_arrival, p.on_sale,
        p.original_price_min, p.original_price_max, p.in_stock,
      ],
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product: rowToProduct(result.rows[0]) });
  }),
);

router.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found.' });
    res.json({ ok: true });
  }),
);

router.get(
  '/orders',
  asyncHandler(async (_req, res) => {
    const result = await query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
    const orders = await Promise.all(
      result.rows.map(async (row) => rowToOrder(row, await getOrderItems(row.id))),
    );
    res.json({ orders });
  }),
);

router.patch(
  '/orders/:id',
  asyncHandler(async (req, res) => {
    const { status } = req.body ?? {};
    if (!status) return res.status(400).json({ error: 'status is required.' });
    const result = await query(
      'UPDATE orders SET status = $2 WHERE id = $1 RETURNING *',
      [req.params.id, status],
    );
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Order not found.' });
    res.json({ order: rowToOrder(row, await getOrderItems(row.id)) });
  }),
);

router.get(
  '/inquiries',
  asyncHandler(async (_req, res) => {
    const result = await query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 100');
    res.json({ inquiries: result.rows });
  }),
);

router.get(
  '/blog',
  asyncHandler(async (_req, res) => {
    const result = await query('SELECT * FROM blog_posts ORDER BY post_date DESC');
    res.json({ posts: result.rows.map(rowToBlogPost) });
  }),
);

router.post(
  '/blog',
  asyncHandler(async (req, res) => {
    const { id, title, excerpt, body, image, date, published } = req.body ?? {};
    if (!id?.trim() || !title?.trim()) {
      return res.status(400).json({ error: 'id and title are required.' });
    }
    const slug = id.trim().toLowerCase().replace(/\s+/g, '-');
    await query(
      `INSERT INTO blog_posts (id, title, excerpt, body, image, post_date, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [slug, title.trim(), excerpt || null, body || null, image || null, date || new Date(), published !== false],
    );
    const row = (await query('SELECT * FROM blog_posts WHERE id = $1', [slug])).rows[0];
    res.status(201).json({ post: rowToBlogPost(row) });
  }),
);

router.put(
  '/blog/:id',
  asyncHandler(async (req, res) => {
    const { title, excerpt, body, image, date, published } = req.body ?? {};
    const result = await query(
      `UPDATE blog_posts SET
        title = COALESCE($2, title),
        excerpt = COALESCE($3, excerpt),
        body = COALESCE($4, body),
        image = COALESCE($5, image),
        post_date = COALESCE($6, post_date),
        published = COALESCE($7, published),
        updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [req.params.id, title, excerpt, body, image, date, published],
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Post not found.' });
    res.json({ post: rowToBlogPost(result.rows[0]) });
  }),
);

router.delete(
  '/blog/:id',
  asyncHandler(async (req, res) => {
    const result = await query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Post not found.' });
    res.json({ ok: true });
  }),
);

router.get(
  '/users',
  asyncHandler(async (_req, res) => {
    const result = await query(
      'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC LIMIT 100',
    );
    res.json({ users: result.rows });
  }),
);

router.patch(
  '/users/:id/role',
  asyncHandler(async (req, res) => {
    const { role } = req.body ?? {};
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'role must be admin or user.' });
    }
    const result = await query(
      'UPDATE users SET role = $2 WHERE id = $1 RETURNING id, email, name, role',
      [req.params.id, role],
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: result.rows[0] });
  }),
);

router.get(
  '/reviews',
  asyncHandler(async (_req, res) => {
    const result = await query('SELECT * FROM product_reviews ORDER BY created_at DESC');
    res.json({ reviews: result.rows });
  }),
);

router.patch(
  '/reviews/:id',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'invalid status' });
    }
    const result = await query(
      'UPDATE product_reviews SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Review not found.' });
    res.json({ review: result.rows[0] });
  }),
);

export default router;
