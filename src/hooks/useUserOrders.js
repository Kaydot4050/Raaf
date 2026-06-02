import { useEffect, useState } from 'react';
import { ordersApi } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function formatOrderDate(createdAt) {
  if (!createdAt) return '';
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return String(createdAt).slice(0, 10);
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

const STATUS_LABELS = {
  pending: 'Processing',
  processing: 'Processing',
  shipped: 'In transit',
  in_transit: 'In transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function formatStatus(status) {
  if (!status) return 'Processing';
  const key = String(status).toLowerCase();
  if (STATUS_LABELS[key]) return STATUS_LABELS[key];
  const s = key.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function useUserOrders() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setOrders([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    ordersApi
      .mine()
      .then(({ orders: list }) => {
        if (!cancelled) setOrders(Array.isArray(list) ? list : []);
      })
      .catch((e) => {
        if (!cancelled) {
          setOrders([]);
          setError(e.message || 'Could not load orders.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const displayOrders = orders.map((o) => ({
    ...o,
    date: formatOrderDate(o.createdAt),
    statusLabel: formatStatus(o.status),
    total: o.subtotal ?? 0,
  }));

  return { orders: displayOrders, loading, error };
}
