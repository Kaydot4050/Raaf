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
  'mt-1.5 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-forest/50 focus:border-forest/40';
export const authLabelCls = 'block text-sm font-medium text-white/85';

export default function AuthPageShell({
  title,
  subtitle,
  heroTitle = 'Orders, tracking, and farm details in one account.',
  heroSubtitle = 'Sign in to check deliveries, reorder stock, and update your farm profile.',
  children,
  footer,
}) {
  return (
    <div className="relative min-h-screen min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 bg-[#0a0e0c]">
      <Link
        to="/"
        className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#0f1412]/80 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
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
          {/* Fade into form panel */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-[28%] min-w-[7rem] max-w-[12rem] bg-gradient-to-l from-[#0f1412] via-[#0f1412]/80 to-transparent lg:block"
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

      {/* Right — form (full screen on mobile) */}
      <div className="flex min-h-screen min-h-[100dvh] flex-col items-center justify-center px-6 py-10 sm:px-12 lg:px-12 xl:px-16 bg-[#0f1412]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto"
        >
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-white/55 mb-8">{subtitle}</p>}
          {children}
          {footer}
        </motion.div>
      </div>
    </div>
  );
}
