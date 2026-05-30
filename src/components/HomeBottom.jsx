import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './ui/Button.jsx';
import { viewportOnce } from '../lib/motion.js';
import { usePageSection } from '../context/ContentContext.jsx';

export default function HomeBottom() {
  const { data } = usePageSection('home', 'bottom', {
    logo: '/images/cropped-cropped-gooo-1-1.png',
    brandName: 'raafortagro',
    title: 'We develop cutting-edge supply chains to unlock the full potential of your farm.',
    image: '/images/a.jpg',
    imageSecondary: '/images/Raafortagro-3.png',
    buttonLabel: 'Our technology',
    buttonTo: '/services',
  });

  return (
    <section className="py-14 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewportOnce}>
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img src={data.logo} alt={data.brandName} className="w-10 h-10 rounded-lg object-cover" />
              <span className="font-display font-bold text-xl text-charcoal lowercase tracking-tight">
                {data.brandName}
              </span>
            </Link>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-[1.15] mb-6">
              {data.title}
            </h2>
            <div className="flex items-center gap-4">
              <img
                src={data.image}
                alt=""
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
              />
              <Button to={data.buttonTo || '/services'} variant="forest" size="sm">
                {data.buttonLabel || 'Our technology'}
              </Button>
            </div>
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
