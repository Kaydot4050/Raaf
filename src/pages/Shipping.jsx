import CmsLegalPage from '../components/CmsLegalPage.jsx';

const FALLBACK = {
  eyebrow: 'Support',
  title: 'Shipping & Delivery',
  description: 'How we get your order from our hatchery and warehouses to your farm.',
  sections: [
    {
      title: 'Delivery Areas',
      body: 'We deliver across Ghana. Live birds and temperature‑aware logistics.',
    },
    {
      title: 'Shipping Rates',
      body: 'Rates are calculated based on distance and product type. Below is a quick overview:',
      list: [
        'Accra & Greater Accra – GHS 20',
        'Ashanti – GHS 25',
        'Northern – GHS 35',
        'Remote areas – GHS 50',
      ],
    },
    {
      title: 'Delivery Times',
      body: 'Standard deliveries arrive within 3‑5 business days. Express shipping (additional GHS 15) arrives in 1‑2 days for major cities.',
    },
    {
      title: 'Tracking',
      body: 'All orders receive a tracking code via email and SMS. Use the “Track Order” page to view real‑time updates.',
    },
  ],
};

export default function Shipping() {
  return <CmsLegalPage page="shipping" fallback={FALLBACK} />;
}
