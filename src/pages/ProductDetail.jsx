import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, ChevronLeft, ChevronRight, Facebook, Twitter, Linkedin, X } from 'lucide-react';
import { getProduct, getRelatedProducts, formatPrice } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import Button from '../components/ui/Button.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = getProduct(id);
  const relatedProducts = product ? getRelatedProducts(product, 4) : [];
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
    { id: 'info', label: 'Additional Information' },
    { id: 'review', label: 'Review' },
  ];

  const productImages = product.images?.length > 0 ? product.images : [product.image];
  const [selectedImage, setSelectedImage] = useState(0);

  const prevImage = () => setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  const nextImage = () => setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));

  return (
    <div className="bg-white py-10 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] sm:aspect-square bg-[#f9f9f9] flex items-center justify-center overflow-hidden">
              <img src={productImages[selectedImage]} alt={product.name} className="max-w-full max-h-full object-contain" />
              
              {productImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#f5b041] bg-opacity-90 flex items-center justify-center text-white hover:bg-opacity-100 shadow-sm transition-all">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 flex items-center justify-center text-gray-800 hover:bg-opacity-100 shadow-sm transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto scrollbar-none">
                {productImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square w-[calc(25%-0.75rem)] shrink-0 border transition-all bg-[#f9f9f9] flex items-center justify-center ${
                      selectedImage === idx ? 'border-gray-800' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col pt-2 text-[#555]">
            <span className="text-gray-400 mb-1 text-sm capitalize">{product.category}</span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#333] mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#f5b041]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-sm font-semibold text-gray-500">{product.rating} (245 Review)</span>
            </div>

            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#333]">{formatPrice(product.priceMin, product.priceMax)}</span>
              {product.onSale && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPriceMin, product.originalPriceMax)}</span>
              )}
            </div>
            
            <p className="text-sm leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-2 mb-6">
               <span className="text-sm font-semibold underline cursor-pointer mr-2">Clear</span>
               <X className="w-4 h-4 text-gray-400 cursor-pointer" />
               <span className="text-[#2ecc71] border border-[#2ecc71] bg-[#eafaf1] px-2 py-0.5 text-xs ml-2">In Stock</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex items-center border border-gray-200 bg-white">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">−</button>
                <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">+</button>
              </div>
              <button className="h-10 px-6 sm:px-8 bg-[#4a3525] text-white font-semibold text-sm hover:bg-[#3a2515] transition-colors" onClick={() => { addItem(product, quantity); navigate('/cart'); }}>
                Add To Cart
              </button>
              <button className="h-10 px-6 sm:px-8 bg-[#f5b041] text-white font-semibold text-sm hover:bg-[#e6a23c] transition-colors" onClick={() => { addItem(product, quantity); navigate('/cart'); }}>
                Buy Now
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors bg-white">
                 <Heart className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-sm">
              <p><strong className="text-[#333] font-semibold">SKU : </strong> {product.id.toUpperCase()}</p>
              <p><strong className="text-[#333] font-semibold">Tags : </strong> <span className="capitalize">{product.type}, {product.category}</span></p>
              <div className="flex items-center gap-3">
                 <strong className="text-[#333] font-semibold">Share : </strong>
                 <div className="flex items-center gap-2 text-gray-700">
                   <Facebook className="w-4 h-4 cursor-pointer hover:text-[#333]" />
                   <Twitter className="w-4 h-4 cursor-pointer hover:text-[#333]" />
                   <Linkedin className="w-4 h-4 cursor-pointer hover:text-[#333]" />
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
                <p>There are no reviews yet.</p>
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
                <div key={p.id} className="w-[65vw] sm:w-[40vw] lg:w-[calc(25%-1.125rem)] shrink-0 snap-start">
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
