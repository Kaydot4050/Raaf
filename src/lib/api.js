// When accessed over a network IP (not localhost), the Vite proxy doesn't apply
// in the browser, so we point directly to the API server on port 3001.
function resolveBase() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:3001/api`;
  }
  return '/api';
}
const BASE = resolveBase();

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new Error('Cannot reach the API server. Run both frontend and API: npm run dev');
  }

  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        res.ok
          ? 'Invalid response from server.'
          : `Server error (${res.status}). Start the API with: npm run dev:server`,
      );
    }
  }

  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const authApi = {
  register: (body) => api('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => api('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  google: (credential) => api('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
  phoneSend: (phone) => api('/auth/phone/send', { method: 'POST', body: JSON.stringify({ phone }) }),
  phoneVerify: (body) => api('/auth/phone/verify', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => api('/auth/logout', { method: 'POST' }),
  me: () => api('/auth/me'),
};

export const ordersApi = {
  create: (body) => api('/orders', { method: 'POST', body: JSON.stringify(body) }),
  get: (id) => api(`/orders/${id}`),
  mine: () => api('/orders/mine'),
};

export const inquiriesApi = {
  contact: (body) => api('/inquiries/contact', { method: 'POST', body: JSON.stringify(body) }),
  wholesale: (body) => api('/inquiries/wholesale', { method: 'POST', body: JSON.stringify(body) }),
};

export const contentApi = {
  all: () => api('/content'),
  page: (page) => api(`/content?page=${encodeURIComponent(page)}`),
  blog: () => api('/content/blog'),
  blogPost: (id) => api(`/content/blog/${id}`),
};

export const productsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/products${q ? `?${q}` : ''}`);
  },
  get: (id) => api(`/products/${id}`),
};
