import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { externalImageUrl } from '../lib/api.js';
import { industryNewsError, loadIndustryNews } from '../lib/newsClient.js';

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const data = await loadIndustryNews();
        setNews(data.items || []);
      } catch (err) {
        console.error('News error:', err);
        setError(industryNewsError(err));
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) return <div className="p-6 bg-white rounded-2xl shadow-sm border border-border flex items-center justify-center min-h-[200px]"><span className="text-sm text-text-muted">Loading latest news...</span></div>;
  if (error) return <div className="p-6 bg-white rounded-2xl shadow-sm border border-border flex items-center justify-center min-h-[200px]"><span className="text-sm text-red-500">{error}</span></div>;
  if (news.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
      <h3 className="text-sm font-semibold text-charcoal mb-4 uppercase tracking-wider">Industry News</h3>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {news.map((item, index) => (
          <Link
            key={index}
            to={`/news/article?url=${encodeURIComponent(item.link || item.url)}`}
            className="block p-3 rounded-xl border border-transparent hover:bg-cream hover:border-border transition-colors group"
          >
            <div className="flex gap-4">
              {(item.image || item.imageUrl) && (
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 hidden sm:block">
                  <img src={externalImageUrl(item.image || item.imageUrl)} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-charcoal group-hover:text-forest line-clamp-2 mb-1">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="truncate">{item.source}</span>
                  <span>•</span>
                  <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
