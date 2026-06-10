import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, HelpCircle } from 'lucide-react';
import CmsPageHero from '../components/CmsPageHero.jsx';
import Button from '../components/ui/Button.jsx';
import { fadeUp } from '../lib/motion.js';
import { fetchOrderById } from '../lib/orders.js';
import { buildOrderTimeline } from '../lib/orderTracking.js';

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function track(id) {
    const trimmed = id.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const found = await fetchOrderById(trimmed);
      if (!found) {
        setError('Order not found. Check your order ID and try again.');
        return;
      }
      setOrder(found);
      setSearchParams({ order: trimmed }, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not load order.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = searchParams.get('order');
    if (id) {
      setOrderId(id);
      track(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    track(orderId);
  };

  const timeline = order ? buildOrderTimeline(order.status) : null;

  return (
    <div>
      <CmsPageHero
        page="track_order"
        fallback={{
          eyebrow: 'Track order',
          title: 'Know exactly where your order is',
          description: 'Enter your order ID from your confirmation email for live status and estimated delivery.',
          image: '/images/1-Howo-Cargo-Truck-1.jpg',
        }}
        align="center"
        fullWidth
      />

      <section className="py-16 md:py-24 bg-beige-soft">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl shadow-charcoal/8 border border-border p-6 md:p-10 -mt-16 relative z-10"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">Order ID</span>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. RAF-6KMRBQ"
                  required
                  className="mt-1.5 w-full px-4 py-3.5 rounded-xl border border-border text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </label>
              {error && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
              )}
              <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
                {loading ? 'Tracking…' : 'Track shipment'}
              </Button>
            </form>
          </motion.div>

          <AnimatePresence>
            {order && timeline && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-10 space-y-8"
              >
                <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">Order</p>
                      <p className="font-display font-bold text-charcoal text-lg">{order.id}</p>
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                        timeline.cancelled
                          ? 'bg-red-100 text-red-800'
                          : 'bg-forest/10 text-forest'
                      }`}
                    >
                      {timeline.statusLabel}
                    </span>
                  </div>

                  <div className="relative pl-2">
                    {timeline.steps.map((step, i) => {
                      const Icon = step.icon;
                      const isLast = i === timeline.steps.length - 1;
                      return (
                        <motion.div
                          key={step.id}
                          initial="hidden"
                          animate="visible"
                          variants={fadeUp}
                          custom={i}
                          className="flex gap-4 pb-8 relative"
                        >
                          {!isLast && (
                            <span
                              className={`absolute left-[19px] top-10 w-0.5 h-[calc(100%-2rem)] ${
                                step.done ? 'bg-forest' : 'bg-border'
                              }`}
                            />
                          )}
                          <span
                            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              step.active
                                ? 'bg-forest text-white ring-4 ring-forest/20'
                                : step.done
                                  ? 'bg-forest text-white'
                                  : 'bg-beige-soft text-text-muted border border-border'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </span>
                          <div className="pt-1">
                            <p className={`font-semibold text-sm ${step.done || step.active ? 'text-charcoal' : 'text-text-muted'}`}>
                              {step.label}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">{step.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {(order.trackingCode || order.logisticsProvider) && (
                    <div className="mt-2 pt-6 border-t border-border text-sm space-y-1">
                      {order.logisticsProvider && (
                        <p><span className="text-text-muted">Carrier:</span> <span className="font-medium text-charcoal">{order.logisticsProvider}</span></p>
                      )}
                      {order.trackingCode && (
                        <p><span className="text-text-muted">Tracking code:</span> <span className="font-medium text-charcoal">{order.trackingCode}</span></p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-border">
                    <Clock className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">Estimated arrival</p>
                      <p className="font-semibold text-charcoal mt-1">
                        {order.status === 'completed' || order.status === 'delivered'
                          ? 'Delivered'
                          : order.status === 'processing'
                            ? 'Within 24–48 hours'
                            : 'After dispatch'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-border">
                    <MapPin className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">Delivery region</p>
                      <p className="font-semibold text-charcoal mt-1">
                        {order.customer?.region || order.customer?.address || 'As per order address'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-forest text-white">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-beige shrink-0" />
                    <p className="text-sm text-white/85">Questions about live-animal delivery schedules?</p>
                  </div>
                  <Button to="/contact" variant="secondary" size="sm">
                    Contact support
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
