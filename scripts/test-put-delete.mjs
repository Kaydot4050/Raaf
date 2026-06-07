import 'dotenv/config';

const API = 'http://localhost:3001/api';

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
  return { status: res.status, data };
}

const noAuthPut = await req('/admin/products/test-id', {
  method: 'PUT',
  body: JSON.stringify({ name: 'T', category: 'poultry', price: 1, originalPrice: 2, images: [] }),
});
console.log('PUT no auth:', noAuthPut.status, noAuthPut.data);

const noAuthDel = await req('/admin/products/test-id', { method: 'DELETE' });
console.log('DELETE no auth:', noAuthDel.status, noAuthDel.data);

const products = await req('/products');
const id = products.data.products?.[0]?.id;
console.log('sample product id:', id);
