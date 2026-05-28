export const posts = [
  {
    id: 'why-balanced-feeding-is-key-to-animal-health',
    title: 'Why Balanced Feeding Is Key to Animal Health',
    date: '2025-09-12',
    excerpt:
      'The right feed mix supports growth, immunity, and long-term productivity across poultry and livestock.',
    image: '/images/Raafortagro-2.png',
  },
  {
    id: 'getting-the-best-start-with-day-old-chicks',
    title: 'Getting the Best Start with Day-Old Chicks',
    date: '2025-08-28',
    excerpt:
      'Brooding temperature, clean water, and early nutrition set the foundation for a healthy flock.',
    image: '/images/a.jpg',
  },
  {
    id: 'why-quality-chicks-and-feeds-matter-for-every-farmer',
    title: 'Why Quality Chicks and Feeds Matter for Every Farmer',
    date: '2025-08-05',
    excerpt:
      'Investing in trusted genetics and feed reduces mortality and improves your bottom line.',
    image: '/images/Raafortagro.png',
  },
  {
    id: 'livestock-feed-management',
    title: 'Livestock Feed Management Basics',
    date: '2025-07-18',
    excerpt:
      'Practical tips for ration planning, storage, and seasonal adjustments on the farm.',
    image: '/images/Raafortagro-3.png',
  },
];

export function getPost(id) {
  return posts.find((p) => p.id === id);
}
