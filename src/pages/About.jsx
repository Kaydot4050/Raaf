import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart, Users, ArrowRight, ChevronDown,
  TrendingUp, Leaf, Shield, Mail, Phone,
} from 'lucide-react';

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
    desc: 'We communicate with honesty and act with transparency. Every transaction, recommendation, and partnership is held to the highest ethical standard.',
  },
  {
    icon: Shield, num: '02', title: 'Value-Driven Excellence',
    desc: 'From hatchery to delivery, we are committed to quality. Our objective is client success — we consistently work to meet and exceed your farm goals.',
  },
  {
    icon: Users, num: '03', title: 'Client-Centered',
    desc: 'Our success metrics are yours. We align our performance goals to the specific needs and growth targets of every farmer and investor we serve.',
  },
  {
    icon: Leaf, num: '04', title: 'Continuous Growth',
    desc: 'We are dedicated to learning, improving, and innovating. Raafort Agro supports its team, clients, and communities to grow beyond their current limits.',
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
  },
  {
    name: 'Veterinary Unit',
    role: 'On-farm health, vaccination programs & biosecurity',
    icon: '🩺',
  },
  {
    name: 'Farm Advisory',
    role: 'Consultancy, setup planning & investment guidance',
    icon: '📋',
  },
  {
    name: 'Customer Support',
    role: 'Order management, after-sales care & follow-ups',
    icon: '🤝',
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
  const [openValue, setOpenValue] = useState(0);

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
            Our Story
          </motion.p>
          <motion.h1
            variants={fadeUp} custom={1} initial="hidden" animate="show"
            className="font-display font-bold text-white leading-[1.0] mb-0"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
          >
            THE FOUNDATION<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #4e785a, #8fd4a2)' }}
            >
              OF OUR MISSION
            </span>
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
                <p className="text-white font-display font-bold text-sm leading-tight">Raafort<br />Agro</p>
              </div>
            </motion.div>

            {/* Card 3 — tallest */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative rounded-none overflow-hidden h-72 md:h-96 shadow-2xl bg-charcoal-light"
            >
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-display font-bold text-sm">500+ Farms</p>
                <p className="text-white/60 text-xs">Nationwide</p>
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
            We help Ghanaian farmers reach the{' '}
            <span className="text-forest italic">right resources</span>, build profitable farms,
            and grow with{' '}
            <span className="text-forest italic">confidence.</span>
          </motion.p>
          <motion.p
            variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-text text-base leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Raafort Agro began with a simple promise: give every farmer access to the same quality genetics,
            veterinary expertise, and supply chains that large commercial units enjoy. Today we serve over 500
            farms across Ghana — and we're just getting started.
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
                We help our clients achieve sustainable growth through values rooted in integrity,
                innovation, and honest partnership.
              </motion.p>
            </div>

            {/* Right — Accordion */}
            <div className="bg-cream rounded-3xl border border-border overflow-hidden shadow-sm">
              {values.map((v, i) => (
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
                We turn farm goals<br />into{' '}
                <span className="text-forest">tangible results.</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-text leading-relaxed mb-10 max-w-md">
                Our focus on farm performance, quality inputs, and continuous improvement ensures every partnership
                delivers a measurable impact on your bottom line.
              </motion.p>

              {/* Two small stats stacked */}
              <div className="space-y-4">
                {[
                  { value: 90, suffix: '%', label: 'Documented survival rate for our day-old chick deliveries on registered farms.' },
                  { value: 100, suffix: '+', label: 'Programs delivered in digital marketing, branding and business strategy for agri-entrepreneurs.' },
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

          <motion.div
            variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="rounded-[1.75rem] md:rounded-[2.25rem] border border-border bg-white shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Mission */}
              <div className="relative p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border">
                <span
                  className="font-display text-[4.5rem] sm:text-[6rem] font-bold leading-none text-forest/[0.07] absolute -top-2 right-4 sm:right-8 select-none pointer-events-none"
                  aria-hidden
                >
                  01
                </span>
                <div className="relative">
                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">Today</p>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal">Our Mission</h3>
                  </div>
                  <p className="font-display text-lg sm:text-xl md:text-[1.4rem] font-semibold text-charcoal leading-snug mb-6 max-w-lg">
                    Empower Ghanaian farmers with premium genetics, reliable logistics, and honest expertise.
                  </p>
                  <p className="text-text text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                    So every farm can produce more with confidence — from your first flock to full-scale operations.
                  </p>
                  <ul className="space-y-3.5">
                    {[
                      'Quality genetics from proven parent stock',
                      'Reliable, nationwide logistics',
                      'Expert advisory at every stage',
                    ].map((item, i) => (
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

              {/* Vision */}
              <div className="relative p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-charcoal via-charcoal to-forest text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#8fd4a2]/15 blur-[90px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-forest/40 blur-[70px] rounded-full pointer-events-none" />
                <span
                  className="font-display text-[4.5rem] sm:text-[6rem] font-bold leading-none text-white/[0.06] absolute -top-2 right-4 sm:right-8 select-none pointer-events-none"
                  aria-hidden
                >
                  02
                </span>
                <div className="relative">
                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fd4a2]">Tomorrow</p>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">Our Vision</h3>
                  </div>
                  <p className="font-display text-lg sm:text-xl md:text-[1.4rem] font-semibold text-white leading-snug mb-6 max-w-lg">
                    West Africa&apos;s most trusted agricultural supply brand.
                  </p>
                  <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-7 max-w-md">
                    Where quality, care, and community grow together toward a food-secure future for every farmer we serve.
                  </p>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#8fd4a2]/20 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-6 h-6 text-[#8fd4a2]" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Growing stronger</p>
                        <p className="text-white/55 text-xs sm:text-sm mt-0.5">Every harvest season, with you.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                We are a group of specialists, advisors, and producers whose mission is to grow your brand — and your farm.
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-white font-semibold text-sm hover:bg-forest-light transition-all duration-300 shadow-md shadow-forest/20 hover:scale-105"
              >
                Contact us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Team cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="group relative rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:border-forest/30 hover:shadow-md transition-all duration-300 p-6"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-forest/5 blur-2xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-3xl mb-4">{m.icon}</div>
                <div className="w-10 h-0.5 bg-forest/30 mb-4 group-hover:bg-forest transition-colors duration-300" />
                <h4 className="font-display font-bold text-charcoal mb-1.5 group-hover:text-forest transition-colors duration-300">{m.name}</h4>
                <p className="text-text-muted text-xs leading-relaxed">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
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
            Get in touch and let's build a plan that works for your operation.
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
