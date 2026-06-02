import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { query, formatUser } from '../db.js';
import { signToken, authRequired } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { setAuthCookie, clearAuthCookie } from '../lib/authCookies.js';
import { normalizePhone, phonePlaceholderEmail, generateOtp } from '../lib/phone.js';
import { sendOtpSms } from '../lib/sms.js';

const router = Router();
const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

function respondWithSession(res, user, status = 200) {
  const token = signToken(user);
  setAuthCookie(res, token);
  res.status(status).json({ user: formatUser(user), token });
}

/** Placeholder hash so Google-only accounts satisfy NOT NULL password_hash columns. */
function googleOnlyPasswordHash(googleId) {
  return bcrypt.hashSync(`google-oauth:${googleId}`, 10);
}

async function userRowById(id) {
  const result = await query(
    'SELECT id, email, name, phone, farm_name, role, created_at, google_id FROM users WHERE id = $1',
    [id],
  );
  return result.rows[0] || null;
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, phone, farmName } = req.body ?? {};
    const normalized = String(email || '').trim().toLowerCase();
    if (!name?.trim() || !normalized || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const normalizedPhone = phone ? normalizePhone(phone) : null;
    if (phone && !normalizedPhone) {
      return res.status(400).json({ error: 'Enter a valid phone number (e.g. 024 123 4567).' });
    }

    const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1', [normalized]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    if (normalizedPhone) {
      const phoneTaken = await query('SELECT id FROM users WHERE phone = $1', [normalizedPhone]);
      if (phoneTaken.rows.length) {
        return res.status(409).json({ error: 'This phone number is already registered.' });
      }
    }

    const userCount = (await query('SELECT COUNT(*)::int AS c FROM users')).rows[0].c;
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const role =
      userCount === 0 || (adminEmail && adminEmail === normalized) ? 'admin' : 'user';

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = await query(
      `INSERT INTO users (email, password_hash, name, phone, farm_name, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, phone, farm_name, role, created_at`,
      [normalized, passwordHash, name.trim(), normalizedPhone, farmName?.trim() || null, role],
    );
    respondWithSession(res, result.rows[0], 201);
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await query(
      'SELECT id, email, name, phone, farm_name, role, created_at, password_hash FROM users WHERE LOWER(email) = $1',
      [normalized],
    );
    const row = result.rows[0];
    if (!row?.password_hash || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    respondWithSession(res, row);
  }),
);

/** Admin app only — always reads role from DB and rejects non-admins. */
router.post(
  '/admin-login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await query(
      `SELECT id, email, name, phone, farm_name, role, created_at, password_hash
       FROM users WHERE LOWER(email) = $1`,
      [normalized],
    );
    const row = result.rows[0];
    if (!row?.password_hash || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (String(row.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({
        error: 'This account does not have admin access.',
        role: row.role || 'user',
      });
    }

    respondWithSession(res, row);
  }),
);

router.post(
  '/google',
  asyncHandler(async (req, res) => {
    const { credential } = req.body ?? {};
    if (!googleClient || !process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ error: 'Google sign-in is not configured on the server.' });
    }
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required.' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (e) {
      console.error('[auth/google] verifyIdToken:', e.message);
      return res.status(401).json({
        error:
          'Google sign-in could not be verified. Ensure GOOGLE_CLIENT_ID matches your Google OAuth client.',
      });
    }

    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const name = payload.name || payload.given_name || email?.split('@')[0] || 'User';

    if (!email) {
      return res.status(400).json({ error: 'Google account must include an email address.' });
    }

    let result = await query(
      'SELECT id, email, name, phone, farm_name, role, created_at, google_id FROM users WHERE google_id = $1',
      [googleId],
    );
    let row = result.rows[0];

    if (!row) {
      result = await query(
        'SELECT id, email, name, phone, farm_name, role, created_at, google_id FROM users WHERE LOWER(email) = $1',
        [email],
      );
      row = result.rows[0];
      if (row && !row.google_id) {
        await query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, row.id]);
        row = await userRowById(row.id);
      }
    }

    if (!row) {
      const userCount = (await query('SELECT COUNT(*)::int AS c FROM users')).rows[0].c;
      const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const role =
        userCount === 0 || (adminEmail && adminEmail === email) ? 'admin' : 'user';
      const passwordHash = googleOnlyPasswordHash(googleId);

      try {
        result = await query(
          `INSERT INTO users (email, password_hash, name, google_id, role)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, email, name, phone, farm_name, role, created_at, google_id`,
          [email, passwordHash, name, googleId, role],
        );
        row = result.rows[0];
      } catch (e) {
        if (e.code === '23505') {
          result = await query(
            'SELECT id, email, name, phone, farm_name, role, created_at, google_id FROM users WHERE LOWER(email) = $1',
            [email],
          );
          row = result.rows[0];
          if (row && !row.google_id) {
            await query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, row.id]);
            row = await userRowById(row.id);
          }
        } else {
          throw e;
        }
      }
    }

    if (!row) {
      return res.status(500).json({ error: 'Could not create or load your account. Please try again.' });
    }

    respondWithSession(res, row);
  }),
);

router.post(
  '/phone/send',
  asyncHandler(async (req, res) => {
    const phone = normalizePhone(req.body?.phone);
    if (!phone) {
      return res.status(400).json({ error: 'Enter a valid Ghana phone number (e.g. 024 123 4567).' });
    }

    const code = generateOtp();
    const codeHash = bcrypt.hashSync(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await query(
      `INSERT INTO phone_otps (phone, code_hash, expires_at, attempts)
       VALUES ($1, $2, $3, 0)
       ON CONFLICT (phone) DO UPDATE SET code_hash = $2, expires_at = $3, attempts = 0`,
      [phone, codeHash, expiresAt],
    );

    const sent = await sendOtpSms(phone, code);
    const body = { ok: true, message: 'Verification code sent.' };
    if (sent.channel === 'dev') {
      body.devCode = sent.code;
      body.message = 'Dev mode: use the code shown below (also in API console).';
    }
    res.json(body);
  }),
);

router.post(
  '/phone/verify',
  asyncHandler(async (req, res) => {
    const phone = normalizePhone(req.body?.phone);
    const code = String(req.body?.code || '').trim();
    const name = req.body?.name?.trim();

    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone number and verification code are required.' });
    }

    const otpResult = await query('SELECT * FROM phone_otps WHERE phone = $1', [phone]);
    const otp = otpResult.rows[0];
    if (!otp) {
      return res.status(400).json({ error: 'Request a new verification code first.' });
    }
    if (new Date(otp.expires_at) < new Date()) {
      await query('DELETE FROM phone_otps WHERE phone = $1', [phone]);
      return res.status(400).json({ error: 'Code expired. Request a new one.' });
    }
    if (otp.attempts >= 5) {
      return res.status(429).json({ error: 'Too many attempts. Request a new code.' });
    }

    if (!bcrypt.compareSync(code, otp.code_hash)) {
      await query('UPDATE phone_otps SET attempts = attempts + 1 WHERE phone = $1', [phone]);
      return res.status(401).json({ error: 'Invalid verification code.' });
    }

    await query('DELETE FROM phone_otps WHERE phone = $1', [phone]);

    let userResult = await query(
      'SELECT id, email, name, phone, farm_name, role, created_at FROM users WHERE phone = $1',
      [phone],
    );
    let row = userResult.rows[0];

    if (!row) {
      if (!name) {
        return res.status(400).json({ error: 'Name is required for new accounts.', needsName: true });
      }
      userResult = await query(
        `INSERT INTO users (email, password_hash, name, phone)
         VALUES ($1, NULL, $2, $3)
         RETURNING id, email, name, phone, farm_name, role, created_at`,
        [phonePlaceholderEmail(phone), name, phone],
      );
      row = userResult.rows[0];
    }

    respondWithSession(res, row);
  }),
);

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get(
  '/me',
  authRequired,
  asyncHandler(async (req, res) => {
    const result = await query(
      'SELECT id, email, name, phone, farm_name, role, created_at FROM users WHERE id = $1',
      [req.user.id],
    );
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: formatUser(row) });
  }),
);

export default router;
