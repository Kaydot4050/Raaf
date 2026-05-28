import 'dotenv/config';
import { query, initDb, pool } from './db.js';

await initDb();
const r = await query('SELECT id, email, role FROM users ORDER BY id');
console.table(r.rows);
await pool.end();
