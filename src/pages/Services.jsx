import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSection } from '../context/ContentContext.jsx';
import {
  ArrowRight, CheckCircle2, Mail, Phone, MapPin, ChevronRight, CalendarDays,
} from 'lucide-react';
import ServiceCapabilities from '../components/ServiceCapabilities.jsx';
import ServiceBookingForm from '../components/ServiceBookingForm.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({ opacity: 1, transition: { duration: 0.8, delay: i * 0.1 } }),
};

function Counter({ to, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(to);
  }, [inView, to, motionVal]);

  useEffect(() => spring.on('change', (v) => setDisplay(Math.floor(v))), [spring]);

  return (
    <span ref={ref}>{prefix}{display}{suffix}</span>
  );
}

const stats = [
  { value: 500, suffix: '+', label: 'Farms Served' },
  { value: 11, suffix: '', label: 'Years Experience' },
  { value: 9, suffix: '', label: 'Core Categories' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
];

export default function Services() {
  const { data: hero } = usePageSection('services', 'hero', {
    title: 'End-to-end farm solutions',
    description:
      'Day-old chicks, livestock, feed, logistics, and on-farm advice under one roof.',
    image: '/images/istock-hero.jpg',
  });
  usePageMeta('Farm Services', 'Poultry, livestock, feed, logistics, and expert consultation — one partner for your entire agricultural operation in Ghana.');
  const [bookService, setBookService] = useState('');

  const handleBook = (title) => {
    setBookService(title);
    requestAnimationFrame(() => {
      document.getElementById('service-booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="bg-cream min-h-screen text-charcoal overflow-x-hidden">

      <section className="relative min-h-0 lg:min-h-[85vh] flex items-start lg:items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={hero.image || '/images/istock-hero.jpg'} alt="Farm Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/40 via-transparent to-cream" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-center">
          <div className="text-center lg:text-left">
            <motion.h1
              variants={fadeUp} custom={1} initial="hidden" animate="show"
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6 text-charcoal"
            >
              {hero.title}
            </motion.h1>

            <motion.p
              variants={fadeUp} custom={2} initial="hidden" animate="show"
              className="text-text text-lg leading-relaxed max-w-lg mb-10 mx-auto lg:mx-0"
            >
              {hero.description}
            </motion.p>

            <motion.div
              variants={fadeUp} custom={3} initial="hidden" animate="show"
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <button
                type="button"
                onClick={() => handleBook('')}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-forest text-white font-semibold text-sm hover:bg-forest-light transition-all duration-300 shadow-lg shadow-forest/20 hover:scale-105"
              >
                <CalendarDays className="w-4 h-4" />
                Book a Service
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border text-charcoal font-semibold text-sm hover:border-forest/50 hover:bg-white transition-all duration-300 bg-white shadow-sm"
              >
                Get a Quote
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border text-charcoal font-semibold text-sm hover:border-forest/50 hover:bg-white transition-all duration-300 bg-white shadow-sm"
              >
                View Products
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={fadeIn} custom={4} initial="hidden" animate="show"
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp} custom={i + 3} initial="hidden" animate="show"
                className="relative rounded-2xl p-6 border border-border bg-white shadow-sm overflow-hidden group hover:border-forest/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-forest/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="font-display text-4xl font-bold text-forest mb-1">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="text-text-muted text-sm font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <ServiceCapabilities />
      <ServiceBookingForm preselectedService={bookService} />

      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-forest/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 xl:gap-16 items-start">

            <div className="min-w-0 order-1">
              <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-forest text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                Why Raafort
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-4 leading-tight">
                Why farmers<br />choose us.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-text text-sm mb-6 leading-relaxed">
                We combine commercial-grade supply chains with the personal touch small farms deserve.
              </motion.p>
              <div className="space-y-2.5">
                {[
                  'Genetics sourced from proven, elite parent stock',
                  'Transparent health & vaccination documentation',
                  'Flexible payment for registered farm accounts',
                  'Nationwide logistics with live-animal care protocols',
                  'Dedicated post-delivery support and follow-up',
                ].map((item, i) => (
                  <motion.div key={item} variants={fadeUp} custom={i + 3} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border bg-cream hover:border-forest/30 hover:bg-forest/5 transition-all duration-300 group shadow-sm">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-forest flex items-center justify-center shrink-0 group-hover:bg-forest-light transition-colors">
                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                    </span>
                    <span className="text-charcoal text-xs font-medium leading-snug">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="order-2 flex justify-center min-w-0 px-2"
            >
              <div className="w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[360px] xl:max-w-[400px] shrink-0">
                <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border shadow-lg shadow-charcoal/10 aspect-[3/4] max-h-[480px] lg:max-h-[560px]">
                  <img
                    src="/images/istock-hero.jpg"
                    alt="Raafort farm services"
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>

            <div className="min-w-0 order-3">
              <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-forest text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                How It Works
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-6 leading-tight">
                From inquiry<br />to harvest.
              </motion.h2>
              <div className="space-y-2">
                {[
                  { step: '01', title: 'Consult', desc: 'Tell us your farm goals, capacity, and timeline.' },
                  { step: '02', title: 'Plan', desc: 'We recommend breeds, quantities, and feed programs.' },
                  { step: '03', title: 'Deliver', desc: 'Scheduled delivery with health checks on arrival.' },
                  { step: '04', title: 'Support', desc: 'Ongoing guidance through grow-out and production.' },
                ].map((p, i) => (
                  <motion.div key={p.step} variants={fadeUp} custom={i + 2} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="group relative flex items-start gap-4 p-4 rounded-xl border border-border bg-cream hover:border-forest/40 hover:bg-forest/5 transition-all duration-400 shadow-sm">
                    <div className="shrink-0">
                      <span className="flex w-9 h-9 rounded-full bg-forest border border-forest text-white font-display font-bold text-xs items-center justify-center shadow-md shadow-forest/20">
                        {p.step}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm font-bold text-charcoal mb-0.5 group-hover:text-forest transition-colors">{p.title}</h4>
                      <p className="text-text-muted text-xs leading-relaxed">{p.desc}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-forest group-hover:translate-x-1 transition-all mt-2 shrink-0" />
                    {i < 3 && <div className="absolute left-[1.85rem] top-[3.75rem] bottom-[-0.5rem] w-px bg-forest/20" />}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cream">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-forest/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            <div>
              <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-4">
                Get In Touch
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">
                Ready to grow<br />your farm?
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-text mb-10 leading-relaxed max-w-sm">
                Reach out to discuss your requirements — bulk orders, custom packages, or expert consultancy.
              </motion.p>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Call Us', val: '+233 XX XXX XXXX' },
                  { icon: Mail, label: 'Email Us', val: 'info@raafortagro.com' },
                  { icon: MapPin, label: 'Location', val: 'Accra, Ghana' },
                ].map(({ icon: Icon, label, val }, i) => (
                  <motion.div key={label} variants={fadeUp} custom={i + 3} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-forest/10 border border-forest/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-forest" />
                    </span>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">{label}</p>
                      <p className="text-charcoal text-sm font-bold">{val}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="relative rounded-3xl border border-border bg-white shadow-xl shadow-black/5 p-8 md:p-10 overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-48 h-48 bg-forest/5 blur-3xl rounded-full pointer-events-none" />
              <h3 className="font-display text-xl font-bold text-charcoal mb-3">Schedule a visit</h3>
              <p className="text-sm text-text leading-relaxed mb-8 max-w-sm">
                Pick a service, choose a date, and our team will confirm your booking within one business day.
              </p>
              <button
                type="button"
                onClick={() => handleBook('')}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-forest hover:bg-forest-light text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-forest/20 hover:shadow-lg hover:shadow-forest/30"
              >
                <CalendarDays className="w-4 h-4" />
                Book a Service
              </button>
              <Link
                to="/contact"
                className="mt-4 text-center text-sm font-semibold text-forest hover:underline"
              >
                Or send a general message
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden m-4 sm:m-8 rounded-[2rem]">
        <div className="absolute inset-0 bg-forest" />
        <div className="relative z-10 max-w-5xl mx-auto text-center py-10">
          <motion.h2 variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Need a custom farm package?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-white/80 mb-10 text-lg max-w-xl mx-auto">
            Bulk chicks, feed contracts, and delivery schedules tailored to your operation.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-forest font-bold text-sm hover:bg-cream transition-all duration-300 hover:scale-105 shadow-xl shadow-black/20"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-semibold text-sm hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Browse Products
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
