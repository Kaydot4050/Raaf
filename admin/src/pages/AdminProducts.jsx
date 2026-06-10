import { useEffect, useState } from 'react';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/shadcn-button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
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
import ImageUpload from '../components/ImageUpload.jsx';
import { adminApi, mediaUrl } from '../lib/api.js';
import { adminRowSurface } from '../lib/adminColors.js';
import { PRODUCT_CATEGORIES, SELECT_CLASS } from '../lib/fieldOptions.js';
import { cn } from '@/lib/utils';

const GALLERY_SLOTS = 5;

const empty = {
  id: '',
  name: '',
  category: 'poultry',
  image: '',
  images: Array.from({ length: GALLERY_SLOTS }, () => ''),
  price: 0,
  originalPrice: null,
  onSale: false,
  discountPercent: '',
  description: '',
  featured: false,
  inStock: true,
  stockQuantity: 100,
  label: '',
  labelColor: 'green',
};

function padImages(images, primary = '') {
  const list = Array.isArray(images) ? images.filter((u) => u != null).map(String) : [];
  if (!list.length && primary) list.push(primary);
  while (list.length < GALLERY_SLOTS) list.push('');
  return list.slice(0, GALLERY_SLOTS);
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = () => adminApi.products().then((r) => setProducts(r.products || []));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    const discountPercent =
      p.onSale && p.originalPrice && p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : '';
    setForm({
      ...p,
      images: padImages(p.images, p.image),
      image: p.image || p.images?.[0] || '',
      originalPrice: p.originalPrice ?? null,
      onSale: !!p.onSale,
      discountPercent,
    });
    setOpen(true);
  };

  const applyDiscountPercent = (percent) => {
    const pct = Math.min(100, Math.max(0, Number(percent) || 0));
    const base = Number(form.originalPrice || form.price) || 0;
    if (!base) return;
    const salePrice = Math.round(base * (1 - pct / 100) * 100) / 100;
    setForm((f) => ({
      ...f,
      discountPercent: pct,
      originalPrice: f.originalPrice || base,
      price: salePrice,
      onSale: pct > 0,
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    const gallery = form.images.map((u) => u.trim()).filter(Boolean).slice(0, GALLERY_SLOTS);
    const onSale = !!form.onSale && form.originalPrice && form.price < form.originalPrice;
    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      price: form.price,
      originalPrice: onSale ? form.originalPrice : null,
      onSale,
      featured: form.featured,
      inStock: form.inStock,
      stockQuantity: form.stockQuantity,
      images: gallery,
      image: gallery[0] || '',
      label: form.label || null,
      labelColor: form.labelColor || 'green',
    };
    if (!editing) payload.id = form.id;
    try {
      if (editing) {
        await adminApi.updateProduct(editing, payload);
        toast.success('Product updated.');
      } else {
        await adminApi.createProduct(payload);
        toast.success('Product created.');
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
    if (!confirm('Delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Product deleted.');
      load();
    } catch (err) {
      toast.error(err.message || 'Delete failed.');
    }
  };

  return (
    <AdminPage
      title="Products"
      description="Add and edit shop products with photos and pricing."
      actions={
        <Button type="button" onClick={openCreate}>
          Add product
        </Button>
      }
    >
      <AdminSection
        tone="earth"
        title="Catalog"
        description={`${products.length} product${products.length === 1 ? '' : 's'}`}
      >
        <div className="flex flex-col gap-2.5">
          {products.map((p, i) => (
            <div key={p.id} className={cn('admin-row flex-wrap sm:flex-nowrap', adminRowSurface(i))}>
              <div className="admin-row-icon overflow-hidden p-0">
                {p.image ? (
                  <img src={mediaUrl(p.image)} alt="" className="size-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold">{p.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">
                  {p.category} · GH₵ {p.price}
                  {p.onSale && p.originalPrice ? ` · was GH₵ ${p.originalPrice}` : ''}
                </p>
              </div>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => openEdit(p)}>
                  <PencilIcon />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(p.id)}>
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))}
          {!products.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No products yet.</p>
          ) : null}
        </div>
      </AdminSection>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit product' : 'New product'}</DialogTitle>
            <DialogDescription>Product details appear on the public shop.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save}>
            <FieldGroup>
              <Field>
                <FieldLabel>ID (slug)</FieldLabel>
                <Input
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  disabled={!!editing}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Category</FieldLabel>
                <select
                  className={SELECT_CLASS}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="rounded-xl border border-border bg-accent/20 p-4">
                <p className="text-sm font-semibold text-foreground mb-1">Product gallery</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Up to {GALLERY_SLOTS} photos for the product detail page. Photo 1 is the main image. Uploads are auto-compressed.
                </p>
                <div className="flex flex-col gap-6">
                  {form.images.map((src, index) => (
                    <ImageUpload
                      key={index}
                      label={`Photo ${index + 1}${index === 0 ? ' (main)' : ''}`}
                      value={src}
                      onChange={(url) => {
                        const images = [...form.images];
                        images[index] = url;
                        setForm({
                          ...form,
                          images,
                          image: images.find(Boolean) || '',
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-accent/20 p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Discount / sale</p>
                    <p className="text-xs text-muted-foreground">Shows strikethrough price and % off on the shop.</p>
                  </div>
                  <Switch
                    checked={form.onSale}
                    onCheckedChange={(onSale) =>
                      setForm((f) => ({
                        ...f,
                        onSale,
                        originalPrice: onSale ? f.originalPrice || f.price || null : null,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>{form.onSale ? 'Sale price (GH₵)' : 'Price (GH₵)'}</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: +e.target.value })}
                    />
                  </Field>
                  {form.onSale ? (
                    <Field>
                      <FieldLabel>Compare-at price (GH₵)</FieldLabel>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.originalPrice ?? ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            originalPrice: e.target.value ? +e.target.value : null,
                          })
                        }
                      />
                    </Field>
                  ) : null}
                </div>
                {form.onSale ? (
                  <Field>
                    <FieldLabel>Quick discount (%)</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={form.discountPercent}
                        onChange={(e) => applyDiscountPercent(e.target.value)}
                        placeholder="e.g. 15"
                      />
                      <div className="flex gap-1">
                        {[10, 15, 20, 25].map((pct) => (
                          <Button key={pct} type="button" variant="outline" size="sm" onClick={() => applyDiscountPercent(pct)}>
                            {pct}%
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Field>
                ) : null}
              </div>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel>Featured</FieldLabel>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(featured) => setForm({ ...form, featured })}
                />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel>In stock</FieldLabel>
                <Switch
                  checked={form.inStock}
                  onCheckedChange={(inStock) => setForm({ ...form, inStock })}
                />
              </Field>
              <Field>
                <FieldLabel>Stock Quantity</FieldLabel>
                <Input
                  type="number"
                  value={form.stockQuantity ?? 100}
                  onChange={(e) => setForm({ ...form, stockQuantity: +e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Card Label (optional — e.g. "Premium", "Heritage Breed")</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    className="flex-1"
                    placeholder="e.g. Premium, Heritage Breed"
                    value={form.label ?? ''}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                  />
                  <select
                    className={`${SELECT_CLASS} w-[120px]`}
                    value={form.labelColor || 'green'}
                    onChange={(e) => setForm({ ...form, labelColor: e.target.value })}
                  >
                    <option value="green">Green</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="brown">Brown</option>
                  </select>
                </div>
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
