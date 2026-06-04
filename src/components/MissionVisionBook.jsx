import { useState } from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';

const missionBullets = [
  'Quality genetics from proven parent stock',
  'Reliable, nationwide logistics',
  'Expert advisory at every stage',
];

function MissionPage({ className = '' }) {
  return (
    <div className={`relative h-full p-6 sm:p-8 lg:p-10 bg-white text-charcoal ${className}`}>
      <span
        className="font-display text-[7rem] sm:text-[9rem] font-bold leading-none text-forest/[0.07] absolute -top-4 right-2 sm:right-4 select-none pointer-events-none"
        aria-hidden
      >
        01
      </span>
      <div className="relative h-full flex flex-col">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">Today</p>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal">Our Mission</h3>
        </div>
        <p className="font-display text-lg sm:text-xl md:text-[1.4rem] font-semibold leading-snug mb-6 max-w-lg">
          Supply Ghanaian farms with vaccinated stock, reliable delivery, and field advice you can use.
        </p>
        <p className="text-text text-sm sm:text-base leading-relaxed mb-6 max-w-md">
          From a first brooder to commercial houses, we stay involved through grow-out.
        </p>
        <ul className="space-y-3.5 mt-auto">
          {missionBullets.map((item, i) => (
            <li key={item} className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm sm:text-base text-charcoal pt-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function VisionPage({ className = '' }) {
  return (
    <div
      className={`relative h-full p-6 sm:p-8 lg:p-10 bg-charcoal text-white overflow-hidden ${className}`}
    >
      <span
        className="font-display text-[7rem] sm:text-[9rem] font-bold leading-none text-white/[0.06] absolute -top-4 right-2 sm:right-4 select-none pointer-events-none"
        aria-hidden
      >
        02
      </span>
      <TrendingUp
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(72vw,22rem)] h-[min(72vw,22rem)] sm:w-80 sm:h-80 text-white/[0.06] pointer-events-none"
        strokeWidth={1}
        aria-hidden
      />
      <div className="relative h-full flex flex-col">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fd4a2]">Tomorrow</p>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">Our Vision</h3>
        </div>
        <p className="font-display text-lg sm:text-xl md:text-[1.4rem] font-semibold text-white leading-snug mb-6 max-w-lg">
          West Africa&apos;s most trusted agricultural supply brand.
        </p>
        <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-7 max-w-md">
          A supply chain Ghanaian farmers can depend on for chicks, feed, health plans, and honest pricing.
        </p>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm mt-auto">
          <p className="text-white font-semibold text-sm">Growing stronger</p>
          <p className="text-white/55 text-xs sm:text-sm mt-0.5">Every harvest season, with you.</p>
        </div>
      </div>
    </div>
  );
}

function TurnPageTeaser() {
  return (
    <div className="relative h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-beige-soft via-cream to-beige border-l border-border/60">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest mb-3">Next page</p>
      <h3 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-3">Our Vision</h3>
      <p className="text-text text-sm max-w-[14rem] leading-relaxed mb-8">
        Hover or tap to turn the page and read where we&apos;re headed.
      </p>
      <span className="inline-flex items-center gap-2 text-forest text-sm font-semibold">
        Turn the page
        <ChevronRight className="w-4 h-4 motion-safe:animate-pulse" />
      </span>
      <div
        className="absolute inset-y-4 left-0 w-3 rounded-full bg-gradient-to-r from-charcoal/15 to-transparent pointer-events-none"
        aria-hidden
      />
    </div>
  );
}

function MissionVisionBook() {
  const [flipped, setFlipped] = useState(false);

  const open = () => setFlipped(true);
  const close = () => setFlipped(false);
  const toggle = () => setFlipped((f) => !f);

  const flipTransform = flipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-center text-xs text-text-muted mb-4 lg:hidden">
        Tap the card to flip between mission and vision
      </p>
      <p className="hidden lg:block text-center text-xs text-text-muted mb-4">
        Hover the right page to turn it — or click to keep it open
      </p>

      {/* Mobile: single card flip */}
      <div
        className="lg:hidden relative min-h-[520px] rounded-[1.75rem] border border-border shadow-xl"
        style={{ perspective: '1600px' }}
      >
        <button
          type="button"
          className="absolute inset-0 z-10 w-full h-full rounded-[1.75rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
          onClick={toggle}
          aria-pressed={flipped}
          aria-label={flipped ? 'Show our mission' : 'Show our vision'}
        />
        <div
          className="relative w-full h-full min-h-[520px] transition-transform duration-700 ease-in-out motion-reduce:transition-none"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipTransform,
          }}
        >
          <div
            className="absolute inset-0 rounded-[1.75rem] overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <MissionPage className="rounded-[1.75rem]" />
          </div>
          <div
            className="absolute inset-0 rounded-[1.75rem] overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <VisionPage className="rounded-[1.75rem]" />
          </div>
        </div>
      </div>

      {/* Desktop: open book — mission fixed, vision page turns */}
      <div
        className="hidden lg:flex relative min-h-[500px] rounded-[2.25rem] border border-border bg-white shadow-xl overflow-hidden"
        style={{ perspective: '2200px' }}
        onMouseLeave={close}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 z-30 pointer-events-none bg-gradient-to-r from-transparent via-charcoal/20 to-transparent" />

        <div className="w-1/2 shrink-0 border-r border-border/80">
          <MissionPage />
        </div>

        <div className="w-1/2 relative" style={{ perspective: '1400px' }}>
          <div
            className="absolute inset-0 transition-transform duration-[850ms] ease-in-out motion-reduce:transition-none cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center',
              transform: flipTransform,
            }}
            onMouseEnter={open}
            onClick={toggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
              }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
            aria-label={flipped ? 'Turn back to vision teaser' : 'Turn page to our vision'}
          >
            <div
              className="absolute inset-0 shadow-[inset_12px_0_24px_-12px_rgba(0,0,0,0.12)]"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <TurnPageTeaser />
            </div>
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <VisionPage className="shadow-[-8px_0_32px_rgba(0,0,0,0.15)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MissionVisionBook;
