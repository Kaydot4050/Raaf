import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { formatPrice } from '../data/products.js';
import { useAccount } from '../context/AccountContext.jsx';

export default function ProductCard({ product, onAdd }) {
  const [hovered, setHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useAccount();
  const saved = isInWishlist(product.id);
  const hoverImage = product.image.replace(/-300x300\.png$/, '.png');

  const getCatLabel = (cat) => {
    if (!cat) return '';
    const map = { poultry: 'Poultry', livestock: 'Livestock', layers: 'Layers', broilers: 'Broilers' };
    return map[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  const discount =
    product.onSale && product.originalPriceMin && product.priceMin
      ? Math.round(((product.originalPriceMin - product.priceMin) / product.originalPriceMin) * 100)
      : 0;

  return (
    <motion.article
      layout
      className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/60 shadow-sm hover:shadow-xl hover:shadow-charcoal/6 transition-all duration-400"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-white">
        {product.bestSeller && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-charcoal text-white text-[10px] font-bold uppercase tracking-wide">
            Best seller
          </span>
        )}
        {product.onSale && discount > 0 && (
          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold">
            −{discount}%
          </span>
        )}
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={hovered && hoverImage !== product.image ? hoverImage : product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-2 sm:p-3 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-charcoal hover:bg-forest hover:text-white transition-colors"
            title={saved ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-charcoal hover:bg-forest hover:text-white transition-colors"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="p-3 sm:p-3.5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest">{getCatLabel(product.category)}</span>
          {product.rating > 0 && (
            <span className="flex items-center gap-0.5 text-xs font-semibold text-charcoal">
              <Star className="w-3.5 h-3.5 fill-star text-star" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <h3 className="font-display font-semibold text-sm text-charcoal leading-snug mb-1">
          <Link to={`/product/${product.id}`} className="hover:text-forest transition-colors line-clamp-2">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-border/60">
          <div className="min-w-0 flex-1 pr-1">
            <p className="text-xs sm:text-sm font-bold text-charcoal whitespace-nowrap leading-tight">
              {formatPrice(product.priceMin, product.priceMax)}
            </p>
            {product.onSale && product.originalPriceMin && (
              <p className="text-[11px] sm:text-xs text-text-muted line-through whitespace-nowrap leading-tight mt-0.5">
                {formatPrice(product.originalPriceMin, product.originalPriceMax || product.originalPriceMin)}
              </p>
            )}
          </div>
          <button
            type="button"
            className="w-9 h-9 min-w-9 min-h-9 shrink-0 rounded-full bg-forest text-white flex items-center justify-center hover:bg-forest-light shadow-md shadow-forest/25 transition-all active:scale-95 touch-target"
            onClick={() => onAdd(product)}
            title="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
