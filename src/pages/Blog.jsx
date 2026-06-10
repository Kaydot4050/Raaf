import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts as fallback } from '../data/blog.js';
import { cardImageForPost } from '../data/blogCardImages.js';
import { contentApi, externalApi, externalImageUrl } from '../lib/api.js';
import SectionTitle from '../components/SectionTitle.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

const GHANA_FLAG = '/images/ghana-flag.png';
const AFRICA_MAP = '/images/africa-map.png';

const REGIONS = [
  { id: 'all', label: 'All news' },
  { id: 'ghana', label: 'Ghana', icon: GHANA_FLAG, iconStyle: 'flag' },
  { id: 'africa', label: 'Africa', icon: AFRICA_MAP, iconStyle: 'map' },
  { id: 'global', label: 'Global', emoji: '🌎' },
];

const CATEGORIES = [
  { id: 'all', label: 'All topics' },
  { id: 'poultry', label: 'Poultry' },
  { id: 'disease', label: 'Disease alerts' },
  { id: 'market', label: 'Market prices' },
  { id: 'livestock', label: 'Livestock' },
  { id: 'crops', label: 'Crops' },
  { id: 'equipment', label: 'Farm tech' },
];

const REGION_META = {
  ghana: { label: 'Ghana', icon: GHANA_FLAG, iconStyle: 'flag', accent: 'border-l-[#ce1126]' },
  africa: { label: 'Africa', icon: AFRICA_MAP, iconStyle: 'map', accent: 'border-l-forest' },
  global: { label: 'Global', emoji: '🌎', accent: 'border-l-forest-muted' },
};

function regionIconClass(size, style) {
  if (style === 'flag') {
    if (size === 'lg') return 'h-5 w-7 rounded-sm object-cover';
    if (size === 'md') return 'h-4 w-5 rounded-sm object-cover';
    return 'h-3.5 w-5 rounded-sm object-cover';
  }
  if (size === 'lg') return 'h-5 w-5 object-contain';
  if (size === 'md') return 'h-4 w-4 object-contain';
  return 'h-3.5 w-3.5 object-contain';
}

function RegionMark({ region, size = 'sm', className = '' }) {
  const meta = REGION_META[region];
  if (!meta) return null;
  if (meta.icon) {
    return (
      <img
        src={meta.icon}
        alt=""
        className={`${regionIconClass(size, meta.iconStyle)} shrink-0 ${className}`}
      />
    );
  }
  return <span className={`shrink-0 ${className}`}>{meta.emoji}</span>;
}

function RegionLabel({ region, size = 'sm', className = '' }) {
  const meta = REGION_META[region] || REGION_META.global;
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <RegionMark region={region} size={size} />
      <span>{meta.label}</span>
    </span>
  );
}

const CATEGORY_COLORS = {
  Poultry: 'bg-amber-50 text-amber-900 ring-amber-200/60',
  'Disease Alerts': 'bg-red-50 text-red-900 ring-red-200/60',
  'Market Prices': 'bg-emerald-50 text-emerald-900 ring-emerald-200/60',
  Livestock: 'bg-orange-50 text-orange-900 ring-orange-200/60',
  Crops: 'bg-lime-50 text-lime-900 ring-lime-200/60',
  'Farm Equipment': 'bg-sky-50 text-sky-900 ring-sky-200/60',
  Agriculture: 'bg-beige-soft text-charcoal ring-border',
};

function NewsCard({ item, index }) {
  const date = item.publishedAt || item.pubDate;
  const image = externalImageUrl(item.image || item.imageUrl);
  const summary = item.summary || item.contentSnippet;
  const link = item.url || item.link;
  const region = REGION_META[item.region] || REGION_META.global;
  const catClass = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Agriculture;

  return (
    <motion.article
      className={`group bg-white rounded-2xl overflow-hidden border border-border/80 hover:border-forest/25 hover:shadow-md transition-all duration-300 flex flex-col ${!image ? `border-l-4 ${region.accent}` : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      {image ? (
        <Link to={`/news/article?url=${encodeURIComponent(link)}`} className="relative block aspect-[16/10] overflow-hidden shrink-0 bg-beige-soft">
          <img src={image} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wide text-white/95">
            <RegionLabel region={item.region} size="md" className="drop-shadow-sm" />
          </span>
        </Link>
      ) : null}
      <div className={`p-5 flex-1 flex flex-col ${image ? '' : 'pt-4'}`}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {!image ? (
            <RegionLabel region={item.region} className="text-[10px] font-bold uppercase tracking-wide text-forest" />
          ) : null}
          {item.category ? (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${catClass}`}>
              {item.category}
            </span>
          ) : null}
        </div>
        <div className="text-[11px] text-text-muted mb-2.5 font-medium truncate">
          {item.source}
          <span className="mx-1.5 text-border">·</span>
          {date ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
        </div>
        <h2 className="text-base sm:text-lg font-bold text-heading mb-2 leading-snug">
          <Link to={`/news/article?url=${encodeURIComponent(link)}`} className="hover:text-forest transition-colors line-clamp-3">
            {item.title}
          </Link>
        </h2>
        <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-3 flex-1">
          {summary || 'Open to read the full story.'}
        </p>
        <Link
          to={`/news/article?url=${encodeURIComponent(link)}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-forest group-hover:gap-2 transition-all mt-auto"
        >
          Read article
          <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.article>
  );
}

function NewsFilters({ newsRegion, newsCategory, onFilter }) {
  return (
    <div className="mb-10 space-y-3">
      <div className="flex justify-center">
        <div className="inline-flex w-full max-w-md p-1 rounded-xl bg-white border border-border shadow-sm">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onFilter('region', r.id)}
              className={`flex-1 min-w-0 px-2 sm:px-4 py-2.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                newsRegion === r.id
                  ? 'bg-forest text-white shadow-sm'
                  : 'text-charcoal/70 hover:text-charcoal hover:bg-beige-soft/80'
              }`}
            >
              <span className="truncate flex items-center justify-center gap-1">
                {r.icon ? (
                  <img src={r.icon} alt="" className={`${regionIconClass('sm', r.iconStyle)} shrink-0`} />
                ) : r.emoji ? (
                  <span>{r.emoji}</span>
                ) : null}
                <span>{r.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative -mx-4 sm:mx-0 flex justify-center">
        <div className="flex gap-2 overflow-x-auto px-4 sm:px-0 pb-1 md:overflow-visible md:flex-wrap md:justify-center md:max-w-3xl scrollbar-none snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onFilter('category', c.id)}
              className={`shrink-0 snap-start px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                newsCategory === c.id
                  ? 'bg-charcoal text-white border-charcoal shadow-sm'
                  : 'bg-white text-text-muted border-border hover:border-forest/30 hover:text-charcoal'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsSectionHeader({ title, count, regionKey }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h3 className="font-display text-lg sm:text-xl font-bold text-charcoal shrink-0 inline-flex items-center gap-2">
        {regionKey === 'ghana' || regionKey === 'africa' ? <RegionMark region={regionKey} size="lg" /> : null}
        {title}
      </h3>
      <div className="h-px flex-1 bg-gradient-to-r from-forest/30 to-transparent" />
      {count != null ? (
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-beige-soft px-2.5 py-1 rounded-full">
          {count}
        </span>
      ) : null}
    </div>
  );
}

export default function Blog() {
  usePageMeta('Blog', 'Farm insights, tips, and agricultural news from Raafortagro.');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'blog';
  const newsRegion = searchParams.get('region') || 'all';
  const newsCategory = searchParams.get('category') || 'all';

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
    if (activeTab !== 'news') return;
    setLoadingNews(true);
    setNewsError(null);
    externalApi
      .news({ region: newsRegion, category: newsCategory })
      .then((data) => setNews(data?.items || []))
      .catch((err) => {
        setNewsError(
          err?.message?.includes('Cannot reach') || err?.status === 503
            ? 'Industry news needs the API online. Open api.raafortagro.com/api/health — you should see JSON, not 503.'
            : err?.message || 'Could not load industry news.',
        );
      })
      .finally(() => setLoadingNews(false));
  }, [activeTab, newsRegion, newsCategory]);

  const groupedNews = useMemo(() => {
    if (newsRegion !== 'all') return null;
    return {
      ghana: news.filter((n) => n.region === 'ghana'),
      africa: news.filter((n) => n.region === 'africa'),
      global: news.filter((n) => n.region === 'global'),
    };
  }, [news, newsRegion]);

  const setNewsFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', 'news');
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <div className="py-12 sm:py-16 md:py-20 min-h-[50vh] bg-beige-soft/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Link to={`/blog/${post.id}`} className="block aspect-[16/10] overflow-hidden shrink-0 bg-beige-soft">
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
                    <Link to={`/blog/${post.id}`} className="text-sm font-semibold text-forest hover:underline mt-auto">
                      Read more →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        ) : (
          <>
            <SectionTitle subtitle="NEWS" title="Farm & poultry updates" />

            <NewsFilters newsRegion={newsRegion} newsCategory={newsCategory} onFilter={setNewsFilter} />

            {loadingNews ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-forest/20 border-t-forest animate-spin" />
              </div>
            ) : newsError ? (
              <p className="text-center text-red-600 text-sm py-8 max-w-lg mx-auto">{newsError}</p>
            ) : news.length === 0 ? (
              <p className="text-center text-text-muted py-8">No news articles found for this filter.</p>
            ) : newsRegion === 'all' &&
              groupedNews &&
              (groupedNews.ghana?.length || groupedNews.africa?.length || groupedNews.global?.length) ? (
              <div className="space-y-12">
                {[
                  { key: 'ghana', title: 'Ghana farm news' },
                  { key: 'africa', title: 'Africa farm news' },
                  { key: 'global', title: 'Global agriculture' },
                ].map(({ key, title }) =>
                  groupedNews[key]?.length ? (
                    <section key={key}>
                      <NewsSectionHeader title={title} count={groupedNews[key].length} regionKey={key} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {groupedNews[key].map((item, i) => (
                          <NewsCard key={`${key}-${item.url || item.title}`} item={item} index={i} />
                        ))}
                      </div>
                    </section>
                  ) : null,
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, i) => (
                  <NewsCard key={item.url || item.title || i} item={item} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
