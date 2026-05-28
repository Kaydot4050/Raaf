import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';

const STATUSES = ['pending', 'processing', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => adminApi.orders().then((r) => setOrders(r.orders || []));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    await adminApi.updateOrder(id, status);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-charcoal">Orders</h1>
      <div className="bg-white rounded-2xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-beige-soft/50 text-left text-xs uppercase text-text-muted">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3">{o.customer?.name}</td>
                <td className="px-4 py-3">{o.customer?.phone}</td>
                <td className="px-4 py-3">GH₵ {o.subtotal?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                    className="px-2 py-1 rounded-lg border border-border text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
