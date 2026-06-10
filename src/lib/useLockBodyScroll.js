import { useEffect } from 'react';

/** Prevent page scroll while overlays (search, mobile filters, etc.) are open. */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}
