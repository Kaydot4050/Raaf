/** Default CMS content — seeded / synced into site_content */

import { allBlogPosts } from './posts/index.js';

const FOOTER_COLUMNS = [
  {
    title: 'Explore',
    links: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'Our Mission' },
      { to: '/shop', label: 'Shop' },
      { to: '/services', label: 'Services' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/track-order', label: 'Track Order' },
      { to: '/faq', label: 'FAQ' },
      { to: '/shipping', label: 'Shipping' },
      { to: '/returns', label: 'Returns' },
      { to: '/wholesale', label: 'Wholesale' },
      { to: '/contact', label: 'Contact' },
      { to: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy' },
      { to: '/terms', label: 'Terms' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/account', label: 'Dashboard' },
      { to: '/account?tab=orders', label: 'Orders' },
      { to: '/account?tab=wishlist', label: 'Wishlist' },
    ],
  },
];

export const defaultSiteContent = [
  {
    page: 'global',
    section: 'footer',
    data: {
      tagline: 'Poultry, livestock, and feed for farms across Ghana.',
      phone: '+233 00 000 0000',
      email: 'hello@raafortagro.com',
      address: 'Greater Accra, Ghana',
      logo: '/images/cropped-cropped-gooo-1-1.png',
      copyright: '© Raafortagro. All rights reserved.',
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      twitterUrl: '',
      youtubeUrl: '',
      whatsappUrl: '',
      columns: FOOTER_COLUMNS,
    },
  },
  {
    page: 'global',
    section: 'header',
    data: {
      logo: '/images/cropped-cropped-gooo-1-1.png',
      brandName: 'raafortagro',
      searchPlaceholder: 'Search products…',
      nav: [
        { to: '/', label: 'Home', end: true },
        { 
          to: '/shop', 
          label: 'Shop',
          dropdown: [
            { to: '/shop', label: 'All Products', end: true },
            { to: '/track-order', label: 'Track Order' }
          ]
        },
        { to: '/services', label: 'Services' },
        { to: '/about', label: 'Our Mission' },
        { to: '/blog?tab=news', label: 'News' },
        { to: '/contact', label: 'Contact' },
      ],
    },
  },
  {
    page: 'home',
    section: 'hero_slides',
    data: {
      slides: [
        { src: '/images/Raafortagro-2.png', mobileSrc: '', alt: 'Poultry & Livestock', title: 'LIVESTOCK' },
        { src: '/images/Raafortagro-3.png', mobileSrc: '', alt: 'Agro Chemicals', title: 'CHEMICALS' },
        { src: '/images/Raafortagro.png', mobileSrc: '', alt: 'Farm Equipment', title: 'EQUIPMENT' },
        { src: '/images/a.jpg', mobileSrc: '', alt: 'Sustainable agriculture', title: 'FARMING' },
        { src: '/images/istock-hero.jpg', mobileSrc: '', alt: 'Feed & nutrition', title: 'NUTRITION' },
      ],
    },
  },
  {
    page: 'home',
    section: 'hero_cards',
    data: {
      cards: [
        {
          image: '/images/Raafortagro.png',
          eyebrow: 'Advisory',
          title: 'Questions about breeds or feed?',
          buttonLabel: 'Contact us',
          buttonTo: '/contact',
        },
        {
          eyebrow: 'Raafort Agro',
          title: 'Farm supply hub',
          badge: 'Nationwide delivery',
        },
        {
          eyebrow: 'National Reach',
          statValue: '500+',
          statLabel: 'Farms served across Ghana',
          statProgress: 75,
        },
      ],
    },
  },
  {
    page: 'home',
    section: 'mission',
    data: {
      backgroundImage: '/images/animals-bg.png',
      title: 'Better inputs for stronger flocks and herds',
      description:
        'We supply vaccinated chicks, feed, and field advice to poultry and livestock farmers across Ghana.',
      sideImage: '/images/Raafortagro-2.png',
      statValue: 500,
      statLabel: 'Farms served across Ghana',
      statProgress: 75,
      tagline: 'Chicks, feed, and vet support from hatch to harvest.',
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      benefits: [
        { n: '01', title: 'Premium genetics', desc: 'Day-old chicks and livestock from trusted parent stock.' },
        { n: '02', title: 'Live-animal delivery', desc: 'Scheduled runs across Ghana with trained handlers.' },
      ],
    },
  },
  {
    page: 'home',
    section: 'categories',
    data: {
      items: [
        { label: 'New Arrivals', href: '/shop?promo=new' },
        { label: 'Best Sellers', href: '/shop?promo=best' },
        { label: 'Daily Deals', href: '/shop?promo=sale' },
        { label: 'Poultry', href: '/shop?category=poultry' },
        { label: 'Broilers', href: '/shop?category=broilers' },
        { label: 'Layers', href: '/shop?category=layers' },
        { label: 'Livestock', href: '/shop?category=livestock' },
        { label: 'Ducks', href: '/shop?q=duck' },
        { label: 'Guinea Fowl', href: '/shop?q=guinea' },
        { label: 'All Products', href: '/shop' },
      ],
    },
  },
  {
    page: 'home',
    section: 'featured',
    data: {
      title: 'Featured this week',
      subtitle: 'Shop picks',
      description: 'Breeds and inputs our team stocks most often.',
      buttonLabel: 'View all products',
    },
  },
  {
    page: 'home',
    section: 'blog_teaser',
    data: {
      eyebrow: 'Journal',
      title: 'Farm insights',
      subtitle: 'Latest from our blog',
    },
  },
  {
    page: 'home',
    section: 'testimonials',
    data: {
      eyebrow: 'Testimonials',
      title: 'Voices from the field',
      description: 'What farmers say about orders, delivery, and follow-up.',
      items: [
        {
          name: 'Kwame Asante',
          role: 'Broiler Farmer · Ashanti',
          quote:
            'Ross 308 chicks arrived healthy. Mortality stayed low through brooding.',
        },
        {
          name: 'Ama Serwaa',
          role: 'Layer Farmer · Eastern',
          quote:
            'Two years of layer orders. When I call, someone picks up.',
        },
        {
          name: 'Yaw Mensah',
          role: 'Mixed Farm · Volta',
          quote:
            'Guinea keets and Boer goats arrived in good condition. They know how we farm here.',
        },
      ],
    },
  },
  {
    page: 'home',
    section: 'bottom',
    data: {
      eyebrow: 'Why Raafort Agro',
      title: 'From hatchery to harvest',
      description:
        'We supply vaccinated day-old chicks, point-of-lay birds, feed, and on-farm veterinary support. Orders are scheduled for your region, with live-animal handling on every run.',
      bullets: [
        'Day-old chicks and livestock from checked parent stock',
        'Feed, vaccines, and equipment in one order',
        'Advice on housing, biosecurity, and grow-out',
      ],
      image: '/images/a.jpg',
      imageSecondary: '/images/Raafortagro-3.png',
      buttonLabel: 'View services',
      buttonTo: '/services',
    },
  },
  {
    page: 'about',
    section: 'hero',
    data: {
      eyebrow: 'Our Story',
      title: 'Built for Ghanaian farms',
      titleAccent: '',
      card1Title: 'Since 2015',
      card1Subtitle: 'Trusted by farmers',
      card2Title: 'Raafort Agro',
      card3Title: '500+ Farms',
      card3Subtitle: 'Nationwide',
      image: '/images/Raafortagro-3.png',
    },
  },
  {
    page: 'about',
    section: 'intro',
    data: {
      quote: 'We help Ghanaian farms run on reliable stock, clear advice, and deliveries you can plan around.',
      body: 'Raafort Agro supplies genetics, feed, and on-farm support from Accra to the regions.',
    },
  },
  {
    page: 'about',
    section: 'values',
    data: {
      items: [
        {
          num: '01',
          title: 'Integrity',
          desc: 'We quote honestly, deliver what we promise, and flag problems early.',
        },
        {
          num: '02',
          title: 'Quality stock',
          desc: 'Vaccinated chicks, checked livestock, and feed batches we stand behind.',
        },
        {
          num: '03',
          title: 'Farmer-first',
          desc: 'Orders, health plans, and pricing shaped around your farm size and season.',
        },
        {
          num: '04',
          title: 'Keep improving',
          desc: 'Our team trains on new breeds, biosecurity, and logistics so your results can improve season after season.',
        },
      ],
    },
  },
  {
    page: 'about',
    section: 'stats',
    data: {
      items: [
        { value: 500, suffix: '+', label: 'Partner Farms', desc: 'Across Ghana and West Africa' },
        { value: 11, suffix: '', label: 'Years Experience', desc: 'In agricultural services' },
        { value: 9, suffix: '', label: 'Core Services', desc: 'From hatchery to harvest' },
        { value: 98, suffix: '%', label: 'Client Satisfaction', desc: 'Verified post-delivery rating' },
      ],
    },
  },
  {
    page: 'about',
    section: 'team',
    data: {
      items: [
        { name: 'Hatchery & Supply', role: 'Day-old chick sourcing, quality checks & logistics', icon: '🐣', image: '/images/Raafortagro-2.png' },
        { name: 'Veterinary Unit', role: 'On-farm health, vaccination programs & biosecurity', icon: '🩺', image: '/images/Raafortagro-3.png' },
        { name: 'Farm Advisory', role: 'Consultancy, setup planning & investment guidance', icon: '📋', image: '/images/Raafortagro.png' },
        { name: 'Customer Support', role: 'Order management, after-sales care & follow-ups', icon: '🤝', image: '/images/a.jpg' },
      ],
    },
  },
  {
    page: 'services',
    section: 'hero',
    data: {
      eyebrow: 'Our Services',
      title: 'End-to-end farm solutions',
      description: 'From day-old chicks to advisory and logistics — everything your operation needs under one roof.',
      image: '/images/Raafortagro-2.png',
    },
  },
  {
    page: 'contact',
    section: 'main',
    data: {
      eyebrow: 'Contact',
      title: 'Talk to our team',
      description:
        'Ask about orders, breeds, or delivery. We reply within one business day.',
      supportCards: [
        { title: 'Call us', detail: '+233 00 000 0000', href: 'tel:+233000000000' },
        { title: 'Email', detail: 'hello@raafortagro.com', href: 'mailto:hello@raafortagro.com' },
        { title: 'Hours', detail: 'Mon–Sat · 7am – 6pm', href: '' },
      ],
      faqs: [
        {
          q: 'How do I place a bulk order?',
          a: 'Contact us with your farm size and breed preferences. We will prepare a quote and delivery schedule.',
        },
        {
          q: 'Do you deliver live birds nationwide?',
          a: 'Yes — we coordinate climate-aware transport across Ghana with scheduled delivery windows.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'Mobile money, bank transfer, and approved credit terms for registered farm accounts.',
        },
      ],
    },
  },
  {
    page: 'shop',
    section: 'hero',
    data: {
      eyebrow: 'Shop',
      title: 'Farm inputs & livestock',
      description: 'Browse poultry, feeds, and agro supplies for your operation.',
      image: '/images/Raafortagro-2.png',
    },
  },
  {
    page: 'faq',
    section: 'main',
    data: {
      eyebrow: 'Support',
      title: 'Frequently asked questions',
      subtitle: 'Quick answers about orders, delivery, and products.',
      items: [
        { q: 'How do I place an order?', a: 'Add items to your cart and complete checkout, or contact us for wholesale orders.' },
        { q: 'Do you deliver outside Accra?', a: 'Yes — we arrange delivery across Ghana. Fees depend on location and order size.' },
        { q: 'What payment methods do you accept?', a: 'Mobile money, bank transfer, and approved credit terms for registered farm accounts.' },
      ],
    },
  },
  {
    page: 'wholesale',
    section: 'hero',
    data: {
      eyebrow: 'Wholesale',
      title: 'Bulk & farm account orders',
      description: 'Commercial farms, integrators, and distributors — get tailored quotes and credit terms.',
      image: '/images/Raafortagro.png',
    },
  },
  {
    page: 'wholesale',
    section: 'main',
    data: {
      perks: [
        { title: 'Volume pricing', desc: 'Competitive rates on chicks, feed, and inputs for commercial farms.' },
        { title: 'Scheduled logistics', desc: 'Recurring delivery windows aligned with your production cycles.' },
        { title: 'Dedicated support', desc: 'A named advisor for orders, health plans, and account terms.' },
      ],
    },
  },
  {
    page: 'track_order',
    section: 'hero',
    data: {
      eyebrow: 'Orders',
      title: 'Track your order',
      description: 'Enter your order ID and phone number to see status and delivery details.',
      image: '/images/1-Howo-Cargo-Truck-1.jpg',
    },
  },
  {
    page: 'privacy',
    section: 'main',
    data: {
      eyebrow: 'Legal',
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal information.',
      sections: [
        {
          title: 'Information we collect',
          body: 'We collect information you provide when placing orders, creating an account, or contacting us — including name, phone, email, farm details, and delivery addresses.',
        },
        {
          title: 'How we use your data',
          list: [
            'Process and deliver orders',
            'Provide customer support and farm advisory',
            'Send order updates and service communications',
            'Improve our products and website',
          ],
        },
      ],
    },
  },
  {
    page: 'terms',
    section: 'main',
    data: {
      eyebrow: 'Legal',
      title: 'Terms of Service',
      description: 'Terms governing use of our website and purchase of products.',
      sections: [
        {
          title: 'Orders & pricing',
          body: 'All prices are listed in Ghana Cedis unless stated otherwise. We reserve the right to adjust pricing for live animals based on market conditions.',
        },
      ],
    },
  },
  {
    page: 'shipping',
    section: 'main',
    data: {
      eyebrow: 'Support',
      title: 'Shipping & Delivery',
      description: 'How we deliver live animals, feed, and farm inputs across Ghana.',
      sections: [
        {
          title: 'Delivery areas',
          body: 'We deliver nationwide. Accra and surrounding regions typically receive orders within 1–3 business days.',
        },
      ],
    },
  },
  {
    page: 'returns',
    section: 'main',
    data: {
      eyebrow: 'Support',
      title: 'Returns & Refunds',
      description: 'Our policy for live animals, feed, and equipment.',
      sections: [
        {
          title: 'Live animals',
          body: 'Due to the nature of live poultry and livestock, returns are handled on a case-by-case basis when mortality occurs in transit.',
        },
      ],
    },
  },
];

export const defaultBlogPosts = [
  ...allBlogPosts,
  {
    id: 'why-balanced-feeding-is-key-to-animal-health',
    title: 'Why Balanced Feeding Is Key to Animal Health',
    date: '2025-09-12',
    excerpt: 'The right feed mix supports growth, immunity, and long-term productivity across poultry and livestock.',
    body: '<p>The right feed mix supports growth, immunity, and long-term productivity across poultry and livestock. Protein, energy, and minerals must match the species and growth stage—broiler starter is not layer mash, and goat supplement is not poultry finisher.</p><p>Work with a supplier who labels rations clearly and delivers sealed bags. <a href="/shop">Shop feed</a> or <a href="/contact">contact Raafortagro</a> for ration advice.</p>',
    image: '/images/Raafortagro-2.png',
    published: true,
  },
  {
    id: 'getting-the-best-start-with-day-old-chicks',
    title: 'Getting the Best Start with Day-Old Chicks',
    date: '2025-08-28',
    excerpt: 'Brooding temperature, clean water, and early nutrition set the foundation for a healthy flock.',
    body: '<p>Brooding temperature, clean water, and early nutrition set the foundation for a healthy flock. See our full guide: <a href="/blog/brooding-and-chicks-ghana-guide">Brooding &amp; day-old chicks in Ghana</a>.</p>',
    image: '/images/Raafortagro-2.png',
    published: true,
  },
];
