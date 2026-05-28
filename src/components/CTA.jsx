import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button.jsx';

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 mx-4 sm:mx-6 lg:mx-8 mb-8 rounded-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-light to-charcoal rounded-hero" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-beige/90 text-xs font-semibold tracking-[0.2em] uppercase mb-3"
        >
          Start your next season right
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-2xl mx-auto"
        >
          Ready to grow a stronger farm?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-white/75 text-base md:text-lg max-w-xl mx-auto mb-10"
        >
          Premium poultry, livestock, feed, and expert logistics — delivered with the care your operation deserves.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button to="/shop" variant="secondary" size="lg">
            Shop catalog
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button to="/contact" variant="outline" size="lg">
            Talk to our team
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
