import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { corsOptions } from './lib/cors.js';
import cookieParser from 'cookie-parser';
import { initDb, query, pool } from './db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import inquiryRoutes from './routes/inquiries.js';
import contentRoutes from './routes/content.js';
import adminRoutes from './routes/admin.js';
import accountRoutes from './routes/account.js';
import paymentRoutes, { paystackWebhookHandler } from './routes/payment.js';
import externalRoutes from './routes/external.js';
import { seedSiteContent, seedBlogPosts, migrateBlogPosts } from './lib/seedContent.js';

const app = express();
const port = Number(process.env.PORT) || 3001;
const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

app.use(cors(corsOptions()));
app.use(cookieParser());
app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  paystackWebhookHandler,
);
app.use(express.json({ limit: '1mb' }));

/** Stable root for cPanel post–npm-install probe (avoids text/html vs text/html; charset=utf-8 mismatch). */
app.get('/', (_req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send('Raafortagro API');
});

app.use('/uploads', express.static(path.join(projectRoot, 'public', 'uploads')));
app.use(express.static(path.join(projectRoot, 'public')));

/** Liveness: Node is up (Namecheap 503 HTML usually means this never runs). */
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'raafortagro-api',
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    uptime: Math.floor(process.uptime()),
  });
});

/** Readiness: can reach PostgreSQL. */
app.get('/api/health/db', async (_req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ ok: false, error: 'DATABASE_URL is not set on the server.' });
  }
  try {
    await query('SELECT 1');
    res.json({ ok: true, database: 'postgresql' });
  } catch (e) {
    console.error('[health/db]', e.message);
    res.status(503).json({ ok: false, error: 'Database unavailable.' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/external', externalRoutes);

app.use((err, _req, res, _next) => {
  console.error('[API Error]', err);
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Image must be 5 MB or smaller.' });
  }
  if (err?.message === 'Only image files are allowed.') {
    return res.status(400).json({ error: err.message });
  }
  if (err?.http_code) {
    return res.status(400).json({ error: err.message || 'Cloudinary upload failed.' });
  }
  if (err?.code === '23505') {
    return res.status(409).json({ error: 'This record already exists.' });
  }
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err?.message || 'Internal server error.';
  res.status(500).json({ error: message });
});

async function start() {
  app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on 0.0.0.0:${port} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
  });

  if (!process.env.DATABASE_URL) {
    console.error('[startup] Missing DATABASE_URL — set it in cPanel Node.js environment variables.');
    return;
  }

  try {
    await initDb();
    await seedSiteContent();
    await seedBlogPosts();
    await migrateBlogPosts();
    console.log('PostgreSQL schema ready.');
  } catch (err) {
    console.error('[startup] Database init failed:', err.message);
  }
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

process.on('SIGTERM', () => pool.end());
