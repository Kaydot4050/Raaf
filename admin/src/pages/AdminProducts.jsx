import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';

const empty = {
  id: '',
  name: '',
  category: 'poultry',
  image: '',
  priceMin: 0,
  priceMax: 0,
  description: '',
  featured: false,
  inStock: true,
};

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-forest/30';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => adminApi.products().then((r) => setProducts(r.products || []));

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editing) {
      await adminApi.updateProduct(editing, form);
      setMsg('Product updated.');
    } else {
      await adminApi.createProduct(form);
      setMsg('Product created.');
    }
    setForm(empty);
    setEditing(null);
    load();
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ ...p });
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await adminApi.deleteProduct(id);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-charcoal">Products</h1>
      {msg && <p className="text-sm text-forest">{msg}</p>}

      <form onSubmit={save} className="bg-white rounded-2xl border border-border p-5 grid sm:grid-cols-2 gap-4">
        <input className={inputCls} placeholder="ID (slug)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editing} required />
        <input className={inputCls} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className={inputCls} placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className={inputCls} placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input className={inputCls} type="number" placeholder="Price min" value={form.priceMin} onChange={(e) => setForm({ ...form, priceMin: +e.target.value })} />
        <input className={inputCls} type="number" placeholder="Price max" value={form.priceMax} onChange={(e) => setForm({ ...form, priceMax: +e.target.value })} />
        <textarea className={`${inputCls} sm:col-span-2`} rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
          In stock
        </label>
        <button type="submit" className="sm:col-span-2 px-5 py-2.5 rounded-full bg-forest text-white text-sm font-semibold">
          {editing ? 'Update product' : 'Add product'}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-beige-soft/50 text-left text-xs uppercase text-text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">GH₵ {p.priceMin}–{p.priceMax}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button type="button" className="text-forest font-semibold" onClick={() => startEdit(p)}>Edit</button>
                  <button type="button" className="text-red-600" onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
