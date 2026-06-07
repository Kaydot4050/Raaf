import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_IMAGES = [
  '/images/Raafortagro-2.png',
  '/images/Raafortagro-3.png',
  '/images/Raafortagro.png',
  '/images/a.jpg',
  '/images/istock-hero.jpg',
  '/images/Raafortagro-2.png',
];

export const authInputCls =
  'mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest/40 lg:border-white/10 lg:bg-white/[0.06] lg:text-white lg:placeholder:text-white/35 lg:focus:ring-forest/50 lg:focus:border-forest/40';

export const authLabelCls = 'block text-sm font-medium text-charcoal lg:text-white/85';

export const authErrorCls =
  'mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2 lg:text-red-200 lg:bg-red-500/15 lg:border-red-400/30';

export const authFooterTextCls = 'mt-8 text-sm text-center text-text-muted lg:text-white/50';

export const authFooterLinkCls =
  'text-forest font-semibold hover:text-forest-light transition-colors lg:text-beige lg:hover:text-white';

export const authDividerLineCls = 'w-full border-t border-border lg:border-white/10';

export const authDividerOrCls =
  'bg-white px-3 text-text-muted uppercase tracking-widest text-xs lg:bg-[#0f1412] lg:text-white/40';

export default function AuthPageShell({
  title,
  subtitle,
  heroTitle = 'Orders, tracking, and farm details in one account.',
  heroSubtitle = 'Sign in to check deliveries, reorder stock, and update your farm profile.',
  children,
  footer,
}) {
  return (
    <div className="relative w-full bg-cream lg:fixed lg:inset-0 lg:z-[80] lg:min-h-screen lg:min-h-[100dvh] lg:grid lg:grid-cols-2 lg:bg-[#0a0e0c]">
      <Link
        to="/"
        className="hidden lg:flex fixed top-4 right-4 z-[90] h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#0f1412]/80 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
        aria-label="Close"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </Link>

      {/* Left — branding (desktop only) */}
      <div className="relative hidden lg:flex min-h-screen flex-col justify-between overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
        <div className="absolute inset-0">
          <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 sm:gap-1.5 opacity-40">
            {HERO_IMAGES.map((src, i) => (
              <div key={`${src}-${i}`} className="overflow-hidden rounded-sm">
                <img src={src} alt="" className="h-full w-full object-cover scale-105" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a140c]/95 via-[#0f1f14]/88 to-[#050807]/98" />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[28%] min-w-[7rem] max-w-[12rem] bg-gradient-to-l from-[#0f1412] via-[#0f1412]/80 to-transparent"
            aria-hidden
          />
        </div>

        <Link to="/" className="relative z-10 inline-flex items-center gap-2.5 w-fit">
          <img
            src="/images/cropped-cropped-gooo-1-1.png"
            alt=""
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/20"
          />
          <span className="font-display font-bold text-white text-lg lowercase tracking-tight">raafortagro</span>
        </Link>

        <div className="relative z-10 mt-10 lg:mt-auto lg:pt-16 max-w-md">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            {heroTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed">{heroSubtitle}</p>
        </div>
      </div>

      {/* Mobile: cream + card with nav/footer. Desktop: full-height dark panel */}
      <div className="flex flex-col items-center justify-center px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:min-h-screen lg:px-12 xl:px-16 lg:py-10 lg:bg-[#0f1412]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto mt-10 sm:mt-12 mb-8 sm:mb-12 lg:mt-0 lg:mb-0 rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-border lg:max-w-none lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:border-0"
        >
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal lg:text-white">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-text-muted lg:text-white/55 mb-8">{subtitle}</p>
          )}
          {children}
          {footer}
        </motion.div>
      </div>
    </div>
  );
}
