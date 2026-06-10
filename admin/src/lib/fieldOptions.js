/** Preset options for CMS / admin fields — avoids free-text typos. */

export const SELECT_CLASS =
  'flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export const PRODUCT_CATEGORIES = [
  { value: 'poultry', label: 'Poultry' },
  { value: 'livestock', label: 'Livestock' },
  { value: 'layers', label: 'Layers' },
  { value: 'broilers', label: 'Broilers' },
];

export const SERVICE_TAGS = [
  'Poultry',
  'Advisory',
  'Health',
  'Nutrition',
  'Infrastructure',
  'Learning',
  'Finance',
  'Supply',
  'Livestock',
].map((tag) => ({ value: tag, label: tag }));

export const SERVICE_FILTER_TAGS = [{ value: 'All', label: 'All (show every category)' }, ...SERVICE_TAGS];

export const SITE_ROUTES = [
  { value: '/', label: 'Home' },
  { value: '/about', label: 'Our Mission' },
  { value: '/shop', label: 'Shop' },
  { value: '/services', label: 'Services' },
  { value: '/blog', label: 'Blog' },
  { value: '/contact', label: 'Contact' },
  { value: '/cart', label: 'Cart' },
  { value: '/account', label: 'My Account' },
  { value: '/track-order', label: 'Track Order' },
  { value: '/faq', label: 'FAQ' },
  { value: '/shipping', label: 'Shipping' },
  { value: '/returns', label: 'Returns' },
  { value: '/wholesale', label: 'Wholesale' },
  { value: '/privacy', label: 'Privacy' },
  { value: '/terms', label: 'Terms' },
];

export const SHOP_SHORTCUTS = [
  { value: '/shop', label: 'All products' },
  { value: '/shop?category=poultry', label: 'Poultry' },
  { value: '/shop?category=broilers', label: 'Broilers' },
  { value: '/shop?category=layers', label: 'Layers' },
  { value: '/shop?category=livestock', label: 'Livestock' },
  { value: '/shop?promo=new', label: 'New arrivals' },
  { value: '/shop?promo=best', label: 'Best sellers' },
  { value: '/shop?promo=sale', label: 'Daily deals' },
  { value: '/shop?q=duck', label: 'Ducks' },
  { value: '/shop?q=guinea', label: 'Guinea fowl' },
];

export const LABEL_COLORS = [
  { value: 'green', label: 'Green' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'brown', label: 'Brown' },
];

/**
 * @param {string} fieldKey
 * @param {string[]} contextPath — ancestor field keys (skips numeric indices)
 * @param {{ sectionKey?: string, pageKey?: string, inArrayItem?: boolean }} [meta]
 * @returns {{ options: {value:string,label:string}[], allowCustom?: boolean } | null}
 */
export function getFieldOptions(fieldKey, contextPath = [], meta = {}) {
  const { sectionKey = '', pageKey = '', inArrayItem = false } = meta;
  const path = contextPath.join('.');

  if (fieldKey === 'category') {
    return { options: PRODUCT_CATEGORIES, allowCustom: false };
  }

  if (fieldKey === 'tag') {
    return { options: SERVICE_TAGS, allowCustom: false };
  }

  if (fieldKey === 'labelColor') {
    return { options: LABEL_COLORS, allowCustom: false };
  }

  if (['buttonTo', 'to', 'ctaTo'].includes(fieldKey)) {
    return { options: SITE_ROUTES, allowCustom: true };
  }

  if (fieldKey === 'href' && path.includes('links')) {
    return { options: SITE_ROUTES, allowCustom: true };
  }

  // Home page category shortcut chips
  if (pageKey === 'home' && sectionKey === 'categories') {
    if (fieldKey === 'href') return { options: SHOP_SHORTCUTS, allowCustom: true };
    if (fieldKey === 'label') {
      const labels = SHOP_SHORTCUTS.map((o) => ({ value: o.label, label: o.label }));
      return { options: labels, allowCustom: true };
    }
  }

  // Services page filter tabs (array of category names)
  if (
    sectionKey === 'capabilities' &&
    (fieldKey === 'categories' || (inArrayItem && contextPath.at(-1) === 'categories'))
  ) {
    return { options: SERVICE_FILTER_TAGS, allowCustom: false };
  }

  return null;
}
