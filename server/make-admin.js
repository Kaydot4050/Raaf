import 'dotenv/config';
import { query, initDb, pool } from './db.js';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Usage: npm run make-admin -- your@email.com');
  process.exit(1);
}

await initDb();

const result = await query(
  `UPDATE users SET role = 'admin' WHERE LOWER(email) = $1
   RETURNING id, email, name, role`,
  [email],
);

if (!result.rows.length) {
  console.error(`No user found with email: ${email}`);
  console.error('Register on the site first, then run this command again.');
  await pool.end();
  process.exit(1);
}

const u = result.rows[0];
console.log(`Done. ${u.email} (${u.name || 'no name'}) is now role: ${u.role}`);
await pool.end();
