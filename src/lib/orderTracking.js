import { Package, Truck, CheckCircle2 } from 'lucide-react';

export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Placed', hint: 'Order received — stock selected & health checked' },
  { value: 'processing', label: 'In transit', hint: 'On the way to the customer' },
  { value: 'completed', label: 'Delivered', hint: 'Handed to customer or agent' },
  { value: 'cancelled', label: 'Cancelled', hint: 'Order cancelled' },
];

const TRACK_STEPS = [
  { id: 'placed', label: 'Order placed', desc: 'We received your order', icon: Package },
  { id: 'prep', label: 'Preparing', desc: 'Stock selected & health checked', icon: Package },
  { id: 'transit', label: 'In transit', desc: 'On the way to your farm', icon: Truck },
  { id: 'delivered', label: 'Delivered', desc: 'Handed to you or your agent', icon: CheckCircle2 },
];

const STATUS_LABELS = {
  pending: 'Order placed',
  processing: 'In transit',
  in_transit: 'In transit',
  shipped: 'In transit',
  completed: 'Delivered',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function formatOrderStatus(status) {
  const key = String(status || 'pending').toLowerCase();
  return STATUS_LABELS[key] || key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

/** Timeline: placed + preparing complete on order creation; admin drives in-transit & delivered. */
export function buildOrderTimeline(status) {
  const s = String(status || 'pending').toLowerCase();

  if (s === 'cancelled') {
    return {
      cancelled: true,
      statusLabel: 'Cancelled',
      steps: TRACK_STEPS.map((step) => ({ ...step, done: false, active: false })),
    };
  }

  let completedThrough = 1;
  let activeIndex = null;

  if (s === 'processing' || s === 'in_transit' || s === 'shipped') {
    activeIndex = 2;
  } else if (s === 'completed' || s === 'delivered') {
    completedThrough = 3;
  }

  const steps = TRACK_STEPS.map((step, i) => ({
    ...step,
    done: i <= completedThrough && i !== activeIndex,
    active: i === activeIndex,
  }));

  return {
    cancelled: false,
    statusLabel: formatOrderStatus(s),
    steps,
  };
}
