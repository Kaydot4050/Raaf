# Namecheap / production API (503 fixes)

## What the 503 means

| What you see | Meaning |
|--------------|---------|
| Namecheap HTML: *"Service Unavailable… contact Technical Support"* | Node app is **not running** (crash, wrong startup file, or `npm install` failed). |
| JSON: `{"ok":false,"error":"Database unavailable."}` | Node is up; fix **DATABASE_URL** / Neon. |
| JSON: `{"ok":true,...}` on `/api/health` but DB fails on `/api/health/db` | Fix database only. |

## Checklist (cPanel → Setup Node.js App)

1. **Application root** — `api-server` (must contain `package.json`, `app.js`, and `server/index.js`).
2. **Application startup file** — **`app.js`** (not `server/index.js`). Must match `package.json` → `"main": "app.js"`.
3. **Run NPM Install** after each deploy (installs `cloudinary`, `multer`, `pg`, etc.).
4. **Stop** the app → **Run NPM Install** → **Start** (or Save).
4. **Environment variables** (required):

```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
JWT_SECRET=long-random-string
CLIENT_ORIGIN=https://raafortagro.com,https://admin.raafortagro.com
COOKIE_DOMAIN=.raafortagro.com
```

5. **Restart** the Node app after changing env or uploading files (`tmp/restart.txt` is touched on deploy).

## `api.raafortagro.com` redirects to `raafortagro.com`

That means the **subdomain is not hitting your Node app**. Apache is serving the shop site (or a cPanel redirect) instead.

**Fix (cPanel):**

1. **Domains → Redirects** — delete any redirect from `api.raafortagro.com` → `raafortagro.com`.
2. **Domains → Subdomains** — `api` should **not** use `public_html` as its document root if that’s the same as the main site. The **Setup Node.js App** entry for `api.raafortagro.com` should own that host (app root `api-server`).
3. **Setup Node.js App** — app URL = `api.raafortagro.com`, startup file = **`app.js`**, then **Run NPM Install** → **Restart**.
4. Open **https://api.raafortagro.com/api/health** again — the address bar must **stay** on `api.raafortagro.com` and show JSON (not the shop homepage).

Until that works, use the admin build that calls **`https://raafortagro.com/api`** (only works if you also proxy `/api` on the main domain — see below).

### API on the main domain (`raafortagro.com/api`)

The shop is static files in `public_html`. For **`https://raafortagro.com/api/health`** to work you need either:

- A **second** Node.js app on `raafortagro.com` with a path prefix (if your host supports it), or  
- An **`.htaccess` proxy** from `/api` to the working `api.` subdomain (after the subdomain is fixed).

If `raafortagro.com/api/health` also opens the homepage, the API is **only** available on a correctly configured `api.` subdomain.

## Test URLs

1. `https://api.raafortagro.com/api/health` → JSON, **no redirect** in the browser.
2. `https://api.raafortagro.com/api/health/db` → `"ok":true` when Neon is reachable.
3. `https://raafortagro.com/api/health` → only if step 1 works **or** `/api` is proxied on the main domain.

If (1) is still Namecheap HTML:

- Open **`api-server/stderr.log`** or cPanel **Metrics → Errors**.
- In cPanel Node app, click **Terminal**, then:
  ```bash
  cd ~/api-server
  source /home/YOURUSER/nodevenv/api-server/20/bin/activate
  node app.js
  ```
  (Adjust the `source` path — cPanel shows the exact command on the Node.js app edit page.)
- Common log lines: `Cannot find package 'multer'` → Run NPM Install; `ERR_MODULE_NOT_FOUND` → wrong deploy folder; `Missing DATABASE_URL` → add env vars in cPanel (not only a local `.env` file).

## Redeploy

Push to `main` so GitHub Actions rebuilds with fixed `deploy-server/package.json` (includes `multer` + `cloudinary`), then **Run NPM Install** + **Restart** in cPanel.

## Admin login

Set GitHub secret `VITE_API_URL` to a working base, e.g. `https://api.raafortagro.com/api` only after `/api/health` returns JSON.
