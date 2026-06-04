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

function resolveBases() {
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
    bases.push(siteApiBase(hostname, protocol));
  } else if (fromEnv) {
    bases.push(fromEnv);
  }

  return [...new Set(bases)];
}

function requestCredentials(path, method) {
  const m = (method || 'GET').toUpperCase();
  if (
    m === 'GET' &&
    (path.startsWith('/products') ||
      path.startsWith('/content') ||
      path.startsWith('/auth/google-config'))
  ) {
    return 'omit';
  }
  return 'include';
}

export async function api(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body) headers['Content-Type'] = 'application/json';

  const bases = resolveBases();
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
        lastError = err;
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

  const err =
    lastError ||
    new Error(
      `Cannot reach the API (tried ${bases.join(', ')}). Check api.${typeof window !== 'undefined' ? siteRoot(window.location.hostname) : 'yourdomain.com'}/api/health`,
    );
  throw err;
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
  news: () => api('/external/news'),
  newsArticle: (url) => api(`/external/news/article?url=${encodeURIComponent(url)}`),
};
