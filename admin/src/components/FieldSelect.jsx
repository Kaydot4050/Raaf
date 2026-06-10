import { useMemo } from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field.jsx';
import { SELECT_CLASS } from '../lib/fieldOptions.js';

export default function FieldSelect({
  label,
  hint,
  value,
  options,
  allowCustom = false,
  onChange,
  placeholder = 'Enter custom value',
}) {
  const str = value ?? '';
  const knownValues = useMemo(() => new Set(options.map((o) => o.value)), [options]);
  const isCustom = allowCustom && str !== '' && !knownValues.has(str);
  const selectValue = knownValues.has(str) ? str : allowCustom ? '__custom__' : options[0]?.value ?? '';

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      {hint ? <FieldDescription>{hint}</FieldDescription> : null}
      <select
        className={SELECT_CLASS}
        value={selectValue}
        onChange={(e) => {
          const next = e.target.value;
          if (next === '__custom__') {
            onChange(isCustom ? str : '');
            return;
          }
          onChange(next);
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {allowCustom ? <option value="__custom__">Other (type manually)…</option> : null}
      </select>
      {allowCustom && (selectValue === '__custom__' || isCustom) ? (
        <Input
          className="mt-2"
          value={str}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : null}
    </Field>
  );
}
