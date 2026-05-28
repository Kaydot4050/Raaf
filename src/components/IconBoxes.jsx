import { Truck, Headphones, BadgePercent, Leaf, ShieldCheck } from 'lucide-react';
import { RevealGrid, RevealItem } from './ui/SectionReveal.jsx';

const items = [
  { title: 'Nationwide delivery', desc: 'Livestock & supplies to your farm gate', icon: Truck },
  { title: 'Expert support', desc: 'Guidance when you need it most', icon: Headphones },
  { title: 'Fair farm pricing', desc: 'Value without compromising quality', icon: BadgePercent },
  { title: 'Farm-fresh stock', desc: 'Healthy birds from trusted genetics', icon: Leaf },
  { title: 'Quality assured', desc: 'Standards you can rely on', icon: ShieldCheck },
];

export default function IconBoxes() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <RevealItem
                key={item.title}
                index={i}
                className="group p-6 rounded-2xl bg-beige-soft/80 border border-beige-dark/20 hover:border-forest/20 hover:shadow-lg hover:shadow-forest/5 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-forest/10 text-forest mb-4 group-hover:bg-forest group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </span>
                <h3 className="font-display font-semibold text-charcoal text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </RevealItem>
            );
          })}
        </RevealGrid>
      </div>
    </section>
  );
}
