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
  authRequired,
  asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required to place order.' });
    }
    const { customer, payment, items, subtotal } = req.body ?? {};
    if (!customer?.name?.trim() || !customer?.phone?.trim() || !customer?.address?.trim()) {
      return res.status(400).json({ error: 'Name, phone, and delivery address are required.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must include at least one item.' });
    }

    const orderId = generateOrderId();
    const totalItems = items.reduce((s, i) => s + i.price * i.qty, 0);
    
    // Calculate shipping based on region
    const SHIPPING_RATES = {
      'Greater Accra': 50, 'Ashanti': 80, 'Central': 60, 'Western': 80,
      'Eastern': 60, 'Volta': 70, 'Northern': 100, 'Upper East': 120,
      'Upper West': 120, 'Bono': 90, 'Bono East': 90, 'Ahafo': 90,
      'Oti': 80, 'Savannah': 110, 'North East': 110, 'Western North': 90,
    };
    const regionKey = customer.region?.trim();
    const shippingCost = regionKey && SHIPPING_RATES[regionKey] ? SHIPPING_RATES[regionKey] : 100;
    
    const total = totalItems + shippingCost;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO orders (
          id, user_id, status, customer_name, customer_email, customer_phone,
          region, address, notes, payment_method, subtotal, shipping_cost
        ) VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          orderId,
          req.user?.id ?? null,
          customer.name.trim(),
          customer.email?.trim() || null,
          customer.phone.trim(),
          regionKey || null,
          customer.address.trim(),
          customer.notes?.trim() || null,
          payment || 'paystack',
          totalItems,
          shippingCost
        ],
      );
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name, qty, price, image)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.id || null, item.name, item.qty, item.price, item.image || null],
        );
        if (item.id) {
          await client.query(
            `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 AND stock_quantity >= $1`,
            [item.qty, item.id]
          );
        }
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
