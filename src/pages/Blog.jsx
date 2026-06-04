import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts as fallback } from '../data/blog.js';
import { cardImageForPost } from '../data/blogCardImages.js';
import { contentApi, externalApi } from '../lib/api.js';
import SectionTitle from '../components/SectionTitle.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function Blog() {
  usePageMeta('Blog', 'Farm insights, tips, and agricultural news from Raafortagro.');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'blog';

  const [posts, setPosts] = useState(fallback);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState(null);

  useEffect(() => {
    contentApi.blog().then((r) => {
      if (r.posts?.length) setPosts(r.posts);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === 'news' && news.length === 0 && !newsError) {
      setLoadingNews(true);
      setNewsError(null);
      externalApi
        .news()
        .then((data) => {
          if (data?.items) setNews(data.items);
        })
        .catch((err) => {
          setNewsError(
            err?.message?.includes('Cannot reach')
              ? 'Industry news needs the API online. Open api.raafortagro.com/api/health — you should see JSON, not 503.'
              : 'Could not load industry news.',
          );
        })
        .finally(() => setLoadingNews(false));
    }
  }, [activeTab, news.length, newsError]);

  return (
    <div className="py-12 sm:py-16 md:py-20 min-h-[50vh] bg-beige-soft/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <WeatherWidget />
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border border-border p-1 rounded-xl shadow-sm">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                activeTab === 'blog' ? 'bg-forest text-white' : 'text-text hover:bg-beige-soft'
              }`}
            >
              Our Blog
            </button>
            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'news' })}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                activeTab === 'news' ? 'bg-forest text-white' : 'text-text hover:bg-beige-soft'
              }`}
            >
              Industry News
            </button>
          </div>
        </div>

        {activeTab === 'blog' ? (
          <>
            <SectionTitle subtitle="BLOG" title="Latest posts" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  className="bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    to={`/blog/${post.id}`}
                    className="block aspect-[16/10] overflow-hidden shrink-0 bg-beige-soft"
                  >
                    <img
                      src={post.image || cardImageForPost(post.id)}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold text-heading mb-2">
                      <Link to={`/blog/${post.id}`} className="hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-text leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-sm font-semibold text-forest hover:underline mt-auto"
                    >
                      Read more →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        ) : (
          <>
            <SectionTitle subtitle="NEWS" title="Industry Updates" />
            {loadingNews ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-forest/20 border-t-forest animate-spin" />
              </div>
            ) : newsError ? (
              <p className="text-center text-red-600 text-sm py-8 max-w-lg mx-auto">{newsError}</p>
            ) : news.length === 0 ? (
              <p className="text-center text-text-muted py-8">No news articles found right now.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, i) => (
                  <motion.article
                    key={i}
                    className="bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    {item.imageUrl && (
                      <Link to={`/news/article?url=${encodeURIComponent(item.link)}`} className="block aspect-[16/10] overflow-hidden shrink-0 bg-gray-100">
                        <img src={item.imageUrl} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </Link>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wide">
                        {item.source} • {new Date(item.pubDate).toLocaleDateString()}
                      </div>
                      <h2 className="text-lg font-bold text-heading mb-2">
                        <Link to={`/news/article?url=${encodeURIComponent(item.link)}`} className="hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-text leading-relaxed mb-4 line-clamp-3 flex-1">
                        {item.contentSnippet || 'Click to read the full article.'}
                      </p>
                      <Link
                        to={`/news/article?url=${encodeURIComponent(item.link)}`}
                        className="text-sm font-semibold text-forest hover:underline mt-auto"
                      >
                        Read full article →
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
