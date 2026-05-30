import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from './ui/SectionReveal.jsx';
import { usePageSection } from '../context/ContentContext.jsx';

const FALLBACK = [
  {
    name: 'Kwame Asante',
    role: 'Broiler Farmer · Ashanti',
    quote:
      'Ross 308 chicks from Raafort performed exceptionally — low mortality and fast growth. The best investment on my farm.',
  },
  {
    name: 'Ama Serwaa',
    role: 'Layer Farmer · Eastern',
    quote:
      'Two years of consistent quality layers and a support team that actually answers. I recommend them to every farmer I know.',
  },
  {
    name: 'Yaw Mensah',
    role: 'Mixed Farm · Volta',
    quote:
      'From guinea keets to Boer goats, every order has been healthy and well handled. They understand Ghanaian farming.',
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-star text-sm">★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { data } = usePageSection('home', 'testimonials', { items: FALLBACK });
  const testimonials = data.items?.length ? data.items : FALLBACK;
  const baseGroup = [...testimonials, ...testimonials, ...testimonials];
  const loopItems = [...baseGroup, ...baseGroup];

  return (
    <section className="py-12 sm:py-20 md:py-28 bg-cream-dark/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12">
        <SectionHeader
          eyebrow={data.eyebrow || 'Testimonials'}
          title={data.title || 'Voices from the field'}
          description={data.description || 'Farmers across Ghana trust Raafort for genetics, delivery, and honest support.'}
        />
      </div>

      <div className="relative w-full overflow-hidden flex">
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-cream-dark/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-cream-dark/50 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6 lg:gap-8 w-max px-4"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: 'linear', duration: 45, repeat: Infinity }}
        >
          {loopItems.map((t, i) => (
            <div
              key={i}
              className="relative bg-white rounded-card p-8 shadow-sm border border-border/50 w-[300px] sm:w-[350px] shrink-0"
            >
              <Quote className="w-10 h-10 text-forest/15 absolute top-6 right-6" />
              <Stars />
              <p className="text-sm text-text leading-relaxed mb-8 relative z-10">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-5 border-t border-border">
                <div className="w-11 h-11 rounded-full bg-forest/10 flex items-center justify-center font-display font-bold text-forest text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
