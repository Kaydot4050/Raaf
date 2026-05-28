import LegalPage from '../components/ui/LegalPage.jsx';

const sections = [
  {
    title: 'Agreement',
    body: 'By using raafortagro.farm and placing orders, you agree to these terms. If you do not agree, please do not use our services.',
  },
  {
    title: 'Products & pricing',
    body: 'Prices shown are indicative and may vary by breed, quantity, and season. Final quotes are confirmed before payment. Live-animal sales are subject to availability and health certification.',
  },
  {
    title: 'Orders & payment',
    list: [
      'Orders are confirmed after we verify stock and delivery feasibility',
      'Payment may be required in full or as a deposit before dispatch',
      'Approved farm accounts may use agreed credit terms',
    ],
  },
  {
    title: 'Limitation of liability',
    body: 'We provide veterinary guidance and quality inputs in good faith. Farm performance depends on many factors beyond our control. Our liability is limited to the value of products or services purchased.',
  },
];

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of service"
      description="Terms governing use of our website and agricultural supply services."
      sections={sections}
    />
  );
}
