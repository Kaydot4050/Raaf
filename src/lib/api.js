function siteRoot(hostname) {
  return hostname.replace(/^www\./, '');
}

function dedicatedApiBase(hostname, protocol) {
  return `${protocol}//api.${siteRoot(hostname)}/api`;
}

function siteApiBase(hostname, protocol) {
  return `${protocol}//${siteRoot(hostname)}/api`;
}

function resolveBases() {
  const fromEnv = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  const bases = [];

  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return ['/api'];
    }
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return [`http://${hostname}:3001/api`];
    }
    bases.push(dedicatedApiBase(hostname, protocol));
    bases.push(siteApiBase(hostname, protocol));
  }

  if (fromEnv) bases.unshift(fromEnv);
  return [...new Set(bases)];
}

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const bases = resolveBases();
  let res;
  let lastError;

  for (const base of bases) {
    try {
      res = await fetch(`${base}${path}`, {
        ...options,
        headers,
        credentials: 'include',
      });
      if (res.ok) break;
      if (res.status === 404 && bases.length > 1) {
        res = undefined;
        continue;
      }
      break;
    } catch (err) {
      lastError = err;
      res = undefined;
    }
  }

  if (!res) {
    throw new Error(
      lastError?.message ||
        `Cannot reach the API (tried ${bases.join(', ')}). Check api.${typeof window !== 'undefined' ? siteRoot(window.location.hostname) : 'yourdomain.com'}/api/health`,
    );
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

export const accountApi = {
  get: () => api('/account'),
  updateProfile: (body) => api('/account/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  updateFarm: (body) => api('/account/farm', { method: 'PATCH', body: JSON.stringify(body) }),
  updateNotifications: (body) =>
    api('/account/notifications', { method: 'PATCH', body: JSON.stringify(body) }),
  addAddress: (body) => api('/account/addresses', { method: 'POST', body: JSON.stringify(body) }),
  removeAddress: (id) => api(`/account/addresses/${id}`, { method: 'DELETE' }),
  setDefaultAddress: (id) => api(`/account/addresses/${id}/default`, { method: 'POST' }),
  toggleWishlist: (productId) => api(`/account/wishlist/${encodeURIComponent(productId)}`, { method: 'POST' }),
  changePassword: (body) => api('/account/password', { method: 'PATCH', body: JSON.stringify(body) }),
};

export const ordersApi = {
  create: (body) => api('/orders', { method: 'POST', body: JSON.stringify(body) }),
  get: (id) => api(`/orders/${id}`),
  mine: () => api('/orders/mine'),
};

export const inquiriesApi = {
  contact: (body) => api('/inquiries/contact', { method: 'POST', body: JSON.stringify(body) }),
  wholesale: (body) => api('/inquiries/wholesale', { method: 'POST', body: JSON.stringify(body) }),
  serviceBooking: (body) => api('/inquiries/service-booking', { method: 'POST', body: JSON.stringify(body) }),
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
  getReviews: (id) => api(`/products/${id}/reviews`),
  addReview: (id, body) => api(`/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
};
