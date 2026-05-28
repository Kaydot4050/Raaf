import { Router } from 'express';
import { pool, query, rowToOrder } from '../db.js';
import { authOptional, authRequired } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

function generateOrderId() {
  const n = Date.now().toString(36).toUpperCase().slice(-6);
  return `RAF-${n}`;
}

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

router.post(
  '/',
  authOptional,
  asyncHandler(async (req, res) => {
    const { customer, payment, items, subtotal } = req.body ?? {};
    if (!customer?.name?.trim() || !customer?.phone?.trim() || !customer?.address?.trim()) {
      return res.status(400).json({ error: 'Name, phone, and delivery address are required.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must include at least one item.' });
    }

    const orderId = generateOrderId();
    const total = subtotal ?? items.reduce((s, i) => s + i.price * i.qty, 0);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO orders (
          id, user_id, status, customer_name, customer_email, customer_phone,
          region, address, notes, payment_method, subtotal
        ) VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          orderId,
          req.user?.id ?? null,
          customer.name.trim(),
          customer.email?.trim() || null,
          customer.phone.trim(),
          customer.region?.trim() || null,
          customer.address.trim(),
          customer.notes?.trim() || null,
          payment || 'momo',
          total,
        ],
      );
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name, qty, price, image)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.id || null, item.name, item.qty, item.price, item.image || null],
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    const row = (await query('SELECT * FROM orders WHERE id = $1', [orderId])).rows[0];
    const orderItems = await getOrderItems(orderId);
    res.status(201).json({ order: rowToOrder(row, orderItems) });
  }),
);

router.get(
  '/mine',
  authRequired,
  asyncHandler(async (req, res) => {
    const result = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id],
    );
    const orders = await Promise.all(
      result.rows.map(async (row) => rowToOrder(row, await getOrderItems(row.id))),
    );
    res.json({ orders });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Order not found.' });
    res.json({ order: rowToOrder(row, await getOrderItems(row.id)) });
  }),
);

export default router;
