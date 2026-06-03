const COOKIE_NAME = 'raafort_session';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_MS,
    path: '/',
  };
  if (process.env.COOKIE_DOMAIN) {
    opts.domain = process.env.COOKIE_DOMAIN;
  }
  return opts;
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

export function getTokenFromRequest(req) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  if (req.cookies?.[COOKIE_NAME]) return req.cookies[COOKIE_NAME];
  return null;
}
