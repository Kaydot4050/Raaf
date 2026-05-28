import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts as fallback } from '../data/blog.js';
import { contentApi } from '../lib/api.js';
import SectionTitle from '../components/SectionTitle.jsx';

export default function Blog() {
  const [posts, setPosts] = useState(fallback);

  useEffect(() => {
    contentApi.blog().then((r) => {
      if (r.posts?.length) setPosts(r.posts);
    }).catch(() => {});
  }, []);

  return (
    <div className="py-12 sm:py-16 md:py-20 min-h-[50vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="BLOG" title="Latest posts" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={`/blog/${post.id}`} className="block aspect-[16/10] overflow-hidden">
                <img src={post.image} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </Link>
              <div className="p-5">
                <h2 className="text-lg font-bold text-heading mb-2">
                  <Link to={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-text leading-relaxed mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-sm font-semibold text-forest hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
