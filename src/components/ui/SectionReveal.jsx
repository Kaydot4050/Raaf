import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '../../lib/motion.js';

export function SectionHeader({ eyebrow, title, description, align = 'center', className = '' }) {
  const centered = align === 'center';
  return (
    <motion.div
      className={`mb-8 sm:mb-12 md:mb-16 ${centered ? 'text-center' : ''} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger}
    >
      {eyebrow && (
        <motion.p variants={fadeUp} className="text-forest font-semibold text-xs tracking-[0.2em] uppercase mb-2">
          {eyebrow}
        </motion.p>
      )}
      <motion.h2 variants={fadeUp} className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal">
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={`mt-3 text-text-muted text-sm md:text-base max-w-xl leading-relaxed ${centered ? 'mx-auto' : ''}`}
        >
          {description}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className={`mt-5 h-1 w-14 rounded-full bg-forest ${centered ? 'mx-auto' : ''}`} />
    </motion.div>
  );
}

export function RevealGrid({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = '', index = 0 }) {
  return (
    <motion.div variants={fadeUp} custom={index} className={className}>
      {children}
    </motion.div>
  );
}
