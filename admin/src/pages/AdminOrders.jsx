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
import AdminPage from '../components/AdminPage.jsx';
import AdminSection from '../components/AdminSection.jsx';
import { adminApi } from '../lib/api.js';
import { adminRowSurface } from '../lib/adminColors.js';
import { cn } from '@/lib/utils';

const STATUSES = ['pending', 'processing', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => adminApi.orders().then((r) => setOrders(r.orders || []));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    try {
      await adminApi.updateOrder(id, status);
      toast.success('Order status updated.');
      load();
    } catch (err) {
      toast.error(err.message || 'Update failed.');
    }
  };

  return (
    <AdminPage title="Orders" description="Track and update customer order status.">
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
                </p>
              </div>
              <Select value={o.status} onValueChange={(v) => setStatus(o.id, v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          {!orders.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : null}
        </div>
      </AdminSection>
    </AdminPage>
  );
}
