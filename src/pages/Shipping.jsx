import CmsLegalPage from '../components/CmsLegalPage.jsx';

const FALLBACK = {
  eyebrow: 'Support',
  title: 'Shipping & delivery',
  description: 'How we get your order from our hatchery and warehouses to your farm.',
  sections: [
    {
      title: 'Delivery areas',
      body: 'We deliver across Ghana. Live birds and temperature-sensitive products are routed through climate-aware logistics.',
    },
  ],
};

export default function Shipping() {
  return <CmsLegalPage page="shipping" fallback={FALLBACK} />;
}
