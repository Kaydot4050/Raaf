import LegalPage from '../components/ui/LegalPage.jsx';

const sections = [
  {
    title: 'Live animals',
    body: 'Due to biosecurity and welfare requirements, live chicks, pullets, and livestock are generally not returnable once accepted in good condition. Report transit mortality or visible illness within 24 hours of delivery with photos and your order reference.',
  },
  {
    title: 'Feed & supplies',
    body: 'Unopened feed bags and unused equipment in original packaging may be eligible for exchange within 7 days if defective or incorrectly supplied. Opened or custom-blended feed cannot be returned.',
  },
  {
    title: 'How to report an issue',
    list: [
      'Contact us with your order ID and delivery date',
      'Provide photos and a brief description of the issue',
      'Our team will assess and offer replacement, credit, or refund where applicable',
    ],
  },
  {
    title: 'Refunds',
    body: 'Approved refunds are processed to the original payment method or as farm account credit within 5–10 business days.',
  },
];

export default function Returns() {
  return (
    <LegalPage
      eyebrow="Support"
      title="Returns & refunds"
      description="Our policy for live products, feed, and equipment orders."
      sections={sections}
    />
  );
}
