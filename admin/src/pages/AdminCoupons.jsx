import { useEffect, useState } from 'react';
import { PencilIcon, Trash2Icon, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/shadcn-button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx';
import AdminPage from '../components/AdminPage.jsx';
import AdminSection from '../components/AdminSection.jsx';
import { adminApi } from '../lib/api.js';
import { adminRowSurface } from '../lib/adminColors.js';
import { SELECT_CLASS } from '../lib/fieldOptions.js';
import { cn } from '@/lib/utils';

const empty = {
  code: '',
  description: '',
  discountType: 'percent',
  discountValue: 10,
  minOrderAmount: 0,
  maxUses: '',
  active: true,
  expiresAt: '',
};

function formatDiscount(coupon) {
  return coupon.discountType === 'percent'
    ? `${coupon.discountValue}% off`
    : `GH₵ ${coupon.discountValue} off`;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = () => adminApi.coupons().then((r) => setCoupons(r.coupons || []));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxUses: coupon.maxUses ?? '',
      active: coupon.active,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      maxUses: form.maxUses === '' ? null : Number(form.maxUses),
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    };
    try {
      if (editing) {
        await adminApi.updateCoupon(editing, payload);
        toast.success('Coupon updated.');
      } else {
        await adminApi.createCoupon(payload);
        toast.success('Coupon created.');
      }
      setOpen(false);
      setForm(empty);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Save failed.');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await adminApi.deleteCoupon(id);
      toast.success('Coupon deleted.');
      load();
    } catch (err) {
      toast.error(err.message || 'Delete failed.');
    }
  };

  return (
    <AdminPage
      title="Coupons"
      description="Create discount codes customers can apply at checkout."
      actions={
        <Button type="button" onClick={openCreate}>
          New coupon
        </Button>
      }
    >
      <AdminSection tone="wheat" title="Active codes" description={`${coupons.length} coupon${coupons.length === 1 ? '' : 's'}`}>
        <div className="flex flex-col gap-2.5">
          {coupons.map((coupon, i) => (
            <div key={coupon.id} className={cn('admin-row flex-wrap sm:flex-nowrap', adminRowSurface(i))}>
              <div className="admin-row-icon">
                <Ticket className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{coupon.code}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDiscount(coupon)}
                  {coupon.minOrderAmount ? ` · min GH₵ ${coupon.minOrderAmount}` : ''}
                  {coupon.maxUses != null ? ` · ${coupon.usedCount}/${coupon.maxUses} used` : ` · ${coupon.usedCount} used`}
                  {!coupon.active ? ' · inactive' : ''}
                </p>
              </div>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => openEdit(coupon)}>
                  <PencilIcon />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(coupon.id)}>
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))}
          {!coupons.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No coupons yet.</p>
          ) : null}
        </div>
      </AdminSection>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit coupon' : 'New coupon'}</DialogTitle>
            <DialogDescription>Customers enter this code at checkout.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save}>
            <FieldGroup>
              <Field>
                <FieldLabel>Code</FieldLabel>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FARM10"
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Description (optional)</FieldLabel>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Internal note or campaign name"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Discount type</FieldLabel>
                  <select
                    className={SELECT_CLASS}
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  >
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed amount (GH₵)</option>
                  </select>
                </Field>
                <Field>
                  <FieldLabel>{form.discountType === 'percent' ? 'Percent off' : 'Amount off (GH₵)'}</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    max={form.discountType === 'percent' ? 100 : undefined}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: +e.target.value })}
                    required
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Minimum order (GH₵)</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: +e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel>Max uses (optional)</FieldLabel>
                  <Input
                    type="number"
                    min="1"
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                    placeholder="Unlimited"
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel>Expiry date (optional)</FieldLabel>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
                <FieldDescription>Leave blank for no expiry.</FieldDescription>
              </Field>
              <Field orientation="horizontal">
                <FieldLabel>Active</FieldLabel>
                <Switch checked={form.active} onCheckedChange={(active) => setForm({ ...form, active })} />
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
