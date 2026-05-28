import jwt from 'jsonwebtoken';
import { getTokenFromRequest } from '../lib/authCookies.js';

const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export function signToken(user) {
  const id = Number(user.id);
  return jwt.sign({ sub: id, email: user.email }, secret, { expiresIn: '7d' });
}

function verifyTokenString(token) {
  try {
    const payload = jwt.verify(token, secret);
    return { id: Number(payload.sub), email: payload.email };
  } catch {
    return null;
  }
}

export function authOptional(req, _res, next) {
  const token = getTokenFromRequest(req);
  req.user = token ? verifyTokenString(token) : null;
  next();
}

export function authRequired(req, res, next) {
  authOptional(req, res, () => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required.' });
    next();
  });
}
