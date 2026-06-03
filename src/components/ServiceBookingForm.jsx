import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Send } from 'lucide-react';
import { servicesCatalog } from '../data/servicesCatalog.js';
import { inquiriesApi } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const inputCls =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/15';

export default function ServiceBookingForm({ preselectedService = '' }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    service: preselectedService,
    preferredDate: '',
    name: '',
    email: '',
    phone: '',
    farmName: '',
    region: '',
    notes: '',
  });

  useEffect(() => {
    if (preselectedService) {
      setForm((f) => ({ ...f, service: preselectedService }));
    }
  }, [preselectedService]);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || user.name || '',
      email: f.email || user.email || '',
      phone: f.phone || user.phone || '',
      farmName: f.farmName || user.farmName || '',
      region: f.region || user.farmRegion || '',
    }));
  }, [user]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await inquiriesApi.serviceBooking(form);
      setSent(true);
      showToast('Booking request sent');
    } catch (err) {
      setError(err.message || 'Could not submit booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="service-booking" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-4">Book a service</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight mb-4">
            Schedule your
            <br />
            farm service.
          </h2>
          <p className="text-text leading-relaxed max-w-md">
            Pick a service, choose a preferred date, and tell us about your farm. Our team will confirm availability and next steps within one business day.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-charcoal">
            {['Free consultation on first booking', 'Flexible on-farm or remote visits', 'Nationwide delivery where applicable'].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CalendarDays className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-border bg-cream/40 p-6 sm:p-8 shadow-sm"
        >
          {sent ? (
            <div className="rounded-2xl border border-forest/20 bg-forest/5 p-6 text-charcoal">
              <p className="font-semibold text-forest mb-1">Booking request received</p>
              <p className="text-sm text-text">We will contact you shortly to confirm your appointment.</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
              )}

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-charcoal">Service *</span>
                <select required value={form.service} onChange={set('service')} className={`${inputCls} mt-1.5`}>
                  <option value="">Select a service</option>
                  {servicesCatalog.map((s) => (
                    <option key={s.title} value={s.title}>
                      {s.title} ({s.tag})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-charcoal">Preferred date</span>
                <input type="date" value={form.preferredDate} onChange={set('preferredDate')} className={`${inputCls} mt-1.5`} />
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-charcoal">Full name *</span>
                  <input required type="text" value={form.name} onChange={set('name')} className={`${inputCls} mt-1.5`} />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-charcoal">Phone *</span>
                  <input required type="tel" value={form.phone} onChange={set('phone')} className={`${inputCls} mt-1.5`} />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-charcoal">Email</span>
                <input type="email" value={form.email} onChange={set('email')} className={`${inputCls} mt-1.5`} />
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-charcoal">Farm name</span>
                  <input type="text" value={form.farmName} onChange={set('farmName')} className={`${inputCls} mt-1.5`} />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-charcoal">Region</span>
                  <input type="text" value={form.region} onChange={set('region')} className={`${inputCls} mt-1.5`} />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-charcoal">Notes</span>
                <textarea rows={4} value={form.notes} onChange={set('notes')} className={`${inputCls} mt-1.5 resize-none`} placeholder="Tell us about flock size, urgency, or special requirements." />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest py-3.5 text-sm font-semibold text-white transition-colors hover:bg-forest-light disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Submitting…' : 'Request booking'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
