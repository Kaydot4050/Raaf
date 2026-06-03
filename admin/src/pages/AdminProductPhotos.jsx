import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/shadcn-button.jsx';
import { Input } from '@/components/ui/input.jsx';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field.jsx';
import AdminPage from '../components/AdminPage.jsx';
import AdminSection from '../components/AdminSection.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { adminApi } from '../lib/api.js';

const SLOT_COUNT = 5;
const EMPTY_SLOT = { src: '', mobileSrc: '', alt: '', title: '' };

function normalizeSlides(slides) {
  const list = Array.isArray(slides) ? slides.map((s) => ({ ...EMPTY_SLOT, ...s })) : [];
  while (list.length < SLOT_COUNT) list.push({ ...EMPTY_SLOT });
  return list.slice(0, SLOT_COUNT);
}

export default function AdminProductPhotos() {
  const [slides, setSlides] = useState(() => Array.from({ length: SLOT_COUNT }, () => ({ ...EMPTY_SLOT })));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.content().then((r) => {
      const data = r.pages?.home?.sections?.hero_slides?.data;
      setSlides(normalizeSlides(data?.slides));
    });
  }, []);

  const updateSlide = (index, patch) => {
    setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await adminApi.updateContent('home', 'hero_slides', { slides: normalizeSlides(slides) });
      toast.success('Product photos saved. Refresh the homepage to preview.');
    } catch (e) {
      toast.error(e.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="Product photos"
      description="Five homepage slider images. Uploads are auto-compressed to WebP for storage while staying bright and sharp."
      actions={
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save all'}
        </Button>
      }
    >
      <AdminSection
        tone="earth"
        title="Homepage slider (5 slots)"
        description="These appear in the expanding photo row on the home page."
      >
        <div className="flex flex-col gap-8">
          {slides.map((slide, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <p className="mb-4 text-sm font-semibold text-foreground">Photo {index + 1}</p>
              <FieldGroup>
                <Field>
                  <ImageUpload
                    label={`Product photo ${index + 1}`}
                    value={slide.src}
                    onChange={(src) => updateSlide(index, { src })}
                  />
                  <FieldDescription>Desktop image · compressed automatically on upload</FieldDescription>
                </Field>
                <Field>
                  <ImageUpload
                    label={`Mobile photo ${index + 1} (optional)`}
                    value={slide.mobileSrc}
                    onChange={(mobileSrc) => updateSlide(index, { mobileSrc })}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Label on slide</FieldLabel>
                    <Input
                      value={slide.title}
                      onChange={(e) => updateSlide(index, { title: e.target.value })}
                      placeholder="e.g. POULTRY"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Description (accessibility)</FieldLabel>
                    <Input
                      value={slide.alt}
                      onChange={(e) => updateSlide(index, { alt: e.target.value })}
                      placeholder="Short description of the image"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </div>
          ))}
        </div>
      </AdminSection>
    </AdminPage>
  );
}
