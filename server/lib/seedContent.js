import { query } from '../db.js';
import { defaultSiteContent, defaultBlogPosts } from './defaultSiteContent.js';

const FOOTER_SOCIAL_DEFAULTS = {
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  twitterUrl: '',
  youtubeUrl: '',
  whatsappUrl: '',
};

async function migrateFooterSocial() {
  const result = await query(
    `SELECT data FROM site_content WHERE page = $1 AND section = $2`,
    ['global', 'footer'],
  );
  if (!result.rows[0]) return;

  const data = result.rows[0].data;
  let changed = false;
  const next = { ...data };

  for (const [key, value] of Object.entries(FOOTER_SOCIAL_DEFAULTS)) {
    if (!Object.prototype.hasOwnProperty.call(next, key)) {
      next[key] = value;
      changed = true;
    }
  }

  if (!changed) return;

  await query(
    `UPDATE site_content SET data = $1, updated_at = NOW() WHERE page = $2 AND section = $3`,
    [next, 'global', 'footer'],
  );
  console.log('Added social links to site footer.');
}

async function migrateHeroSlidesMobileSrc() {
  const result = await query(
    `SELECT data FROM site_content WHERE page = $1 AND section = $2`,
    ['home', 'hero_slides'],
  );
  if (!result.rows[0]) return;

  const data = result.rows[0].data;
  if (!Array.isArray(data.slides)) return;

  let changed = false;
  const slides = data.slides.map((slide) => {
    if (!Object.prototype.hasOwnProperty.call(slide, 'mobileSrc')) {
      changed = true;
      return { ...slide, mobileSrc: '' };
    }
    return slide;
  });

  if (!changed) return;

  await query(
    `UPDATE site_content SET data = $1, updated_at = NOW() WHERE page = $2 AND section = $3`,
    [{ ...data, slides }, 'home', 'hero_slides'],
  );
  console.log('Added mobile photo field to homepage slider.');
}

async function migrateTrackOrderHeroImage() {
  const result = await query(
    `SELECT data FROM site_content WHERE page = $1 AND section = $2`,
    ['track_order', 'hero'],
  );
  if (!result.rows[0]) return;

  const data = result.rows[0].data;
  if (data.image) return;

  const nextImage = '/images/1-Howo-Cargo-Truck-1.jpg';
  await query(
    `UPDATE site_content SET data = $1, updated_at = NOW() WHERE page = $2 AND section = $3`,
    [{ ...data, image: nextImage }, 'track_order', 'hero'],
  );
  console.log('Set default track order hero image (was empty).');
}

const HERO_SLIDE_DEFAULTS = [
  { src: '/images/Raafortagro-2.png', mobileSrc: '', alt: 'Poultry & Livestock', title: 'LIVESTOCK' },
  { src: '/images/Raafortagro-3.png', mobileSrc: '', alt: 'Agro Chemicals', title: 'CHEMICALS' },
  { src: '/images/Raafortagro.png', mobileSrc: '', alt: 'Farm Equipment', title: 'EQUIPMENT' },
  { src: '/images/a.jpg', mobileSrc: '', alt: 'Sustainable agriculture', title: 'FARMING' },
  { src: '/images/istock-hero.jpg', mobileSrc: '', alt: 'Feed & nutrition', title: 'NUTRITION' },
];

async function migrateHeroSlidesToFive() {
  const result = await query(
    `SELECT data FROM site_content WHERE page = $1 AND section = $2`,
    ['home', 'hero_slides'],
  );
  if (!result.rows[0]) return;

  const data = result.rows[0].data;
  const slides = Array.isArray(data.slides) ? [...data.slides] : [];

  while (slides.length < 5) {
    const template = HERO_SLIDE_DEFAULTS[slides.length] || { src: '', mobileSrc: '', alt: '', title: '' };
    slides.push({ ...template });
  }

  const nextSlides = slides.slice(0, 5).map((slide, i) => ({
    src: slide.src || HERO_SLIDE_DEFAULTS[i]?.src || '',
    mobileSrc: slide.mobileSrc ?? '',
    alt: slide.alt || HERO_SLIDE_DEFAULTS[i]?.alt || '',
    title: slide.title || HERO_SLIDE_DEFAULTS[i]?.title || '',
  }));

  if (JSON.stringify(data.slides) === JSON.stringify(nextSlides)) return;

  await query(
    `UPDATE site_content SET data = $1, updated_at = NOW() WHERE page = $2 AND section = $3`,
    [{ ...data, slides: nextSlides }, 'home', 'hero_slides'],
  );
  console.log('Homepage product slider set to 5 photos.');
}

export async function seedSiteContent() {
  let inserted = 0;
  for (const row of defaultSiteContent) {
    const result = await query(
      `INSERT INTO site_content (page, section, data)
       VALUES ($1, $2, $3)
       ON CONFLICT (page, section) DO NOTHING
       RETURNING page`,
      [row.page, row.section, row.data],
    );
    if (result.rows[0]) inserted += 1;
  }
  if (inserted > 0) {
    console.log(`Seeded ${inserted} new site content section(s).`);
  }
  await migrateHeroSlidesMobileSrc();
  await migrateHeroSlidesToFive();
  await migrateFooterSocial();
  await migrateTrackOrderHeroImage();
}

export async function seedBlogPosts() {
  const count = (await query('SELECT COUNT(*)::int AS c FROM blog_posts')).rows[0].c;
  if (count > 0) return;

  for (const p of defaultBlogPosts) {
    await query(
      `INSERT INTO blog_posts (id, title, excerpt, body, image, post_date, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [p.id, p.title, p.excerpt, p.body, p.image, p.date, p.published],
    );
  }
  console.log(`Seeded ${defaultBlogPosts.length} blog posts.`);
}
