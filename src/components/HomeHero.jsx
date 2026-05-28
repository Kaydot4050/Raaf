import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import Button from './ui/Button.jsx';
import AnimatedCounter from './ui/AnimatedCounter.jsx';
import AnimatedProgressBar from './ui/AnimatedProgressBar.jsx';
import HeroImageSlider from './HeroImageSlider.jsx';

export default function HomeHero() {
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
            <img
              src="/images/Raafortagro.png"
              alt=""
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div>
              <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wider">Expert support</p>
              <p className="font-display font-bold text-charcoal text-base sm:text-lg leading-snug">
                Need advice for your farm?
              </p>
            </div>
          </div>
          <Button to="/contact" size="sm" className="w-full justify-center mt-2">
            Contact Us
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-border/50 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wider">Raafort Agro</p>
            <p className="font-display font-bold text-charcoal text-xl leading-tight">Farm supply hub</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-forest text-sm font-semibold bg-forest/10 w-fit px-3 py-1.5 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            Yield support +30%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-beige/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-beige-dark/30 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">National Reach</p>
            <p className="font-display text-3xl font-bold text-charcoal">
              <AnimatedCounter value={500} from={1} suffix="+" duration={2} />
            </p>
            <p className="text-sm text-charcoal/70 mt-1">Farms served across Ghana</p>
          </div>
          <AnimatedProgressBar
            percent={75}
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
