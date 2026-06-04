import { useEffect } from 'react';

const SITE_NAME = 'Raafortagro';

/**
 * Sets the document title and meta description for the current page.
 * Resets to defaults on unmount.
 *
 * @param {string} title - Page title (will be appended with site name)
 * @param {string} [description] - Meta description for the page
 */
export default function usePageMeta(title, description) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME;

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute('content') || '';

    if (description) {
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    return () => {
      document.title = prev;
      if (metaDesc && prevDesc) metaDesc.setAttribute('content', prevDesc);
    };
  }, [title, description]);
}
