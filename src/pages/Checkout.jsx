import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext.jsx';
import { useAccount } from '../context/AccountContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice } from '../data/products.js';
import { createOrder } from '../lib/orders.js';
import Button from '../components/ui/Button.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

const inputCls =
  'mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30';
const labelCls = 'block text-xs font-semibold text-charcoal uppercase tracking-wide';

const SHIPPING_RATES = {
  'Greater Accra': 50,
  'Ashanti': 80,
  'Central': 60,
  'Western': 80,
  'Eastern': 60,
  'Volta': 70,
  'Northern': 100,
  'Upper East': 120,
  'Upper West': 120,
  'Bono': 90,
  'Bono East': 90,
  'Ahafo': 90,
  'Oti': 80,
  'Savannah': 110,
  'North East': 110,
  'Western North': 90,
};

const PAYMENT_OPTIONS = [
  { id: 'paystack', label: 'Online Payment (Paystack)' },
];

export default function Checkout() {
  usePageMeta('Checkout', 'Complete your order — enter delivery details and pay securely.');
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const { profile, farm } = useAccount();
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    name: profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : user?.name || '',
    email: profile.email || user?.email || '',
    phone: profile.phone || '',
    region: farm.region || '',
    address: '',
    notes: '',
    payment: 'momo',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  if (!isAuthenticated) {
    // Optionally we can pass a redirect param, but for now just redirect to login
    return <Navigate to="/login" replace />;
  }

  const subtotal = items.reduce((sum, item) => sum + item.priceMin * item.qty, 0);
  const regionKey = form.region?.trim();
  const shippingCost = regionKey && SHIPPING_RATES[regionKey] ? SHIPPING_RATES[regionKey] : 100;
  const orderTotal = subtotal + shippingCost;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Please fill in name, phone, and delivery address.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const order = await createOrder({
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          region: form.region.trim(),
          address: form.address.trim(),
          notes: form.notes.trim(),
        },
        payment: form.payment,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          qty: i.qty,
          price: i.priceMin,
          image: i.image,
        })),
        subtotal,
      });
      clear();
      
      // Initialize Paystack payment
      const paymentRes = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      const paymentData = await paymentRes.json();
      if (paymentData.authorization_url) {
        window.location.href = paymentData.authorization_url;
      } else {
        navigate(`/order-confirmation?order=${order.id}`, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Could not place order. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 md:py-20 min-h-[50vh] bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted mb-6">
          <Link to="/cart" className="hover:text-forest">Cart</Link>
          <span>/</span>
          <span className="text-charcoal font-medium">Checkout</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-charcoal">Delivery details</h2>
              {error && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
              )}
              <label className="block">
                <span className={labelCls}>Full name</span>
                <input type="text" required value={form.name} onChange={set('name')} className={inputCls} />
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className={labelCls}>Phone</span>
                  <input type="tel" required value={form.phone} onChange={set('phone')} className={inputCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>Email</span>
                  <input type="email" value={form.email} onChange={set('email')} className={inputCls} />
                </label>
              </div>
              <label className="block">
                <span className={labelCls}>Region</span>
                <input type="text" value={form.region} onChange={set('region')} placeholder="e.g. Greater Accra" className={inputCls} />
              </label>
              <label className="block">
                <span className={labelCls}>Delivery address</span>
                <textarea rows={3} required value={form.address} onChange={set('address')} className={`${inputCls} resize-y`} />
              </label>
              <label className="block">
                <span className={labelCls}>Order notes (optional)</span>
                <textarea rows={2} value={form.notes} onChange={set('notes')} placeholder="Breed preferences, delivery window…" className={`${inputCls} resize-y`} />
              </label>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5 sm:p-6">
              <h2 className="font-display text-lg font-bold text-charcoal mb-4">Payment method</h2>
              <div className="space-y-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      form.payment === opt.id ? 'border-forest bg-forest/5' : 'border-border hover:border-forest/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={form.payment === opt.id}
                      onChange={set('payment')}
                      className="accent-forest"
                    />
                    <span className="text-sm font-medium text-charcoal">{opt.label}</span>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-xs text-text-muted leading-relaxed">
                Payment instructions will be sent after we confirm your order. Live-animal orders may require a deposit.
              </p>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-border lg:sticky lg:top-24"
          >
            <h2 className="font-display text-lg font-bold text-charcoal pb-3 border-b border-border">Your order</h2>
            <ul className="mt-4 space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-charcoal line-clamp-2">
                    {item.name} <span className="text-text-muted">×{item.qty}</span>
                  </span>
                  <span className="font-semibold shrink-0">{formatPrice(item.priceMin * item.qty, item.priceMin * item.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="flex justify-between text-sm text-text-muted mt-4 pt-4 border-t border-border">
              <span>Subtotal</span>
              <span className="font-bold text-charcoal">{formatPrice(subtotal, subtotal)}</span>
            </p>
            <p className="flex justify-between text-sm text-text-muted mt-2">
              <span>Shipping</span>
              <span className="font-bold text-charcoal">{formatPrice(shippingCost, shippingCost)}</span>
            </p>
            <p className="flex justify-between text-base mt-4 pt-4 border-t border-border">
              <span className="font-bold text-charcoal">Total</span>
              <span className="font-bold text-forest text-lg">{formatPrice(orderTotal, orderTotal)}</span>
            </p>
            <Button type="submit" variant="forest" className="w-full justify-center mt-5" disabled={submitting}>
              {submitting ? 'Redirecting to payment…' : 'Pay & Place Order'}
            </Button>
            <Link to="/cart" className="block text-center text-sm text-text-muted hover:text-charcoal mt-3 py-2">
              Back to cart
            </Link>
          </motion.aside>
        </form>
      </div>
    </div>
  );
}
