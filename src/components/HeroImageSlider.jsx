import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePageSection } from '../context/ContentContext.jsx';

const FALLBACK_SLIDES = [
  { src: '/images/logo.png', alt: 'Poultry & Livestock', title: 'LIVESTOCK' },
  { src: '/images/Raafortagro-3.png', alt: 'Agro Chemicals', title: 'CHEMICALS' },
  { src: '/images/Raafortagro.png', alt: 'Farm Equipment', title: 'EQUIPMENT' },
  { src: '/images/a.jpg', alt: 'Sustainable agriculture', title: 'FARMING' },
];

export default function HeroImageSlider({ className = '' }) {
  const { data } = usePageSection('home', 'hero_slides', { slides: FALLBACK_SLIDES });
  const SLIDES = data.slides?.length ? data.slides : FALLBACK_SLIDES;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, 4000); // Cycles every 4 seconds
    
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      className={`relative w-full mx-auto -mt-2 sm:-mt-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="flex flex-row h-[40vh] sm:h-[60vh] lg:h-[500px] w-full gap-1 sm:gap-2 overflow-hidden bg-charcoal/5 p-1">
        {SLIDES.map((slide, i) => {
          const isActive = i === activeIndex;
          return (
            <motion.article
              key={i}
              className="relative h-full overflow-hidden cursor-pointer"
              animate={{
                flex: isActive ? (isDesktop ? 9.5 : 8) : isDesktop ? 0.7 : 1,
              }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => setActiveIndex(i)}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <motion.div 
                className="absolute bottom-0 left-0 w-full p-3 sm:p-6 flex flex-col justify-end"
                animate={{
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                <motion.h3
                  className="text-white font-display font-bold text-lg sm:text-2xl lg:text-3xl tracking-tight leading-none whitespace-nowrap overflow-hidden text-center drop-shadow-md"
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 20,
                  }}
                  transition={{ duration: 0.3, delay: isActive ? 0.2 : 0 }}
                >
                  {slide.title}
                </motion.h3>
                {!isActive && (
                  <h3 className="text-white/80 font-display font-bold text-xs sm:text-sm tracking-widest text-center uppercase" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', height: '100px', margin: '0 auto' }}>
                    {slide.title}
                  </h3>
                )}
              </motion.div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
