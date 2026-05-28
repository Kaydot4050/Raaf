import { query } from '../db.js';
import { defaultSiteContent, defaultBlogPosts } from '../data/defaultSiteContent.js';

export async function seedSiteContent() {
  const count = (await query('SELECT COUNT(*)::int AS c FROM site_content')).rows[0].c;
  if (count > 0) return;

  for (const row of defaultSiteContent) {
    await query(
      `INSERT INTO site_content (page, section, data) VALUES ($1, $2, $3)`,
      [row.page, row.section, row.data],
    );
  }
  console.log(`Seeded ${defaultSiteContent.length} site content sections.`);
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
