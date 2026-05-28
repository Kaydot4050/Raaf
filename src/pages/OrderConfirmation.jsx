import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package } from 'lucide-react';
import { fetchOrderById } from '../lib/orders.js';
import { formatPrice } from '../data/products.js';
import Button from '../components/ui/Button.jsx';

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const orderId = params.get('order');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!orderId);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetchOrderById(orderId).then((o) => {
      setOrder(o);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-16 md:py-20 min-h-[50vh] bg-cream flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading order…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 md:py-20 min-h-[50vh] bg-cream">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-charcoal mb-4">Order not found</h1>
          <p className="text-text-muted text-sm mb-6">We could not find this order reference.</p>
          <Button to="/shop" variant="forest">Continue shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 md:py-20 min-h-[50vh] bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-10 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-forest" />
          </div>
          <p className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-2">Order received</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-2">Thank you!</h1>
          <p className="text-text text-sm leading-relaxed mb-6">
            Your order <span className="font-semibold text-charcoal">{order.id}</span> has been placed.
            Our team will contact you within one business day with payment and delivery details.
          </p>

          <div className="text-left bg-cream rounded-xl border border-border p-5 mb-8 space-y-3 text-sm">
            <p className="flex justify-between">
              <span className="text-text-muted">Customer</span>
              <span className="font-medium text-charcoal">{order.customer.name}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-text-muted">Phone</span>
              <span className="font-medium text-charcoal">{order.customer.phone}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span className="font-bold text-forest">{formatPrice(order.subtotal, order.subtotal)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-text-muted">Items</span>
              <span className="font-medium text-charcoal">{order.items.length}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button to={`/track-order?order=${order.id}`} variant="forest" className="justify-center">
              <Package className="w-4 h-4" /> Track order
            </Button>
            <Button to="/shop" variant="secondary" className="justify-center">Continue shopping</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
