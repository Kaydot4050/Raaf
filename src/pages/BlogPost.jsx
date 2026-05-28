import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPost } from '../data/blog.js';

export default function BlogPost() {
  const { id } = useParams();
  const post = getPost(id);

  if (!post) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-charcoal">Post not found.</p>
        <Link to="/blog" className="text-forest font-semibold mt-4 inline-block">Back to blog</Link>
      </div>
    );
  }

  return (
    <motion.article
      className="py-12 sm:py-16 md:py-20 min-h-[50vh]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-block text-sm text-forest font-semibold mb-4 min-h-[44px] flex items-center">
          ← Back to blog
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-4 sm:mb-6">{post.title}</h1>
        <img src={post.image} alt="" className="w-full max-h-[min(50vw,280px)] sm:max-h-[400px] object-cover rounded-2xl mb-5" />
        <p className="text-base sm:text-lg font-medium text-charcoal mb-5 leading-relaxed">{post.excerpt}</p>
        <p className="text-sm sm:text-base text-text leading-relaxed">
          Raafortagro works with farmers every day to improve flock health and farm economics.
          For product availability and delivery, visit our{' '}
          <Link to="/shop" className="text-forest font-semibold">shop</Link> or{' '}
          <Link to="/contact" className="text-forest font-semibold">contact us</Link>.
        </p>
      </div>
    </motion.article>
  );
}
