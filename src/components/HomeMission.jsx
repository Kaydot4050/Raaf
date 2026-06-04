import { motion } from 'framer-motion';
import { Facebook, Instagram } from 'lucide-react';
import { SocialIconLink } from './SocialIconLink.jsx';
import AnimatedCounter from './ui/AnimatedCounter.jsx';
import AnimatedProgressBar from './ui/AnimatedProgressBar.jsx';
import { RevealGrid, RevealItem } from './ui/SectionReveal.jsx';
import { viewportOnce } from '../lib/motion.js';
import { usePageSection } from '../context/ContentContext.jsx';

const DEFAULT = {
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
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomeMission() {
  const { data: m } = usePageSection('home', 'mission', DEFAULT);
  const rawBenefits = m.benefits?.length ? m.benefits : DEFAULT.benefits;
  const benefits = DEFAULT.benefits.map((def, i) => {
    const cms = rawBenefits[i] || {};
    return {
      ...def,
      ...Object.fromEntries(Object.entries(cms).filter(([, v]) => v !== '' && v !== null && v !== undefined)),
    };
  });

  return (
    <section
      className="relative pt-5 pb-10 sm:pt-8 sm:pb-14 md:py-20 lg:py-28 bg-cream bg-contain md:bg-cover bg-top md:bg-center bg-no-repeat"
      style={{ backgroundImage: `url("${m.backgroundImage}")` }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ staggerChildren: 0.1 }}
          className="grid lg:hidden grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 auto-rows-[68px] sm:auto-rows-[96px] md:auto-rows-[130px]"
        >
          <motion.div
            variants={item}
            className="col-span-2 row-span-2 bg-white/50 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xl sm:shadow-2xl border border-white/40 flex flex-col justify-center gap-2 sm:gap-3"
          >
            <h2 className="font-display text-base sm:text-2xl md:text-3xl font-bold text-charcoal leading-snug drop-shadow-sm">
              {m.title}
            </h2>
            <p className="text-xs sm:text-base text-charcoal leading-snug sm:leading-relaxed font-medium">
              {m.description}
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="col-span-1 row-span-2 bg-forest/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xl sm:shadow-2xl flex flex-col justify-between text-white border border-forest/50"
          >
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/70 mb-0.5 sm:mb-1">
                National Reach
              </p>
              <p className="font-display text-2xl sm:text-5xl font-bold text-white">
                <AnimatedCounter value={Number(m.statValue) || 500} from={1} suffix="+" duration={2} />
              </p>
              <p className="text-[10px] sm:text-sm text-white/70 mt-0.5 sm:mt-1 leading-tight">{m.statLabel}</p>
            </div>
            <AnimatedProgressBar
              percent={m.statProgress ?? 75}
              duration={2}
              className="h-1 sm:h-1.5 mt-2 sm:mt-4"
              trackClassName="bg-white/20"
              barClassName="bg-white"
            />
          </motion.div>

          <motion.div
            variants={item}
            className="col-span-1 row-span-2 bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-gray-600/30 flex flex-col justify-between p-3.5 sm:p-5 text-white relative"
          >
            {/* Printed chick silhouette */}
            <svg className="absolute bottom-0 right-0 w-24 h-24 sm:w-36 sm:h-36 text-white/[0.07]" viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="65" cy="48" rx="28" ry="30" />
              <circle cx="55" cy="28" r="18" />
              <ellipse cx="46" cy="22" rx="5" ry="3" transform="rotate(-20 46 22)" />
              <polygon points="42,30 34,28 42,33" />
              <circle cx="50" cy="25" r="2.5" fill="rgba(0,0,0,0.15)" />
              <ellipse cx="52" cy="78" rx="8" ry="14" transform="rotate(-8 52 78)" />
              <ellipse cx="78" cy="78" rx="8" ry="14" transform="rotate(8 78 78)" />
              <rect x="48" y="90" width="5" height="12" rx="2" transform="rotate(-5 50 96)" />
              <rect x="72" y="90" width="5" height="12" rx="2" transform="rotate(5 74 96)" />
              <ellipse cx="80" cy="50" rx="14" ry="8" transform="rotate(25 80 50)" />
            </svg>
            <div className="relative z-10">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70 mb-1">Fresh Stock</p>
              <p className="font-display text-sm sm:text-xl font-bold leading-snug">Quality breeds ready for your farm</p>
            </div>
            <a
              href="/shop"
              className="relative z-10 mt-2 sm:mt-4 inline-flex items-center justify-center gap-1.5 bg-white text-forest font-bold text-[10px] sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl hover:bg-white/90 transition-colors w-fit"
            >
              Shop now
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
          </motion.div>

          {benefits.map((b) => (
            <motion.div
              key={b.n}
              variants={item}
              className="col-span-1 row-span-1 bg-beige/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-lg sm:shadow-xl border border-beige-dark/20 flex flex-col justify-center"
            >
              <span className="font-display text-base sm:text-xl font-bold text-forest mb-0.5 sm:mb-1">{b.n}</span>
              <h3 className="font-display font-bold text-charcoal text-xs sm:text-sm leading-snug">{b.title}</h3>
              <p className="text-xs text-charcoal/60 mt-0.5 hidden sm:block">{b.desc}</p>
            </motion.div>
          ))}

          <motion.div
            variants={item}
            className="col-span-2 row-span-1 bg-charcoal/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xl sm:shadow-2xl border border-white/10 flex items-center justify-between gap-2"
          >
            <p className="text-white text-[11px] sm:text-base font-medium leading-snug">{m.tagline}</p>
            <div className="flex gap-1.5 sm:gap-2 shrink-0">
              {m.facebookUrl ? (
                <SocialIconLink
                  network="facebook"
                  href={m.facebookUrl}
                  label="Facebook"
                  Icon={Facebook}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                />
              ) : null}
              {m.instagramUrl ? (
                <SocialIconLink
                  network="instagram"
                  href={m.instagramUrl}
                  label="Instagram"
                  Icon={Instagram}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                />
              ) : null}
            </div>
          </motion.div>
        </motion.div>

        <div className="hidden lg:block max-w-3xl mx-auto space-y-6">
          <RevealItem>
            <h2 className="font-display text-[2.75rem] font-bold text-charcoal leading-[1.12] drop-shadow-sm">
              {m.title}
            </h2>
          </RevealItem>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="bg-white/50 backdrop-blur-lg rounded-card p-8 shadow-2xl border border-white/40"
          >
            <p className="text-xl text-charcoal leading-relaxed font-semibold drop-shadow-sm">{m.description}</p>
          </motion.div>

          <RevealGrid className="space-y-4">
            {benefits.map((b, i) => (
              <RevealItem
                key={b.n}
                index={i}
                className="flex gap-5 p-6 bg-white/50 backdrop-blur-lg rounded-card border border-white/40 shadow-xl"
              >
                <span className="font-display text-2xl font-bold text-forest shrink-0">{b.n}</span>
                <div>
                  <h3 className="font-display font-bold text-charcoal mb-1">{b.title}</h3>
                  <p className="text-sm font-medium text-charcoal/70">{b.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGrid>

          <div className="flex justify-end gap-3 pt-2">
            {m.facebookUrl ? (
              <SocialIconLink
                network="facebook"
                href={m.facebookUrl}
                label="Facebook"
                Icon={Facebook}
                className="h-10 w-10"
              />
            ) : null}
            {m.instagramUrl ? (
              <SocialIconLink
                network="instagram"
                href={m.instagramUrl}
                label="Instagram"
                Icon={Instagram}
                className="h-10 w-10"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
