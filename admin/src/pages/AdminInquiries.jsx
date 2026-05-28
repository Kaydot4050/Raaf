import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';

export default function AdminInquiries() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    adminApi.inquiries().then((r) => setItems(r.inquiries || []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-charcoal">Inquiries</h1>
      <div className="space-y-3">
        {items.map((q) => (
          <article key={q.id} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase text-text-muted mb-2">
              <span className="bg-beige-soft px-2 py-0.5 rounded">{q.type}</span>
              <span>{new Date(q.created_at).toLocaleString()}</span>
            </div>
            <p className="font-semibold text-charcoal">{q.name}</p>
            <p className="text-sm text-text-muted">{q.email} · {q.phone}</p>
            <p className="mt-2 text-sm">{q.message}</p>
          </article>
        ))}
        {!items.length && <p className="text-text-muted text-sm">No inquiries yet.</p>}
      </div>
    </div>
  );
}
