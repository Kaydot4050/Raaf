import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import { getProduct, formatPrice } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import Button from '../components/ui/Button.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = getProduct(id);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);

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
    { id: 'info', label: 'Details' },
    { id: 'review', label: 'Reviews' },
  ];

  return (
    <div className="bg-beige-soft/50 py-6 sm:py-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex w-11 h-11 rounded-full bg-white border border-border text-charcoal items-center justify-center shadow-sm hover:bg-beige-soft transition-colors mb-4 sm:mb-6"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <motion.div
          className="grid lg:grid-cols-2 gap-6 lg:gap-10 bg-white p-4 sm:p-6 md:p-8 rounded-2xl mb-6 sm:mb-8 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="rounded-xl overflow-hidden bg-white border border-border/60 aspect-square max-h-[min(70vw,420px)] sm:max-h-none mx-auto lg:mx-0 flex items-center justify-center">
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain p-4 sm:p-6" />
            </div>
          </div>

          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest">{product.category}</span>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-charcoal mt-2 mb-3">{product.name}</h1>
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${product.inStock ? 'bg-forest/10 text-forest' : 'bg-red-100 text-red-600'}`}>
              {product.inStock ? 'In stock' : 'Out of stock'}
            </span>
            <div className="flex items-center gap-1 text-sm mb-4">
              <Star className="w-4 h-4 fill-star text-star" />
              <span className="font-semibold text-charcoal">{product.rating}</span>
            </div>
            <div className="mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-forest">{formatPrice(product.priceMin, product.priceMax)}</span>
              {product.onSale && (
                <span className="text-base text-text-muted line-through ml-2">{formatPrice(product.originalPriceMin, product.originalPriceMax)}</span>
              )}
            </div>
            <p className="text-sm text-text leading-relaxed mb-6">{product.description}</p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-6">
              <div className="inline-flex items-center border border-border rounded-full self-start">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 bg-beige-soft text-lg touch-target">−</button>
                <span className="px-4 text-sm font-semibold min-w-[2.5rem] text-center">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 bg-beige-soft text-lg touch-target">+</button>
              </div>
              <Button className="flex-1 sm:flex-none justify-center" onClick={() => { addItem(product, quantity); navigate('/cart'); }}>
                Add to cart
              </Button>
              <Button variant="dark" className="flex-1 sm:flex-none justify-center" onClick={() => { addItem(product, quantity); navigate('/cart'); }}>
                Buy now
              </Button>
            </div>

            <dl className="pt-4 border-t border-border text-sm space-y-1.5 text-text-muted">
              <div><dt className="inline font-semibold text-charcoal">SKU: </dt><dd className="inline">{product.id.toUpperCase()}</dd></div>
              <div><dt className="inline font-semibold text-charcoal">Type: </dt><dd className="inline capitalize">{product.type}</dd></div>
            </dl>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="flex overflow-x-auto border-b border-border scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 sm:px-6 py-3.5 min-h-[48px] text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  activeTab === tab.id ? 'text-forest border-forest' : 'text-text-muted border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-4 sm:p-6 text-sm text-text leading-relaxed">
            {activeTab === 'description' && <p>{product.description}</p>}
            {activeTab === 'info' && (
              <ul className="space-y-2">
                <li><strong className="text-charcoal">Category:</strong> {product.category}</li>
                <li><strong className="text-charcoal">Rating:</strong> {product.rating}/5</li>
                <li><strong className="text-charcoal">Stock:</strong> {product.inStock ? 'Available' : 'Unavailable'}</li>
              </ul>
            )}
            {activeTab === 'review' && (
              <div className="p-4 rounded-xl bg-beige-soft">
                <p className="font-semibold text-charcoal">Customer review</p>
                <p className="mt-2">Excellent quality — highly recommended for farming.</p>
                <p className="mt-2 text-star font-semibold">★★★★★ 5.0</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
