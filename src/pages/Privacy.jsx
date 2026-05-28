import LegalPage from '../components/ui/LegalPage.jsx';

const sections = [
  {
    title: 'Information we collect',
    body: 'We collect information you provide when placing orders, creating an account, or contacting us — including name, phone, email, farm details, and delivery addresses.',
  },
  {
    title: 'How we use your data',
    list: [
      'Process and deliver orders',
      'Provide customer support and farm advisory',
      'Send order updates and service communications',
      'Improve our products and website',
    ],
  },
  {
    title: 'Sharing',
    body: 'We do not sell your personal data. We may share information with delivery partners and payment processors only as needed to fulfil your order.',
  },
  {
    title: 'Your rights',
    body: 'You may request access, correction, or deletion of your data by contacting us. We retain order records as required for business and legal purposes.',
  },
];

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy"
      description="How Raafort Agro collects, uses, and protects your information."
      sections={sections}
    />
  );
}
