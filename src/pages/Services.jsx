import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSection } from '../context/ContentContext.jsx';
import {
  Egg, Beef, Wheat, TrendingUp, Stethoscope, Warehouse,
  GraduationCap, Coins, Package, ArrowRight, ArrowUpRight,
  CheckCircle2, Mail, Phone, MapPin, Send, ChevronRight,
  Droplets, Shield, FileText, Settings, BookOpen, Truck
} from 'lucide-react';

/* ── Animation helpers ─────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({ opacity: 1, transition: { duration: 0.8, delay: i * 0.1 } }),
};

/* ── Animated Counter ──────────────────────────────── */
function Counter({ to, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(to);
  }, [inView, to, motionVal]);

  useEffect(() => spring.on('change', v => setDisplay(Math.floor(v))), [spring]);

  return (
    <span ref={ref}>{prefix}{display}{suffix}</span>
  );
}

/* ── Data ──────────────────────────────────────────── */
const services = [
  // POULTRY
  {
    isCore: true, icon: Egg, tag: 'Poultry', title: 'Day-Old Chicks',
    short: 'Vaccinated, high-yield chicks delivered safely nationwide.',
    desc: 'Sourced from elite parent stock. Every chick is vaccinated, health-certified, and transported with live-animal care protocols.',
    image: '/images/Raafortagro-2.png', size: 'large', darkText: false,
  },
  { isCore: false, icon: Egg, tag: 'Poultry', title: 'Point-of-Lay Pullets', short: 'Ready-to-lay hens for immediate egg production.', desc: 'Skip the brooding phase. Our 16-week old pullets are fully vaccinated and primed for maximum yield.', darkText: true },
  { isCore: false, icon: Beef, tag: 'Poultry', title: 'Broiler Processing', short: 'Hygienic processing and packaging services.', desc: 'Commercial-grade processing facilities ensuring your meat meets all health and safety standards.', darkText: true },
  { isCore: false, icon: Warehouse, tag: 'Poultry', title: 'Hatchery Services', short: 'Custom hatching and incubation.', desc: 'State-of-the-art incubation ensuring high hatchability and robust day-old chicks.', darkText: false },
  { isCore: false, icon: Package, tag: 'Poultry', title: 'Poultry Equipment', short: 'Feeders, drinkers, and heating systems.', desc: 'Everything you need to equip your poultry house for optimal growth and survival rates.', darkText: true },

  // ADVISORY
  {
    isCore: true, icon: TrendingUp, tag: 'Advisory', title: 'Farm Consultancy',
    short: 'Expert analysis to unlock your farm\'s full potential.',
    desc: 'Our specialists assess your operation and deliver actionable recommendations.',
    image: '/images/Raafortagro-3.png', size: 'tall', darkText: false,
  },
  { isCore: false, icon: FileText, tag: 'Advisory', title: 'Business Planning', short: 'Strategic roadmaps for farm profitability.', desc: 'Comprehensive business plans tailored for agricultural startups and expanding operations.', darkText: true },
  { isCore: false, icon: Shield, tag: 'Advisory', title: 'Risk Management', short: 'Mitigate agricultural and financial risks.', desc: 'Identify and neutralize threats before they impact your farm\'s bottom line.', darkText: false },
  { isCore: false, icon: Droplets, tag: 'Advisory', title: 'Resource Optimization', short: 'Do more with less waste.', desc: 'Analyze water, feed, and energy usage to dramatically reduce overhead costs.', darkText: true },
  { isCore: false, icon: Coins, tag: 'Advisory', title: 'Market Analysis', short: 'Know where to sell for the best margins.', desc: 'Data-driven insights into agricultural commodity prices and demand forecasting.', darkText: true },

  // HEALTH
  {
    isCore: true, icon: Stethoscope, tag: 'Health', title: 'Veterinary Care',
    short: 'Professional animal health & prevention programs.',
    desc: 'On-farm veterinary visits, vaccinations, and preventive health plans.',
    image: null, size: 'small', darkText: true,
  },
  { isCore: false, icon: Shield, tag: 'Health', title: 'Vaccination Programs', short: 'Comprehensive immunization schedules.', desc: 'Protect your flock and herd with expertly administered, timely vaccines.', darkText: true },
  { isCore: false, icon: Droplets, tag: 'Health', title: 'Disease Diagnostics', short: 'Rapid testing and treatment plans.', desc: 'Accurate laboratory diagnostics to catch and contain outbreaks early.', darkText: false },
  { isCore: false, icon: Warehouse, tag: 'Health', title: 'Biosecurity Protocols', short: 'Keep pathogens off your farm.', desc: 'Custom biosecurity audits and implementation strategies to protect your investment.', darkText: true },
  { isCore: false, icon: Wheat, tag: 'Health', title: 'Nutritional Supplements', short: 'Vitamins and minerals for peak health.', desc: 'Targeted supplements to boost immunity, growth, and production rates.', darkText: true },

  // NUTRITION
  {
    isCore: true, icon: Wheat, tag: 'Nutrition', title: 'Feed Formulation',
    short: 'Precision nutrition for every growth stage.',
    desc: 'Balanced feeds that drive faster growth and better feed conversion ratios.',
    image: null, size: 'small', darkText: true,
  },
  { isCore: false, icon: Settings, tag: 'Nutrition', title: 'Custom Blends', short: 'Tailored recipes for your specific breed.', desc: 'We formulate exact nutritional profiles based on your livestock\'s unique requirements.', darkText: false },
  { isCore: false, icon: Truck, tag: 'Nutrition', title: 'Bulk Feed Supply', short: 'Reliable delivery of commercial feeds.', desc: 'Consistent, on-time delivery of premium pelleted and mash feeds.', darkText: true },
  { isCore: false, icon: Egg, tag: 'Nutrition', title: 'Feed Additives', short: 'Enzymes, probiotics, and binders.', desc: 'Enhance digestion and gut health with our range of high-quality feed additives.', darkText: true },
  { isCore: false, icon: Stethoscope, tag: 'Nutrition', title: 'Quality Testing', short: 'Laboratory analysis of feed ingredients.', desc: 'Ensure your raw materials are free from toxins and meet nutritional standards.', darkText: true },

  // INFRASTRUCTURE
  {
    isCore: true, icon: Warehouse, tag: 'Infrastructure', title: 'Farm Setup',
    short: 'End-to-end farm design and installation.',
    desc: 'Housing, equipment, ventilation — we build your farm from ground up.',
    image: '/images/Raafortagro-2.png', size: 'wide', darkText: false,
  },
  { isCore: false, icon: Droplets, tag: 'Infrastructure', title: 'Irrigation Systems', short: 'Smart water management.', desc: 'Design and installation of drip and sprinkler irrigation for crop integration.', darkText: true },
  { isCore: false, icon: Settings, tag: 'Infrastructure', title: 'Automated Feeding', short: 'Reduce labor, increase efficiency.', desc: 'Silo and auger systems for automated, scheduled feeding of poultry and livestock.', darkText: true },
  { isCore: false, icon: Shield, tag: 'Infrastructure', title: 'Climate Control', short: 'Optimal environments year-round.', desc: 'Ventilation, cooling pads, and heating systems for environmentally controlled houses.', darkText: false },
  { isCore: false, icon: Package, tag: 'Infrastructure', title: 'Waste Management', short: 'Eco-friendly disposal and recycling.', desc: 'Biogas digesters and composting systems to turn animal waste into resources.', darkText: true },

  // LEARNING
  {
    isCore: true, icon: GraduationCap, tag: 'Learning', title: 'Training & Education',
    short: 'Hands-on programs for modern agri-entrepreneurs.',
    desc: 'Practical workshops and mentorship to build confident farm operators.',
    image: null, size: 'small', darkText: true,
  },
  { isCore: false, icon: BookOpen, tag: 'Learning', title: 'Farm Mentorship', short: '1-on-1 guidance from veterans.', desc: 'Partner with experienced farm managers who guide you through your first production cycles.', darkText: true },
  { isCore: false, icon: TrendingUp, tag: 'Learning', title: 'Internships', short: 'Practical on-farm experience.', desc: 'Immersive programs for students and new graduates to learn real-world farming.', darkText: false },
  { isCore: false, icon: FileText, tag: 'Learning', title: 'Certification Courses', short: 'Recognized agricultural qualifications.', desc: 'Structured learning paths covering biosecurity, management, and animal welfare.', darkText: true },
  { isCore: false, icon: Droplets, tag: 'Learning', title: 'Masterclasses', short: 'Deep dives into specialized topics.', desc: 'Intensive weekend seminars on advanced farming techniques and technologies.', darkText: true },

  // FINANCE
  {
    isCore: true, icon: Coins, tag: 'Finance', title: 'Investment Packages',
    short: 'Grow your capital through managed agri-investment.',
    desc: 'Partner with us to fund projects managed by our expert team with agreed profit-sharing.',
    image: null, size: 'small', darkText: true,
  },
  { isCore: false, icon: Shield, tag: 'Finance', title: 'Farm Insurance', short: 'Protect your flock and assets.', desc: 'Comprehensive coverage against disease outbreaks, natural disasters, and theft.', darkText: true },
  { isCore: false, icon: Settings, tag: 'Finance', title: 'Equipment Financing', short: 'Upgrade without breaking the bank.', desc: 'Flexible payment plans for tractors, silos, and automated housing systems.', darkText: false },
  { isCore: false, icon: FileText, tag: 'Finance', title: 'Grant Assistance', short: 'Access government and NGO funding.', desc: 'Expert help in writing proposals and securing agricultural development grants.', darkText: true },
  { isCore: false, icon: TrendingUp, tag: 'Finance', title: 'Profit Sharing', short: 'Joint venture farming.', desc: 'Provide the land or capital, and we provide the management for a shared return.', darkText: true },

  // SUPPLY
  {
    isCore: true, icon: Package, tag: 'Supply', title: 'Farm Input Supply',
    short: 'All your inputs from one trusted source.',
    desc: 'Feeds, vaccines, drugs, feeders, drinkers and equipment — sourced and delivered.',
    image: '/images/Raafortagro-3.png', size: 'tall', darkText: false,
  },
  { isCore: false, icon: Stethoscope, tag: 'Supply', title: 'Veterinary Drugs', short: 'Authentic medications and vaccines.', desc: 'Cold-chain guaranteed supply of essential veterinary pharmaceuticals.', darkText: true },
  { isCore: false, icon: Droplets, tag: 'Supply', title: 'Wholesale Disinfectants', short: 'Chemicals for biosecurity.', desc: 'Bulk supply of industrial-grade farm sanitizers and boot-dip chemicals.', darkText: true },
  { isCore: false, icon: Egg, tag: 'Supply', title: 'Consumables', short: 'Egg trays, crates, and packaging.', desc: 'High-quality, durable packaging materials for the safe transport of your produce.', darkText: true },
  { isCore: false, icon: Settings, tag: 'Supply', title: 'Farming Tools', short: 'Durable hardware for daily tasks.', desc: 'From wheelbarrows to specialized surgical kits, we stock reliable farm hardware.', darkText: false },

  // LIVESTOCK
  {
    isCore: true, icon: Beef, tag: 'Livestock', title: 'Livestock & Meat',
    short: 'From pasture to plate — hygienic, fresh, traceable.',
    desc: 'Professionally processed, packaged and distributed to consumers and businesses.',
    image: null, size: 'wide-short', darkText: true,
  },
  { isCore: false, icon: TrendingUp, tag: 'Livestock', title: 'Breeding Stock', short: 'Genetically superior animals.', desc: 'Pedigree bulls, rams, and boars to improve the genetic pool of your herd.', darkText: true },
  { isCore: false, icon: Droplets, tag: 'Livestock', title: 'Dairy Production', short: 'High-yield dairy cows and goats.', desc: 'Sourced dairy livestock with proven records of high milk volume and quality.', darkText: false },
  { isCore: false, icon: Package, tag: 'Livestock', title: 'Meat Processing', short: 'Custom butchery services.', desc: 'We process your animals to your exact cuts and specifications for retail.', darkText: true },
  { isCore: false, icon: Truck, tag: 'Livestock', title: 'Live Animal Transport', short: 'Stress-free logistics.', desc: 'Specialized vehicles designed for the safe and humane transport of livestock.', darkText: true },
];

const stats = [
  { value: 500, suffix: '+', label: 'Farms Served' },
  { value: 11, suffix: '', label: 'Years Experience' },
  { value: 9, suffix: '', label: 'Core Categories' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
];

/* ── Layout Patterns ─────────────────────────────────── */
const patterns = {
  // Pattern 1: Left Large
  p1: {
    0: 'col-span-2 md:col-span-2 row-span-2 min-h-[340px]',
    1: 'col-span-1 md:col-span-1 row-span-1 min-h-[160px]',
    2: 'col-span-1 md:col-span-1 row-span-1 min-h-[160px]',
    3: 'col-span-1 md:col-span-1 row-span-1 min-h-[160px]',
    4: 'col-span-1 md:col-span-1 row-span-1 min-h-[160px]',
  },
  // Pattern 2: Right Large
  p2: {
    0: 'col-span-2 md:col-span-2 md:col-start-3 md:row-start-1 row-span-2 min-h-[340px]',
    1: 'col-span-1 md:col-span-1 md:col-start-1 md:row-start-1 row-span-1 min-h-[160px]',
    2: 'col-span-1 md:col-span-1 md:col-start-2 md:row-start-1 row-span-1 min-h-[160px]',
    3: 'col-span-1 md:col-span-1 md:col-start-1 md:row-start-2 row-span-1 min-h-[160px]',
    4: 'col-span-1 md:col-span-1 md:col-start-2 md:row-start-2 row-span-1 min-h-[160px]',
  },
  // Pattern 3: Top Wide
  p3: {
    0: 'col-span-2 md:col-span-2 row-span-1 min-h-[160px]',
    1: 'col-span-1 md:col-span-1 row-span-1 min-h-[160px]',
    2: 'col-span-1 md:col-span-1 row-span-1 min-h-[160px]',
    3: 'col-span-2 md:col-span-2 row-span-1 min-h-[160px]',
    4: 'col-span-2 md:col-span-2 row-span-1 min-h-[160px]',
  },
  // Pattern 4: Center Large
  p4: {
    0: 'col-span-2 md:col-span-2 md:col-start-2 md:row-start-1 row-span-2 min-h-[340px]',
    1: 'col-span-1 md:col-span-1 md:col-start-1 md:row-start-1 row-span-1 min-h-[160px]',
    2: 'col-span-1 md:col-span-1 md:col-start-4 md:row-start-1 row-span-1 min-h-[160px]',
    3: 'col-span-1 md:col-span-1 md:col-start-1 md:row-start-2 row-span-1 min-h-[160px]',
    4: 'col-span-1 md:col-span-1 md:col-start-4 md:row-start-2 row-span-1 min-h-[160px]',
  },
  // Pattern 5: Flanked Tall
  p5: {
    0: 'col-span-2 md:col-span-2 md:col-start-2 md:row-start-1 row-span-1 min-h-[160px]',
    1: 'col-span-1 md:col-span-1 md:col-start-1 md:row-start-1 row-span-2 min-h-[340px]',
    2: 'col-span-1 md:col-span-1 md:col-start-4 md:row-start-1 row-span-2 min-h-[340px]',
    3: 'col-span-1 md:col-span-1 md:col-start-2 md:row-start-2 row-span-1 min-h-[160px]',
    4: 'col-span-1 md:col-span-1 md:col-start-3 md:row-start-2 row-span-1 min-h-[160px]',
  }
};

const categoryToPattern = {
  'Poultry': 'p1',
  'Advisory': 'p2',
  'Health': 'p3',
  'Nutrition': 'p4',
  'Infrastructure': 'p5',
  'Learning': 'p2',
  'Finance': 'p3',
  'Supply': 'p4',
  'Livestock': 'p1',
};

/* ── Service Card ──────────────────────────────────── */
function ServiceCard({ s, index, isFiltered, activeCategory }) {
  const [hovered, setHovered] = useState(false);

  let sizeClass;
  if (isFiltered) {
    const patternKey = categoryToPattern[activeCategory] || 'p1';
    sizeClass = patterns[patternKey][index] || 'col-span-1 row-span-1 min-h-[160px]';
  } else {
    sizeClass = {
      large: 'col-span-2 row-span-2 min-h-[340px]',
      tall: 'col-span-1 row-span-2 min-h-[340px]',
      wide: 'col-span-2 row-span-1 min-h-[160px]',
      'wide-short': 'col-span-2 row-span-1 min-h-[160px]',
      small: 'col-span-1 row-span-1 min-h-[160px]',
    }[s.size];
  }

  const hasImage = !!s.image;
  const Icon = s.icon;
  const tColor = s.darkText ? 'text-charcoal' : 'text-white';
  const tMuted = s.darkText ? 'text-text-muted' : 'text-white/70';
  
  const isHuge = sizeClass.includes('row-span-2') && (sizeClass.includes('md:col-span-2') || (!sizeClass.includes('md:') && sizeClass.includes('col-span-2')));
  const isWide = sizeClass.includes('row-span-1') && (sizeClass.includes('md:col-span-2') || (!sizeClass.includes('md:') && sizeClass.includes('col-span-2')));
  const isTall = sizeClass.includes('row-span-2') && (sizeClass.includes('md:col-span-1') || (!sizeClass.includes('md:') && sizeClass.includes('col-span-1')));
  const isSmall = !isHuge && !isWide && !isTall; // Fallback

  const arrowClasses = `w-8 h-8 shrink-0 rounded-full flex items-center justify-center border transition-colors ${
    s.darkText ? 'bg-cream text-charcoal border-border' : 'bg-white/10 text-white border-white/15 backdrop-blur-sm'
  }`;
  const arrowHoverStyle = { rotate: hovered ? 45 : 0, background: hovered ? (s.darkText ? '#2d4a32' : 'rgba(45,74,50,0.8)') : undefined };
  const ArrowIcon = () => (
    <motion.div className={arrowClasses} animate={arrowHoverStyle} transition={{ duration: 0.3 }}>
      <ArrowUpRight className={`w-4 h-4 ${hovered && s.darkText ? 'text-white' : ''}`} />
    </motion.div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group ${sizeClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.015, transition: { duration: 0.3 } }}
    >
      {/* Backgrounds */}
      {hasImage ? (
        <>
          <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-charcoal/10" />
          <motion.div className="absolute inset-0 bg-forest/20" animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-white border border-border">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-forest/10 blur-[50px]"
            animate={{ opacity: hovered ? 1 : 0.3, scale: hovered ? 1.4 : 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* ── Internal Layouts ── */}

      {/* WIDE CARD LAYOUT */}
      {isWide && (
        <div className="relative z-10 h-full flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 sm:p-6">
          <div className="flex flex-col items-start gap-4 flex-1">
            <div className="flex items-center gap-3">
              <Tag label={s.tag} darkText={s.darkText} />
              <div className={`p-1.5 rounded-md ${s.darkText ? 'bg-forest/10' : 'bg-white/10'}`}>
                <Icon className={`w-4 h-4 ${s.darkText ? 'text-forest' : 'text-white'}`} strokeWidth={2} />
              </div>
            </div>
            <h3 className={`font-display font-bold text-xl md:text-2xl ${tColor}`}>{s.title}</h3>
          </div>
          <div className="flex flex-col md:items-end gap-4 flex-1">
            <div className="hidden md:block"><ArrowIcon /></div>
            <motion.p className={`text-sm md:text-right leading-relaxed ${tMuted}`}>{s.desc}</motion.p>
            <div className="md:hidden self-start"><ArrowIcon /></div>
          </div>
        </div>
      )}

      {/* TALL CARD LAYOUT */}
      {isTall && (
        <div className="relative z-10 h-full flex flex-col items-center text-center justify-between p-5 sm:p-8">
          <div className="w-full flex justify-between items-start">
            <Tag label={s.tag} darkText={s.darkText} />
            <ArrowIcon />
          </div>
          <div className="flex flex-col items-center gap-4 my-8">
            <div className={`p-5 rounded-full ${s.darkText ? 'bg-forest/10' : 'bg-white/10 backdrop-blur-md'}`}>
              <Icon className={`w-8 h-8 ${s.darkText ? 'text-forest' : 'text-white'}`} strokeWidth={1.5} />
            </div>
            <h3 className={`font-display font-bold text-2xl ${tColor}`}>{s.title}</h3>
            <motion.p className={`text-sm leading-relaxed ${tMuted}`}>{s.desc}</motion.p>
          </div>
          <div className="h-4" /> {/* Spacer */}
        </div>
      )}

      {/* HUGE/LARGE CARD LAYOUT */}
      {isHuge && (
        <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <Tag label={s.tag} darkText={s.darkText} />
            <ArrowIcon />
          </div>
          
          <div className={`mt-auto ${hasImage ? 'backdrop-blur-md bg-charcoal/40 border border-white/10 p-6 rounded-2xl' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${hasImage ? 'bg-white/10' : (s.darkText ? 'bg-forest/10' : 'bg-white/10')}`}>
                <Icon className={`w-5 h-5 ${hasImage ? 'text-white' : (s.darkText ? 'text-forest' : 'text-white')}`} />
              </div>
              <h3 className={`font-display font-bold text-2xl sm:text-3xl ${hasImage ? 'text-white' : tColor}`}>{s.title}</h3>
            </div>
            <motion.p className={`leading-relaxed text-sm sm:text-base ${hasImage ? 'text-white/80' : tMuted}`}>
              {s.desc}
            </motion.p>
          </div>
        </div>
      )}

      {/* SMALL CARD LAYOUT */}
      {isSmall && (
        <div className="relative z-10 h-full flex flex-col justify-between p-5 overflow-hidden">
          {/* Large faded decorative icon in background */}
          <Icon className={`absolute -right-4 -bottom-4 w-32 h-32 opacity-[0.03] ${s.darkText ? 'text-charcoal' : 'text-white'} pointer-events-none`} />
          
          <div className="flex items-start justify-between relative z-10">
            <Tag label={s.tag} darkText={s.darkText} />
            <ArrowIcon />
          </div>
          
          <div className="relative z-10 mt-6">
            <Icon className={`w-5 h-5 mb-3 ${s.darkText ? 'text-forest' : 'text-[#8fd4a2]'}`} />
            <h3 className={`font-display font-bold text-lg mb-1.5 ${tColor}`}>{s.title}</h3>
            <motion.p className={`text-xs leading-relaxed ${tMuted}`} animate={{ opacity: hovered ? 1 : 0.7 }}>
              {s.short}
            </motion.p>
            
            {/* Expand text on hover */}
            <motion.p
              className={`text-[11px] mt-2 leading-relaxed overflow-hidden ${s.darkText ? 'text-text' : 'text-white/80'}`}
              animate={{ maxHeight: hovered ? '80px' : '0px', opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {s.desc}
            </motion.p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ── Tag Badge ─────────────────────────────────────── */
function Tag({ label, darkText }) {
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border backdrop-blur-sm ${darkText ? 'bg-forest/10 text-forest border-forest/20' : 'bg-white/15 text-white border-white/20'}`}>
      {label}
    </span>
  );
}

/* ── Floating Label Input ──────────────────────────── */
function FloatInput({ id, label, type = 'text', as = 'input' }) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState('');
  const lifted = focused || val.length > 0;
  const Tag2 = as;
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-4 pointer-events-none transition-all duration-200 ${lifted ? 'top-2 text-[10px] text-forest' : 'top-1/2 -translate-y-1/2 text-sm text-text-muted'}`}
        style={as === 'textarea' && !lifted ? { top: '1.1rem', transform: 'none' } : {}}
      >
        {label}
      </label>
      <Tag2
        id={id}
        type={type}
        rows={as === 'textarea' ? 4 : undefined}
        className="w-full bg-white border border-border rounded-xl px-4 pt-6 pb-3 text-charcoal text-sm focus:outline-none focus:border-forest/60 focus:bg-cream transition-all resize-none shadow-sm"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={e => setVal(e.target.value)}
        value={val}
      />
    </div>
  );
}

/* ── Main Component ────────────────────────────────── */
export default function Services() {
  const { data: hero } = usePageSection('services', 'hero', {
    title: 'Farm services built around your success.',
    description:
      'From day-old chicks and livestock to feed, logistics, and expert consultation — one partner for your entire agricultural operation.',
    image: '/images/istock-hero.jpg',
  });
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories from core services
  const categories = ['All', ...new Set(services.filter(s => s.isCore).map(s => s.tag))];

  // Filter services based on active category
  // If "All", show ONLY the 9 Core services.
  // If a specific category, show ALL 5 services for that category.
  const filteredServices = activeCategory === 'All' 
    ? services.filter(s => s.isCore) 
    : services.filter(s => s.tag === activeCategory);

  return (
    <div className="bg-cream min-h-screen text-charcoal overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-0 lg:min-h-[85vh] flex items-start lg:items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={hero.image || '/images/istock-hero.jpg'} alt="Farm Services" className="w-full h-full object-cover" />
          {/* Light glass blur overlay */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />
          {/* Subtle gradient from top/bottom to ensure the image blends nicely into the page */}
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
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-forest text-white font-semibold text-sm hover:bg-forest-light transition-all duration-300 shadow-lg shadow-forest/20 hover:scale-105"
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

          {/* Right: Stats grid */}
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

      {/* ── SERVICES BENTO GRID ───────────────────────── */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
            <p className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-4">Capabilities</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight">
                Everything your<br />
                <span className="text-forest">
                  farm needs.
                </span>
              </h2>
              <p className="text-text max-w-xs text-sm leading-relaxed md:text-right">
                Explore our full suite of agricultural services. Filter by category to see everything we offer.
              </p>
            </div>
          </motion.div>

          {/* Service Categories Row */}
          <div className="mb-8 overflow-x-auto scrollbar-none">
            <div className="flex gap-2 min-w-max pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap border ${
                    activeCategory === cat
                      ? 'bg-forest text-white border-forest shadow-md shadow-forest/20'
                      : 'bg-white text-charcoal border-border hover:border-forest/40 hover:text-forest'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bento Grid */}
          <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px]">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((s, i) => (
                <ServiceCard key={s.title} s={s} index={i} isFiltered={activeCategory !== 'All'} activeCategory={activeCategory} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── WHY US / PROCESS ────────────────────────────  */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-forest/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left: Why Us */}
            <div>
              <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-4">
                Why Raafort
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">
                Why farmers<br />choose us.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-text mb-10 leading-relaxed">
                We combine commercial-grade supply chains with the personal touch small farms deserve.
              </motion.p>
              <div className="space-y-4">
                {[
                  'Genetics sourced from proven, elite parent stock',
                  'Transparent health & vaccination documentation',
                  'Flexible payment for registered farm accounts',
                  'Nationwide logistics with live-animal care protocols',
                  'Dedicated post-delivery support and follow-up',
                ].map((item, i) => (
                  <motion.div key={item} variants={fadeUp} custom={i + 3} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-border bg-cream hover:border-forest/30 hover:bg-forest/5 transition-all duration-300 group shadow-sm">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-forest flex items-center justify-center shrink-0 group-hover:bg-forest-light transition-colors shadow-sm shadow-forest/20">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                    <span className="text-charcoal text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Process */}
            <div>
              <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="text-forest text-xs font-bold uppercase tracking-[0.2em] mb-4">
                How It Works
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-10 leading-tight">
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
                    className="group relative flex items-start gap-6 p-6 rounded-2xl border border-border bg-cream hover:border-forest/40 hover:bg-forest/5 transition-all duration-400 cursor-pointer shadow-sm">
                    <div className="shrink-0">
                      <span className="flex w-11 h-11 rounded-full bg-forest border border-forest text-white font-display font-bold text-sm items-center justify-center shadow-md shadow-forest/20">
                        {p.step}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-charcoal mb-1 group-hover:text-forest transition-colors">{p.title}</h4>
                      <p className="text-text-muted text-sm">{p.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-forest group-hover:translate-x-1 transition-all mt-3.5 shrink-0" />
                    {/* Connector line */}
                    {i < 3 && <div className="absolute left-[2.35rem] top-[4.5rem] bottom-[-0.6rem] w-px bg-forest/20" />}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────*/}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cream">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-forest/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left */}
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

            {/* Right: Form */}
            <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="relative rounded-3xl border border-border bg-white shadow-xl shadow-black/5 p-8 md:p-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-forest/5 blur-3xl rounded-full pointer-events-none" />
              <h3 className="font-display text-xl font-bold text-charcoal mb-8">Send a message</h3>
              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <FloatInput id="fname" label="First Name" />
                  <FloatInput id="lname" label="Last Name" />
                </div>
                <FloatInput id="email" label="Email Address" type="email" />
                <FloatInput id="phone" label="Phone Number" type="tel" />
                <FloatInput id="message" label="Your Message" as="textarea" />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-forest hover:bg-forest-light text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-forest/20 hover:shadow-lg hover:shadow-forest/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
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
