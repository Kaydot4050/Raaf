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
import { cn } from '@/lib/utils';

const empty = {
  id: '',
  name: '',
  category: 'poultry',
  image: '',
  priceMin: 0,
  priceMax: 0,
  description: '',
  featured: false,
  inStock: true,
};

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
    setForm({ ...p });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminApi.updateProduct(editing, form);
        toast.success('Product updated.');
      } else {
        await adminApi.createProduct(form);
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
                  {p.category} · GH₵ {p.priceMin}–{p.priceMax}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
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
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </Field>
              <ImageUpload
                label="Product image"
                value={form.image}
                onChange={(image) => setForm({ ...form, image })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Price min (GH₵)</FieldLabel>
                  <Input
                    type="number"
                    value={form.priceMin}
                    onChange={(e) => setForm({ ...form, priceMin: +e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel>Price max (GH₵)</FieldLabel>
                  <Input
                    type="number"
                    value={form.priceMax}
                    onChange={(e) => setForm({ ...form, priceMax: +e.target.value })}
                  />
                </Field>
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
