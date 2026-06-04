import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { externalApi } from '../lib/api.js';
import Button from '../components/ui/Button.jsx';

/**
 * Post-process Readability HTML:
 * - Promote bold-only paragraphs (<p><strong>...</strong></p>) to styled h3s
 * - Alternate images float left / right
 */
function enhanceArticleHtml(html) {
  if (!html) return '';

  // 1. Promote lone <strong> paragraphs to h3 headings
  let result = html.replace(
    /<p>\s*<strong>([^<]{6,})<\/strong>\s*<\/p>/gi,
    '<h3 class="ra-article-h3">$1</h3>'
  );

  // 2. Alternate image float: odd = left, even = right
  let imgCount = 0;
  result = result.replace(/<img([^>]*)>/gi, (match, attrs) => {
    imgCount++;
    const floatClass = imgCount % 2 === 1 ? 'ra-img-left' : 'ra-img-right';
    return `<img${attrs} class="${floatClass}">`;
  });

  return result;
}

export default function NewsArticle() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!url) {
        setError('No article URL provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [articleData, newsData] = await Promise.all([
          externalApi.newsArticle(url),
          externalApi.news(),
        ]);
        setArticle(articleData);
        if (newsData?.items) {
          setRelated(newsData.items.filter((item) => item.link !== url).slice(0, 4));
        }
      } catch (err) {
        console.error('Article error:', err);
        setError('Could not load the article content.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [url]);

  if (loading) {
    return (
      <div className="py-16 flex justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-2 border-forest/20 border-t-forest animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 min-h-[50vh]">
        <p className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
          {error || 'Failed to load article.'}
        </p>
        <Link to="/blog?tab=news" className="text-forest font-semibold mt-4 inline-block">
          Back to news
        </Link>
      </div>
    );
  }

  const sourceName = new URL(url).hostname.replace(/^www\./, '');
  const enhancedContent = enhanceArticleHtml(article.content);

  return (
    <>
      {/* Scoped article styles */}
      <style>{`
        .ra-article-body h3,
        .ra-article-h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a2e1a;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          display: block;
        }
        .ra-article-body h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1a2e1a;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .ra-article-body p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: #2d3a2d;
          font-size: 1rem;
        }
        .ra-article-body strong,
        .ra-article-body b {
          font-weight: 700;
          color: #1a2e1a;
        }
        .ra-article-body a {
          color: #2d6a2d;
          font-weight: 500;
        }
        .ra-article-body img {
          border-radius: 12px;
          max-width: 48%;
          height: auto;
          margin-bottom: 1rem;
        }
        .ra-article-body .ra-img-left {
          float: left;
          margin-right: 1.5rem;
          margin-top: 0.25rem;
        }
        .ra-article-body .ra-img-right {
          float: right;
          margin-left: 1.5rem;
          margin-top: 0.25rem;
        }
        .ra-article-body::after {
          content: '';
          display: table;
          clear: both;
        }
        @media (max-width: 640px) {
          .ra-article-body img,
          .ra-article-body .ra-img-left,
          .ra-article-body .ra-img-right {
            float: none;
            max-width: 100%;
            margin: 0 0 1rem 0;
          }
        }
        .ra-article-body figure {
          margin: 1.5rem 0;
        }
        .ra-article-body figcaption {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 0.5rem;
          font-style: italic;
        }
        .ra-article-body ul, .ra-article-body ol {
          margin: 1rem 0 1.25rem 1.5rem;
          line-height: 1.8;
        }
        .ra-article-body li { margin-bottom: 0.4rem; }
        .ra-article-body blockquote {
          border-left: 4px solid #2d6a2d;
          margin: 1.5rem 0;
          padding: 0.75rem 1.25rem;
          background: #f0f7f0;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #374737;
        }
      `}</style>

      <div className="relative min-h-[70vh] bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link to="/blog?tab=news" className="inline-flex items-center text-sm text-forest font-semibold mb-6">
            ← Back to news
          </Link>

          <div className="lg:grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-10 xl:gap-16 items-start">

            {/* Main Article */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pb-12 min-w-0"
            >
              {/* Meta bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="bg-beige-soft text-charcoal font-semibold text-sm px-4 py-1.5 rounded-lg shadow-sm">
                    News
                  </span>
                  <div className="flex items-center gap-1.5 text-forest font-medium text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{sourceName}</span>
                  </div>
                </div>
                <span className="text-forest font-medium text-sm">
                  {article.publishedTime
                    ? new Date(article.publishedTime).toLocaleDateString()
                    : 'Recent'}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">
                {article.title}
              </h1>

              {article.byline && (
                <p className="text-sm font-semibold text-text-muted mb-8 uppercase tracking-wider">
                  By {article.byline}
                </p>
              )}

              <div
                className="ra-article-body"
                dangerouslySetInnerHTML={{ __html: enhancedContent }}
              />

              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-text-muted">
                  Original source:{' '}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest font-semibold hover:underline"
                  >
                    {sourceName}
                  </a>
                </p>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="relative lg:sticky lg:top-24">
              <div className="absolute inset-0 bg-beige-soft rounded-[40px] lg:rounded-l-[80px] lg:rounded-br-[40px] -z-10 lg:-mr-[100vw]" />
              <div className="p-6 sm:p-8 lg:pr-0">
                <div className="flex justify-end mb-12">
                  <Button to="/shop" className="bg-[#facc15] hover:bg-[#eab308] text-charcoal shadow-sm border-none">
                    Shop Products
                  </Button>
                </div>

                <h3 className="font-display text-2xl font-bold text-charcoal mb-6">Related Articles</h3>

                <div className="space-y-6">
                  {related.map((item, i) => (
                    <Link
                      key={i}
                      to={`/news/article?url=${encodeURIComponent(item.link)}`}
                      className="flex gap-4 group"
                    >
                      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-white shadow-sm">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-forest/5 text-forest font-bold text-xs">
                            NEWS
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="inline-block bg-teal-400 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1.5 w-max">
                          News
                        </span>
                        <h4 className="text-sm sm:text-base font-semibold text-charcoal group-hover:text-forest transition-colors line-clamp-3 leading-snug">
                          {item.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}
