import { Link } from 'react-router-dom';
import {
  Sparkles,
  Trophy,
  Percent,
  Bird,
  Flame,
  Egg,
  Beef,
  Waves,
  Feather,
  LayoutGrid,
} from 'lucide-react';
import { usePageSection } from '../context/ContentContext.jsx';

const ICONS = [Sparkles, Trophy, Percent, Bird, Flame, Egg, Beef, Waves, Feather, LayoutGrid];

const DEFAULT_ITEMS = [
  { label: 'New Arrivals', href: '/shop?promo=new' },
  { label: 'Best Sellers', href: '/shop?promo=best' },
  { label: 'Daily Deals', href: '/shop?promo=sale' },
  { label: 'Poultry', href: '/shop?category=poultry' },
  { label: 'Broilers', href: '/shop?category=broilers' },
  { label: 'Layers', href: '/shop?category=layers' },
  { label: 'Livestock', href: '/shop?category=livestock' },
  { label: 'Ducks', href: '/shop?q=duck' },
  { label: 'Guinea Fowl', href: '/shop?q=guinea' },
  { label: 'All Products', href: '/shop' },
];

export default function CategoryIconGrid() {
  const { data } = usePageSection('home', 'categories', { items: DEFAULT_ITEMS });
  const items = data.items?.length ? data.items : DEFAULT_ITEMS;

  return (
    <div className="grid grid-cols-5 gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-5 max-w-4xl mx-auto">
      {items.map(({ label, href }, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <Link
            key={`${label}-${href}`}
            to={href}
            className="group flex flex-col items-center text-center gap-1.5"
          >
            <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/80 border border-border/60 shadow-sm flex items-center justify-center transition-colors group-hover:bg-white group-hover:border-forest/25">
              <Icon className="w-5 h-5 sm:w-[1.35rem] sm:h-[1.35rem] text-charcoal stroke-[1.5] group-hover:text-forest transition-colors" />
            </span>
            <span className="text-[9px] sm:text-[10px] font-medium text-charcoal leading-tight px-0.5 group-hover:text-forest transition-colors">
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
