import { motion } from 'framer-motion';
import { Facebook, Instagram } from 'lucide-react';
import Button from './ui/Button.jsx';
import AnimatedCounter from './ui/AnimatedCounter.jsx';
import AnimatedProgressBar from './ui/AnimatedProgressBar.jsx';
import { RevealGrid, RevealItem } from './ui/SectionReveal.jsx';
import { viewportOnce } from '../lib/motion.js';
import { usePageSection } from '../context/ContentContext.jsx';

const DEFAULT = {
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
          className="grid lg:hidden grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 auto-rows-[84px] sm:auto-rows-[120px] md:auto-rows-[160px]"
        >
          <motion.div
            variants={item}
            className="col-span-2 row-span-2 bg-white/50 backdrop-blur-lg border border-white/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 shadow-xl sm:shadow-2xl flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <img src={m.logo} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm" />
              <span className="text-[10px] sm:text-xs font-bold text-charcoal/80 bg-white/50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm">
                {m.badge}
              </span>
            </div>
            <h2 className="font-display text-base sm:text-3xl md:text-4xl font-bold text-charcoal leading-snug sm:leading-[1.12] drop-shadow-sm">
              {m.title}
            </h2>
            <Button to={m.ctaTo || '/about'} size="sm" className="shadow-lg mt-2 sm:mt-4 w-fit sm:!px-6 sm:!py-3 sm:text-base">
              {m.ctaLabel}
            </Button>
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
            className="col-span-1 row-span-2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-white/30"
          >
            <img src={m.sideImage} alt="" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            variants={item}
            className="col-span-2 row-span-1 bg-white/50 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xl sm:shadow-2xl border border-white/40 flex items-center"
          >
            <p className="text-xs sm:text-base text-charcoal leading-snug sm:leading-relaxed font-semibold drop-shadow-sm">
              {m.description}
            </p>
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
                <a
                  href={m.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              ) : null}
              {m.instagramUrl ? (
                <a
                  href={m.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              ) : null}
            </div>
          </motion.div>
        </motion.div>

        <div className="hidden lg:grid grid-cols-2 gap-10 lg:gap-16 items-start">
          <RevealGrid className="bg-white/50 backdrop-blur-lg border border-white/40 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <RevealItem className="flex items-center gap-3 mb-6">
              <img src={m.logo} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm" />
              <span className="text-sm font-bold text-charcoal/80 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                {m.badge}
              </span>
            </RevealItem>
            <RevealItem>
              <h2 className="font-display text-[2.75rem] font-bold text-charcoal leading-[1.12] mb-6 drop-shadow-sm">
                {m.title}
              </h2>
            </RevealItem>
            <RevealItem className="flex items-center gap-6">
              <Button to={m.ctaTo || '/about'} size="lg" className="shadow-lg shrink-0">
                {m.ctaLabel}
              </Button>
              <p className="text-sm font-medium text-charcoal/80 max-w-xs leading-relaxed">{m.tagline}</p>
            </RevealItem>
          </RevealGrid>

          <div className="space-y-6">
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
                <a
                  href={m.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/50 flex items-center justify-center text-charcoal hover:bg-white/80 transition-colors shadow-lg"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              ) : null}
              {m.instagramUrl ? (
                <a
                  href={m.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/50 flex items-center justify-center text-charcoal hover:bg-white/80 transition-colors shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
