import { motion } from 'framer-motion';
import { fadeUp } from '../../lib/motion.js';

export default function PageHero({
  eyebrow,
  title,
  description,
  image = '/images/Raafortagro-2.png',
  align = 'left',
  children,
  tall = false,
}) {
  const isCenter = align === 'center';

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:pb-8 bg-cream">
      <div
        className={`relative overflow-hidden rounded-hero md:rounded-[2.5rem] bg-charcoal shadow-lg ${
          tall ? 'min-h-[min(380px,55svh)] sm:min-h-[48vh]' : 'min-h-[min(300px,45svh)] sm:min-h-[38vh]'
        } flex items-end`}
      >
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />

        <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pb-10 sm:pb-14 pt-24 sm:pt-28 ${isCenter ? 'text-center' : ''}`}>
          {eyebrow && (
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-white/70 text-xs tracking-[0.2em] uppercase mb-2"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] max-w-3xl mx-auto"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className={`mt-4 text-base text-white/75 max-w-xl leading-relaxed ${isCenter ? 'mx-auto' : ''}`}
            >
              {description}
            </motion.p>
          )}
          {children && (
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className={`mt-6 flex flex-col sm:flex-row flex-wrap gap-3 ${isCenter ? 'justify-center' : ''} [&_a]:justify-center`}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
