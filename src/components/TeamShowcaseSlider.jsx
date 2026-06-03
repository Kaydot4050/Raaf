import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK_IMAGES = [
  '/images/Raafortagro-2.png',
  '/images/Raafortagro-3.png',
  '/images/Raafortagro.png',
  '/images/a.jpg',
  '/images/istock-hero.jpg',
  '/images/1-Howo-Cargo-Truck-1.jpg',
  '/images/Raafortagro-2.png',
];

function scaleFromOffset(offsetPx, slideSpan) {
  const ratio = Math.abs(offsetPx) / slideSpan;
  return Math.max(0.56, 1 - ratio * 0.14);
}

function useSlideLayout(trackRef) {
  const [layout, setLayout] = useState({ width: 200, height: 256, gap: 14 });

  useEffect(() => {
    const update = () => {
      const trackWidth = trackRef.current?.clientWidth || window.innerWidth;
      const w = window.innerWidth;
      const gap = w >= 1024 ? 22 : w >= 640 ? 18 : 12;
      const slideWidth = Math.round(Math.min(360, Math.max(168, trackWidth * 0.2)));
      const slideHeight = Math.round(slideWidth * 1.28);
      setLayout({ width: slideWidth, height: slideHeight, gap });
    };

    update();
    window.addEventListener('resize', update);

    const track = trackRef.current;
    const observer = track ? new ResizeObserver(update) : null;
    if (track && observer) observer.observe(track);

    return () => {
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [trackRef]);

  return layout;
}

export default function TeamShowcaseSlider({ items = [] }) {
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const hoverZoneRef = useRef('center');
  const steppingRef = useRef(false);
  const { width, height, gap } = useSlideLayout(trackRef);
  const len = items.length || 0;

  const slides = useMemo(
    () =>
      len
        ? [...items, ...items, ...items].map((item, i) => ({
            ...item,
            key: `${i}-${item.name}`,
            sourceIndex: i % len,
            image: item.image || FALLBACK_IMAGES[(i % len) % FALLBACK_IMAGES.length],
          }))
        : [],
    [items, len],
  );

  const [active, setActive] = useState(0);
  const [transforms, setTransforms] = useState([]);
  const [mouseControl, setMouseControl] = useState(false);

  const slideSpan = width + gap;

  useEffect(() => {
    setMouseControl(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const getCenterIndex = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return 0;

    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    let current = 0;
    let minDist = Infinity;

    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - viewportCenter);
      if (dist < minDist) {
        minDist = dist;
        current = i;
      }
    });

    return current;
  }, []);

  const updateTransforms = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !slides.length) return;

    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    const next = [];

    slideRefs.current.forEach((el, i) => {
      if (!el) {
        next[i] = { scale: 0.84 };
        return;
      }
      const center = el.offsetLeft + el.offsetWidth / 2;
      const offset = center - viewportCenter;
      const distance = Math.abs(offset);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
      next[i] = {
        scale: scaleFromOffset(offset, slideSpan),
      };
    });

    setTransforms(next);
    setActive(slides[closestIndex]?.sourceIndex ?? 0);
  }, [slideSpan, slides]);

  const scrollToIndex = useCallback(
    (index) => {
      const scroller = scrollerRef.current;
      const el = slideRefs.current[index];
      if (!scroller || !el) return;

      steppingRef.current = true;
      const target = el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2;
      scroller.scrollTo({ left: target, behavior: 'smooth' });

      window.setTimeout(() => {
        steppingRef.current = false;
        updateTransforms();
      }, 420);
    },
    [updateTransforms],
  );

  const go = useCallback(
    (delta) => {
      scrollToIndex(getCenterIndex() + delta);
    },
    [getCenterIndex, scrollToIndex],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!mouseControl || steppingRef.current) return;

      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;

      let zone = 'center';
      if (ratio < 0.32) zone = 'left';
      else if (ratio > 0.68) zone = 'right';

      const prev = hoverZoneRef.current;
      if (zone === prev) return;

      if (zone === 'left') go(-1);
      else if (zone === 'right') go(1);

      hoverZoneRef.current = zone;
    },
    [go, mouseControl],
  );

  const handleMouseLeave = useCallback(() => {
    hoverZoneRef.current = 'center';
  }, []);

  useEffect(() => {
    if (!len) return;
    scrollToIndex(len);
  }, [len, width, height, gap, scrollToIndex]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateTransforms);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    updateTransforms();

    return () => {
      scroller.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [updateTransforms, slides.length]);

  const activeItem = items[active] || items[0];
  if (!len) return null;

  return (
    <div className="relative w-full">
      <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]">
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-border bg-white/90 text-charcoal shadow-md hover:bg-white transition-colors hidden sm:flex items-center justify-center"
          aria-label="Previous team member"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div ref={trackRef} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} className="w-full">
          <div
            ref={scrollerRef}
            className="flex w-full items-end overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-2"
            style={{
              gap,
              paddingLeft: `calc(50% - ${width / 2}px)`,
              paddingRight: `calc(50% - ${width / 2}px)`,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {slides.map((slide, i) => {
              const t = transforms[i] || { scale: 0.84 };
              const isCenter = t.scale >= 0.96;

              return (
                <button
                  key={slide.key}
                  ref={(el) => {
                    slideRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  className={`relative shrink-0 snap-center overflow-hidden rounded-2xl sm:rounded-3xl bg-charcoal/5 shadow-[0_12px_40px_rgba(28,28,28,0.12)] origin-bottom transition-transform duration-200 ease-out ${
                    isCenter ? 'ring-2 ring-forest/20' : ''
                  }`}
                  style={{
                    width,
                    height,
                    transform: `scale(${t.scale})`,
                  }}
                  aria-label={`Show ${slide.name}`}
                >
                  <img src={slide.image} alt={slide.name} className="h-full w-full object-cover" loading="lazy" />
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-border bg-white/90 text-charcoal shadow-md hover:bg-white transition-colors hidden sm:flex items-center justify-center"
          aria-label="Next team member"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {mouseControl && (
        <p className="mt-3 text-center text-xs text-text-muted hidden sm:block">
          Point left or right over the gallery to move one member at a time
        </p>
      )}

      <div key={active} className="mt-6 sm:mt-8 text-center px-4">
        <h4 className="font-display text-xl sm:text-2xl font-bold text-charcoal">{activeItem.name}</h4>
        <p className="mt-2 text-sm sm:text-base text-text-muted max-w-md mx-auto leading-relaxed">{activeItem.role}</p>
      </div>
    </div>
  );
}
