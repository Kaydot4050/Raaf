import {
  Egg, Beef, Wheat, TrendingUp, Stethoscope, Warehouse,
  GraduationCap, Coins, Package, Droplets, Shield, FileText,
  Settings, BookOpen, Truck,
} from 'lucide-react';

export const servicesCatalog = [
  { isCore: true, icon: Egg, tag: 'Poultry', title: 'Day-Old Chicks', short: 'Vaccinated, high-yield chicks delivered safely nationwide.', desc: 'Sourced from selected parent stock. Every chick is vaccinated, health-certified, and transported with live-animal care protocols.', image: '/images/Raafortagro-2.png' },
  { isCore: false, icon: Egg, tag: 'Poultry', title: 'Point-of-Lay Pullets', short: 'Ready-to-lay hens for immediate egg production.', desc: 'Skip the brooding phase. Our 16-week old pullets are fully vaccinated and primed for maximum yield.' },
  { isCore: false, icon: Beef, tag: 'Poultry', title: 'Broiler Processing', short: 'Hygienic processing and packaging services.', desc: 'Approved processing facilities ensuring your meat meets all health and safety standards.' },
  { isCore: false, icon: Warehouse, tag: 'Poultry', title: 'Hatchery Services', short: 'Custom hatching and incubation.', desc: 'Modern incubation ensuring high hatchability and robust day-old chicks.' },
  { isCore: false, icon: Package, tag: 'Poultry', title: 'Poultry Equipment', short: 'Feeders, drinkers, and heating systems.', desc: 'Everything you need to equip your poultry house for optimal growth and survival rates.' },

  { isCore: true, icon: TrendingUp, tag: 'Advisory', title: 'Farm Consultancy', short: 'Expert analysis to improve margins and flock health.', desc: 'Our specialists assess your operation and deliver clear next steps.', image: '/images/Raafortagro-3.png' },
  { isCore: false, icon: FileText, tag: 'Advisory', title: 'Business Planning', short: 'Strategic roadmaps for farm profitability.', desc: 'Written business plans tailored for agricultural startups and expanding operations.' },
  { isCore: false, icon: Shield, tag: 'Advisory', title: 'Risk Management', short: 'Mitigate agricultural and financial risks.', desc: 'Identify and neutralize threats before they impact your farm\'s bottom line.' },
  { isCore: false, icon: Droplets, tag: 'Advisory', title: 'Resource Optimization', short: 'Do more with less waste.', desc: 'Analyze water, feed, and energy usage to cut overhead costs.' },
  { isCore: false, icon: Coins, tag: 'Advisory', title: 'Market Analysis', short: 'Know where to sell for the best margins.', desc: 'Data-driven insights into agricultural commodity prices and demand forecasting.' },

  { isCore: true, icon: Stethoscope, tag: 'Health', title: 'Veterinary Care', short: 'Professional animal health & prevention programs.', desc: 'On-farm veterinary visits, vaccinations, and preventive health plans.' },
  { isCore: false, icon: Shield, tag: 'Health', title: 'Vaccination Programs', short: 'Full vaccination schedules for your flock or herd.', desc: 'Protect your flock and herd with expertly administered, timely vaccines.' },
  { isCore: false, icon: Droplets, tag: 'Health', title: 'Disease Diagnostics', short: 'Rapid testing and treatment plans.', desc: 'Accurate laboratory diagnostics to catch and contain outbreaks early.' },
  { isCore: false, icon: Warehouse, tag: 'Health', title: 'Biosecurity Protocols', short: 'Keep pathogens off your farm.', desc: 'Custom biosecurity audits and implementation strategies to protect your investment.' },
  { isCore: false, icon: Wheat, tag: 'Health', title: 'Nutritional Supplements', short: 'Vitamins and minerals for peak health.', desc: 'Targeted supplements to boost immunity, growth, and production rates.' },

  { isCore: true, icon: Wheat, tag: 'Nutrition', title: 'Feed Formulation', short: 'Precision nutrition for every growth stage.', desc: 'Balanced feeds that drive faster growth and better feed conversion ratios.' },
  { isCore: false, icon: Settings, tag: 'Nutrition', title: 'Custom Blends', short: 'Tailored recipes for your specific breed.', desc: 'We formulate exact nutritional profiles based on your livestock\'s unique requirements.' },
  { isCore: false, icon: Truck, tag: 'Nutrition', title: 'Bulk Feed Supply', short: 'Reliable delivery of commercial feeds.', desc: 'Consistent, on-time delivery of premium pelleted and mash feeds.' },
  { isCore: false, icon: Egg, tag: 'Nutrition', title: 'Feed Additives', short: 'Enzymes, probiotics, and binders.', desc: 'Enhance digestion and gut health with our range of high-quality feed additives.' },
  { isCore: false, icon: Stethoscope, tag: 'Nutrition', title: 'Quality Testing', short: 'Laboratory analysis of feed ingredients.', desc: 'Ensure your raw materials are free from toxins and meet nutritional standards.' },

  { isCore: true, icon: Warehouse, tag: 'Infrastructure', title: 'Farm Setup', short: 'End-to-end farm design and installation.', desc: 'Housing, equipment, ventilation — we build your farm from ground up.', image: '/images/Raafortagro-2.png' },
  { isCore: false, icon: Droplets, tag: 'Infrastructure', title: 'Irrigation Systems', short: 'Smart water management.', desc: 'Design and installation of drip and sprinkler irrigation for crop integration.' },
  { isCore: false, icon: Settings, tag: 'Infrastructure', title: 'Automated Feeding', short: 'Reduce labor, increase efficiency.', desc: 'Silo and auger systems for automated, scheduled feeding of poultry and livestock.' },
  { isCore: false, icon: Shield, tag: 'Infrastructure', title: 'Climate Control', short: 'Optimal environments year-round.', desc: 'Ventilation, cooling pads, and heating systems for environmentally controlled houses.' },
  { isCore: false, icon: Package, tag: 'Infrastructure', title: 'Waste Management', short: 'Eco-friendly disposal and recycling.', desc: 'Biogas digesters and composting systems to turn animal waste into resources.' },

  { isCore: true, icon: GraduationCap, tag: 'Learning', title: 'Training & Education', short: 'Hands-on programs for modern agri-entrepreneurs.', desc: 'Practical workshops and mentorship to build confident farm operators.' },
  { isCore: false, icon: BookOpen, tag: 'Learning', title: 'Farm Mentorship', short: '1-on-1 guidance from veterans.', desc: 'Partner with experienced farm managers who guide you through your first production cycles.' },
  { isCore: false, icon: TrendingUp, tag: 'Learning', title: 'Internships', short: 'Practical on-farm experience.', desc: 'Immersive programs for students and new graduates to learn real-world farming.' },
  { isCore: false, icon: FileText, tag: 'Learning', title: 'Certification Courses', short: 'Recognized agricultural qualifications.', desc: 'Structured learning paths covering biosecurity, management, and animal welfare.' },
  { isCore: false, icon: Droplets, tag: 'Learning', title: 'Masterclasses', short: 'Deep dives into specialized topics.', desc: 'Intensive weekend seminars on advanced farming techniques and technologies.' },

  { isCore: true, icon: Coins, tag: 'Finance', title: 'Investment Packages', short: 'Grow your capital through managed agri-investment.', desc: 'Partner with us to fund projects managed by our expert team with agreed profit-sharing.' },
  { isCore: false, icon: Shield, tag: 'Finance', title: 'Farm Insurance', short: 'Protect your flock and assets.', desc: 'Coverage for disease outbreaks, natural disasters, and theft.' },
  { isCore: false, icon: Settings, tag: 'Finance', title: 'Equipment Financing', short: 'Upgrade without breaking the bank.', desc: 'Flexible payment plans for tractors, silos, and automated housing systems.' },
  { isCore: false, icon: FileText, tag: 'Finance', title: 'Grant Assistance', short: 'Access government and NGO funding.', desc: 'Expert help in writing proposals and securing agricultural development grants.' },
  { isCore: false, icon: TrendingUp, tag: 'Finance', title: 'Profit Sharing', short: 'Joint venture farming.', desc: 'Provide the land or capital, and we provide the management for a shared return.' },

  { isCore: true, icon: Package, tag: 'Supply', title: 'Farm Input Supply', short: 'All your inputs from one trusted source.', desc: 'Feeds, vaccines, drugs, feeders, drinkers and equipment — sourced and delivered.', image: '/images/Raafortagro-3.png' },
  { isCore: false, icon: Stethoscope, tag: 'Supply', title: 'Veterinary Drugs', short: 'Authentic medications and vaccines.', desc: 'Cold-chain guaranteed supply of essential veterinary pharmaceuticals.' },
  { isCore: false, icon: Droplets, tag: 'Supply', title: 'Wholesale Disinfectants', short: 'Chemicals for biosecurity.', desc: 'Bulk supply of industrial-grade farm sanitizers and boot-dip chemicals.' },
  { isCore: false, icon: Egg, tag: 'Supply', title: 'Consumables', short: 'Egg trays, crates, and packaging.', desc: 'High-quality, durable packaging materials for the safe transport of your produce.' },
  { isCore: false, icon: Settings, tag: 'Supply', title: 'Farming Tools', short: 'Durable hardware for daily tasks.', desc: 'From wheelbarrows to specialized surgical kits, we stock reliable farm hardware.' },

  { isCore: true, icon: Beef, tag: 'Livestock', title: 'Livestock & Meat', short: 'From pasture to plate — hygienic, fresh, traceable.', desc: 'Professionally processed, packaged and distributed to consumers and businesses.' },
  { isCore: false, icon: TrendingUp, tag: 'Livestock', title: 'Breeding Stock', short: 'Genetically superior animals.', desc: 'Pedigree bulls, rams, and boars to improve the genetic pool of your herd.' },
  { isCore: false, icon: Droplets, tag: 'Livestock', title: 'Dairy Production', short: 'High-yield dairy cows and goats.', desc: 'Sourced dairy livestock with proven records of high milk volume and quality.' },
  { isCore: false, icon: Package, tag: 'Livestock', title: 'Meat Processing', short: 'Custom butchery services.', desc: 'We process your animals to your exact cuts and specifications for retail.' },
  { isCore: false, icon: Truck, tag: 'Livestock', title: 'Live Animal Transport', short: 'Stress-free logistics.', desc: 'Specialized vehicles designed for the safe and humane transport of livestock.' },
];

export const serviceCategories = ['All', ...new Set(servicesCatalog.filter((s) => s.isCore).map((s) => s.tag))];
