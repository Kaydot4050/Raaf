/** Plain-language labels for CMS fields (no developer jargon). */

const LABELS = {
  // General text
  title: 'Heading',
  subtitle: 'Subheading',
  description: 'Description',
  body: 'Full text',
  excerpt: 'Short summary',
  quote: 'Quote or highlight',
  tagline: 'Short line under logo',
  eyebrow: 'Small label above heading',
  copyright: 'Copyright line',
  brandName: 'Brand name',
  searchPlaceholder: 'Search box placeholder',

  // Contact & business
  phone: 'Phone number',
  email: 'Email address',
  address: 'Address',
  detail: 'Details shown to visitors',
  href: 'Link (phone, email, or web — optional)',
  message: 'Message text',

  // Images & media
  image: 'Photo',
  logo: 'Logo image',
  src: 'Photo',
  alt: 'Photo description (for accessibility)',
  backgroundImage: 'Background photo',
  sideImage: 'Side photo',
  imageSecondary: 'Second photo',

  // Stats & numbers
  statValue: 'Number',
  statLabel: 'Text under the number',
  statProgress: 'Bar fill amount (0–100)',
  suffix: 'Symbol after number (e.g. + or %)',
  value: 'Number',
  label: 'Label',
  desc: 'Description',
  progressPercent: 'Bar fill amount (0–100)',

  // Buttons & links
  buttonLabel: 'Button text',
  buttonTo: 'Button goes to page (e.g. /contact)',
  ctaLabel: 'Button text',
  ctaTo: 'Button goes to page',
  to: 'Page link (e.g. /shop)',
  badge: 'Highlight badge text',

  // Home / marketing
  slides: 'Homepage slider',
  cards: 'Info cards',
  items: 'List items',
  benefits: 'Benefits',
  columns: 'Footer menu groups',
  links: 'Menu links',
  sections: 'Sections',
  perks: 'Benefits',
  supportCards: 'Contact options',
  faqs: 'Questions & answers',
  posts: 'Blog posts',
  nav: 'Main menu links',

  // About page
  card1Title: 'Left card title',
  card1Subtitle: 'Left card subtitle',
  card2Title: 'Center card title',
  card3Title: 'Right card title',
  card3Subtitle: 'Right card subtitle',
  titleAccent: 'Highlighted part of heading',
  name: 'Name',
  role: 'Role or location',
  icon: 'Emoji or icon (optional)',
  num: 'Step number',
  n: 'Step number',

  // FAQ / legal
  q: 'Question',
  a: 'Answer',
  list: 'Bullet points (one per line in editor)',

  // Product-ish (if shown)
  published: 'Visible on website',
  featured: 'Show in featured section',
  inStock: 'Available to buy',
  end: 'This is the home link',
  date: 'Date',
  id: 'Unique ID (do not change unless you know why)',

  // Social
  facebookUrl: 'Facebook page link',
  instagramUrl: 'Instagram page link',

  // Wholesale / forms copy
  farmName: 'Farm name field label',
  contactName: 'Contact name',
  productsVolume: 'Products & volume',
};

const HINTS = {
  href: 'Examples: tel:+233201234567 for phone, mailto:hello@site.com for email, or https://… for a website.',
  buttonTo: 'Use paths like /shop, /contact, or /about.',
  to: 'Use paths like /shop or /contact.',
  suffix: 'Usually + for “500+” or % for “98%”.',
  statProgress: '100 means full bar, 75 means three-quarters full.',
  alt: 'Describe what is in the photo. Helps visitors using screen readers.',
  id: 'Changing this can break existing links. Only edit when creating new content.',
  src: 'Upload a photo or paste an image web address.',
};

const LIST_NAMES = {
  slides: 'slider photo',
  cards: 'card',
  items: 'item',
  benefits: 'benefit',
  columns: 'menu group',
  links: 'link',
  sections: 'section',
  perks: 'benefit',
  supportCards: 'contact row',
  faqs: 'question',
  posts: 'post',
  nav: 'menu item',
  testimonials: 'review',
  values: 'value',
  stats: 'stat',
  team: 'team member',
};

export function humanLabel(key) {
  if (!key) return 'Field';
  if (LABELS[key]) return LABELS[key];
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function fieldHint(key) {
  return HINTS[key] || null;
}

export function listItemName(parentKey, index) {
  const base = LIST_NAMES[parentKey] || humanLabel(parentKey).toLowerCase();
  return `${base.charAt(0).toUpperCase() + base.slice(1)} ${index + 1}`;
}

export function listAddLabel(parentKey) {
  const base = LIST_NAMES[parentKey] || 'item';
  return `Add another ${base}`;
}

export function sectionGroupLabel(key) {
  const groups = {
    hero_slides: 'Homepage image slider',
    hero_cards: 'Cards below the slider',
    mission: 'Mission section',
    categories: 'Category shortcuts',
    featured: 'Featured products heading',
    blog_teaser: 'Blog section heading',
    testimonials: 'Customer reviews',
    bottom: 'Bottom banner',
    header: 'Site header',
    footer: 'Site footer',
    hero: 'Top banner',
    main: 'Main content',
    intro: 'Introduction',
    values: 'Company values',
    stats: 'Statistics',
    team: 'Team areas',
  };
  return groups[key] || humanLabel(key);
}
