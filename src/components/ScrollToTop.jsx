import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll window (or optional element) to top on route change. */
export default function ScrollToTop({ scrollTarget }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const el = scrollTarget ? document.querySelector(scrollTarget) : null;
    if (el) {
      el.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, scrollTarget]);

  return null;
}
