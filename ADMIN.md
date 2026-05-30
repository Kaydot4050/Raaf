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

**Admin app** (GitHub secret or `admin/.env` at build time):

```env
# Most Namecheap setups: Node API is reached on the MAIN domain (not api.* unless you created that subdomain)
VITE_API_URL=https://raafortagro.com/api
VITE_SITE_URL=https://raafortagro.com
```

Only use `https://api.raafortagro.com/api` if that subdomain exists in DNS **and** your Node app is assigned to it in cPanel.

### “Cannot reach API at https://api.raafortagro.com/api”

1. `https://api.raafortagro.com/api/health` → JSON `{"ok":true}` means Node is running.
2. `https://api.raafortagro.com/api/health/db` → JSON `{"ok":true}` means the database is connected.
3. Namecheap **HTML** 503 on `/api/health` → Node app is down; see [HOSTING.md](./HOSTING.md).
4. Set `VITE_API_URL` only after (1) works; redeploy admin after changing the GitHub secret.

## Production deploy

1. `npm run build:admin` → upload `dist-admin/` to admin hosting (Vercel, Netlify, S3, etc.)
2. Point DNS `admin.raafortagro.com` to that host
3. Ensure API CORS includes `https://admin.raafortagro.com`
4. Set `COOKIE_DOMAIN=.raafortagro.com` so login cookies work from the admin subdomain to the API

## Auth note

Login happens on the **admin app**; the session cookie is stored for the **API domain**. All admin requests use `credentials: 'include'` to send that cookie.
