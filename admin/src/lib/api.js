// Dev: Vite proxy at /api. Production: infer from admin host; ignore api.* env on shared hosting.
function siteApiBase(hostname, protocol) {
  const siteHost = hostname.startsWith('admin.') ? hostname.slice('admin.'.length) : hostname;
  return `${protocol}//${siteHost}/api`;
}

/** Map api.example.com → https://example.com/api (Namecheap: Node on main domain). */
function mainSiteApiFromEnvUrl(envUrl) {
  try {
    const u = new URL(envUrl);
    if (u.hostname.startsWith('api.')) {
      return `${u.protocol}//${u.hostname.slice(4)}${u.pathname || '/api'}`.replace(/\/$/, '');
    }
  } catch {
    /* ignore */
  }
  return null;
}

function resolveBase() {
  const fromEnv = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return '/api';
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return `http://${hostname}:3001/api`;

    const siteApi = siteApiBase(hostname, protocol);
    if (hostname.startsWith('admin.')) return siteApi;

    const mainFromEnv = fromEnv ? mainSiteApiFromEnvUrl(fromEnv) : null;
    if (mainFromEnv) return mainFromEnv;
    if (fromEnv) return fromEnv;
    return siteApi;
  }

  if (fromEnv) {
    return mainSiteApiFromEnvUrl(fromEnv) || fromEnv;
  }
  return '/api';
}

/** Try main-site API first, then baked-in api.* URL if different. */
function getApiBases() {
  const primary = resolveBase();
  const bases = [primary];
  const fromEnv = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

  if (fromEnv && fromEnv !== primary) bases.push(fromEnv);

  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    const siteApi = siteApiBase(hostname, protocol);
    if (!bases.includes(siteApi)) bases.unshift(siteApi);
  }

  return [...new Set(bases)];
}

export function getApiBase() {
  return getApiBases()[0];
}
const TOKEN_KEY = 'raafort_admin_token';

export function setAuthToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

function getAuthToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function api(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const bases = getApiBases();
  let res;
  let usedBase = bases[0];
  let lastNetworkError;

  for (const base of bases) {
    try {
      res = await fetch(`${base}${path}`, {
        ...options,
        headers,
        credentials: 'include',
      });
      usedBase = base;
      break;
    } catch (err) {
      lastNetworkError = err;
      res = undefined;
    }
  }

  if (!res) {
    const siteHealth =
      typeof window !== 'undefined' && window.location.hostname.startsWith('admin.')
        ? `${window.location.protocol}//${window.location.hostname.slice('admin.'.length)}/api/health`
        : null;
    const hint = siteHealth
      ? ` Open ${siteHealth} in your browser — if that fails, fix Node in cPanel (see HOSTING.md).`
      : '';
    throw new Error(`Cannot reach API (tried ${bases.join(', ')}).${hint}`);
  }

  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      const preview = text.slice(0, 160).replace(/\s+/g, ' ').trim();
      throw new Error(
        res.ok
          ? `Invalid response from ${usedBase}${path}`
          : `Server error (${res.status}) from ${usedBase}${path}: ${preview}`,
      );
    }
  }

  if (!res.ok) {
    let message = data.error || res.statusText || 'Request failed';
    if (!data.error && (res.status === 500 || res.status === 502 || res.status === 503)) {
      message =
        'API server is not running. In the project root run: npm run dev:server (or npm run dev:full)';
    }
    if (res.status === 404 && path.includes('admin-login')) {
      message =
        'API server is outdated. Stop all terminals running the API, then run: npm run dev:server';
    }
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function sessionLogin(path, body) {
  const data = await api(path, { method: 'POST', body: JSON.stringify(body) });
  if (data.token) setAuthToken(data.token);
  return data;
}

export const authApi = {
  login: (body) => sessionLogin('/auth/admin-login', body),
  logout: async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },
  me: () => api('/auth/me'),
};

export async function uploadImage(file) {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${getApiBase()}/admin/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
    credentials: 'include',
  });
  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Upload failed (${res.status}).`);
    }
  }
  if (!res.ok) throw new Error(data.error || 'Upload failed.');
  return data;
}

export async function uploadImageFromUrl(url) {
  return api('/admin/upload-from-url', {
    method: 'POST',
    body: JSON.stringify({ url: url.trim() }),
  });
}

export function mediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = import.meta.env.VITE_SITE_URL || '';
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

export const adminApi = {
  stats: () => api('/admin/stats'),
  uploadConfig: () => api('/admin/upload-config'),
  uploadImage,
  uploadImageFromUrl,
  content: () => api('/admin/content'),
  updateContent: (page, section, data) =>
    api(`/admin/content/${page}/${section}`, { method: 'PUT', body: JSON.stringify({ data }) }),
  products: () => api('/admin/products'),
  createProduct: (body) => api('/admin/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => api(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => api(`/admin/products/${id}`, { method: 'DELETE' }),
  orders: () => api('/admin/orders'),
  updateOrder: (id, status) =>
    api(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  inquiries: () => api('/admin/inquiries'),
  blog: () => api('/admin/blog'),
  createBlog: (body) => api('/admin/blog', { method: 'POST', body: JSON.stringify(body) }),
  updateBlog: (id, body) => api(`/admin/blog/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteBlog: (id) => api(`/admin/blog/${id}`, { method: 'DELETE' }),
  users: () => api('/admin/users'),
  setUserRole: (id, role) =>
    api(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
};

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
