import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPost, posts as allFallbackPosts } from '../data/blog.js';
import { cardImageForPost } from '../data/blogCardImages.js';
import { getRelatedPosts } from '../data/blogRelated.js';
import { contentApi } from '../lib/api.js';
import { enhanceBlogHtml } from '../lib/enhanceBlogHtml.js';
import usePageMeta from '../hooks/usePageMeta.js';

const articleStyles = `
  .ra-article-body h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1a2e1a;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }
  .ra-article-body h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a2e1a;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }
  .ra-article-body p {
    margin-bottom: 1.25rem;
    line-height: 1.85;
    color: #2d3a2d;
    font-size: 1.0625rem;
    max-width: none;
  }
  @media (min-width: 1024px) {
    .ra-article-body p { font-size: 1.125rem; }
    .ra-article-body h2 { font-size: 1.75rem; }
    .ra-article-body h3 { font-size: 1.375rem; }
  }
  .ra-article-body strong { font-weight: 700; color: #1a2e1a; }
  .ra-article-body a { color: #2d6a2d; font-weight: 600; }
  .ra-article-body ul, .ra-article-body ol {
    margin: 1rem 0 1.25rem 1.5rem;
    line-height: 1.8;
    color: #2d3a2d;
  }
  .ra-article-body li { margin-bottom: 0.4rem; }
  .ra-article-body table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.9rem;
  }
  .ra-article-body th, .ra-article-body td {
    border: 1px solid #d4e4d4;
    padding: 0.6rem 0.75rem;
    text-align: left;
  }
  .ra-article-body th { background: #f0f7f0; font-weight: 700; color: #1a2e1a; }
  .ra-article-body::after {
    content: '';
    display: table;
    clear: both;
  }
  .ra-article-body .ra-img-wrap {
    margin: 1.25rem 0 1.5rem;
    border-radius: 0.75rem;
    overflow: hidden;
    background: #f4f8f4;
    border: 1px solid #d4e4d4;
    box-shadow: 0 1px 3px rgba(26, 46, 26, 0.06);
  }
  .ra-article-body .ra-img-wrap img {
    width: 100%;
    height: auto;
    display: block;
    vertical-align: middle;
  }
  .ra-article-body .ra-img-wrap figcaption {
    padding: 0.5rem 0.85rem 0.65rem;
    font-size: 0.8125rem;
    line-height: 1.45;
    color: #5a6b5a;
    background: #f4f8f4;
    border-top: 1px solid #e0ebe0;
  }
  .ra-article-body .ra-img-wrap.ra-img-left {
    float: left;
    width: min(44%, 22rem);
    margin: 0.35rem 1.75rem 1rem 0;
  }
  .ra-article-body .ra-img-wrap.ra-img-right {
    float: right;
    width: min(44%, 22rem);
    margin: 0.35rem 0 1rem 1.75rem;
  }
  .ra-article-body .ra-img-wrap.ra-img-center {
    float: none;
    width: 100%;
    max-width: 52rem;
    margin-left: auto;
    margin-right: auto;
    clear: both;
  }
  .ra-article-body .ra-img-wrap.ra-img-wide {
    float: none;
    width: 100%;
    max-width: none;
    clear: both;
    margin: 2rem 0;
  }
  .ra-article-body .ra-img-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 2rem 0;
    clear: both;
  }
  .ra-article-body .ra-img-grid .ra-img-wrap {
    margin: 0;
    float: none;
    width: 100%;
    max-width: none;
  }
  @media (max-width: 768px) {
    .ra-article-body .ra-img-wrap.ra-img-left,
    .ra-article-body .ra-img-wrap.ra-img-right {
      float: none;
      width: 100%;
      max-width: none;
      margin: 1.25rem 0;
    }
    .ra-article-body .ra-img-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function RelatedArticleCard({ item }) {
  const thumb = item.image || cardImageForPost(item.id);
  return (
    <Link
      to={`/blog/${item.id}`}
      className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/60 shadow-sm hover:shadow-lg hover:shadow-charcoal/5 transition-shadow duration-200"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-beige-soft">
        <img
          src={thumb}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 text-left">
        <h3 className="font-display font-bold text-charcoal text-sm leading-snug mb-1 line-clamp-2">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2 m-0 flex-1">{item.excerpt}</p>
        )}
        <span className="inline-block mt-2 text-xs font-semibold text-forest group-hover:underline">
          Read more →
        </span>
      </div>
    </Link>
  );
}

function RelatedArticles({ items }) {
  if (!items?.length) return null;

  return (
    <section className="mt-16 sm:mt-20 pt-8 border-t border-border/60 w-full" aria-labelledby="related-blog-heading">
      <div className="text-center sm:text-left mb-6 sm:mb-8">
        <span className="text-sm text-text/60 mb-1 block">From our blog</span>
        <h2 id="related-blog-heading" className="font-display text-2xl sm:text-3xl font-bold text-charcoal">
          Related articles
        </h2>
      </div>

      {/* Mobile: horizontal scroll (matches product detail related products) */}
      <div className="flex sm:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-none snap-x snap-mandatory text-left">
        {items.map((item) => (
          <div key={item.id} className="w-[45vw] max-w-[200px] shrink-0 snap-start">
            <RelatedArticleCard item={item} />
          </div>
        ))}
      </div>

      {/* Tablet/desktop: grid */}
      <ul className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none m-0 p-0 max-w-5xl">
        {items.map((item) => (
          <li key={item.id}>
            <RelatedArticleCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BlogPost() {
  const { id } = useParams();
  const fallback = getPost(id);
  const [post, setPost] = useState(fallback ? { ...fallback, body: fallback.body || '' } : null);
  const [related, setRelated] = useState(() => (id ? getRelatedPosts(id) : []));
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    contentApi
      .blogPost(id)
      .then((r) => {
        if (r.post) setPost(r.post);
        if (r.related?.length) {
          setRelated(r.related);
        } else if (r.post?.id) {
          const fromList = allFallbackPosts.length
            ? getRelatedPosts(r.post.id)
            : [];
          if (fromList.length) setRelated(fromList);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  usePageMeta(post?.title, post?.excerpt);

  if (loading && !post) {
    return (
      <div className="py-16 flex justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-2 border-forest/20 border-t-forest animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-charcoal">Post not found.</p>
        <Link to="/blog" className="text-forest font-semibold mt-4 inline-block">
          Back to blog
        </Link>
      </div>
    );
  }

  const hasBody = post.body && post.body.replace(/<[^>]+>/g, '').trim().length > 80;
  const articleHtml = hasBody ? enhanceBlogHtml(post.body) : '';
  const heroImage = post.image || cardImageForPost(post.id);

  return (
    <motion.article
      className="flex-1 flex flex-col bg-beige-soft/30 py-8 sm:py-10 md:py-12 min-h-[calc(100dvh-8rem)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <style>{articleStyles}</style>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        <Link
          to="/blog"
          className="inline-block text-sm text-forest font-semibold mb-4 min-h-[44px] flex items-center shrink-0"
        >
          ← Back to blog
        </Link>
        <header className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border/60">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] font-bold text-charcoal mb-3 leading-tight">
            {post.title}
          </h1>
          {post.date && (
            <p className="text-sm sm:text-base text-text/70">
              {new Date(post.date).toLocaleDateString('en-GH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </header>
        {heroImage && (
          <figure className="ra-img-wrap ra-img-wide mb-8 sm:mb-10">
            <img src={heroImage} alt="" loading="eager" />
          </figure>
        )}
        <div className="flex-1 w-full">
          {hasBody ? (
            <div className="ra-article-body w-full" dangerouslySetInnerHTML={{ __html: articleHtml }} />
          ) : (
            <div className="text-base sm:text-lg lg:text-xl leading-relaxed text-charcoal">
              <p className="font-medium mb-5">{post.excerpt}</p>
              <p className="text-text">
                Raafortagro works with farmers every day to improve flock health and farm economics.
                For product availability and delivery, visit our{' '}
                <Link to="/shop" className="text-forest font-semibold">
                  shop
                </Link>{' '}
                or{' '}
                <Link to="/contact" className="text-forest font-semibold">
                  contact us
                </Link>
                .
              </p>
            </div>
          )}
        </div>
        <RelatedArticles items={related} />
      </div>
    </motion.article>
  );
}
