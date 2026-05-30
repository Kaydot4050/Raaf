import CmsLegalPage from '../components/CmsLegalPage.jsx';

const FALLBACK = {
  eyebrow: 'Legal',
  title: 'Privacy policy',
  description: 'How Raafort Agro collects, uses, and protects your information.',
  sections: [
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
  ],
};

export default function Privacy() {
  return <CmsLegalPage page="privacy" fallback={FALLBACK} />;
}
