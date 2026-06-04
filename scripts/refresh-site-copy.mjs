/**
 * Push marketing copy from server/lib/defaultSiteContent.js into site_content.
 * Run after copy edits: node scripts/refresh-site-copy.mjs
 */
import 'dotenv/config';
import { query, initDb } from '../server/db.js';
import { defaultSiteContent } from '../server/lib/defaultSiteContent.js';

await initDb();

let updated = 0;
for (const row of defaultSiteContent) {
  const result = await query(
    `INSERT INTO site_content (page, section, data, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (page, section) DO UPDATE SET data = $3, updated_at = NOW()
     RETURNING page`,
    [row.page, row.section, row.data],
  );
  if (result.rows[0]) updated += 1;
}

console.log(`Updated ${updated} site content section(s).`);
