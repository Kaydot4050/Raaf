import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { servicesCatalog, serviceCategories } from '../data/servicesCatalog.js';
import ServiceShowcaseSlider from './ServiceShowcaseSlider.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function ServiceCapabilities() {
  const [activeCategory, setActiveCategory] = useState('All');

  const sliderItems = useMemo(() => {
    const list =
      activeCategory === 'All'
        ? servicesCatalog.filter((s) => s.isCore)
        : servicesCatalog.filter((s) => s.tag === activeCategory);

    return list.slice(0, 5).map((s) => ({
      name: s.title,
      role: s.tag,
      short: s.short,
      image: s.image,
      icon: s.icon,
    }));
  }, [activeCategory]);

  return (
    <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-forest/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-10 sm:mb-16">
          <div>
            <motion.p
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-4"
            >
              Capabilities
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight"
            >
              Everything Your
              <br />
              Farm Needs
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-text leading-relaxed mb-6">
              From chicks and feed to consultancy and logistics — browse our core services and find the right fit for your operation.
            </p>
            <div className="flex flex-wrap gap-2">
              {serviceCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap border ${
                    activeCategory === cat
                      ? 'bg-forest text-white border-forest shadow-md shadow-forest/20'
                      : 'bg-white text-charcoal border-border hover:border-forest/40 hover:text-forest'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        key={activeCategory}
        variants={fadeUp}
        custom={3}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 w-full"
      >
        <ServiceShowcaseSlider items={sliderItems} />
      </motion.div>
    </section>
  );
}
