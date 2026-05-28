# Raafort Agro — Backend API

Express + PostgreSQL (Neon) API for auth, orders, products, and inquiries.

## Quick start

```bash
npm install
cp .env.example .env
npm run db:seed
npm run dev
```

- **Frontend:** http://localhost:5173  
- **API:** http://localhost:3001  
- **Sign in:** http://localhost:5173/login  

## Auth

Session uses HTTP-only cookie `raafort_session` (7 days). Frontend sends `credentials: 'include'`.

- `POST /api/auth/register` — `{ name, email, password, phone?, farmName? }`
- `POST /api/auth/login` — `{ email, password }`
- `POST /api/auth/google` — `{ credential }` (requires `GOOGLE_CLIENT_ID`)
- `POST /api/auth/phone/send` — `{ phone }`
- `POST /api/auth/phone/verify` — `{ phone, code, name? }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Other endpoints

See previous docs for products, orders, and inquiries.

## Environment

- `DATABASE_URL` — Neon Postgres connection string  
- `JWT_SECRET` — strong random string  
- `CLIENT_ORIGIN` — frontend URL (comma-separated for multiple origins)  
- Optional: `GOOGLE_CLIENT_ID`, Twilio vars for phone OTP  

Remove `NEON_AUTH_URL` / `VITE_NEON_AUTH_URL` from `.env` if present — they are no longer used.
