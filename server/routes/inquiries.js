import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post(
  '/contact',
  asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body ?? {};
    if (!name?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name and message are required.' });
    }
    const result = await query(
      `INSERT INTO inquiries (type, name, email, phone, message)
       VALUES ('contact', $1, $2, $3, $4) RETURNING id`,
      [name.trim(), email?.trim() || null, phone?.trim() || null, message.trim()],
    );
    res.status(201).json({ id: result.rows[0].id, message: 'Message received.' });
  }),
);

router.post(
  '/wholesale',
  asyncHandler(async (req, res) => {
    const { farmName, contactName, email, phone, productsVolume } = req.body ?? {};
    if (!farmName?.trim() || !contactName?.trim() || !phone?.trim()) {
      return res.status(400).json({ error: 'Farm name, contact name, and phone are required.' });
    }
    const metadata = { farmName: farmName.trim(), productsVolume: productsVolume?.trim() };
    const result = await query(
      `INSERT INTO inquiries (type, name, email, phone, message, metadata)
       VALUES ('wholesale', $1, $2, $3, $4, $5) RETURNING id`,
      [
        contactName.trim(),
        email?.trim() || null,
        phone.trim(),
        productsVolume?.trim() || '',
        JSON.stringify(metadata),
      ],
    );
    res.status(201).json({ id: result.rows[0].id, message: 'Inquiry received.' });
  }),
);

export default router;
