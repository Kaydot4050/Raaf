import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';

const empty = { id: '', title: '', excerpt: '', body: '', image: '', date: '', published: true };
const inputCls =
  'w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-forest/30';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => adminApi.blog().then((r) => setPosts(r.posts || []));

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editing) await adminApi.updateBlog(editing, form);
    else await adminApi.createBlog(form);
    setForm(empty);
    setEditing(null);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-charcoal">Blog</h1>
      <form onSubmit={save} className="bg-white rounded-2xl border border-border p-5 space-y-3">
        <input className={inputCls} placeholder="Slug id" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editing} required />
        <input className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className={inputCls} placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input className={inputCls} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <textarea className={inputCls} rows={2} placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <textarea className={inputCls} rows={6} placeholder="Body (HTML)" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <button type="submit" className="px-5 py-2.5 rounded-full bg-forest text-white text-sm font-semibold">
          {editing ? 'Update post' : 'Publish post'}
        </button>
      </form>
      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.id} className="bg-white rounded-xl border border-border px-4 py-3 flex justify-between gap-4">
            <span className="font-medium">{p.title}</span>
            <button type="button" className="text-forest text-sm font-semibold" onClick={() => { setEditing(p.id); setForm({ ...p, date: p.date?.slice?.(0, 10) || p.date }); }}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
