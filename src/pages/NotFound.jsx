import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="py-16 md:py-20 min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-[1200px] mx-auto px-4">
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-primary mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-heading mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Page not found
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary-dark text-white font-semibold text-sm px-8 py-3.5 rounded-full uppercase tracking-wide hover:bg-[#3a3a3a] transition-colors duration-200"
          >
            Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}