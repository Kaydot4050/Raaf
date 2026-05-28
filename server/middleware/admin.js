import { authRequired } from './auth.js';
import { query } from '../db.js';

export function requireAdmin(req, res, next) {
  authRequired(req, res, async () => {
    try {
      const result = await query('SELECT role FROM users WHERE id = $1', [req.user.id]);
      const role = result.rows[0]?.role;
      if (role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
      }
      next();
    } catch (e) {
      next(e);
    }
  });
}
