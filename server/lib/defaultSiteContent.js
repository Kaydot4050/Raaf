/** Default CMS content — seeded / synced into site_content */

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
      tagline: 'Premium poultry, livestock, and feed for farms across Ghana.',
      phone: '+233 00 000 0000',
      email: 'hello@raafortagro.com',
      address: 'Greater Accra, Ghana',
      logo: '/images/cropped-cropped-gooo-1-1.png',
      copyright: '© Raafortagro. All rights reserved.',
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
        { to: '/shop', label: 'Shop' },
        { to: '/services', label: 'Services' },
        { to: '/about', label: 'Our Mission' },
        { to: '/contact', label: 'Contact' },
      ],
    },
  },
  {
    page: 'home',
    section: 'hero_slides',
    data: {
      slides: [
        { src: '/images/Raafortagro-2.png', alt: 'Poultry & Livestock', title: 'LIVESTOCK' },
        { src: '/images/Raafortagro-3.png', alt: 'Agro Chemicals', title: 'CHEMICALS' },
        { src: '/images/Raafortagro.png', alt: 'Farm Equipment', title: 'EQUIPMENT' },
        { src: '/images/a.jpg', alt: 'Sustainable agriculture', title: 'FARMING' },
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
          eyebrow: 'Expert support',
          title: 'Need advice for your farm?',
          buttonLabel: 'Contact Us',
          buttonTo: '/contact',
        },
        {
          eyebrow: 'Raafort Agro',
          title: 'Farm supply hub',
          badge: 'Yield support +30%',
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
      badge: 'Trusted since 2015',
      title: 'Empowering growth through sustainable agriculture',
      description:
        'We offer innovative solutions to significantly enhance poultry and livestock yields for Ghanaian farmers.',
      sideImage: '/images/Raafortagro-2.png',
      logo: '/images/cropped-cropped-gooo-1-1.png',
      ctaLabel: 'Learn more',
      ctaTo: '/about',
      statValue: 500,
      statLabel: 'Farms served across Ghana',
      statProgress: 75,
      tagline: 'Premium poultry, livestock & feed — from hatch to harvest.',
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      benefits: [
        { n: '01', title: 'Premium genetics', desc: 'Day-old chicks and livestock from trusted parent stock.' },
        { n: '02', title: 'Smart delivery', desc: 'Nationwide logistics with live-animal care protocols.' },
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
      title: 'Hand-picked for your farm',
      subtitle: 'Featured products',
      description: 'Premium breeds selected by our agronomy team.',
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
      description: 'Farmers across Ghana trust Raafort for genetics, delivery, and honest support.',
      items: [
        {
          name: 'Kwame Asante',
          role: 'Broiler Farmer · Ashanti',
          quote:
            'Ross 308 chicks from Raafort performed exceptionally — low mortality and fast growth. The best investment on my farm.',
        },
        {
          name: 'Ama Serwaa',
          role: 'Layer Farmer · Eastern',
          quote:
            'Two years of consistent quality layers and a support team that actually answers. I recommend them to every farmer I know.',
        },
        {
          name: 'Yaw Mensah',
          role: 'Mixed Farm · Volta',
          quote:
            'From guinea keets to Boer goats, every order has been healthy and well handled. They understand Ghanaian farming.',
        },
      ],
    },
  },
  {
    page: 'home',
    section: 'bottom',
    data: {
      logo: '/images/cropped-cropped-gooo-1-1.png',
      brandName: 'raafortagro',
      title: 'We develop cutting-edge supply chains to unlock the full potential of your farm.',
      image: '/images/a.jpg',
      imageSecondary: '/images/Raafortagro-3.png',
      buttonLabel: 'Our technology',
      buttonTo: '/services',
    },
  },
  {
    page: 'about',
    section: 'hero',
    data: {
      eyebrow: 'Our Story',
      title: 'THE FOUNDATION OF OUR MISSION',
      titleAccent: 'OF OUR MISSION',
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
      quote: 'We exist to strengthen Ghanaian agriculture — one farm, one flock, one harvest at a time.',
      body: 'Raafort Agro connects farmers with quality genetics, feeds, and advisory services across Ghana.',
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
          desc: 'We communicate with honesty and act with transparency. Every transaction, recommendation, and partnership is held to the highest ethical standard.',
        },
        {
          num: '02',
          title: 'Value-Driven Excellence',
          desc: 'From hatchery to delivery, we are committed to quality. Our objective is client success — we consistently work to meet and exceed your farm goals.',
        },
        {
          num: '03',
          title: 'Client-Centered',
          desc: 'Our success metrics are yours. We align our performance goals to the specific needs and growth targets of every farmer and investor we serve.',
        },
        {
          num: '04',
          title: 'Continuous Growth',
          desc: 'We are dedicated to learning, improving, and innovating. Raafort Agro supports its team, clients, and communities to grow beyond their current limits.',
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
        { name: 'Hatchery & Supply', role: 'Day-old chick sourcing, quality checks & logistics', icon: '🐣' },
        { name: 'Veterinary Unit', role: 'On-farm health, vaccination programs & biosecurity', icon: '🩺' },
        { name: 'Farm Advisory', role: 'Consultancy, setup planning & investment guidance', icon: '📋' },
        { name: 'Customer Support', role: 'Order management, after-sales care & follow-ups', icon: '🤝' },
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
      title: 'We are here for your farm',
      description:
        'Questions about orders, breeds, or delivery? Our team responds quickly — usually within one business day.',
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
      image: '/images/Raafortagro-2.png',
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
  {
    id: 'why-balanced-feeding-is-key-to-animal-health',
    title: 'Why Balanced Feeding Is Key to Animal Health',
    date: '2025-09-12',
    excerpt: 'The right feed mix supports growth, immunity, and long-term productivity across poultry and livestock.',
    body: '<p>The right feed mix supports growth, immunity, and long-term productivity across poultry and livestock.</p>',
    image: '/images/Raafortagro-2.png',
    published: true,
  },
  {
    id: 'getting-the-best-start-with-day-old-chicks',
    title: 'Getting the Best Start with Day-Old Chicks',
    date: '2025-08-28',
    excerpt: 'Brooding temperature, clean water, and early nutrition set the foundation for a healthy flock.',
    body: '<p>Brooding temperature, clean water, and early nutrition set the foundation for a healthy flock.</p>',
    image: '/images/a.jpg',
    published: true,
  },
];
