import crypto from 'node:crypto';
import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock_key';
const PAYSTACK_CURRENCY = process.env.PAYSTACK_CURRENCY || 'GHS';

function paystackConfigured() {
  return PAYSTACK_SECRET_KEY && PAYSTACK_SECRET_KEY !== 'sk_test_mock_key';
}

/** Public site origin for Paystack callback (skip admin subdomain). */
function siteCallbackOrigin() {
  const origins = process.env.CLIENT_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean) || [];
  const publicSite = origins.find((o) => !/admin\./i.test(o));
  return publicSite || origins[0] || 'http://localhost:5173';
}

async function markOrderPaid(orderId, reference) {
  await query(
    "UPDATE orders SET payment_status = 'paid', transaction_id = $1 WHERE id = $2",
    [reference, orderId],
  );
}

export async function paystackWebhookHandler(req, res) {
  if (!paystackConfigured()) {
    return res.sendStatus(503);
  }

  const signature = req.headers['x-paystack-signature'];
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(req.body).digest('hex');
  if (!signature || hash !== signature) {
    return res.sendStatus(401);
  }

  let event;
  try {
    event = JSON.parse(req.body.toString());
  } catch {
    return res.sendStatus(400);
  }

  if (event.event === 'charge.success') {
    const { reference, metadata } = event.data ?? {};
    const orderId = metadata?.orderId;
    if (orderId && reference) {
      await markOrderPaid(orderId, reference);
    }
  }

  res.sendStatus(200);
}

router.post('/initialize', asyncHandler(async (req, res) => {
  if (!paystackConfigured()) {
    return res.status(503).json({
      error: 'Paystack is not configured. Set PAYSTACK_SECRET_KEY on the API server.',
    });
  }

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const orderRes = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
  const order = orderRes.rows[0];
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const amount = Math.round((Number(order.subtotal) + Number(order.shipping_cost || 0)) * 100);
  if (amount < 100) {
    return res.status(400).json({ error: 'Order total is too low for Paystack.' });
  }

  const reference = `${orderId}-${Date.now()}`;
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: order.customer_email || 'customer@raafortagro.com',
      amount,
      currency: PAYSTACK_CURRENCY,
      reference,
      metadata: { orderId },
      channels: ['card', 'mobile_money', 'bank'],
      callback_url: `${siteCallbackOrigin()}/order-confirmation?order=${orderId}`,
    }),
  });

  const data = await response.json();
  if (!data.status) {
    return res.status(400).json({ error: data.message || 'Paystack initialization failed.' });
  }

  res.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
}));

router.post('/verify', asyncHandler(async (req, res) => {
  if (!paystackConfigured()) {
    return res.status(503).json({ error: 'Paystack is not configured.' });
  }

  const { reference, orderId } = req.body ?? {};
  if (!reference || !orderId) {
    return res.status(400).json({ error: 'reference and orderId are required' });
  }

  const orderRes = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
  if (!orderRes.rows[0]) return res.status(404).json({ error: 'Order not found' });

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } },
  );
  const data = await response.json();

  if (!data.status) {
    return res.status(400).json({ error: data.message || 'Verification failed.' });
  }

  const tx = data.data;
  const paid =
    tx.status === 'success' &&
    tx.currency === PAYSTACK_CURRENCY &&
    tx.metadata?.orderId === orderId;

  if (paid) {
    await markOrderPaid(orderId, reference);
  }

  res.json({ ok: true, paid, status: tx.status });
}));

export default router;
