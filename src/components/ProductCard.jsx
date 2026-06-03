import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { formatPrice } from '../data/products.js';
import { getProductGallery, productLinkState, storeProductGallery } from '../lib/productImages.js';
import { useGalleryHover } from '../hooks/useGalleryHover.js';
import { useAccount } from '../context/AccountContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProductCard({ product, onAdd }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useAccount();
  const saved = isInWishlist(product.id);

  const gallery = useMemo(() => getProductGallery(product), [product]);
  const canCycle = gallery.length > 1;
  const { activeImageIndex: imageIndex, galleryHoverHandlers } = useGalleryHover(gallery, 0);
  const linkState = productLinkState(gallery);

  const rememberGallery = () => storeProductGallery(product.id, gallery);

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
      className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/60 shadow-sm hover:shadow-lg hover:shadow-charcoal/5 transition-shadow duration-200 ease-out"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-white">
        {product.bestSeller && (
          <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-charcoal text-white text-[10px] font-bold uppercase tracking-wide pointer-events-none">
            Best seller
          </span>
        )}
        {product.onSale && discount > 0 && (
          <span className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-forest text-white text-[10px] font-bold pointer-events-none">
            −{discount}%
          </span>
        )}
        <Link
          to={`/product/${product.id}`}
          state={linkState}
          onClick={rememberGallery}
          className="relative block w-full h-full"
          {...galleryHoverHandlers}
        >
          {gallery.map((src, i) => (
            <img
              key={`${product.id}-${i}-${src}`}
              src={src}
              alt={i === 0 ? product.name : `${product.name} view ${i + 1}`}
              loading={i === 0 ? 'lazy' : 'eager'}
              decoding="async"
              className={`absolute inset-0 w-full h-full object-contain p-2 sm:p-3 transition-opacity duration-300 ease-out pointer-events-none ${
                i === imageIndex ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
              }`}
            />
          ))}
        </Link>
        {canCycle && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1 pointer-events-none">
            {gallery.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-200 ${
                  i === imageIndex ? 'w-3 bg-forest' : 'w-1 bg-charcoal/25'
                }`}
              />
            ))}
          </div>
        )}
        <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-charcoal hover:bg-forest hover:text-white transition-colors duration-150"
            title={saved ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isAuthenticated) {
                navigate('/login');
                return;
              }
              toggleWishlist(product.id);
            }}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <Link
            to={`/product/${product.id}`}
            state={linkState}
            onClick={(e) => {
              rememberGallery();
              e.stopPropagation();
            }}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-charcoal hover:bg-forest hover:text-white transition-colors duration-150"
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
          <Link
            to={`/product/${product.id}`}
            state={linkState}
            onClick={rememberGallery}
            className="hover:text-forest transition-colors line-clamp-2"
          >
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
