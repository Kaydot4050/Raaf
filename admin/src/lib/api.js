// Default /api uses Vite proxy in dev (avoids CORS on :5174).
// On network (non-localhost) access the Vite proxy doesn't apply in the browser,
// so we point directly to the API server on port 3001 of the same host.
function resolveBase() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:3001/api`;
  }
  return '/api';
}
const BASE = resolveBase();
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

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new Error(`Cannot reach API at ${BASE}. Is the server running?`);
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
          ? `Invalid response from ${BASE}${path}`
          : `Server error (${res.status}) from ${BASE}${path}: ${preview}`,
      );
    }
  }

  if (!res.ok) {
    let message = data.error || res.statusText || 'Request failed';
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

export const adminApi = {
  stats: () => api('/admin/stats'),
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
