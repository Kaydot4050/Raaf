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

export default router;
