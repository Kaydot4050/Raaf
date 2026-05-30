import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
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

export default function Footer() {
  const { data: footer } = usePageSection('global', 'footer', {
    tagline: 'Premium poultry, livestock, and feed for farms across Ghana.',
    phone: '+233 00 000 0000',
    email: 'hello@raafortagro.com',
    address: 'Greater Accra, Ghana',
    logo: '/images/cropped-cropped-gooo-1-1.png',
    copyright: '© Raafortagro. All rights reserved.',
    columns: DEFAULT_COLUMNS,
  });

  const columns = footer.columns?.length ? footer.columns : DEFAULT_COLUMNS;

  return (
    <footer className="mt-auto bg-charcoal text-white/75 rounded-t-[2rem] sm:rounded-t-[2.5rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img src={footer.logo} alt="" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-display font-bold text-white text-lg lowercase">raafortagro</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-5">{footer.tagline}</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-beige shrink-0" />
                <a href={`tel:${footer.phone?.replace(/\s/g, '')}`} className="hover:text-white">
                  {footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-beige shrink-0" />
                <a href={`mailto:${footer.email}`} className="hover:text-white">
                  {footer.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-beige shrink-0 mt-0.5" />
                <span>{footer.address}</span>
              </li>
            </ul>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h6 className="text-white font-semibold text-sm mb-4">{col.title}</h6>
              <ul className="space-y-2.5">
                {col.links?.map(({ to, label }) => (
                  <li key={`${col.title}-${to}`}>
                    <Link to={to} className="text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-white/40 pt-8">
          {footer.copyright || `© ${new Date().getFullYear()} Raafortagro`}
        </p>
      </div>
    </footer>
  );
}
