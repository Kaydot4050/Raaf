import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { usePageSection } from '../context/ContentContext.jsx';

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
    social.facebookUrl && { href: social.facebookUrl, label: 'Facebook', Icon: Facebook },
    social.instagramUrl && { href: social.instagramUrl, label: 'Instagram', Icon: Instagram },
    social.twitterUrl && { href: social.twitterUrl, label: 'X (Twitter)', Icon: Twitter },
    social.youtubeUrl && { href: social.youtubeUrl, label: 'YouTube', Icon: Youtube },
  ].filter(Boolean);

  if (!items.length && !wa) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-beige/40 hover:bg-white/10 hover:text-white"
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </a>
      ))}
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#25D366]/40 bg-[#25D366]/15 text-[#25D366] transition-colors hover:bg-[#25D366]/25"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}

export default function Footer() {
  const { data: footer } = usePageSection('global', 'footer', {
    tagline: 'Premium poultry, livestock, and feed for farms across Ghana.',
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
