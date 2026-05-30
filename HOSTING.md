# Namecheap / production API (503 fixes)

## What the 503 means

| What you see | Meaning |
|--------------|---------|
| Namecheap HTML: *"Service Unavailable… contact Technical Support"* | Node app is **not running** (crash, wrong startup file, or `npm install` failed). |
| JSON: `{"ok":false,"error":"Database unavailable."}` | Node is up; fix **DATABASE_URL** / Neon. |
| JSON: `{"ok":true,...}` on `/api/health` but DB fails on `/api/health/db` | Fix database only. |

## Checklist (cPanel → Setup Node.js App)

1. **Application root** — folder where `package.json` and `server/index.js` were deployed (FTP `FTP_API_DIR`).
2. **Application startup file** — `server/index.js` (or start command: `npm start`).
3. **Run NPM Install** after each deploy (installs `cloudinary`, `multer`, `pg`, etc.).
4. **Environment variables** (required):

```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
JWT_SECRET=long-random-string
CLIENT_ORIGIN=https://raafortagro.com,https://admin.raafortagro.com
COOKIE_DOMAIN=.raafortagro.com
```

5. **Restart** the Node app after changing env or uploading files (`tmp/restart.txt` is touched on deploy).

## Test URLs

1. `https://api.raafortagro.com/api/health` → should return JSON with `"ok":true` (even before DB works).
2. `https://api.raafortagro.com/api/health/db` → should return `"ok":true` when Neon is reachable.

If (1) is still Namecheap HTML, open **cPanel → Errors** or Node app **log** — look for `Cannot find package 'multer'` or `Missing DATABASE_URL`.

## Redeploy

Push to `main` so GitHub Actions rebuilds with fixed `deploy-server/package.json` (includes `multer` + `cloudinary`), then **Run NPM Install** + **Restart** in cPanel.

## Admin login

Set GitHub secret `VITE_API_URL` to a working base, e.g. `https://api.raafortagro.com/api` only after `/api/health` returns JSON.
