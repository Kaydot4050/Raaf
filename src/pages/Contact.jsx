import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import { SectionHeader, RevealItem } from '../components/ui/SectionReveal.jsx';
import { fadeUp } from '../lib/motion.js';
import { inquiriesApi } from '../lib/api.js';
import { usePageSection } from '../context/ContentContext.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

const CARD_ICONS = { Phone, Mail, Clock, MapPin };

export default function Contact() {
  usePageMeta('Contact Us', 'Get in touch with Raafortagro for orders, inquiries, and farm consultation.');
  const { data: cms } = usePageSection('contact', 'main', {
    eyebrow: 'Contact',
    title: 'Talk to our team',
    description: 'Ask about orders, breeds, or delivery. We reply within one business day.',
    supportCards: [
      { icon: 'Phone', title: 'Call us', detail: '+233 00 000 0000', href: 'tel:+233000000000' },
      { icon: 'Mail', title: 'Email', detail: 'hello@raafortagro.com', href: 'mailto:hello@raafortagro.com' },
      { icon: 'Clock', title: 'Hours', detail: 'Mon–Sat · 7am – 6pm', href: '' },
    ],
    faqs: [],
  });
  const supportCards = (cms.supportCards || []).map((c) => ({
    ...c,
    icon: CARD_ICONS[c.icon] || Phone,
    href: c.href || null,
  }));
  const faqs = cms.faqs?.length ? cms.faqs : [];
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div>
      <section className="bg-cream">
        <div className="grid lg:grid-cols-2 items-stretch">
          {/* Banner — left */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-forest via-forest-light to-charcoal flex-col justify-center px-5 sm:px-10 lg:px-12 xl:px-16 py-8 sm:py-14 lg:py-16 rounded-b-hero lg:rounded-b-none lg:rounded-r-[2.5rem] lg:rounded-l-none"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8fd4a2]/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 blur-[60px] rounded-full pointer-events-none" />
            <div className="relative z-10 max-w-lg">
              <p className="text-[#8fd4a2] text-xs font-bold tracking-[0.25em] uppercase mb-2 sm:mb-4">{cms.eyebrow}</p>
              <h1 className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.1]">
                {cms.title}
              </h1>
              <div className="mt-3 sm:mt-5 h-1 w-12 bg-[#8fd4a2] rounded-full" />
              <p className="mt-3 sm:mt-5 text-sm sm:text-base text-white/80 leading-relaxed">{cms.description}</p>
            </div>
          </motion.div>

          {/* Call, email, hours — right */}
          <div className="flex flex-col justify-center gap-0 divide-y divide-border bg-white lg:bg-cream lg:shadow-none shadow-sm">
            {supportCards.map((c, i) => {
              const Icon = c.icon;
              const content = (
                <div className="flex items-center gap-3.5 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg sm:rounded-xl bg-forest/10 flex items-center justify-center group-hover:bg-forest group-hover:text-white transition-colors duration-300">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-forest group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-charcoal text-sm sm:text-lg">{c.title}</h3>
                    <p className="text-xs sm:text-sm text-text-muted mt-0.5 truncate sm:whitespace-normal">{c.detail}</p>
                  </div>
                </div>
              );
              return (
                <RevealItem
                  key={c.title}
                  index={i + 1}
                  className="group px-5 sm:px-10 lg:px-12 xl:px-14 py-4 sm:py-7 hover:bg-white/80 lg:hover:bg-white transition-colors duration-300"
                >
                  {c.href ? (
                    <a href={c.href} className="block">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </RevealItem>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-beige-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <SectionHeader
                eyebrow="Message us"
                title="Send an inquiry"
                description="Tell us about your farm and we will get back to you with tailored recommendations."
                align="left"
              />
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-forest/10 border border-forest/20 text-charcoal"
                  >
                    <p className="font-semibold text-forest mb-1">Message received</p>
                    <p className="text-sm text-text">Thank you — our team will respond shortly.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className="space-y-5"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setFormLoading(true);
                      setFormError('');
                      try {
                        await inquiriesApi.contact(form);
                        setSent(true);
                      } catch (err) {
                        setFormError(err.message);
                      } finally {
                        setFormLoading(false);
                      }
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {formError && (
                      <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{formError}</p>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">Name</span>
                        <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-forest/30" />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">Phone</span>
                        <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-forest/30" />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">Email</span>
                      <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-forest/30" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">Message</span>
                      <textarea rows={5} required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 resize-y" />
                    </label>
                    <Button type="submit" size="lg" disabled={formLoading}>
                      {formLoading ? 'Sending…' : 'Send message'}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div>
              <SectionHeader eyebrow="FAQ" title="Common questions" align="left" />
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <div key={f.q} className="rounded-xl bg-white border border-border overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-charcoal text-sm"
                      onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    >
                      {f.q}
                      <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-4 text-sm text-text-muted">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white flex flex-col min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 shrink-0">
          <SectionHeader eyebrow="Location" title="Find us" description="Greater Accra — visit by appointment for farm tours and pickups." />
        </div>
        <div className="relative flex-1 w-full min-h-[50vh] md:min-h-0 border-y border-border bg-beige-soft">
          <iframe
            title="Raafort Agro location — Greater Accra, Ghana"
            src="https://maps.google.com/maps?q=Greater%20Accra,%20Ghana&hl=en&z=11&output=embed"
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href="https://www.google.com/maps/search/?api=1&query=Greater+Accra,Ghana"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/95 backdrop-blur-sm border border-border shadow-lg hover:border-forest/40 transition-colors z-10"
          >
            <MapPin className="w-5 h-5 text-forest shrink-0" />
            <div className="text-left">
              <p className="font-display font-semibold text-charcoal text-sm">Raafort Agro</p>
              <p className="text-xs text-text-muted">Greater Accra, Ghana · Open in Maps</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
