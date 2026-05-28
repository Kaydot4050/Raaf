import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../lib/api.js';

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-charcoal">{value}</p>
      {sub && <p className="mt-1 text-xs text-text-muted">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.orders()])
      .then(([s, o]) => {
        setStats(s);
        setOrders(o.orders?.slice(0, 8) || []);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">Sales overview</h1>
        <p className="text-sm text-text-muted mt-1">Manage your store from one place.</p>
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total orders" value={stats?.totalOrders ?? '—'} />
        <StatCard label="Revenue (completed)" value={stats ? `GH₵ ${Number(stats.revenue).toLocaleString()}` : '—'} />
        <StatCard label="New customers (30d)" value={stats?.newCustomers ?? '—'} />
        <StatCard label="Pending orders" value={stats?.pendingOrders ?? '—'} />
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-charcoal">Recent orders</h2>
          <Link to="/orders" className="text-sm font-semibold text-forest hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-beige-soft/50 text-left text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{o.id}</td>
                  <td className="px-5 py-3">{o.customer?.name}</td>
                  <td className="px-5 py-3 capitalize">{o.status}</td>
                  <td className="px-5 py-3 text-right">GH₵ {o.subtotal?.toLocaleString()}</td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-text-muted">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
