import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSection } from '../context/ContentContext.jsx';
import {
  Heart, Users, ArrowRight, ChevronDown,
  Leaf, Shield, Mail, Phone,
} from 'lucide-react';
import MissionVisionBook from '../components/MissionVisionBook.jsx';
import TeamShowcaseSlider from '../components/TeamShowcaseSlider.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

/* ── Animation helpers ──────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ── Animated Counter ───────────────────────────────── */
function Counter({ to, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 18 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) motionVal.set(to); }, [inView, to, motionVal]);
  useEffect(() => spring.on('change', v => setDisplay(Math.floor(v))), [spring]);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

/* ── Data ───────────────────────────────────────────── */
const values = [
  {
    icon: Heart, num: '01', title: 'Integrity',
    desc: 'We quote honestly, deliver what we promise, and flag problems early.',
  },
  {
    icon: Shield, num: '02', title: 'Quality stock',
    desc: 'Vaccinated chicks, checked livestock, and feed batches we stand behind.',
  },
  {
    icon: Users, num: '03', title: 'Farmer-first',
    desc: 'Orders, health plans, and pricing shaped around your farm size and season.',
  },
  {
    icon: Leaf, num: '04', title: 'Keep improving',
    desc: 'Our team trains on new breeds, biosecurity, and logistics so your results can improve season after season.',
  },
];

const stats = [
  { value: 500, suffix: '+', label: 'Partner Farms', desc: 'Across Ghana and West Africa' },
  { value: 11, suffix: '', label: 'Years Experience', desc: 'In agricultural services' },
  { value: 9, suffix: '', label: 'Core Services', desc: 'From hatchery to harvest' },
  { value: 98, suffix: '%', label: 'Client Satisfaction', desc: 'Verified post-delivery rating' },
];

const team = [
  {
    name: 'Hatchery & Supply',
    role: 'Day-old chick sourcing, quality checks & logistics',
    icon: '🐣',
    image: '/images/Raafortagro-2.png',
  },
  {
    name: 'Veterinary Unit',
    role: 'On-farm health, vaccination programs & biosecurity',
    icon: '🩺',
    image: '/images/Raafortagro-3.png',
  },
  {
    name: 'Farm Advisory',
    role: 'Consultancy, setup planning & investment guidance',
    icon: '📋',
    image: '/images/Raafortagro.png',
  },
  {
    name: 'Customer Support',
    role: 'Order management, after-sales care & follow-ups',
    icon: '🤝',
    image: '/images/a.jpg',
  },
];

/* ── Value Accordion Item ───────────────────────────── */
function ValueItem({ v, isOpen, onClick, index }) {
  const Icon = v.icon;
  return (
    <motion.div
      variants={fadeUp} custom={index}
      initial="hidden" whileInView="show" viewport={{ once: true }}
      className={`border-b border-border last:border-0 transition-colors duration-300 ${isOpen ? 'bg-forest/5' : 'hover:bg-forest/[0.02]'}`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center gap-4 py-4 px-4 text-left group"
      >
        <span className="text-xs font-bold text-text-muted w-6 shrink-0">{v.num}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${isOpen ? 'bg-forest text-white' : 'bg-forest/10 text-forest group-hover:bg-forest/20'}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className={`flex-1 font-display font-bold text-base transition-colors duration-300 ${isOpen ? 'text-forest' : 'text-charcoal'}`}>{v.title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? 'text-forest' : 'text-text-muted'}`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="pl-[3.75rem] pr-4 pb-4 text-text leading-relaxed text-sm">{v.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main ───────────────────────────────────────────── */
export default function About() {
  usePageMeta('About Us', 'Learn about Raafortagro — our mission, team, and commitment to Ghanaian agriculture.');
  const [openValue, setOpenValue] = useState(0);
  const { data: hero } = usePageSection('about', 'hero', {
    eyebrow: 'Our Story',
    title: 'Built for Ghanaian farms',
    card1Title: 'Since 2015',
    card1Subtitle: 'Trusted by farmers',
    card2Title: 'Raafort Agro',
    card3Title: '500+ Farms',
    card3Subtitle: 'Nationwide',
  });
  const { data: intro } = usePageSection('about', 'intro', {
    quote: 'We help Ghanaian farms run on reliable stock, clear advice, and deliveries you can plan around.',
    body: 'Raafort Agro supplies genetics, feed, and on-farm support from Accra to the regions.',
  });
  const { data: valuesCms } = usePageSection('about', 'values', { items: values });
  const { data: statsCms } = usePageSection('about', 'stats', { items: stats });
  const { data: teamCms } = usePageSection('about', 'team', { items: team });
  const valueItems = (valuesCms.items?.length ? valuesCms.items : values).map((v, i) => ({
    ...values[i],
    ...v,
    icon: values[i]?.icon || values[0]?.icon,
  }));
  const statItems = statsCms.items?.length ? statsCms.items : stats;
  const teamItems = (teamCms.items?.length ? teamCms.items : team).map((m, i) => ({
    ...team[i],
    ...m,
    image: m.image || team[i]?.image,
  }));

  return (
    <div className="bg-cream min-h-screen text-charcoal overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-charcoal">
        {/* Nav spacer */}
        <div className="h-20 shrink-0" />

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-10 pb-0">
          <motion.p
            variants={fadeUp} custom={0} initial="hidden" animate="show"
            className="text-forest text-xs font-bold uppercase tracking-[0.25em] mb-6"
          >
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp} custom={1} initial="hidden" animate="show"
            className="font-display font-bold text-white leading-[1.0] mb-0"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
          >
            {hero.title?.includes('\n') ? (
              hero.title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < hero.title.split('\n').length - 1 ? <br /> : null}
                </span>
              ))
            ) : (
              <>
                {hero.title}
                {hero.titleAccent ? (
                  <>
                    <br />
                    <span
                      className="text-transparent bg-clip-text"
                      style={{ backgroundImage: 'linear-gradient(90deg, #4e785a, #8fd4a2)' }}
                    >
                      {hero.titleAccent}
                    </span>
                  </>
                ) : null}
              </>
            )}
          </motion.h1>
        </div>

        {/* Floating cards row */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-0 mt-12">
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative rounded-none overflow-hidden h-48 md:h-64 shadow-2xl bg-forest"
            >
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-display font-bold text-sm">Since 2015</p>
                <p className="text-white/60 text-xs">Trusted by farmers</p>
              </div>
            </motion.div>

            {/* Card 2 — center / taller */}
            <motion.div
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="relative rounded-none overflow-hidden h-64 md:h-80 shadow-2xl border-2 border-forest/40 bg-cream flex flex-col justify-end p-5"
            >
              <div className="bg-charcoal p-3 border border-charcoal">
                <p className="text-white font-display font-bold text-sm leading-tight whitespace-pre-line">
                  {hero.card2Title}
                </p>
              </div>
            </motion.div>

            {/* Card 3 — tallest */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative rounded-none overflow-hidden h-72 md:h-96 shadow-2xl bg-charcoal-light"
            >
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-display font-bold text-sm">{hero.card3Title}</p>
                <p className="text-white/60 text-xs">{hero.card3Subtitle}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ TAGLINE / INTRO ════════════════════════════ */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.p
            variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold text-charcoal leading-snug mb-8"
          >
            {intro.quote}
          </motion.p>
          <motion.p
            variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-text text-base leading-relaxed max-w-2xl mx-auto mb-10"
          >
            {intro.body}
          </motion.p>
          <motion.div
            variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-forest text-white font-semibold text-sm hover:bg-forest-light transition-all duration-300 shadow-lg shadow-forest/20 hover:scale-105"
            >
              Partner with us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border text-charcoal font-semibold text-sm hover:border-forest/50 hover:bg-white transition-all duration-300 bg-white shadow-sm"
            >
              Our services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ WHAT WE STAND FOR — ACCORDION ═════════════ */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left */}
            <div>
              <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-4">
                Core Beliefs
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-4 leading-tight">
                What We<br />Stand For
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-text leading-relaxed mb-4">
                We run on straight talk, reliable stock, and delivery you can plan around.
              </motion.p>
            </div>

            {/* Right — Accordion */}
            <div className="bg-cream rounded-3xl border border-border overflow-hidden shadow-sm">
              {valueItems.map((v, i) => (
                <ValueItem
                  key={v.title}
                  v={v}
                  index={i}
                  isOpen={openValue === i}
                  onClick={() => setOpenValue(openValue === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ MEASURABLE SUCCESS ════════════════════════ */}
      <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — text + mini stats */}
            <div>
              <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-4">
                Our Impact
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">
                We track results<br />in{' '}
                <span className="text-forest">flock performance.</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-text leading-relaxed mb-10 max-w-md">
                Survival rates, feed conversion, and on-time delivery are how we judge a job well done.
              </motion.p>

              {/* Two small stats stacked */}
              <div className="space-y-4">
                {[
                  { value: 90, suffix: '%', label: 'Documented survival rate for our day-old chick deliveries on registered farms.' },
                  { value: 100, suffix: '+', label: 'On-farm vaccination and biosecurity plans completed with registered clients.' },
                ].map((s, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i + 3} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="flex items-start gap-5 p-5 rounded-2xl bg-white border border-border shadow-sm hover:border-forest/30 transition-colors">
                    <p className="font-display text-3xl font-bold text-forest shrink-0">
                      <Counter to={s.value} suffix={s.suffix} />
                    </p>
                    <p className="text-text-muted text-sm leading-relaxed">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.h3 variants={fadeUp} custom={5} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-display text-2xl font-bold text-charcoal mt-10 mb-4">
                Measurable Success
              </motion.h3>
              <motion.div variants={fadeUp} custom={6} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <Link to="/services" className="group inline-flex items-center gap-2 text-forest font-semibold text-sm hover:underline">
                  View our services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Right — bento-style image + big stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Big image spanning both columns */}
              <motion.div
                variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="col-span-2 relative rounded-2xl overflow-hidden h-56 shadow-xl"
              >
                <img src="/images/Raafortagro-3.png" alt="Raafort success" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
              </motion.div>

              {/* Stat card 1 */}
              <motion.div
                variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="relative rounded-2xl bg-forest p-6 flex flex-col justify-between shadow-lg overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Partner Farms</p>
                <p className="font-display text-4xl font-bold text-white mt-4">
                  <Counter to={500} suffix="+" />
                </p>
              </motion.div>

              {/* Stat card 2 with image overlay */}
              <motion.div
                variants={fadeUp} custom={3} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden shadow-lg h-full min-h-[140px]"
              >
                <img src="/images/Raafortagro.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-charcoal/70" />
                <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Satisfaction</p>
                  <p className="font-display text-4xl font-bold text-white">
                    <Counter to={98} suffix="%" />
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MISSION + VISION ══════════════════════════ */}
      <section className="py-14 md:py-20 bg-cream relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-9 md:mb-10">
            <motion.div
              variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="max-w-xl"
            >
              <p className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-3">Direction</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight">
                What drives us<br />
                <span className="text-forest">forward.</span>
              </h2>
            </motion.div>
            <motion.p
              variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-text leading-relaxed max-w-md lg:text-right lg:pb-1"
            >
              Two commitments — one for today&apos;s farms, one for tomorrow&apos;s food systems.
            </motion.p>
          </div>

          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <MissionVisionBook />
          </motion.div>
        </div>
      </section>

      {/* ══ MEET THE TEAM ════════════════════════════= */}
      <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-forest/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
            <div>
              <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-4">Our People</motion.p>
              <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight">
                Meet Our<br />Team
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <p className="text-text leading-relaxed mb-6">
                Hatchery, veterinary, advisory, and customer support teams behind every order.
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-white font-semibold text-sm hover:bg-forest-light transition-all duration-300 shadow-md shadow-forest/20 hover:scale-105"
              >
                Contact us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

        </div>

        {/* Team showcase slider — full width */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
          <TeamShowcaseSlider items={teamItems} />
        </motion.div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════ */}
      <section className="m-4 sm:m-8 rounded-[2rem] overflow-hidden relative">
        <div className="absolute inset-0 bg-charcoal" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-forest/25 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 py-24 px-4 sm:px-8 max-w-5xl mx-auto text-center">
          <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-forest text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Let's Work Together
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to grow<br />your farm with us?
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-white/60 text-lg max-w-lg mx-auto mb-10">
            Tell us your farm size and breeds. We will map stock, feed, and delivery.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-forest text-white font-bold text-sm hover:bg-forest-light transition-all duration-300 hover:scale-105 shadow-xl shadow-forest/30"
            >
              Get in Touch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-sm hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              Browse Products
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="h-8 bg-cream" />
    </div>
  );
}
