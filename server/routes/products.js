import { Router } from 'express';
import { query, rowToProduct } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, featured } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    if (category && category !== 'all') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    if (featured === 'true') {
      sql += ' AND featured = TRUE';
    }
    sql += ' ORDER BY name';
    const result = await query(sql, params);
    res.json({ products: result.rows.map(rowToProduct) });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product: rowToProduct(row) });
  }),
);

router.get(
  '/:id/reviews',
  asyncHandler(async (req, res) => {
    const result = await query(
      "SELECT id, user_name, rating, comment, created_at FROM product_reviews WHERE product_id = $1 AND status = 'approved' ORDER BY created_at DESC",
      [req.params.id]
    );
    res.json({ reviews: result.rows });
  }),
);

router.post(
  '/:id/reviews',
  asyncHandler(async (req, res) => {
    const { userName, rating, comment } = req.body;
    if (!userName || !rating) {
      return res.status(400).json({ error: 'Name and rating are required.' });
    }
    const result = await query(
      `INSERT INTO product_reviews (product_id, user_name, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_name, rating, comment, status, created_at`,
      [req.params.id, userName, rating, comment]
    );
    res.status(201).json({ review: result.rows[0] });
  }),
);

export default router;
