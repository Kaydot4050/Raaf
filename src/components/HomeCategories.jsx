import { motion } from 'framer-motion';
import CategoryIconGrid from './CategoryIconGrid.jsx';
import { viewportOnce } from '../lib/motion.js';

export default function HomeCategories() {
  return (
    <section className="lg:hidden bg-white py-5 sm:py-6 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
        >
          <CategoryIconGrid />
        </motion.div>
      </div>
    </section>
  );
}
