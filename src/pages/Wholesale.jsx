import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Users } from 'lucide-react';
import PageHero from '../components/ui/PageHero.jsx';
import Button from '../components/ui/Button.jsx';
import { inquiriesApi } from '../lib/api.js';

const perks = [
  { icon: Package, title: 'Volume pricing', desc: 'Competitive rates on chicks, feed, and inputs for commercial farms.' },
  { icon: Truck, title: 'Scheduled logistics', desc: 'Recurring delivery windows aligned with your production cycles.' },
  { icon: Users, title: 'Dedicated support', desc: 'A named advisor for orders, health plans, and account terms.' },
];

const inputCls =
  'mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/30';
const labelCls = 'block text-xs font-semibold text-charcoal uppercase tracking-wide';

export default function Wholesale() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    farmName: '',
    contactName: '',
    phone: '',
    email: '',
    productsVolume: '',
  });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <PageHero
        eyebrow="Wholesale"
        title="Bulk & farm account orders"
        description="Commercial farms, integrators, and distributors — get tailored quotes and credit terms."
        align="left"
        tall
      />

      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-5 mb-14">
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl border border-border p-6 shadow-sm"
                >
                  <Icon className="w-8 h-8 text-forest mb-4" />
                  <h3 className="font-display font-bold text-charcoal mb-2">{p.title}</h3>
                  <p className="text-sm text-text leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal mb-4">Request a quote</h2>
              <p className="text-text text-sm leading-relaxed">
                Tell us about your operation and monthly volumes. We respond within one business day with pricing and availability.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
              {sent ? (
                <p className="text-sm text-forest font-medium bg-forest/10 border border-forest/20 rounded-xl px-4 py-4">
                  Thank you — our wholesale team will contact you shortly.
                </p>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    setError('');
                    try {
                      await inquiriesApi.wholesale(form);
                      setSent(true);
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {error && (
                    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
                  )}
                  <label className="block">
                    <span className={labelCls}>Farm / business name</span>
                    <input type="text" required value={form.farmName} onChange={set('farmName')} className={inputCls} />
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className={labelCls}>Contact name</span>
                      <input type="text" required value={form.contactName} onChange={set('contactName')} className={inputCls} />
                    </label>
                    <label className="block">
                      <span className={labelCls}>Phone</span>
                      <input type="tel" required value={form.phone} onChange={set('phone')} className={inputCls} />
                    </label>
                  </div>
                  <label className="block">
                    <span className={labelCls}>Email</span>
                    <input type="email" value={form.email} onChange={set('email')} className={inputCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>Products & monthly volume</span>
                    <textarea rows={4} required value={form.productsVolume} onChange={set('productsVolume')} placeholder="e.g. 5,000 broiler chicks/month, 40 bags feed/week…" className={`${inputCls} resize-y`} />
                  </label>
                  <Button type="submit" variant="forest" className="w-full justify-center" disabled={loading}>
                    {loading ? 'Sending…' : 'Submit inquiry'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
