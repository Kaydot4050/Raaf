function siteRoot(hostname) {
  return hostname.replace(/^www\./, '');
}

function dedicatedApiBase(hostname, protocol) {
  return `${protocol}//api.${siteRoot(hostname)}/api`;
}

function siteApiBase(hostname, protocol) {
  return `${protocol}//${siteRoot(hostname)}/api`;
}

const DEV_PORTS = new Set(['5173', '5174', '5175', '4173', '4174']);

function isPrivateHost(hostname) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}

/** Vite dev/preview — use relative /api so the proxy reaches localhost:3001. */
function isLocalDevServer(hostname, port) {
  return isPrivateHost(hostname) && DEV_PORTS.has(port);
}

function resolveBases({ authOnly = false } = {}) {
  const fromEnv = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  const bases = [];

  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;

    if (isLocalDevServer(hostname, port)) {
      bases.push('/api', 'http://127.0.0.1:3001/api', 'http://localhost:3001/api');
      return [...new Set(bases)];
    }

    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return [`http://${hostname}:3001/api`];
    }

    bases.push(dedicatedApiBase(hostname, protocol));
    if (fromEnv) bases.push(fromEnv);
  } else if (fromEnv) {
    bases.push(fromEnv);
  }

  return [...new Set(bases)];
}

/** News image proxy lives on the API host — not the shop domain in production. */
export function externalImageUrl(src) {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  const [base] = resolveBases();
  if (!base || !src.startsWith('/api/')) return src;
  return `${base}${src.slice(4)}`;
}

function requestCredentials(path, method) {
  const m = (method || 'GET').toUpperCase();
  if (
    m === 'GET' &&
    (path.startsWith('/products') ||
      path.startsWith('/content') ||
      path.startsWith('/external') ||
      path.startsWith('/auth/google-config'))
  ) {
    return 'omit';
  }
  return 'include';
}

export async function api(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body) headers['Content-Type'] = 'application/json';

  const authOnly = path.startsWith('/auth');
  const bases = resolveBases({ authOnly });
  const credentials = options.credentials ?? requestCredentials(path, options.method);
  let lastError;

  for (const base of bases) {
    try {
      const res = await fetch(`${base}${path}`, {
        ...options,
        headers,
        credentials,
      });
      const text = await res.text();

      if (!res.ok) {
        let data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          /* non-JSON error body */
        }
        const err = new Error(data.error || `Request failed (${res.status})`);
        err.status = res.status;
        err.data = data;
        err.base = base;
        if (!lastError || res.status >= 500 || (lastError.status === 404 && res.status !== 404)) {
          lastError = err;
        }
        if (authOnly && (res.status === 502 || res.status === 503 || res.status === 504)) {
          break;
        }
        continue;
      }

      if (!text) return {};

      try {
        return JSON.parse(text);
      } catch {
        lastError = new Error(`Invalid response from ${base}${path}`);
        continue;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw friendlyFetchError(lastError, bases);
}

function friendlyFetchError(err, bases) {
  const raw = err?.message || '';
  const isNetwork =
    raw === 'Failed to fetch' ||
    raw.includes('NetworkError') ||
    raw.includes('Load failed') ||
    err?.name === 'TypeError';

  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;
    if (isLocalDevServer(hostname, port)) {
      return new Error(
        isNetwork
          ? 'Cannot reach the API. Start the backend with npm run dev (port 3001) and try again.'
          : raw || 'Request failed.',
      );
    }
    const apiHost = `api.${siteRoot(hostname)}`;
    const apiDown =
      err?.status === 503 || err?.status === 502 || err?.status === 504;
    if (apiDown || isNetwork) {
      return new Error(
        `Cannot reach the API (${err?.status || 'offline'}). Open ${protocol}//${apiHost}/api/health — you need JSON {"ok":true}, not a 503 page. Restart the Node app in cPanel (HOSTING.md).`,
      );
    }
    return new Error(raw || `Request failed (tried ${bases.join(', ')}).`);
  }

  return (
    err ||
    new Error(`Cannot reach the API (tried ${bases?.join(', ') || 'unknown'}).`)
  );
}

export const authApi = {
  googleConfig: () => api('/auth/google-config'),
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

export const couponsApi = {
  validate: (code, subtotal) =>
    api('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
};

export const paymentApi = {
  initialize: (orderId) =>
    api('/payment/initialize', { method: 'POST', body: JSON.stringify({ orderId }) }),
  verify: (reference, orderId) =>
    api('/payment/verify', { method: 'POST', body: JSON.stringify({ reference, orderId }) }),
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

export const externalApi = {
  weather: (lat, lon) => {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat);
    if (lon) params.append('lon', lon);
    const q = params.toString();
    return api(`/external/weather${q ? `?${q}` : ''}`);
  },
  geocodeSearch: (q) => api(`/external/geocode/search?q=${encodeURIComponent(q)}`),
  geocodeReverse: (lat, lon) =>
    api(`/external/geocode/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`),
  news: (params = {}) => {
    const q = new URLSearchParams();
    if (params.region) q.set('region', params.region);
    if (params.category) q.set('category', params.category);
    const qs = q.toString();
    return api(`/external/news${qs ? `?${qs}` : ''}`);
  },
  newsArticle: (url) => api(`/external/news/article?url=${encodeURIComponent(url)}`),
};
