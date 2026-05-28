import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page } = req.query;
    if (page) {
      const result = await query(
        'SELECT page, section, data, updated_at FROM site_content WHERE page = $1 ORDER BY section',
        [page],
      );
      const sections = {};
      for (const row of result.rows) {
        sections[row.section] = row.data;
      }
      return res.json({ page, sections });
    }

    const result = await query('SELECT page, section, data FROM site_content ORDER BY page, section');
    const byPage = {};
    for (const row of result.rows) {
      if (!byPage[row.page]) byPage[row.page] = {};
      byPage[row.page][row.section] = row.data;
    }
    res.json({ content: byPage });
  }),
);

router.get(
  '/blog',
  asyncHandler(async (req, res) => {
    const result = await query(
      'SELECT * FROM blog_posts WHERE published = TRUE ORDER BY post_date DESC',
    );
    res.json({
      posts: result.rows.map((r) => ({
        id: r.id,
        title: r.title,
        excerpt: r.excerpt,
        image: r.image,
        date: r.post_date,
      })),
    });
  }),
);

router.get(
  '/blog/:id',
  asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM blog_posts WHERE id = $1 AND published = TRUE', [
      req.params.id,
    ]);
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Post not found.' });
    res.json({
      post: {
        id: row.id,
        title: row.title,
        excerpt: row.excerpt,
        body: row.body,
        image: row.image,
        date: row.post_date,
      },
    });
  }),
);

export default router;
