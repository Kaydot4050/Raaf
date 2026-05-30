# Namecheap / production API (503 fixes)

## What the 503 means

| What you see | Meaning |
|--------------|---------|
| Namecheap HTML: *"Service Unavailable… contact Technical Support"* | Node app is **not running** (crash, wrong startup file, or `npm install` failed). |
| JSON: `{"ok":false,"error":"Database unavailable."}` | Node is up; fix **DATABASE_URL** / Neon. |
| JSON: `{"ok":true,...}` on `/api/health` but DB fails on `/api/health/db` | Fix database only. |

## Right now (verified from outside)

| URL | Result | Meaning |
|-----|--------|---------|
| `https://api.raafortagro.com/api/health` | **503** | Node app **not running** — fix cPanel below |
| `https://raafortagro.com/api/health` | **404** | Normal — API is not on the shop folder |

Admin login will fail until **api.** returns JSON, not 503.

## Checklist (cPanel → Setup Node.js App)

1. **Application root** — `api-server` (must contain `package.json`, `app.js`, and `server/index.js`).
2. **Application startup file** — **`app.js`** (not `server/index.js`). Must match `package.json` → `"main": "app.js"`.
3. **Run NPM Install** after each deploy (installs `cloudinary`, `multer`, `pg`, etc.).
4. **Stop** the app → **Run NPM Install** → **Start** (or Save).
5. **Environment variables** (required):

```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
JWT_SECRET=long-random-string
CLIENT_ORIGIN=https://raafortagro.com,https://admin.raafortagro.com
COOKIE_DOMAIN=.raafortagro.com
```

6. **Restart** the Node app after changing env or uploading files (`tmp/restart.txt` is touched on deploy).

## `api.raafortagro.com` redirects to `raafortagro.com`

That means the **subdomain is not hitting your Node app**. Apache is serving the shop site (or a cPanel redirect) instead.

**Fix (cPanel):**

1. **Domains → Redirects** — delete any redirect from `api.raafortagro.com` → `raafortagro.com`.
2. **Domains → Subdomains** — `api` should **not** use `public_html` as its document root if that’s the same as the main site. The **Setup Node.js App** entry for `api.raafortagro.com` should own that host (app root `api-server`).
3. **Setup Node.js App** — app URL = `api.raafortagro.com`, startup file = **`app.js`**, then **Run NPM Install** → **Restart**.
4. Open **https://api.raafortagro.com/api/health** again — the address bar must **stay** on `api.raafortagro.com` and show JSON (not the shop homepage).

Until that works, use the admin build that calls **`https://raafortagro.com/api`** (only works if you also proxy `/api` on the main domain — see below).

### `raafortagro.com/api/health` opens the homepage

The shop `.htaccess` was sending **every** URL (including `/api/*`) to `index.html` (React). The repo **skips** `/api` so it is not rewritten to `index.html`. The API does **not** run inside `public_html` — it runs only on the **Node app** host.

**You must fix `api.raafortagro.com` first** (no redirect to the shop):

1. **Setup Node.js App** → URL `api.raafortagro.com`, root `api-server`, startup **`app.js`**, env vars set, **Run NPM Install**, **Restart**.
2. **https://api.raafortagro.com/api/health** → JSON `{"ok":true,...}` (address bar stays on `api.`).

**Main domain:** `https://raafortagro.com/api/health` will show **404** (not homepage) until you add a proxy in cPanel or use the api subdomain in admin. Admin builds use **`https://raafortagro.com/api`** — that only works after you proxy `/api` in cPanel **or** point admin at `https://api.raafortagro.com/api`.

| Symptom | Cause |
|---------|--------|
| Homepage on `/api/health` | Old `.htaccess` — redeploy main site |
| 500 / “error” on `/api/health` | Bad proxy to broken `api.` host — removed in latest `.htaccess` |
| 503 HTML on `api.` | Node not running — cPanel logs / `node app.js` |
| `api.` redirects to main | cPanel **Redirects** or wrong subdomain docroot |

## Test URLs

1. `https://api.raafortagro.com/api/health` → JSON, **no redirect** in the browser.
2. `https://api.raafortagro.com/api/health/db` → `"ok":true` when Neon is reachable.
3. `https://raafortagro.com/api/health` → only if step 1 works **or** `/api` is proxied on the main domain.

If (1) is still Namecheap HTML:

- Open **`api-server/stderr.log`** or cPanel **Metrics → Errors**.
- In cPanel Node app, click **Terminal**, then:
  ```bash
  cd ~/api-server
  node verify.mjs
  node app.js
  ```
  (Use the **Enter to the virtual environment** command shown on your Node.js app page if `node` is not found.)
  (Adjust the `source` path — cPanel shows the exact command on the Node.js app edit page.)
- Common log lines: `Cannot find package 'multer'` → Run NPM Install; `ERR_MODULE_NOT_FOUND` → wrong deploy folder; `Missing DATABASE_URL` → add env vars in cPanel (not only a local `.env` file).

## Redeploy

Push to `main` so GitHub Actions rebuilds with fixed `deploy-server/package.json` (includes `multer` + `cloudinary`), then **Run NPM Install** + **Restart** in cPanel.

## Admin login

Set GitHub secret `VITE_API_URL` to a working base, e.g. `https://api.raafortagro.com/api` only after `/api/health` returns JSON.
