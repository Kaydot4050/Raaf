import { useEffect, useRef, useState } from 'react';
import { CloudIcon, ImageIcon, LinkIcon, Loader2Icon, UploadIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { adminApi, mediaUrl } from '../lib/api.js';
import { cn } from '@/lib/utils';
import { humanLabel } from '../lib/fieldLabels.js';

function loadCloudinaryConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || null;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || null;
  if (cloudName && uploadPreset) {
    return { enabled: true, cloudName, uploadPreset };
  }
  return null;
}

export default function ImageUpload({ value = '', onChange, label, className }) {
  const inputRef = useRef(null);
  const widgetRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [error, setError] = useState('');
  const [cloudinary, setCloudinary] = useState(null);
  const [widgetConfig, setWidgetConfig] = useState(() => loadCloudinaryConfig());

  const displayLabel =
    typeof label === 'string' && /^[a-z][a-zA-Z]*$/.test(label.replace(/_/g, ''))
      ? humanLabel(label)
      : label || 'Photo';

  useEffect(() => {
    adminApi
      .uploadConfig()
      .then((cfg) => {
        if (!cfg.enabled) return;
        setCloudinary(cfg);
        const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || cfg.uploadPreset;
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || cfg.cloudName;
        if (cloudName && preset) {
          setWidgetConfig({ enabled: true, cloudName, uploadPreset: preset });
        }
      })
      .catch(() => {});
  }, []);

  const pick = () => inputRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await adminApi.uploadImage(file);
      onChange(url);
      setLinkInput('');
    } catch (err) {
      setError(err.message || 'Could not upload. Try a smaller image (under 5 MB).');
    } finally {
      setUploading(false);
    }
  };

  const importFromLink = async () => {
    const url = linkInput.trim();
    if (!url) {
      setError('Paste a web address for the image first.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const { url: saved } = await adminApi.uploadImageFromUrl(url);
      onChange(saved);
      setLinkInput('');
    } catch (err) {
      setError(err.message || 'Could not use that link. Check the address and try again.');
    } finally {
      setUploading(false);
    }
  };

  const useCloudinaryUrl = () => {
    const url = linkInput.trim();
    if (!url) {
      setError('Paste the image web address first.');
      return;
    }
    if (!/res\.cloudinary\.com/i.test(url)) {
      setError('That does not look like a Cloudinary image link.');
      return;
    }
    onChange(url);
    setLinkInput('');
    setError('');
  };

  const widgetCloudName =
    widgetConfig?.cloudName ||
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
    cloudinary?.cloudName;
  const widgetPreset =
    widgetConfig?.uploadPreset ||
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
    cloudinary?.uploadPreset;

  const openCloudinaryWidget = () => {
    if (!widgetCloudName || !widgetPreset) {
      setError('Photo library is not set up yet. Ask your developer to enable Cloudinary.');
      return;
    }
    if (!window.cloudinary?.createUploadWidget) {
      setError('Photo picker did not load. Refresh the page and try again.');
      return;
    }

    setError('');
    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: widgetCloudName,
          uploadPreset: widgetPreset,
          folder: cloudinary?.folder || 'raafortagro',
          sources: ['local', 'url', 'camera', 'image_search', 'google_drive'],
          multiple: false,
          maxFileSize: 5_000_000,
        },
        (err, result) => {
          if (err) {
            setError('Upload failed. Please try again.');
            return;
          }
          if (result?.event === 'success') {
            onChange(result.info.secure_url);
            setLinkInput('');
          }
        },
      );
    }
    widgetRef.current.open();
  };

  const preview = mediaUrl(value);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="text-sm font-medium text-foreground">{displayLabel}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {preview ? (
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageIcon />
            </div>
          )}
          {value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 shadow-sm"
              aria-label="Remove photo"
            >
              <XIcon className="size-3.5" />
            </button>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={pick}>
              {uploading ? (
                <Loader2Icon data-icon="inline-start" className="animate-spin" />
              ) : (
                <UploadIcon data-icon="inline-start" />
              )}
              {uploading ? 'Uploading…' : 'Choose from computer'}
            </Button>
            {widgetCloudName && widgetPreset ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={uploading}
                onClick={openCloudinaryWidget}
              >
                <CloudIcon data-icon="inline-start" />
                Photo library
              </Button>
            ) : null}
          </div>

          <div className="admin-panel-sage gap-2">
            <p className="text-xs font-medium text-muted-foreground">Use a photo from the web</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="Paste image web address"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="shrink-0"
                disabled={uploading || !linkInput.trim()}
                onClick={importFromLink}
              >
                <LinkIcon data-icon="inline-start" />
                Add photo
              </Button>
            </div>
            {cloudinary?.enabled ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-fit"
                disabled={uploading || !linkInput.trim()}
                onClick={useCloudinaryUrl}
              >
                Use link without downloading
              </Button>
            ) : null}
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <p className="text-xs text-muted-foreground">JPG, PNG, or WebP · up to 5 MB</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={onFile} />
    </div>
  );
}
