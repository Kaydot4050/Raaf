import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionReveal.jsx';
import Button from '../components/ui/Button.jsx';
import { usePageSection } from '../context/ContentContext.jsx';

const FALLBACK_FAQS = [
  { q: 'How do I place a bulk order?', a: 'Contact us with your farm size and breed preferences, or use our wholesale inquiry form.' },
  { q: 'What payment methods do you accept?', a: 'Mobile money, bank transfer, and approved credit terms for registered farm accounts.' },
];

export default function FAQ() {
  const { data } = usePageSection('faq', 'main', {
    title: 'Frequently asked questions',
    subtitle: 'Quick answers about orders, delivery, and products.',
    items: FALLBACK_FAQS,
  });
  const faqs = data.items?.length ? data.items : FALLBACK_FAQS;
  const [open, setOpen] = useState(0);

  return (
    <div className="py-12 sm:py-16 md:py-20 min-h-[50vh] bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Support"
          title={data.title || 'Frequently asked questions'}
          description={data.subtitle || 'Quick answers about ordering, delivery, and payments.'}
        />
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-charcoal text-sm sm:text-base"
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                {f.q}
                <ChevronDown className={`w-5 h-5 shrink-0 text-forest transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-text leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-sm text-text-muted mb-4">Still have questions?</p>
          <Button to="/contact" variant="forest">Contact us</Button>
        </div>
      </div>
    </div>
  );
}
