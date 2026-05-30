import { query } from '../db.js';
import { defaultSiteContent, defaultBlogPosts } from './defaultSiteContent.js';

export async function seedSiteContent() {
  let inserted = 0;
  for (const row of defaultSiteContent) {
    const result = await query(
      `INSERT INTO site_content (page, section, data)
       VALUES ($1, $2, $3)
       ON CONFLICT (page, section) DO NOTHING
       RETURNING page`,
      [row.page, row.section, row.data],
    );
    if (result.rows[0]) inserted += 1;
  }
  if (inserted > 0) {
    console.log(`Seeded ${inserted} new site content section(s).`);
  }
}

export async function seedBlogPosts() {
  const count = (await query('SELECT COUNT(*)::int AS c FROM blog_posts')).rows[0].c;
  if (count > 0) return;

  for (const p of defaultBlogPosts) {
    await query(
      `INSERT INTO blog_posts (id, title, excerpt, body, image, post_date, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [p.id, p.title, p.excerpt, p.body, p.image, p.date, p.published],
    );
  }
  console.log(`Seeded ${defaultBlogPosts.length} blog posts.`);
}
