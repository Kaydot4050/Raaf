import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, MapPin, Clock, HelpCircle } from 'lucide-react';
import CmsPageHero from '../components/CmsPageHero.jsx';
import Button from '../components/ui/Button.jsx';
import { fadeUp } from '../lib/motion.js';

const demoSteps = [
  { id: 'placed', label: 'Order placed', desc: 'We received your order', icon: Package, done: true },
  { id: 'prep', label: 'Preparing', desc: 'Stock selected & health checked', icon: Package, done: true },
  { id: 'transit', label: 'In transit', desc: 'On the way to your farm', icon: Truck, done: true, active: true },
  { id: 'delivered', label: 'Delivered', desc: 'Handed to you or your agent', icon: CheckCircle2, done: false },
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('order') || '');
  const [tracked, setTracked] = useState(Boolean(searchParams.get('order')));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = searchParams.get('order');
    if (id) {
      setOrderId(id);
      setTracked(true);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTracked(true);
    }, 800);
  };

  return (
    <div>
      <CmsPageHero
        page="track_order"
        fallback={{
          eyebrow: 'Track order',
          title: 'Know exactly where your order is',
          description: 'Enter your order ID from your confirmation email for live status and estimated delivery.',
          image: '/images/Raafortagro-2.png',
        }}
        align="center"
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
                  placeholder="e.g. RAF-2024-10482"
                  required
                  className="mt-1.5 w-full px-4 py-3.5 rounded-xl border border-border text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </label>
              <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
                {loading ? 'Tracking…' : 'Track shipment'}
              </Button>
            </form>
          </motion.div>

          <AnimatePresence>
            {tracked && (
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
                      <p className="font-display font-bold text-charcoal text-lg">{orderId}</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-forest/10 text-forest text-sm font-semibold">In transit</span>
                  </div>

                  <div className="relative pl-2">
                    {demoSteps.map((step, i) => {
                      const Icon = step.icon;
                      const isLast = i === demoSteps.length - 1;
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
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-border">
                    <Clock className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">Estimated arrival</p>
                      <p className="font-semibold text-charcoal mt-1">Within 24–48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-border">
                    <MapPin className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">Delivery region</p>
                      <p className="font-semibold text-charcoal mt-1">As per order address</p>
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
