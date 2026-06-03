import { useState } from 'react';
import { X } from 'lucide-react';

const DISMISS_KEY = 'raafort-coming-soon-dismissed';
const IS_LOCAL =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.'));

/** Off only when VITE_COMING_SOON=false. On in production by default. */
const ENABLED = import.meta.env.VITE_COMING_SOON !== 'false' && !IS_LOCAL;

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

export default function ComingSoonBanner() {
  const [visible, setVisible] = useState(ENABLED && !wasDismissed());

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div
      role="status"
      className="relative z-[60] border-b border-forest/20 bg-forest text-cream"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-2.5 sm:items-center sm:px-6 lg:px-8">
        <span className="mt-0.5 shrink-0 text-base sm:mt-0" aria-hidden>
          🥚
        </span>
        <p className="flex-1 text-sm leading-snug sm:text-center">
          <span className="font-semibold">Coming soon</span>
          {' — '}
          Our livestock and farm experience is almost ready. You can browse the site; some areas may still change.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md p-1 text-cream/90 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss coming soon notice"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
