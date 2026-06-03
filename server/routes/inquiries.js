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
  '/service-booking',
  asyncHandler(async (req, res) => {
    const { service, preferredDate, name, email, phone, farmName, region, notes } = req.body ?? {};
    if (!service?.trim() || !name?.trim() || !phone?.trim()) {
      return res.status(400).json({ error: 'Service, name, and phone are required.' });
    }
    const metadata = {
      service: service.trim(),
      preferredDate: preferredDate?.trim() || null,
      farmName: farmName?.trim() || null,
      region: region?.trim() || null,
      notes: notes?.trim() || null,
    };
    const result = await query(
      `INSERT INTO inquiries (type, name, email, phone, message, metadata)
       VALUES ('service_booking', $1, $2, $3, $4, $5) RETURNING id`,
      [
        name.trim(),
        email?.trim() || null,
        phone.trim(),
        notes?.trim() || `Service booking: ${service.trim()}`,
        JSON.stringify(metadata),
      ],
    );
    res.status(201).json({ id: result.rows[0].id, message: 'Booking request received.' });
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
