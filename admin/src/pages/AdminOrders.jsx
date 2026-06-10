import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/shadcn-button.jsx';
import AdminPage from '../components/AdminPage.jsx';
import AdminSection from '../components/AdminSection.jsx';
import { adminApi } from '../lib/api.js';
import { adminRowSurface } from '../lib/adminColors.js';
import { cn } from '@/lib/utils';

const STATUSES = [
  { value: 'pending', label: 'Placed', hint: 'Order received — stock selected & health checked' },
  { value: 'processing', label: 'In transit', hint: 'On the way to the customer' },
  { value: 'completed', label: 'Delivered', hint: 'Handed to customer or agent' },
  { value: 'cancelled', label: 'Cancelled', hint: 'Order cancelled' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => adminApi.orders().then((r) => setOrders(r.orders || []));

  useEffect(() => {
    load();
  }, []);

  const [editingOrder, setEditingOrder] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ trackingCode: '', logisticsProvider: '' });

  const setStatus = async (id, status) => {
    try {
      await adminApi.updateOrder(id, { status });
      toast.success('Order status updated.');
      load();
    } catch (err) {
      toast.error(err.message || 'Update failed.');
    }
  };

  const saveTracking = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      await adminApi.updateOrder(editingOrder.id, { 
        status: editingOrder.status,
        ...trackingForm 
      });
      toast.success('Tracking info updated.');
      setEditingOrder(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Update failed.');
    }
  };

  return (
    <AdminPage title="Orders" description="Set delivery status: Placed → In transit → Delivered. Customers see this on Track Order.">
      <AdminSection
        tone="sage"
        title="All orders"
        description={`${orders.length} recent order${orders.length === 1 ? '' : 's'}`}
      >
        <div className="flex flex-col gap-2.5">
          {orders.map((o, i) => (
            <div key={o.id} className={cn('admin-row flex-wrap sm:flex-nowrap', adminRowSurface(i))}>
              <div className="admin-row-icon">
                <ShoppingCart className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  #{o.id} · {o.customer?.name || 'Guest customer'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {o.customer?.phone || '—'} · GH₵ {o.subtotal?.toLocaleString()}
                  {o.discountAmount > 0 ? ` · coupon ${o.couponCode}` : ''} · Paid: {o.paymentStatus}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingOrder(o);
                  setTrackingForm({ trackingCode: o.trackingCode || '', logisticsProvider: o.logisticsProvider || '' });
                }}>
                  Details
                </Button>
                <Select value={o.status} onValueChange={(v) => setStatus(o.id, v)}>
                  <SelectTrigger className="w-[148px]">
                    <SelectValue placeholder="Status">
                      {STATUSES.find((s) => s.value === o.status)?.label || o.status}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value} title={s.hint}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          {!orders.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : null}
        </div>
      </AdminSection>

      <Dialog open={!!editingOrder} onOpenChange={(open) => !open && setEditingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order #{editingOrder?.id}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveTracking} className="space-y-4 py-4">
            {editingOrder?.discountAmount > 0 ? (
              <p className="text-sm text-muted-foreground">
                Items GH₵ {(editingOrder.itemsTotal ?? editingOrder.subtotal)?.toLocaleString()} · Coupon{' '}
                {editingOrder.couponCode} (−GH₵ {editingOrder.discountAmount?.toLocaleString()}) · Total GH₵{' '}
                {editingOrder.subtotal?.toLocaleString()}
              </p>
            ) : null}
            <div>
              <label className="text-sm font-semibold block mb-1">Logistics Provider</label>
              <Input 
                value={trackingForm.logisticsProvider} 
                onChange={e => setTrackingForm(f => ({ ...f, logisticsProvider: e.target.value }))}
                placeholder="e.g. DHL, FedEx, Local Rider"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Tracking Code</label>
              <Input 
                value={trackingForm.trackingCode} 
                onChange={e => setTrackingForm(f => ({ ...f, trackingCode: e.target.value }))}
                placeholder="e.g. 1234567890"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingOrder(null)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
