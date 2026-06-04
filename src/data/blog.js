import { blogCardImages } from './blogCardImages.js';

const featuredPosts = [
  {
    id: 'brooding-and-chicks-ghana-guide',
    title: 'Brooding & Day-Old Chicks: Setup, Health Checks, and Breed Choice in Ghana',
    date: '2026-06-04',
    excerpt:
      'Brooder checklists for 100 and 500 chicks, delivery-day counts, water and feed in week one, vaccination timing, Ross 308 breed choice, and rainy-season brooding in Ghana.',
    image: blogCardImages['brooding-and-chicks-ghana-guide'],
  },
  {
    id: 'starter-grower-finisher-feed-ghana',
    title: 'Starter, Grower, and Finisher Feed: When to Switch in Ghana',
    date: '2026-05-28',
    excerpt:
      'Broiler and layer feed phases explained for Ghanaian farms—protein targets, switch dates, and costly mistakes when you change ration too early or too late.',
    image: blogCardImages['starter-grower-finisher-feed-ghana'],
  },
  {
    id: 'store-poultry-feed-rainy-season-ghana',
    title: 'How to Store Poultry Feed So It Does Not Mold in Rainy Season',
    date: '2026-05-20',
    excerpt:
      'Pallets, ventilation, first-in-first-out, and signs of spoiled mash—practical feed storage for April–July rains in Ghana.',
    image: blogCardImages['store-poultry-feed-rainy-season-ghana'],
  },
  {
    id: 'common-poultry-diseases-ghana-early-signs',
    title: 'Common Poultry Diseases in Ghana: Early Warning Signs',
    date: '2026-05-12',
    excerpt:
      'Newcastle, Gumboro, coccidiosis, and E. coli flare-ups—what to watch in the brooder and grow-out house before mortality spikes.',
    image: blogCardImages['common-poultry-diseases-ghana-early-signs'],
  },
  {
    id: 'goat-feed-ratios-smallholders-ghana',
    title: 'Goat Feed Ratios for Smallholders in Ghana',
    date: '2026-05-05',
    excerpt:
      'Forage, supplement, and water for West African Dwarf and crossbred goats—daily amounts that match rainy and dry season grazing.',
    image: blogCardImages['goat-feed-ratios-smallholders-ghana'],
  },
  {
    id: 'chick-delivery-day-counting-mortality-claims-ghana',
    title: 'Delivery Day: Counting Chicks, Settling, and Mortality Claims',
    date: '2026-04-22',
    excerpt:
      'Same-day DOA counts, photos, heat and water timing, and how to file replacement claims with hatcheries and distributors in Ghana.',
    image: blogCardImages['chick-delivery-day-counting-mortality-claims-ghana'],
  },
];

const legacyPosts = [
  {
    id: 'why-balanced-feeding-is-key-to-animal-health',
    title: 'Why Balanced Feeding Is Key to Animal Health',
    date: '2025-09-12',
    excerpt:
      'The right feed mix supports growth, immunity, and long-term productivity across poultry and livestock.',
    image: blogCardImages['why-balanced-feeding-is-key-to-animal-health'],
  },
  {
    id: 'getting-the-best-start-with-day-old-chicks',
    title: 'Getting the Best Start with Day-Old Chicks',
    date: '2025-08-28',
    excerpt:
      'Brooding temperature, clean water, and early nutrition set the foundation for a healthy flock.',
    image: blogCardImages['getting-the-best-start-with-day-old-chicks'],
  },
  {
    id: 'why-quality-chicks-and-feeds-matter-for-every-farmer',
    title: 'Why Quality Chicks and Feeds Matter for Every Farmer',
    date: '2025-08-05',
    excerpt:
      'Investing in trusted genetics and feed reduces mortality and improves your bottom line.',
    image: blogCardImages['why-quality-chicks-and-feeds-matter-for-every-farmer'],
  },
  {
    id: 'livestock-feed-management',
    title: 'Livestock Feed Management Basics',
    date: '2025-07-18',
    excerpt:
      'Practical tips for ration planning, storage, and seasonal adjustments on the farm.',
    image: blogCardImages['livestock-feed-management'],
  },
];

export const posts = [
  ...featuredPosts,
  ...legacyPosts.filter((p) => !featuredPosts.some((n) => n.id === p.id)),
];

export function getPost(id) {
  return posts.find((p) => p.id === id);
}
