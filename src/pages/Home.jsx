import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HomeHero from '../components/HomeHero.jsx';
import HomeCategories from '../components/HomeCategories.jsx';
import HomeMission from '../components/HomeMission.jsx';
import HomeBottom from '../components/HomeBottom.jsx';
import Testimonials from '../components/Testimonials.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Button from '../components/ui/Button.jsx';
import { SectionHeader, RevealGrid, RevealItem } from '../components/ui/SectionReveal.jsx';
import { posts as fallbackPosts } from '../data/blog.js';
import { cardImageForPost } from '../data/blogCardImages.js';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { usePageSection } from '../context/ContentContext.jsx';
import { useEffect, useState } from 'react';
import { contentApi } from '../lib/api.js';
import usePageMeta from '../hooks/usePageMeta.js';

export default function Home() {
  const { addItem } = useCart();
  usePageMeta('Home', 'Raafortagro — quality poultry, livestock, and farm supplies delivered across Ghana.');
  const { products } = useProducts();
  const { data: featuredCopy } = usePageSection('home', 'featured', {
    title: 'Featured this week',
    subtitle: 'Shop picks',
    description: 'Breeds and inputs our team stocks most often.',
    buttonLabel: 'View all products',
  });
  const { data: blogTeaser } = usePageSection('home', 'blog_teaser', {
    eyebrow: 'Journal',
    title: 'Farm insights',
    subtitle: 'Latest from our blog',
  });
  const [posts, setPosts] = useState(fallbackPosts);

  useEffect(() => {
    contentApi.blog().then((r) => {
      if (r.posts?.length) setPosts(r.posts);
    }).catch(() => {});
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const displayFeatured = featured.length >= 4 ? featured : products.slice(0, 4);

  return (
    <div className="bg-cream">
      <HomeHero />
      <HomeMission />
      <HomeCategories />

      <section className="py-14 sm:py-20 bg-white lg:-mt-2 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={featuredCopy.subtitle || 'Catalog'}
            title={featuredCopy.title || 'Hand-picked for your farm'}
            description={featuredCopy.description}
          />
          <RevealGrid className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayFeatured.map((p, i) => (
              <RevealItem key={p.id} index={i}>
                <ProductCard product={p} onAdd={addItem} />
              </RevealItem>
            ))}
          </RevealGrid>
          <div className="text-center mt-10">
            <Button to="/shop" variant="forest" size="lg">
              {featuredCopy.buttonLabel || 'View all products'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <Testimonials />
      <HomeBottom />

      <section className="py-10 sm:py-20 bg-white mx-4 sm:mx-6 lg:mx-8 mb-8 rounded-card border border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow={blogTeaser.eyebrow || blogTeaser.subtitle}
            title={blogTeaser.title}
            className="!mb-5 sm:!mb-12"
          />
          <RevealGrid className="flex sm:grid gap-4 sm:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post, i) => (
              <RevealItem key={post.id} index={i} className="w-[min(82vw,320px)] sm:w-auto shrink-0 snap-center sm:shrink sm:snap-align-none">
                <article className="group bg-cream rounded-card overflow-hidden h-full flex flex-col">
                  <Link
                    to={`/blog/${post.id}`}
                    className="block h-36 sm:h-auto sm:aspect-[16/10] overflow-hidden bg-beige-soft shrink-0"
                  >
                    <img
                      src={post.image || cardImageForPost(post.id)}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-charcoal text-sm sm:text-base mb-1.5 sm:mb-2 line-clamp-2">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted flex-1 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">{post.excerpt}</p>
                    <Link to={`/blog/${post.id}`} className="text-xs sm:text-sm font-semibold text-forest inline-flex items-center gap-1">
                      Read more <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGrid>
        </div>
      </section>
    </div>
  );
}
