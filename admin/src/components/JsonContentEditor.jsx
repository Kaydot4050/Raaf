import { Loader2Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.jsx';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field.jsx';
import ImageUpload from './ImageUpload.jsx';
import FieldSelect from './FieldSelect.jsx';
import {
  humanLabel,
  fieldHint,
  listItemName,
  listAddLabel,
  sectionGroupLabel,
} from '../lib/fieldLabels.js';
import { getFieldOptions } from '../lib/fieldOptions.js';
import { cn } from '@/lib/utils';

function extendPath(path, key) {
  if (/^\d+$/.test(String(key))) return path;
  return [...path, key];
}

function isImageField(key) {
  return /(^image|logo|src|mobileSrc|photo|banner|avatar|thumb)/i.test(key || '');
}

function isLongTextField(key, str) {
  return str.length > 100 || ['body', 'quote', 'description', 'desc', 'message', 'tagline', 'excerpt'].includes(key);
}

function isLinkField(key) {
  return ['href', 'facebookUrl', 'instagramUrl'].includes(key);
}

function defaultForItem(item) {
  if (item == null) return '';
  if (typeof item === 'object' && !Array.isArray(item)) {
    return Object.fromEntries(Object.keys(item).map((k) => [k, defaultForItem(item[k])]));
  }
  if (Array.isArray(item)) return [];
  if (typeof item === 'boolean') return false;
  if (typeof item === 'number') return 0;
  return '';
}

function FieldHint({ fieldKey }) {
  const hint = fieldHint(fieldKey);
  if (!hint) return null;
  return <FieldDescription>{hint}</FieldDescription>;
}

function SaveButton({ onSave, saving, className }) {
  if (!onSave) return null;
  return (
    <Button
      type="button"
      size="sm"
      className={cn('w-full sm:w-auto', className)}
      disabled={saving}
      onClick={onSave}
    >
      {saving ? (
        <>
          <Loader2Icon data-icon="inline-start" className="animate-spin" />
          Saving…
        </>
      ) : (
        'Save changes'
      )}
    </Button>
  );
}

function FieldEditor({
  fieldKey,
  value,
  onChange,
  parentKey,
  onSave,
  saving,
  contextPath = [],
  sectionKey = '',
  pageKey = '',
}) {
  const label = humanLabel(fieldKey);
  const path = extendPath(contextPath, fieldKey);
  const optionMeta = { sectionKey, pageKey, inArrayItem: /^\d+$/.test(String(fieldKey)) };
  const fieldOptions = getFieldOptions(fieldKey, contextPath, optionMeta);

  if (Array.isArray(value)) {
    const sample = value[0];
    const listTitle = sectionGroupLabel(parentKey || fieldKey);
    const stringListOptions = getFieldOptions(fieldKey, contextPath, { sectionKey, pageKey });

    if (stringListOptions && (typeof sample === 'string' || value.length === 0)) {
      return (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground">{listTitle}</p>
          {value.map((item, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <FieldSelect
                  label={listItemName(parentKey || fieldKey, index)}
                  value={item}
                  options={stringListOptions.options}
                  allowCustom={stringListOptions.allowCustom}
                  onChange={(next) => {
                    const copy = [...value];
                    copy[index] = next;
                    onChange(copy);
                  }}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="mb-0.5 shrink-0"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label="Remove"
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange([...value, stringListOptions.options[0]?.value ?? ''])}
          >
            <PlusIcon data-icon="inline-start" />
            {listAddLabel(parentKey || fieldKey)}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">{listTitle}</p>
        {value.map((item, index) => (
          <Card key={index} size="sm" className="border-border bg-card shadow-none">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium">
                {listItemName(parentKey || fieldKey, index)}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label="Remove"
              >
                <Trash2Icon />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FieldEditor
                fieldKey={String(index)}
                parentKey={parentKey || fieldKey}
                contextPath={path}
                sectionKey={sectionKey}
                pageKey={pageKey}
                value={item}
                onChange={(next) => {
                  const copy = [...value];
                  copy[index] = next;
                  onChange(copy);
                }}
                onSave={onSave}
                saving={saving}
              />
              <div className="flex justify-end border-t border-border pt-3">
                <SaveButton onSave={onSave} saving={saving} />
              </div>
            </CardContent>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, defaultForItem(sample)])}
        >
          <PlusIcon data-icon="inline-start" />
          {listAddLabel(parentKey || fieldKey)}
        </Button>
      </div>
    );
  }

  if (value !== null && typeof value === 'object') {
    return (
      <div className="rounded-xl border border-border bg-accent/20 p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">{label}</p>
        <FieldGroup>
          {Object.entries(value).map(([k, v]) => (
            <FieldEditor
              key={k}
              fieldKey={k}
              parentKey={fieldKey}
              contextPath={path}
              sectionKey={sectionKey}
              pageKey={pageKey}
              value={v}
              onChange={(next) => onChange({ ...value, [k]: next })}
              onSave={onSave}
              saving={saving}
            />
          ))}
        </FieldGroup>
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <Field orientation="horizontal">
        <div className="flex flex-col gap-1">
          <FieldLabel>{label}</FieldLabel>
          <FieldHint fieldKey={fieldKey} />
        </div>
        <Switch checked={value} onCheckedChange={onChange} />
      </Field>
    );
  }

  if (typeof value === 'number') {
    return (
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldHint fieldKey={fieldKey} />
        <Input
          type="number"
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        />
      </Field>
    );
  }

  const str = value ?? '';

  if (fieldOptions) {
    return (
      <FieldSelect
        label={label}
        hint={fieldHint(fieldKey)}
        value={str}
        options={fieldOptions.options}
        allowCustom={fieldOptions.allowCustom}
        onChange={onChange}
      />
    );
  }

  if (isImageField(fieldKey)) {
    return (
      <Field>
        <ImageUpload label={label} value={str} onChange={onChange} />
        <FieldHint fieldKey={fieldKey} />
      </Field>
    );
  }

  if (isLinkField(fieldKey)) {
    return (
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldHint fieldKey={fieldKey} />
        <Input
          value={str}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Leave blank if not needed"
        />
      </Field>
    );
  }

  if (isLongTextField(fieldKey, str)) {
    return (
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <Textarea value={str} rows={4} onChange={(e) => onChange(e.target.value)} />
      </Field>
    );
  }

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      {fieldKey === 'buttonTo' || fieldKey === 'to' || fieldKey === 'ctaTo' ? (
        <FieldHint fieldKey={fieldKey} />
      ) : null}
      <Input value={str} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export default function JsonContentEditor({
  data,
  onChange,
  onSave,
  saving = false,
  sectionKey = '',
  pageKey = '',
}) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing to edit here yet. Pick another section or contact support.
      </p>
    );
  }

  const entries = Object.entries(data);

  return (
    <div className="flex flex-col gap-4">
      {entries.map(([key, val]) => {
        const blockLabel = sectionGroupLabel(key);
        const isScalar = val === null || typeof val !== 'object';

        if (isScalar) {
          return (
            <Card key={key} size="sm" className="border-border bg-card shadow-none">
              <CardContent className="flex flex-col gap-4 pt-4">
                <FieldEditor
                  fieldKey={key}
                  value={val}
                  contextPath={[]}
                  sectionKey={sectionKey}
                  pageKey={pageKey}
                  onChange={(next) => onChange({ ...data, [key]: next })}
                />
                <div className="flex justify-end border-t border-border pt-3">
                  <SaveButton onSave={onSave} saving={saving} />
                </div>
              </CardContent>
            </Card>
          );
        }

        if (Array.isArray(val)) {
          return (
            <Card key={key} size="sm" className="border-border bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-medium">{blockLabel}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <FieldEditor
                  fieldKey={key}
                  value={val}
                  contextPath={[]}
                  sectionKey={sectionKey}
                  pageKey={pageKey}
                  onChange={(next) => onChange({ ...data, [key]: next })}
                  onSave={onSave}
                  saving={saving}
                />
              </CardContent>
            </Card>
          );
        }

        return (
          <Card key={key} size="sm" className="border-border bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-medium">{blockLabel}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-0">
              <FieldEditor
                fieldKey={key}
                value={val}
                contextPath={[]}
                sectionKey={sectionKey}
                pageKey={pageKey}
                onChange={(next) => onChange({ ...data, [key]: next })}
              />
              <div className="flex justify-end border-t border-border pt-3">
                <SaveButton onSave={onSave} saving={saving} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
