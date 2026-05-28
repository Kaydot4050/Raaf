import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthPageShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[calc(100vh-56px)] lg:min-h-[calc(100vh-92px)] bg-[#0f1117] p-3 sm:p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-6xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.45)] bg-[#111827]"
      >
        <div className="grid lg:grid-cols-[1.05fr_1fr] min-h-[min(680px,calc(100vh-120px))]">
          <div className="bg-[#f8fafc] p-6 sm:p-10 lg:p-12 flex items-center justify-center">
            <div className="w-full max-w-[420px]">
              <Link to="/" className="inline-flex items-center gap-2 mb-8">
                <span className="w-9 h-9 rounded-full bg-beige-soft border border-border/60 overflow-hidden shrink-0">
                  <img src="/images/cropped-cropped-gooo-1-1.png" alt="" className="w-full h-full object-cover" />
                </span>
                <span className="font-display font-semibold text-charcoal lowercase tracking-tight">raafortagro</span>
              </Link>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-text-muted mb-6">{subtitle}</p>}
              {children}
              {footer}
            </div>
          </div>

          <div className="hidden lg:flex relative items-end justify-center p-8 bg-[radial-gradient(110%_90%_at_70%_20%,#2d4a32_0%,#1a3320_38%,#0a140c_100%)]">
            <div className="absolute inset-0 opacity-65 bg-[linear-gradient(140deg,rgba(77,122,88,0.45)_0%,rgba(26,51,32,0.08)_42%,rgba(5,12,7,0.75)_100%)]" />
            <div className="absolute top-12 right-12 w-60 h-60 rounded-full bg-forest/25 blur-3xl" />
            <div className="absolute top-36 right-32 w-32 h-32 rounded-full bg-beige/20 blur-2xl" />
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-5 text-center">
              <p className="text-white/95 text-sm font-medium">Fresh from Ghana&apos;s farms</p>
              <p className="text-white/70 text-xs mt-1">Orders, tracking, and your farm account in one place.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
