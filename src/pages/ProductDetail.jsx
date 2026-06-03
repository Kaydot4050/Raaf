import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ChevronLeft, ChevronRight, Facebook, Twitter, Linkedin, ChevronDown } from 'lucide-react';
import { getProduct, formatPrice } from '../data/products.js';
import { enrichProduct, getProductGallery } from '../lib/productImages.js';
import { useGalleryHover } from '../hooks/useGalleryHover.js';
import { useProducts } from '../hooks/useProducts.js';
import { useCart } from '../context/CartContext.jsx';
import { productsApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAccount } from '../context/AccountContext.jsx';
import Button from '../components/ui/Button.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useAccount();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setLoadingProduct(true);
    setSelectedImage(0);
    const fallback = enrichProduct(getProduct(id));
    productsApi
      .get(id)
      .then((r) => setProduct(enrichProduct(r.product) || fallback))
      .catch(() => setProduct(fallback))
      .finally(() => setLoadingProduct(false));
  }, [id]);

  const { products: catalog } = useProducts();
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return catalog.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  }, [catalog, product]);

  const productImages = useMemo(() => getProductGallery(product), [product]);
  const {
    activeImageIndex,
    galleryHovered,
    hoverImageIndex,
    setHoverImageIndex,
    galleryHoverHandlers,
  } = useGalleryHover(productImages, selectedImage);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      productsApi.getReviews(id).then(data => {
        if (data.reviews) setReviews(data.reviews);
      }).catch(err => console.error("Failed to load reviews:", err));
    }
  }, [id]);

  useEffect(() => {
    if (user?.name) {
      setReviewForm(prev => ({ ...prev, userName: user.name }));
    }
  }, [user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.userName.trim()) return showToast('Please enter your name.', 'error');
    setSubmittingReview(true);
    try {
      await productsApi.addReview(id, reviewForm);
      showToast('Review submitted successfully! It will appear once approved by an admin.', 'success');
      setReviewForm({ userName: '', rating: 5, comment: '' });
    } catch (err) {
      showToast(err.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 text-center text-text-muted">
        Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <p className="p-4 rounded-xl border-l-4 border-forest bg-forest/5 text-charcoal">Product not found.</p>
        <Link to="/shop" className="text-forest font-semibold mt-4 inline-block">Return to shop</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'info', label: 'Additional Information' },
    { id: 'review', label: 'Review' },
  ];

  const prevImage = () => setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  const nextImage = () => setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));

  return (
    <div className="bg-white py-10 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div
              className="relative aspect-square sm:aspect-square bg-[#f9f9f9] overflow-hidden rounded-xl"
              {...galleryHoverHandlers}
            >
              {productImages.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={i === activeImageIndex ? product.name : `${product.name} view ${i + 1}`}
                  className={`absolute inset-0 m-auto max-w-[80%] max-h-[80%] w-auto h-auto object-contain transition-opacity duration-300 ease-out ${
                    i === activeImageIndex ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
                  }`}
                />
              ))}
              
              {productImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-[#f5b041] bg-opacity-90 flex items-center justify-center text-white hover:bg-opacity-100 shadow-sm transition-all rounded-full">
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-90 flex items-center justify-center text-gray-800 hover:bg-opacity-100 shadow-sm transition-all rounded-full">
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    onMouseEnter={() => {
                      setSelectedImage(idx);
                      setHoverImageIndex(idx);
                    }}
                    className={`aspect-square w-16 sm:w-[calc(25%-0.75rem)] shrink-0 border transition-all duration-200 bg-[#f9f9f9] flex items-center justify-center rounded-lg ${
                      (galleryHovered ? hoverImageIndex : selectedImage) === idx
                        ? 'border-gray-800'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="max-w-[70%] max-h-[70%] object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forest mb-2 capitalize">
              {product.category}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="flex text-star">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-star text-star' : 'text-border'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-charcoal">{product.rating.toFixed(1)}</span>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  product.inStock
                    ? 'bg-forest/10 text-forest border border-forest/25'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {product.inStock ? 'In stock' : 'Out of stock'}
              </span>
            </div>

            <div className="mb-5 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold text-charcoal">
                {formatPrice(product.priceMin, product.priceMax)}
              </span>
              {product.onSale && product.originalPriceMin && (
                <span className="text-sm text-text-muted line-through">
                  {formatPrice(product.originalPriceMin, product.originalPriceMax)}
                </span>
              )}
            </div>

            <p className="text-sm text-text leading-relaxed mb-6">{product.description}</p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm font-semibold text-charcoal">Quantity</span>
                <div className="flex items-center rounded-full border border-border bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-charcoal/70 hover:bg-beige-soft transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold text-sm text-charcoal tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-charcoal/70 hover:bg-beige-soft transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className={`h-11 w-11 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                    isInWishlist(product.id)
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-border bg-white text-charcoal hover:border-forest/40 hover:text-forest'
                  }`}
                  title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                      return;
                    }
                    toggleWishlist(product.id);
                  }}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="w-full justify-center"
                  disabled={!product.inStock}
                  onClick={() => {
                    addItem(product, quantity);
                    showToast('Added to cart');
                  }}
                >
                  Add to cart
                </Button>
                <Button
                  type="button"
                  variant="forest"
                  size="md"
                  className="w-full justify-center"
                  disabled={!product.inStock}
                  onClick={() => {
                    addItem(product, quantity);
                    navigate('/cart');
                  }}
                >
                  Buy now
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border text-xs text-text-muted">
                  <span className="font-semibold text-charcoal">SKU</span>
                  {product.id.toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border text-xs text-text-muted capitalize">
                  <span className="font-semibold text-charcoal">Tags</span>
                  {product.type}, {product.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">Share</span>
                <div className="flex items-center gap-2">
                  {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-9 h-9 rounded-full border border-border bg-white flex items-center justify-center text-charcoal/70 hover:text-forest hover:border-forest/30 transition-colors"
                      aria-label="Share"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex justify-center border-b border-gray-200 mb-8 gap-8 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-base whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'text-[#333] font-bold border-b-2 border-[#333]' : 'text-gray-400 font-medium hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-[#555] leading-relaxed">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>{product.description}</p>
              </motion.div>
            )}
            
            {activeTab === 'info' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                <table className="w-full text-left border-collapse border border-gray-100">
                  <thead>
                    <tr className="bg-[#f5b041]">
                      <th className="p-3 font-semibold text-white border-r border-[#e0a03a] w-1/3">Feature</th>
                      <th className="p-3 font-semibold text-white">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 border-r border-gray-100 text-gray-600">Category</td>
                      <td className="p-3 font-semibold text-[#333] capitalize">{product.category}</td>
                    </tr>
                    <tr className="bg-[#f9f9f9] border-b border-gray-100">
                      <td className="p-3 border-r border-gray-100 text-gray-600">Stock Status</td>
                      <td className="p-3 font-semibold text-[#333]">{product.inStock ? 'Available' : 'Unavailable'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 border-r border-gray-100 text-gray-600">Rating</td>
                      <td className="p-3 font-semibold text-[#333]">{product.rating} / 5</td>
                    </tr>
                    <tr className="bg-[#f9f9f9] border-b border-gray-100">
                      <td className="p-3 border-r border-gray-100 text-gray-600">Type</td>
                      <td className="p-3 font-semibold text-[#333] capitalize">{product.type}</td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}
            
            {activeTab === 'review' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8">
                  <h3 className="font-bold text-lg text-charcoal mb-4">Customer Reviews</h3>
                  {reviews.length === 0 ? (
                    <p>There are no reviews yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-charcoal">{review.user_name}</span>
                            <div className="flex text-[#f5b041]">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400 ml-auto">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-2">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="flex items-center justify-between w-full text-left font-bold text-lg text-charcoal hover:text-forest transition-colors"
                  >
                    <span>Add a Review</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showReviewForm ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showReviewForm && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      className="mt-6 bg-gray-50 p-6 rounded-xl overflow-hidden"
                    >
                      {!user ? (
                        <div className="text-center py-4">
                          <p className="text-gray-600 mb-4">Please log in to add a review.</p>
                          <Link to="/login" className="inline-block px-6 py-2 bg-forest text-white rounded-lg font-semibold hover:bg-forest-light transition-colors">
                            Log In
                          </Link>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 mb-4">Your review will be checked by an admin before it is published.</p>
                          <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-charcoal mb-1">Your Name *</label>
                              <input 
                                type="text" 
                                required
                                value={reviewForm.userName}
                                onChange={e => setReviewForm({ ...reviewForm, userName: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-forest bg-white/50"
                                placeholder="John Doe"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-charcoal mb-1">Rating *</label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                    className="focus:outline-none transition-colors"
                                  >
                                    <Star 
                                      className={`w-6 h-6 ${star <= reviewForm.rating ? 'fill-[#f5b041] text-[#f5b041]' : 'text-gray-300'}`} 
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-charcoal mb-1">Your Review</label>
                              <textarea 
                                rows={4}
                                value={reviewForm.comment}
                                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-forest resize-none"
                                placeholder="What did you like or dislike?"
                              ></textarea>
                            </div>
                            <Button type="submit" variant="forest" className="w-full" disabled={submittingReview}>
                              {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </Button>
                          </form>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 text-center">
            <span className="text-sm text-gray-500 mb-1 block">Related Products</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#333] mb-8">Explore Related Products</h2>
            <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-none snap-x snap-mandatory text-left">
              {relatedProducts.map((p) => (
                <div key={p.id} className="w-[45vw] sm:w-[40vw] lg:w-[calc(25%-1.125rem)] shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
