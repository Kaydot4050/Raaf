import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  buildAccountPayload,
  joinName,
  parseNotificationSettings,
  rowToAddress,
} from '../lib/accountHelpers.js';

const router = Router();

router.use(authRequired);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const account = await buildAccountPayload(req.user.id, query);
    if (!account) return res.status(404).json({ error: 'User not found.' });
    res.json({ account });
  }),
);

router.patch(
  '/profile',
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, farmName } = req.body ?? {};
    const name = joinName(firstName, lastName);
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1 AND id <> $2', [
      normalizedEmail,
      req.user.id,
    ]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Another account already uses this email.' });
    }

    await query(
      `UPDATE users SET name = $1, email = $2, phone = $3, farm_name = $4 WHERE id = $5`,
      [name, normalizedEmail, phone?.trim() || null, farmName?.trim() || null, req.user.id],
    );

    const account = await buildAccountPayload(req.user.id, query);
    res.json({ account });
  }),
);

router.patch(
  '/farm',
  asyncHandler(async (req, res) => {
    const { farmType, region, flockSize, notes } = req.body ?? {};
    await query(
      `UPDATE users SET farm_type = $1, farm_region = $2, flock_size = $3, farm_notes = $4 WHERE id = $5`,
      [
        farmType?.trim() || null,
        region?.trim() || null,
        flockSize?.trim() || null,
        notes?.trim() || null,
        req.user.id,
      ],
    );
    const account = await buildAccountPayload(req.user.id, query);
    res.json({ account });
  }),
);

router.patch(
  '/notifications',
  asyncHandler(async (req, res) => {
    const settings = parseNotificationSettings(req.body);
    await query(`UPDATE users SET notification_settings = $1::jsonb WHERE id = $2`, [
      JSON.stringify(settings),
      req.user.id,
    ]);
    const account = await buildAccountPayload(req.user.id, query);
    res.json({ account });
  }),
);

router.post(
  '/addresses',
  asyncHandler(async (req, res) => {
    const { label, name, phone, region, address, isDefault } = req.body ?? {};
    if (!name?.trim() || !phone?.trim() || !region?.trim() || !address?.trim()) {
      return res.status(400).json({ error: 'Name, phone, region, and address are required.' });
    }

    const count = (
      await query('SELECT COUNT(*)::int AS c FROM user_addresses WHERE user_id = $1', [req.user.id])
    ).rows[0].c;
    const makeDefault = Boolean(isDefault) || count === 0;

    if (makeDefault) {
      await query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [req.user.id]);
    }

    const inserted = await query(
      `INSERT INTO user_addresses (user_id, label, contact_name, phone, region, address, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, label, contact_name, phone, region, address, is_default`,
      [
        req.user.id,
        label?.trim() || 'Farm',
        name.trim(),
        phone.trim(),
        region.trim(),
        address.trim(),
        makeDefault,
      ],
    );

    const account = await buildAccountPayload(req.user.id, query);
    res.status(201).json({ account, address: rowToAddress(inserted.rows[0]) });
  }),
);

router.delete(
  '/addresses/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const deleted = await query(
      'DELETE FROM user_addresses WHERE id = $1 AND user_id = $2 RETURNING id, is_default',
      [id, req.user.id],
    );
    if (!deleted.rows[0]) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    if (deleted.rows[0].is_default) {
      const next = await query(
        'SELECT id FROM user_addresses WHERE user_id = $1 ORDER BY id ASC LIMIT 1',
        [req.user.id],
      );
      if (next.rows[0]) {
        await query('UPDATE user_addresses SET is_default = TRUE WHERE id = $1', [next.rows[0].id]);
      }
    }

    const account = await buildAccountPayload(req.user.id, query);
    res.json({ account });
  }),
);

router.post(
  '/addresses/:id/default',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const row = await query('SELECT id FROM user_addresses WHERE id = $1 AND user_id = $2', [
      id,
      req.user.id,
    ]);
    if (!row.rows[0]) return res.status(404).json({ error: 'Address not found.' });

    await query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [req.user.id]);
    await query('UPDATE user_addresses SET is_default = TRUE WHERE id = $1', [id]);

    const account = await buildAccountPayload(req.user.id, query);
    res.json({ account });
  }),
);

router.post(
  '/wishlist/:productId',
  asyncHandler(async (req, res) => {
    const productId = String(req.params.productId || '').trim();
    if (!productId) return res.status(400).json({ error: 'Product id is required.' });

    const existing = await query(
      'SELECT 1 FROM user_wishlist WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId],
    );

    if (existing.rows.length) {
      await query('DELETE FROM user_wishlist WHERE user_id = $1 AND product_id = $2', [
        req.user.id,
        productId,
      ]);
      return res.json({ wishlist: (await buildAccountPayload(req.user.id, query)).wishlist, added: false });
    }

    await query('INSERT INTO user_wishlist (user_id, product_id) VALUES ($1, $2)', [
      req.user.id,
      productId,
    ]);
    const account = await buildAccountPayload(req.user.id, query);
    res.json({ wishlist: account.wishlist, added: true });
  }),
);

router.patch(
  '/password',
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body ?? {};
    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const result = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'User not found.' });

    if (row.password_hash) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required.' });
      }
      if (!bcrypt.compareSync(currentPassword, row.password_hash)) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, req.user.id]);
    res.json({ ok: true, message: 'Password updated.' });
  }),
);

export default router;
