import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { useLockBodyScroll } from '../lib/useLockBodyScroll.js';
import ProductCard from '../components/ProductCard.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { SectionHeader } from '../components/ui/SectionReveal.jsx';
import SortSelect from '../components/ui/SortSelect.jsx';
import { categories, formatPrice } from '../data/products.js';
import { useProducts } from '../hooks/useProducts.js';
import { useCart } from '../context/CartContext.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

const TYPELABELS = {
  chicken: 'Chickens',
  sheep: 'Sheep',
  goat: 'Goats',
  duck: 'Ducks',
  guinea: 'Guinea Fowl',
};

const MAX_PER_PAGE = 16;

function FilterBlock({ title, defaultOpen = true, children, collapsed, onToggle }) {
  const isOpen = collapsed !== undefined ? !collapsed : defaultOpen;
  return (
    <div className="mb-4 pb-4 border-b border-border/80">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer p-0"
      >
        <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider m-0">{title}</h4>
        <span className={`text-text transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z" /></svg>
        </span>
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function Shop() {
  const { products, loading, error } = useProducts();
  usePageMeta('Shop', 'Browse our full range of poultry, livestock, feed, and farm equipment.');
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [category, setCategoryState] = useState(initialCategory);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 10, max: 20000 });
  const [selectedRating, setSelectedRating] = useState(null);
  const [promotions, setPromotions] = useState({ newArrivals: false, bestSellers: false, onSale: false });
  const [availability, setAvailability] = useState({ inStock: false, outOfStock: false });
  const [sortBy, setSortBy] = useState('default');
  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [collapsed, setCollapsed] = useState({});
  const { addItem } = useCart();

  useLockBodyScroll(sidebarOpen);

  const toggleCollapsed = (key) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const resetPage = useCallback(() => setPage(1), []);

  useEffect(() => {
    const urlCat = searchParams.get('category') || 'all';
    if (urlCat !== category) setCategoryState(urlCat);

    const promo = searchParams.get('promo');
    const nextPromo = { newArrivals: false, bestSellers: false, onSale: false };
    if (promo === 'new') nextPromo.newArrivals = true;
    else if (promo === 'best') nextPromo.bestSellers = true;
    else if (promo === 'sale') nextPromo.onSale = true;
    setPromotions(nextPromo);
  }, [searchParams]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQuery(q);
  }, [searchParams]);

  const handleCategorySelect = (catId) => {
    setCategoryState(catId);
    resetPage();
    const newParams = new URLSearchParams(searchParams);
    catId === 'all' ? newParams.delete('category') : newParams.set('category', catId);
    setSearchParams(newParams);
  };

  const toggleType = (typeId) => {
    resetPage();
    setSelectedTypes((prev) => (prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]));
  };

  const handlePromoChange = (key) => {
    resetPage();
    setPromotions((p) => ({ ...p, [key]: !p[key] }));
  };
  const handleAvailabilityChange = (key) => {
    resetPage();
    setAvailability((a) => ({ ...a, [key]: !a[key] }));
  };

  const clearAllFilters = () => {
    setCategoryState('all');
    setSelectedTypes([]);
    setPriceRange({ min: 10, max: 20000 });
    setSelectedRating(null);
    setPromotions({ newArrivals: false, bestSellers: false, onSale: false });
    setAvailability({ inStock: false, outOfStock: false });
    setQuery('');
    setSortBy('default');
    setPage(1);
    setSearchParams({});
  };

  const activeFilters = useMemo(() => {
    const chips = [];
    if (category !== 'all') {
      const catObj = categories.find((c) => c.id === category);
      chips.push({ id: 'category', label: `Category: ${catObj ? catObj.label : category}`, onClear: () => { handleCategorySelect('all'); resetPage(); } });
    }
    selectedTypes.forEach((t) => chips.push({ id: `type-${t}`, label: `Type: ${TYPELABELS[t] || t}`, onClear: () => { toggleType(t); resetPage(); } }));
    if (priceRange.min > 10 || priceRange.max < 20000)
      chips.push({ id: 'price', label: `Price: GHS ${priceRange.min} - GHS ${priceRange.max}`, onClear: () => { setPriceRange({ min: 10, max: 20000 }); resetPage(); } });
    if (selectedRating !== null)
      chips.push({ id: 'rating', label: `Rating: ${selectedRating} Star${selectedRating > 1 ? 's' : ''}`, onClear: () => { setSelectedRating(null); resetPage(); } });
    if (promotions.newArrivals) chips.push({ id: 'promo-new', label: 'New Arrivals', onClear: () => { handlePromoChange('newArrivals'); resetPage(); } });
    if (promotions.bestSellers) chips.push({ id: 'promo-best', label: 'Best Sellers', onClear: () => { handlePromoChange('bestSellers'); resetPage(); } });
    if (promotions.onSale) chips.push({ id: 'promo-sale', label: 'On Sale', onClear: () => { handlePromoChange('onSale'); resetPage(); } });
    if (availability.inStock) chips.push({ id: 'avail-in', label: 'In Stock', onClear: () => { handleAvailabilityChange('inStock'); resetPage(); } });
    if (availability.outOfStock) chips.push({ id: 'avail-out', label: 'Out of Stock', onClear: () => { handleAvailabilityChange('outOfStock'); resetPage(); } });
    return chips;
  }, [category, selectedTypes, priceRange, selectedRating, promotions, availability]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'all') {
      list = category === 'poultry'
        ? list.filter((p) => ['poultry', 'broilers', 'layers'].includes(p.category))
        : list.filter((p) => p.category === category);
    }
    if (selectedTypes.length > 0) list = list.filter((p) => selectedTypes.includes(p.type));
    list = list.filter((p) => p.priceMin >= priceRange.min && p.priceMin <= priceRange.max);
    if (selectedRating !== null) list = list.filter((p) => p.rating >= selectedRating);
    if (promotions.newArrivals) list = list.filter((p) => p.newArrival);
    if (promotions.bestSellers) list = list.filter((p) => p.bestSeller);
    if (promotions.onSale) list = list.filter((p) => p.onSale);
    if (availability.inStock && !availability.outOfStock) list = list.filter((p) => p.inStock);
    else if (!availability.inStock && availability.outOfStock) list = list.filter((p) => !p.inStock);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sortBy === 'price-low-high') list.sort((a, b) => a.priceMin - b.priceMin);
    else if (sortBy === 'price-high-low') list.sort((a, b) => b.priceMax - a.priceMax);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'popularity') list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    return list;
  }, [category, selectedTypes, priceRange, selectedRating, promotions, availability, query, sortBy]);

  const totalPages = Math.ceil(filtered.length / MAX_PER_PAGE);
  const displayed = useMemo(() => filtered.slice((page - 1) * MAX_PER_PAGE, page * MAX_PER_PAGE), [filtered, page]);

  useEffect(() => { if (page > totalPages && totalPages > 0) setPage(totalPages); }, [page, totalPages]);

  const renderFilterStars = (ratingVal) =>
    [1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={`text-sm ${i <= ratingVal ? 'text-[#f5a623]' : 'text-gray-300'}`}>★</span>
    ));

  return (
    <div className="bg-cream min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 pt-4 sm:pt-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] gap-5 lg:gap-6 items-start">
        <aside
          className={`fixed lg:sticky lg:top-24 lg:self-start top-0 left-0 bottom-0 w-[min(300px,90vw)] lg:w-full z-40 lg:z-auto bg-white lg:rounded-2xl p-5 lg:p-4 border-r lg:border border-border shadow-2xl lg:shadow-lg lg:shadow-charcoal/5 transition-transform duration-300 max-h-[100dvh] overflow-y-auto overscroll-contain lg:overflow-visible lg:max-h-none lg:h-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="flex justify-between items-center mb-4 lg:mb-5 pb-3 border-b border-forest/20">
            <h3 className="font-display text-base font-bold text-charcoal m-0 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-forest" />
              Filters
            </h3>
            <button type="button" className="lg:hidden p-2 rounded-full hover:bg-beige-soft" onClick={() => setSidebarOpen(false)} aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <FilterBlock title="By Categories" collapsed={collapsed.category} onToggle={() => toggleCollapsed('category')}>
            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <button type="button"
                    className={`bg-none border-none py-1.5 w-full text-left text-sm rounded cursor-pointer transition-colors ${category === c.id ? 'text-primary font-semibold' : 'text-text hover:text-primary'}`}
                    onClick={() => handleCategorySelect(c.id)}>
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </FilterBlock>

          <FilterBlock title="By Animal Type" collapsed={collapsed.type} onToggle={() => toggleCollapsed('type')}>
            <ul className="space-y-1.5">
              {Object.entries(TYPELABELS).map(([typeId, typeLabel]) => (
                <li key={typeId}>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-text">
                    <input type="checkbox" checked={selectedTypes.includes(typeId)} onChange={() => toggleType(typeId)} className="peer hidden" />
                    <span className="w-4 h-4 border-2 border-gray-300 rounded inline-flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary">
                      <span className="text-white text-[10px] font-bold hidden peer-checked:inline">✓</span>
                    </span>
                    <span>{typeLabel}</span>
                  </label>
                </li>
              ))}
            </ul>
          </FilterBlock>

          <FilterBlock title="Price" collapsed={collapsed.price} onToggle={() => toggleCollapsed('price')}>
            <div className="mb-1">
              <div className="flex gap-2.5 items-center mb-3">
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 pointer-events-none">GHS</span>
                  <input type="number" min="10" max="20000" value={priceRange.min}
                    onChange={(e) => { setPriceRange((p) => ({ ...p, min: Math.max(10, parseInt(e.target.value) || 10) })); resetPage(); }}
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded text-sm font-inherit" />
                </div>
                <span className="text-xs text-gray-400">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">GHS</span>
                  <input type="number" min="10" max="20000" value={priceRange.max}
                    onChange={(e) => { setPriceRange((p) => ({ ...p, max: Math.min(20000, parseInt(e.target.value) || 20000) })); resetPage(); }}
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded text-sm font-inherit" />
                </div>
              </div>
              <div className="mt-2.5">
                <input type="range" min="10" max="20000" value={priceRange.max}
                  onChange={(e) => { setPriceRange((p) => ({ ...p, max: parseInt(e.target.value) })); resetPage(); }}
                  className="w-full my-2" />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>GHS 10</span>
                  <span>GHS 20,000</span>
                </div>
              </div>
            </div>
          </FilterBlock>

          <FilterBlock title="Review" collapsed={collapsed.review} onToggle={() => toggleCollapsed('review')}>
            <ul className="space-y-1">
              {[5, 4, 3, 2, 1].map((stars) => (
                <li key={stars}>
                  <button type="button"
                    className={`bg-none border-none py-1 cursor-pointer flex items-center gap-2 text-sm transition-colors w-full text-left ${selectedRating === stars ? 'text-primary' : 'text-text hover:text-primary'}`}
                    onClick={() => { setSelectedRating(selectedRating === stars ? null : stars); resetPage(); }}>
                    <span>{renderFilterStars(stars)}</span>
                    <span className="text-xs text-text">& Up ({stars} Star)</span>
                  </button>
                </li>
              ))}
            </ul>
          </FilterBlock>

          <FilterBlock title="By Promotions" collapsed={collapsed.promotions} onToggle={() => toggleCollapsed('promotions')}>
            <ul className="space-y-1.5">
              {[
                { key: 'newArrivals', label: 'New Arrivals' },
                { key: 'bestSellers', label: 'Best Sellers' },
                { key: 'onSale', label: 'On Sale' },
              ].map(({ key, label }) => (
                <li key={key}>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-text">
                    <input type="checkbox" checked={promotions[key]} onChange={() => handlePromoChange(key)} className="peer hidden" />
                    <span className="w-4 h-4 border-2 border-gray-300 rounded inline-flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary">
                      <span className="text-white text-[10px] font-bold hidden peer-checked:inline">✓</span>
                    </span>
                    <span>{label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </FilterBlock>

          <FilterBlock title="Availability" collapsed={collapsed.availability} onToggle={() => toggleCollapsed('availability')}>
            <ul className="space-y-1.5">
              {[
                { key: 'inStock', label: 'In Stock' },
                { key: 'outOfStock', label: 'Out of Stock' },
              ].map(({ key, label }) => (
                <li key={key}>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-text">
                    <input type="checkbox" checked={availability[key]} onChange={() => handleAvailabilityChange(key)} className="peer hidden" />
                    <span className="w-4 h-4 border-2 border-gray-300 rounded inline-flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary">
                      <span className="text-white text-[10px] font-bold hidden peer-checked:inline">✓</span>
                    </span>
                    <span>{label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </FilterBlock>

          <button type="button" onClick={clearAllFilters}
            className="w-full py-2.5 mt-2 bg-beige-soft border border-border rounded-full text-sm font-semibold text-charcoal hover:bg-beige-dark/30 transition-colors">
            Clear all filters
          </button>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-[39] lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Products area */}
        <div className="min-w-0 w-full">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <form className="flex flex-1 min-w-0 w-full" onSubmit={(e) => e.preventDefault()}>
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  <input type="search" placeholder="Search products…" value={query}
                    onChange={(e) => { setQuery(e.target.value); resetPage(); }}
                    className="w-full pl-11 pr-4 py-3 min-h-[44px] border border-border rounded-full text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest/25" />
                </div>
              </form>
              <button type="button" onClick={() => setSidebarOpen(true)}
                className="lg:hidden inline-flex items-center justify-center gap-2 bg-forest text-white px-4 py-3 min-h-[44px] rounded-full text-sm font-semibold shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-xs text-text-muted order-2 sm:order-1">Page {page} of {totalPages} · {filtered.length} results</span>
              <div className="flex items-center gap-2 order-1 sm:order-2 sm:ml-auto w-full sm:w-auto">
                <span className="text-xs text-text-muted shrink-0">Sort:</span>
                <SortSelect
                  className="flex-1 sm:flex-none"
                  value={sortBy}
                  onChange={(v) => {
                    setSortBy(v);
                    resetPage();
                  }}
                />
              </div>
            </div>
          </div>

          <div className="lg:hidden mb-4 -mx-1 overflow-x-auto scrollbar-none">
            <div className="flex gap-2 px-1 pb-1 w-max max-w-none">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCategorySelect(c.id)}
                  className={`shrink-0 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors touch-target ${
                    category === c.id
                      ? 'bg-forest text-white shadow-sm shadow-forest/25'
                      : 'bg-white text-charcoal border border-border hover:border-forest/30'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-white rounded-lg border border-border">
              <span className="text-xs font-semibold text-heading whitespace-nowrap">Active Filter:</span>
              <div className="flex flex-wrap gap-1.5 items-center">
                {activeFilters.map((chip) => (
                  <span key={chip.id} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[11px] font-semibold">
                    {chip.label}
                    <button type="button" onClick={chip.onClear} className="bg-none border-none text-primary text-sm cursor-pointer leading-none p-0">×</button>
                  </span>
                ))}
                <button type="button" onClick={clearAllFilters} className="bg-none border-none text-xs text-gray-400 cursor-pointer px-2 hover:text-[#3a3a3a]">Clear All</button>
              </div>
            </div>
          )}

          <div className="mb-6 hidden lg:block">
            <SectionHeader eyebrow="Results" title={`${filtered.length} products`} align="left" className="!mb-0" />
          </div>
          <p className="lg:hidden text-sm font-semibold text-charcoal mb-3">{filtered.length} products</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-0">
            {displayed.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addItem} />
            ))}
          </div>

          {loading && products.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading products…</p>
          ) : null}

          {!loading && error && products.length === 0 ? (
            <div className="p-4 border-l-4 border-red-500 bg-red-50 text-charcoal rounded mt-5 text-sm">
              Could not load products. {error}
              {import.meta.env.DEV ? ' Run: npm run dev:server' : ''}
            </div>
          ) : null}

          {filtered.length === 0 && !loading && !error ? (
            <div className="p-4 border-l-4 border-primary bg-primary/5 text-heading rounded mt-5 text-sm">
              No products were found matching your selection.
            </div>
          ) : null}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 overflow-x-auto pb-2 -mx-1 px-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="shrink-0 px-3 py-2.5 min-h-[44px] border border-border rounded-full text-xs font-semibold bg-white text-charcoal disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;
                  return (
                    <span key={p} className="flex items-center gap-1.5 shrink-0">
                      {showEllipsis && <span className="text-text-muted px-1">…</span>}
                      <button
                        type="button"
                        onClick={() => setPage(p)}
                        className={`min-w-[44px] h-11 rounded-full text-xs font-semibold border transition-colors ${
                          p === page
                            ? 'bg-forest text-white border-forest'
                            : 'bg-white text-charcoal border-border'
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="shrink-0 px-3 py-2.5 min-h-[44px] border border-border rounded-full text-xs font-semibold bg-white text-charcoal disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}