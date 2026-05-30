import CmsLegalPage from '../components/CmsLegalPage.jsx';

const FALLBACK = {
  eyebrow: 'Support',
  title: 'Returns & refunds',
  description: 'Our policy for live products, feed, and equipment orders.',
  sections: [
    {
      title: 'Live animals',
      body: 'Report transit mortality or visible illness within 24 hours of delivery with photos and your order reference.',
    },
  ],
};

export default function Returns() {
  return <CmsLegalPage page="returns" fallback={FALLBACK} />;
}
