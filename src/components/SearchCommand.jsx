import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, ShoppingBag, BookOpen, Package } from 'lucide-react';
import { useSearch } from '../context/SearchContext.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useLockBodyScroll } from '../lib/useLockBodyScroll.js';
import { formatPrice } from '../data/products.js';

const GOTO = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'about', label: 'Our Mission', to: '/about' },
  { id: 'shop', label: 'Shop', to: '/shop' },
  { id: 'services', label: 'Services', to: '/services' },
  { id: 'blog', label: 'Blog', to: '/blog' },
  { id: 'contact', label: 'Contact', to: '/contact' },
  { id: 'cart', label: 'Cart', to: '/cart' },
  { id: 'account', label: 'My Account', to: '/account' },
  { id: 'track', label: 'Track Order', to: '/track-order' },
];

export default function SearchCommand() {
  const { open, closeSearch } = useSearch();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  useLockBodyScroll(open);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = [];

    const quick = [
      { id: 'browse', label: 'Browse all products', to: '/shop', icon: ShoppingBag },
      { id: 'shop-q', label: q ? `Search shop for “${query.trim()}”` : 'Search the shop', to: q ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop', icon: Search },
    ].filter((item) => !q || item.id === 'shop-q');

    if (!q) {
      out.push({ title: 'SHOP', items: quick });
    }

    const matched = products
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q),
      )
      .slice(0, 8)
      .map((p) => ({
        id: `product-${p.id}`,
        label: p.name,
        hint: formatPrice(p.price),
        to: `/product/${p.id}`,
        icon: Package,
        image: p.image,
      }));

    if (matched.length) out.push({ title: 'PRODUCTS', items: matched });
    else if (q) out.push({ title: 'PRODUCTS', items: [{ id: 'no-results', label: 'No products found', disabled: true }] });

    const goto = GOTO.filter((g) => !q || g.label.toLowerCase().includes(q) || g.to.includes(q)).map((g) => ({
      ...g,
      icon: ArrowRight,
      hint: null,
    }));

    out.push({ title: 'GO TO', items: goto });

    return out;
  }, [query, products]);

  const flat = useMemo(() => sections.flatMap((s) => s.items.filter((i) => !i.disabled)), [sections]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const go = useCallback(
    (item) => {
      if (!item || item.disabled) return;
      closeSearch();
      navigate(item.to);
    },
    [closeSearch, navigate],
  );

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(flat.length, 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + flat.length) % Math.max(flat.length, 1));
    }
    if (e.key === 'Enter' && flat[active]) {
      e.preventDefault();
      go(flat[active]);
    }
  };

  let itemIndex = -1;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close search"
            className="fixed inset-0 z-[300] bg-charcoal/25 backdrop-blur-sm border-none cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed left-1/2 top-[12%] sm:top-[18%] z-[301] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl bg-cream border border-border shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-white/60">
              <Search className="w-5 h-5 text-text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent border-none outline-none text-charcoal text-sm placeholder:text-text-muted"
              />
              <kbd className="hidden sm:inline text-[10px] text-text-muted border border-border rounded px-1.5 py-0.5 bg-beige-soft/80">
                esc
              </kbd>
            </div>

            <div className="max-h-[min(60vh,420px)] overflow-y-auto py-2">
              {sections.map((section) => (
                <div key={section.title} className="mb-1">
                  <p className="px-4 py-2 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                    {section.title}
                  </p>
                  <ul>
                    {section.items.map((item) => {
                      if (item.disabled) {
                        return (
                          <li key={item.id} className="px-4 py-2.5 text-sm text-text-muted">
                            {item.label}
                          </li>
                        );
                      }
                      itemIndex += 1;
                      const idx = itemIndex;
                      const selected = idx === active;
                      const Icon = item.icon || BookOpen;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => go(item)}
                            onMouseEnter={() => setActive(idx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                              selected
                                ? 'bg-forest/10 text-charcoal'
                                : 'text-charcoal/90 hover:bg-beige-soft'
                            }`}
                          >
                            {item.image ? (
                              <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-beige-soft border border-border" />
                            ) : (
                              <Icon className="w-4 h-4 shrink-0 text-forest-muted" />
                            )}
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.hint && <span className="text-xs text-text-muted shrink-0">{item.hint}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
