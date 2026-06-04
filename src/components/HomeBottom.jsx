import { motion } from 'framer-motion';
import Button from './ui/Button.jsx';
import { viewportOnce } from '../lib/motion.js';
import { usePageSection } from '../context/ContentContext.jsx';

const DEFAULT = {
  eyebrow: 'Why Raafort Agro',
  title: 'From hatchery to harvest',
  description:
    'We supply vaccinated day-old chicks, point-of-lay birds, feed, and on-farm veterinary support. Orders are scheduled for your region, with live-animal handling on every run.',
  bullets: [
    'Day-old chicks and livestock from checked parent stock',
    'Feed, vaccines, and equipment in one order',
    'Advice on housing, biosecurity, and grow-out',
  ],
  buttonLabel: 'View services',
  buttonTo: '/services',
  image: '/images/a.jpg',
  imageSecondary: '/images/Raafortagro-3.png',
};

export default function HomeBottom() {
  const { data } = usePageSection('home', 'bottom', DEFAULT);
  const bullets = data.bullets?.length ? data.bullets : DEFAULT.bullets;

  return (
    <section className="py-14 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewportOnce}>
            {data.eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest mb-3">{data.eyebrow}</p>
            ) : null}
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-[1.15] mb-4">
              {data.title}
            </h2>
            {data.description ? (
              <p className="text-base sm:text-lg text-text leading-relaxed mb-6 max-w-xl">{data.description}</p>
            ) : null}
            {bullets.length > 0 ? (
              <ul className="space-y-2.5 mb-8 text-sm sm:text-base text-charcoal/85 max-w-xl">
                {bullets.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="text-forest font-bold shrink-0" aria-hidden>
                      ·
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <Button to={data.buttonTo || '/services'} variant="forest" size="sm">
              {data.buttonLabel || 'View services'}
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            className="rounded-hero overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[360px] shadow-xl"
          >
            <img
              src={data.imageSecondary || data.image}
              alt=""
              className="w-full h-full object-cover min-h-[280px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
