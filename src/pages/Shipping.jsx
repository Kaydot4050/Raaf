import LegalPage from '../components/ui/LegalPage.jsx';

const sections = [
  {
    title: 'Delivery areas',
    body: 'We deliver across Ghana. Live birds and temperature-sensitive products are routed through climate-aware logistics with scheduled windows.',
  },
  {
    title: 'Live animal transport',
    list: [
      'Day-old chicks and pullets travel in ventilated, disinfected crates',
      'Delivery dates are confirmed 24–48 hours in advance when possible',
      'Receiver must be available to accept live orders at the farm gate',
    ],
  },
  {
    title: 'Feed & equipment',
    body: 'Bulk feed and equipment orders are palletised or bagged for depot or farm-gate delivery. Lead times depend on stock and your region.',
  },
  {
    title: 'Shipping costs',
    body: 'Shipping is quoted at checkout based on distance, order weight, and product type. Live-animal freight may differ from standard feed delivery rates.',
  },
];

export default function Shipping() {
  return (
    <LegalPage
      eyebrow="Support"
      title="Shipping & delivery"
      description="How we get your order from our hatchery and warehouses to your farm."
      sections={sections}
    />
  );
}
