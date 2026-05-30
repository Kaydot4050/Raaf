import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import Button from './ui/Button.jsx';
import AnimatedCounter from './ui/AnimatedCounter.jsx';
import AnimatedProgressBar from './ui/AnimatedProgressBar.jsx';
import HeroImageSlider from './HeroImageSlider.jsx';
import { usePageSection } from '../context/ContentContext.jsx';

const DEFAULT_CARDS = [
  {
    image: '/images/Raafortagro.png',
    eyebrow: 'Expert support',
    title: 'Need advice for your farm?',
    buttonLabel: 'Contact Us',
    buttonTo: '/contact',
  },
  { eyebrow: 'Raafort Agro', title: 'Farm supply hub', badge: 'Yield support +30%' },
  { eyebrow: 'National Reach', statValue: '500+', statLabel: 'Farms served across Ghana', statProgress: 75 },
];

export default function HomeHero() {
  const { data } = usePageSection('home', 'hero_cards', { cards: DEFAULT_CARDS });
  const cards = data.cards?.length >= 3 ? data.cards : DEFAULT_CARDS;
  const [card1, card2, card3] = cards;

  return (
    <section className="relative pt-4 sm:pt-6 pb-2 md:pb-12 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/shop"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex w-11 h-11 rounded-full bg-white border border-border text-charcoal items-center justify-center shadow-md hover:bg-beige-soft transition-colors"
          aria-label="Shop"
        >
          <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>

      <HeroImageSlider />

      <div className="hidden md:grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-border/60 flex flex-col justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            {card1?.image ? (
              <img src={card1.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
            ) : null}
            <div>
              <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wider">
                {card1?.eyebrow || 'Expert support'}
              </p>
              <p className="font-display font-bold text-charcoal text-base sm:text-lg leading-snug">
                {card1?.title}
              </p>
            </div>
          </div>
          {card1?.buttonTo ? (
            <Button to={card1.buttonTo} size="sm" className="w-full justify-center mt-2">
              {card1.buttonLabel || 'Contact Us'}
            </Button>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-border/50 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wider">
              {card2?.eyebrow}
            </p>
            <p className="font-display font-bold text-charcoal text-xl leading-tight">{card2?.title}</p>
          </div>
          {card2?.badge ? (
            <div className="mt-4 flex items-center gap-2 text-forest text-sm font-semibold bg-forest/10 w-fit px-3 py-1.5 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              {card2.badge}
            </div>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-beige/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-beige-dark/30 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              {card3?.eyebrow}
            </p>
            <p className="font-display text-3xl font-bold text-charcoal">
              <AnimatedCounter
                value={parseInt(String(card3?.statValue || '500').replace(/\D/g, ''), 10) || 500}
                from={1}
                suffix="+"
                duration={2}
              />
            </p>
            <p className="text-sm text-charcoal/70 mt-1">{card3?.statLabel}</p>
          </div>
          <AnimatedProgressBar
            percent={card3?.statProgress ?? 75}
            duration={2}
            className="h-1.5 mt-4"
            trackClassName="bg-beige-dark/20"
            barClassName="bg-charcoal"
          />
        </motion.div>
      </div>
    </section>
  );
}
