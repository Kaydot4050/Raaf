import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/products.js';
import Button from '../components/ui/Button.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function Cart() {
  usePageMeta('Cart', 'Review items in your cart before checkout.');
  const { items, removeItem, updateQty, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-12 sm:py-16 md:py-20 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-6">Cart</h1>
          <p className="p-4 rounded-xl border-l-4 border-forest bg-forest/5 text-charcoal mb-6 text-sm">Your cart is currently empty.</p>
          <Button to="/shop">Return to shop</Button>
        </div>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.priceMin * item.qty, 0);

  return (
    <div className="py-12 sm:py-16 md:py-20 min-h-[50vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-6 sm:mb-8">Shopping cart</h1>
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <Link to={`/product/${item.id}`} className="shrink-0 mx-auto sm:mx-0">
                  <img src={item.image} alt="" className="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-white border border-border/60 rounded-xl p-1" />
                </Link>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <Link to={`/product/${item.id}`} className="font-semibold text-charcoal text-sm sm:text-base hover:text-forest line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-sm text-forest font-bold mt-1">{formatPrice(item.priceMin, item.priceMax)}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <div className="inline-flex items-center border border-border rounded-full overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-11 h-11 border-none bg-beige-soft text-lg text-charcoal touch-target"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm font-semibold min-w-[2rem] text-center">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-11 h-11 border-none bg-beige-soft text-lg text-charcoal touch-target"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-charcoal">{formatPrice(item.priceMin * item.qty, item.priceMin * item.qty)}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-text-muted hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>

          <motion.aside
            className="bg-white rounded-2xl p-5 sm:p-6 border border-border lg:sticky lg:top-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-display text-lg font-bold text-charcoal pb-3 border-b border-border">Order summary</h2>
            <div className="space-y-2 mt-4 text-sm">
              <p className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal">{formatPrice(total, total)}</span>
              </p>
              <p className="flex justify-between text-text-muted">
                <span>Shipping</span>
                <span className="font-semibold text-charcoal text-xs sm:text-sm">At checkout</span>
              </p>
              <p className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total, total)}</span>
              </p>
            </div>
            <div className="mt-5 space-y-3">
              <Button to="/checkout" className="w-full justify-center">Proceed to checkout</Button>
              <button
                type="button"
                onClick={clear}
                className="w-full text-center text-sm font-semibold text-text-muted hover:text-charcoal py-2 min-h-[44px]"
              >
                Clear cart
              </button>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
