import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock_key';

router.post('/initialize', asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const orderRes = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
  const order = orderRes.rows[0];
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const amount = (Number(order.subtotal) + Number(order.shipping_cost || 0)) * 100;

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: order.customer_email || 'customer@raafortagro.com',
      amount,
      reference: orderId + '-' + Date.now(),
      metadata: { orderId },
      callback_url: `${process.env.CLIENT_ORIGIN?.split(',')[0] || 'http://localhost:5173'}/order-confirmation?order=${orderId}`
    })
  });

  const data = await response.json();
  if (!data.status) {
    return res.status(400).json({ error: data.message });
  }

  res.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
}));

router.post('/webhook', asyncHandler(async (req, res) => {
  const event = req.body;
  if (event.event === 'charge.success') {
    const { reference, metadata } = event.data;
    const orderId = metadata?.orderId;
    if (orderId) {
      await query(
        "UPDATE orders SET payment_status = 'paid', transaction_id = $1 WHERE id = $2",
        [reference, orderId]
      );
    }
  }
  res.sendStatus(200);
}));

export default router;
