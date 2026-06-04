import 'dotenv/config';

const API = 'http://localhost:3001/api';
const email = `admin-test-${Date.now()}@test.local`;
const password = 'testpass123';

async function req(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text.slice(0, 300) };
  }
  return { status: res.status, data, headers: res.headers };
}

// Register (may be user if DB already has users)
const reg = await req('/auth/register', {
  method: 'POST',
  body: JSON.stringify({ name: 'Admin Test', email, password }),
});
console.log('register', reg.status, reg.data.user?.role);
if (!reg.data.token) process.exit(1);

// Promote to admin
const { query, initDb, pool } = await import('../server/db.js');
await initDb();
await query("UPDATE users SET role = 'admin' WHERE LOWER(email) = $1", [email]);
await pool.end();

// Admin login (sets cookie + token)
const login = await req('/auth/admin-login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
console.log('admin-login', login.status, login.data.user?.role);
const adminToken = login.data.token;
if (!adminToken) process.exit(1);

// Simulate shop session cookie overriding: register another user and use their token as cookie
const shopEmail = `shop-${Date.now()}@test.local`;
const shopReg = await req('/auth/register', {
  method: 'POST',
  body: JSON.stringify({ name: 'Shop User', email: shopEmail, password }),
});
const shopToken = shopReg.data.token;
console.log('shop register', shopReg.status, shopReg.data.user?.role);

const auth = { Authorization: `Bearer ${adminToken}` };
const staleCookie = `raafort_session=${shopToken}`;

const create = await req('/admin/products', {
  method: 'POST',
  headers: { ...auth, Cookie: staleCookie },
  body: JSON.stringify({
    id: 'test-delete-me',
    name: 'Test Product',
    category: 'poultry',
    priceMin: 10,
    priceMax: 20,
    images: ['/images/a.jpg'],
    featured: false,
    inStock: true,
  }),
});
console.log('create (admin bearer + shop cookie)', create.status, create.data.error || 'ok');

const update = await req('/admin/products/test-delete-me', {
  method: 'PUT',
  headers: { ...auth, Cookie: staleCookie },
  body: JSON.stringify({
    name: 'Test Product Updated',
    category: 'poultry',
    priceMin: 15,
    priceMax: 25,
    images: ['/images/a.jpg', '/images/b.jpg'],
    featured: true,
    inStock: true,
  }),
});
console.log('update', update.status, update.data.error || update.data.product?.name);

const del = await req('/admin/products/test-delete-me', {
  method: 'DELETE',
  headers: { ...auth, Cookie: staleCookie },
});
console.log('delete', del.status, del.data.error || 'ok');
