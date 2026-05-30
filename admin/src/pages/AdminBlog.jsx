import { useEffect, useState } from 'react';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/shadcn-button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Badge } from '@/components/ui/badge.jsx';
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

const empty = { id: '', title: '', excerpt: '', body: '', image: '', date: '', published: true };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = () => adminApi.blog().then((r) => setPosts(r.posts || []));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...empty, date: new Date().toISOString().slice(0, 10) });
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      ...p,
      date: p.date?.slice?.(0, 10) || p.date || '',
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await adminApi.updateBlog(editing, form);
      else await adminApi.createBlog(form);
      toast.success(editing ? 'Post updated.' : 'Post published.');
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Save failed.');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await adminApi.deleteBlog(id);
      toast.success('Post deleted.');
      load();
    } catch (err) {
      toast.error(err.message || 'Delete failed.');
    }
  };

  return (
    <AdminPage
      title="Blog"
      description="Write farm articles with cover images for the public blog."
      actions={<Button onClick={openCreate}>New post</Button>}
    >
      <AdminSection
        tone="wheat"
        title="Posts"
        description={`${posts.length} post${posts.length === 1 ? '' : 's'}`}
      >
        <div className="flex flex-col gap-2.5">
          {posts.map((p, i) => (
            <div key={p.id} className={cn('admin-row items-start flex-wrap sm:flex-nowrap', adminRowSurface(i))}>
              <div className="admin-row-icon overflow-hidden p-0">
                {p.image ? (
                  <img src={mediaUrl(p.image)} alt="" className="size-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold">{p.title.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {p.date?.slice?.(0, 10) || p.date}
                </p>
                <Badge variant={p.published ? 'default' : 'secondary'} className="mt-2">
                  {p.published ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => openEdit(p)}>
                  <PencilIcon data-icon="inline-start" />
                  Edit
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(p.id)}>
                  <Trash2Icon data-icon="inline-start" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {!posts.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No posts yet.</p>
          ) : null}
        </div>
      </AdminSection>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit post' : 'New post'}</DialogTitle>
            <DialogDescription>Posts appear on the website blog page.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save}>
            <FieldGroup>
              <Field>
                <FieldLabel>Slug</FieldLabel>
                <Input
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  disabled={!!editing}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </Field>
              <ImageUpload
                label="Cover image"
                value={form.image}
                onChange={(image) => setForm({ ...form, image })}
              />
              <Field>
                <FieldLabel>Date</FieldLabel>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Excerpt</FieldLabel>
                <Textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Body</FieldLabel>
                <Textarea
                  rows={6}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel>Published</FieldLabel>
                <Switch
                  checked={form.published}
                  onCheckedChange={(published) => setForm({ ...form, published })}
                />
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
