import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authLabelCls } from './AuthPageShell.jsx';

const passwordInputCls =
  'w-full px-4 py-3 pr-11 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest/40 lg:border-white/10 lg:bg-white/[0.06] lg:text-white lg:placeholder:text-white/35 lg:focus:ring-forest/50 lg:focus:border-forest/40';

export default function AuthPasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  minLength,
}) {
  const [show, setShow] = useState(false);

  return (
    <label className="block">
      <span className={authLabelCls}>{label}</span>
      <div className="relative mt-1.5">
        <input
          type={show ? 'text' : 'password'}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          minLength={minLength}
          className={passwordInputCls}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-charcoal lg:text-white/45 lg:hover:text-white/80 transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </label>
  );
}
