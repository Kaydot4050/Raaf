import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Average Rating' },
  { value: 'popularity', label: 'Popularity' },
];

export default function SortSelect({ value, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full sm:w-auto sm:min-w-[200px] items-center justify-between gap-3 min-h-[44px] rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-charcoal shadow-sm hover:border-forest/35 transition-colors"
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Sort products"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+6px)] z-40 w-full min-w-[200px] overflow-hidden rounded-xl border border-border bg-white py-1 shadow-xl shadow-charcoal/12"
          >
            {OPTIONS.map((opt) => {
              const active = value === opt.value;
              return (
                <li key={opt.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                      active ? 'bg-forest/10 font-semibold text-forest' : 'text-charcoal hover:bg-beige-soft'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {active && <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
