import 'dotenv/config';

const API = process.env.API_BASE || 'http://localhost:3001/api';
const email = process.env.TEST_ADMIN_EMAIL;
const password = process.env.TEST_ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD in .env');
  process.exit(1);
}

async function req(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text.slice(0, 200) };
  }
  return { status: res.status, data };
}

const login = await req('/auth/admin-login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
if (login.status !== 200 || !login.data.token) {
  console.error('Login failed', login);
  process.exit(1);
}
const token = login.data.token;
const auth = { Authorization: `Bearer ${token}` };

const list = await req('/admin/products', { headers: auth });
const id = list.data.products?.[0]?.id;
if (!id) {
  console.error('No products to test');
  process.exit(1);
}
console.log('Product id:', id);

const update = await req(`/admin/products/${encodeURIComponent(id)}`, {
  method: 'PUT',
  headers: auth,
  body: JSON.stringify({
    name: list.data.products[0].name,
    category: list.data.products[0].category,
    price: list.data.products[0].price,
    originalPrice: list.data.products[0].originalPrice,
    images: list.data.products[0].images || [],
    image: list.data.products[0].image,
    featured: list.data.products[0].featured,
    inStock: list.data.products[0].inStock,
  }),
});
console.log('UPDATE', update.status, update.data);

const del = await req(`/admin/products/${encodeURIComponent(id)}`, {
  method: 'DELETE',
  headers: auth,
});
console.log('DELETE', del.status, del.data);
