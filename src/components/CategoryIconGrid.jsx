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

const HOME_CATEGORIES = [
  { label: 'New Arrivals', href: '/shop?promo=new', icon: Sparkles },
  { label: 'Best Sellers', href: '/shop?promo=best', icon: Trophy },
  { label: 'Daily Deals', href: '/shop?promo=sale', icon: Percent },
  { label: 'Poultry', href: '/shop?category=poultry', icon: Bird },
  { label: 'Broilers', href: '/shop?category=broilers', icon: Flame },
  { label: 'Layers', href: '/shop?category=layers', icon: Egg },
  { label: 'Livestock', href: '/shop?category=livestock', icon: Beef },
  { label: 'Ducks', href: '/shop?q=duck', icon: Waves },
  { label: 'Guinea Fowl', href: '/shop?q=guinea', icon: Feather },
  { label: 'All Products', href: '/shop', icon: LayoutGrid },
];

export default function CategoryIconGrid() {
  return (
    <div className="grid grid-cols-5 gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-5 max-w-4xl mx-auto">
      {HOME_CATEGORIES.map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
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
      ))}
    </div>
  );
}
