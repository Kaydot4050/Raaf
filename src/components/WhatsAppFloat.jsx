import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WHATSAPP = 'https://wa.me/233000000000';

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-[60] flex items-center gap-2 bg-[#25D366] text-white pl-3.5 pr-4 sm:pl-4 sm:pr-5 py-3 rounded-full shadow-xl shadow-[#25D366]/30 hover:shadow-2xl hover:scale-105 transition-shadow touch-target bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      whileHover={{ y: -2 }}
    >
      <MessageCircle className="w-5 h-5" strokeWidth={2} />
      <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
    </motion.a>
  );
}
