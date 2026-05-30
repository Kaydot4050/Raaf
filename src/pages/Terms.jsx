import CmsLegalPage from '../components/CmsLegalPage.jsx';

const FALLBACK = {
  eyebrow: 'Legal',
  title: 'Terms of service',
  description: 'Terms governing use of our website and agricultural supply services.',
  sections: [
    {
      title: 'Agreement',
      body: 'By using raafortagro.farm and placing orders, you agree to these terms.',
    },
  ],
};

export default function Terms() {
  return <CmsLegalPage page="terms" fallback={FALLBACK} />;
}
