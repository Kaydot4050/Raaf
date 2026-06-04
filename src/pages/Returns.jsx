import CmsLegalPage from '../components/CmsLegalPage.jsx';

const FALLBACK = {
  eyebrow: 'Support',
  title: 'Returns & Refunds',
  description: 'Our policy for live products, feed, and equipment orders.',
  sections: [
    {
      title: 'Live Animals',
      body: 'Report transit mortality or visible illness within 24 hours of delivery with photos and your order reference.',
    },
    {
      title: 'Feed & Equipment',
      body: 'Unused feed can be returned within 7 days for a full refund. Equipment must be in original condition and returned within 14 days.',
    },
    {
      title: 'Refund Process',
      body: 'Refunds are processed within 5‑7 business days after we receive the returned items. Funds are returned to the original payment method.',
    },
    {
      title: 'Shipping Costs',
      body: 'If the return is due to product damage or error, we cover return shipping. Otherwise the customer is responsible for shipping costs.',
    },
    {
      title: 'Tracking Returns',
      body: 'All return shipments include a tracking code. Use the “Track Order” page to monitor the status of your return.',
    },
  ],
};

export default function Returns() {
  return <CmsLegalPage page="returns" fallback={FALLBACK} />;
}
