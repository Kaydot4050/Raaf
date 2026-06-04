import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { usePageSection } from '../context/ContentContext.jsx';
import { SocialIconLink, WhatsAppIcon } from './SocialIconLink.jsx';

const DEFAULT_COLUMNS = [
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
      { to: '/contact', label: 'Contact' },
    ],
  },
];

const DEFAULT_SOCIAL = {
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  twitterUrl: '',
  youtubeUrl: '',
};

function whatsAppHref(phone, explicitUrl) {
  if (explicitUrl?.trim()) return explicitUrl.trim();
  const digits = phone?.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

function FooterColumn({ title, children }) {
  return (
    <div className="min-w-0">
      <h6 className="text-white font-semibold text-sm mb-4">{title}</h6>
      {children}
    </div>
  );
}

function SocialLinks({ footer }) {
  const social = { ...DEFAULT_SOCIAL, ...footer };
  const wa = whatsAppHref(footer.phone, footer.whatsappUrl);

  const items = [
    social.facebookUrl && { href: social.facebookUrl, label: 'Facebook', network: 'facebook', Icon: Facebook },
    social.instagramUrl && { href: social.instagramUrl, label: 'Instagram', network: 'instagram', Icon: Instagram },
    social.twitterUrl && { href: social.twitterUrl, label: 'X (Twitter)', network: 'twitter', Icon: Twitter },
    social.youtubeUrl && { href: social.youtubeUrl, label: 'YouTube', network: 'youtube', Icon: Youtube },
  ].filter(Boolean);

  if (!items.length && !wa) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      {items.map(({ href, label, network, Icon }) => (
        <SocialIconLink key={label} network={network} href={href} label={label} Icon={Icon} />
      ))}
      {wa ? (
        <SocialIconLink network="whatsapp" href={wa} label="WhatsApp">
          <WhatsAppIcon />
        </SocialIconLink>
      ) : null}
    </div>
  );
}

export default function Footer() {
  const { data: footer } = usePageSection('global', 'footer', {
    tagline: 'Poultry, livestock, and feed for farms across Ghana.',
    phone: '+233 00 000 0000',
    email: 'hello@raafortagro.com',
    address: 'Greater Accra, Ghana',
    logo: '/images/cropped-cropped-gooo-1-1.png',
    copyright: '© Raafortagro. All rights reserved.',
    columns: DEFAULT_COLUMNS,
    ...DEFAULT_SOCIAL,
  });

  const columns = footer.columns?.length ? footer.columns : DEFAULT_COLUMNS;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-charcoal text-white/75 rounded-t-[2rem] sm:rounded-t-[2.5rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 pb-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 pb-10 sm:pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="w-full lg:w-[min(100%,280px)] lg:shrink-0">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={footer.logo} alt="" className="w-11 h-11 rounded-xl object-cover" />
              <span className="font-display font-bold text-white text-lg lowercase">raafortagro</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{footer.tagline}</p>
            <SocialLinks footer={footer} />
          </div>

          {/* Nav + contact — equal columns, shared top alignment */}
          <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {columns.map((col) => (
              <FooterColumn key={col.title} title={col.title}>
                <ul className="space-y-2.5">
                  {col.links?.map(({ to, label }) => (
                    <li key={`${col.title}-${to}`}>
                      <Link to={to} className="text-sm hover:text-white transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            <FooterColumn title="Contact">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-beige shrink-0" />
                  <a
                    href={`tel:${footer.phone?.replace(/\s/g, '')}`}
                    className="hover:text-white transition-colors"
                  >
                    {footer.phone}
                  </a>
                </li>
                <li className="flex items-start gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-beige shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${footer.email}`}
                    className="hover:text-white transition-colors break-all"
                  >
                    {footer.email}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-beige shrink-0 mt-0.5" />
                  <span>{footer.address}</span>
                </li>
              </ul>
            </FooterColumn>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 text-xs text-white/40">
          <p>{footer.copyright || `© ${year} Raafortagro. All rights reserved.`}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link to="/privacy" className="hover:text-white/70 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white/70 transition-colors">
              Terms
            </Link>
            <Link to="/shipping" className="hover:text-white/70 transition-colors">
              Shipping
            </Link>
            <Link to="/returns" className="hover:text-white/70 transition-colors">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
