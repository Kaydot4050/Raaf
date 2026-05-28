import 'dotenv/config';
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
import { seedSiteContent, seedBlogPosts } from './lib/seedContent.js';

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors(corsOptions()));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ ok: true, service: 'raafortagro-api', database: 'postgresql' });
  } catch (e) {
    res.status(503).json({ ok: false, error: 'Database unavailable.' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error('[API Error]', err);
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
  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL in .env');
    process.exit(1);
  }
  await initDb();
  await seedSiteContent();
  await seedBlogPosts();
  console.log('PostgreSQL schema ready.');
  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

process.on('SIGTERM', () => pool.end());
