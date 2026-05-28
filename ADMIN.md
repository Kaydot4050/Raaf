# Admin app (separate deployment)

The admin dashboard lives in **`admin/`** and builds to **`dist-admin/`**. Deploy it on your admin subdomain (e.g. `admin.raafortagro.com`).

## Local development

```bash
# Terminal 1 — API
npm run dev:server

# Terminal 2 — public site
npm run dev

# Terminal 3 — admin app (port 5174)
npm run dev:admin

# Or all three:
npm run dev:full
```

Open **http://localhost:5174** and sign in with an **admin** account.

### Blank page?

1. Run **both** API and admin: `npm run dev:full` (or `dev:server` + `dev:admin`).
2. Use **http://localhost:5174** — not the shop URL (`:5173`).
3. In API `.env`, `CLIENT_ORIGIN` must include `http://localhost:5174` (see `.env.example`).
4. For a **production build**, run `npm run preview:admin` — do not open `dist-admin/index.html` directly in the browser.
5. If a red error bar appears at the top, check the browser console and that the API is running.

## Environment

**API `.env`** (shared by both apps):

```env
CLIENT_ORIGIN=https://raafortagro.com,https://admin.raafortagro.com
COOKIE_DOMAIN=.raafortagro.com
```

**Public site build** (`.env`):

```env
VITE_ADMIN_URL=https://admin.raafortagro.com
```

**Admin app** (`admin/.env` or build-time):

```env
VITE_API_URL=https://api.raafortagro.com/api
VITE_SITE_URL=https://raafortagro.com
```

If the API is on the same host as the shop (`https://raafortagro.com/api`), set `VITE_API_URL` accordingly.

## Production deploy

1. `npm run build:admin` → upload `dist-admin/` to admin hosting (Vercel, Netlify, S3, etc.)
2. Point DNS `admin.raafortagro.com` to that host
3. Ensure API CORS includes `https://admin.raafortagro.com`
4. Set `COOKIE_DOMAIN=.raafortagro.com` so login cookies work from the admin subdomain to the API

## Auth note

Login happens on the **admin app**; the session cookie is stored for the **API domain**. All admin requests use `credentials: 'include'` to send that cookie.
