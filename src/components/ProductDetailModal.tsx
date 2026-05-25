import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, ShieldCheck, HelpCircle, Star, ArrowRight, Table } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  currency: 'INR' | 'USD' | 'EUR';
  onAddToCart: (p: Product, color: string, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onToggleWishlist,
  isWishlisted,
  currency,
  onAddToCart
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

  const formatPrice = (priceINR: number) => {
    if (currency === 'USD') {
      const converted = Math.round(priceINR * 0.012);
      return `$ ${converted.toLocaleString('en-US')}`;
    }
    if (currency === 'EUR') {
      const converted = Math.round(priceINR * 0.011);
      return `€ ${converted.toLocaleString('en-DE')}`;
    }
    return `₹ ${priceINR.toLocaleString('en-IN')}`;
  };

  const currentPrice = product.discountPriceINR || product.priceINR;

  const handleAdd = () => {
    onAddToCart(product, selectedColor, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="product-detail-backdrop">
        
        {/* Soft elegant backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#121110] backdrop-blur-sm"
        />

        {/* Modal body sheet */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative bg-[#F5F2ED] border border-black/5 rounded-none max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10 shadow-2xl flex flex-col md:flex-row"
          id="product-detail-sheet"
        >
          
          {/* Close button top right */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 border border-black/5 rounded-none hover:bg-stone-50 text-neutral-800 transition-colors z-20 cursor-pointer"
            aria-label="Close product view"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT: Curated Dual Image Stack */}
          <div className="md:w-1/2 p-6 md:p-8 bg-[#EAE7E2] border-b md:border-b-0 md:border-r border-black/5">
            <div className="space-y-4">
              <div className="relative rounded-none overflow-hidden border border-black/5 bg-white">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-[320px] md:h-[380px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 left-3 bg-[#1A1A1A]/80 backdrop-blur-sm px-2.5 py-1 text-[8.5px] font-mono tracking-widest text-[#C5A880] uppercase rounded">
                  Primary Angle
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-none overflow-hidden border border-black/5 aspect-[4/3] bg-white">
                  <img 
                    src={product.hoverImage} 
                    alt={`${product.name} detail`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-[#FAF9F6] border border-black/5 rounded-none p-3 flex flex-col justify-center text-center">
                  <span className="block text-[8.5px] uppercase tracking-widest text-[#C5A880] font-bold font-mono">Atelier Standard</span>
                  <span className="block text-xs font-serif text-[#1a1a1a] font-light mt-0.5">Taxes Pre-settled</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Custom Purchase Customizations */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Core Info */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] uppercase tracking-[0.25em] text-[#C5A880] font-bold font-mono">{product.category}</span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-mono font-medium">
                    <div className="flex">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-500 text-transparent" />
                      ))}
                    </div>
                    <span className="text-neutral-500">({product.rating})</span>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-light text-[#1A1A1A] tracking-wider leading-tight">{product.name}</h2>
                
                {/* Pricing layout */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-xl font-bold text-[#1A1A1A] font-mono">
                    {formatPrice(currentPrice)}
                  </span>
                  {product.discountPriceINR && (
                    <span className="text-sm line-through text-neutral-400 font-light font-mono">
                      {formatPrice(product.priceINR)}
                    </span>
                  )}
                  <span className="text-[10px] bg-[#C5A880]/15 text-[#C5A880] px-2 py-0.5 rounded font-mono font-bold uppercase">
                    TAXES FULLY SETTLED
                  </span>
                </div>
              </div>

              {/* Color swatch selection */}
              <div className="space-y-2">
                <span className="block text-xs text-neutral-500 uppercase tracking-widest font-mono">Selected Finish: <strong className="text-[#1A1A1A]">{selectedColor}</strong></span>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs border rounded-none transition-all font-light ${
                        selectedColor === color 
                          ? 'border-[#C5A880] bg-[#FAF6F0] text-[#1A1A1A] font-semibold ring-1 ring-[#C5A880]' 
                          : 'border-neutral-200 bg-white hover:border-neutral-400 text-neutral-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Counter increment selection */}
              <div className="space-y-2">
                <span className="block text-xs text-neutral-500 uppercase tracking-widest font-mono">Atelier Quantity</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-black/10 rounded-none overflow-hidden bg-white h-11">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={product.stock === 0}
                      className="px-3.5 h-full hover:bg-stone-50 text-neutral-600 font-mono transition-colors border-r border-black/10"
                    >
                      -
                    </button>
                    <span className="px-5 text-sm font-mono font-semibold text-[#1A1A1A]">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={product.stock === 0}
                      className="px-3.5 h-full hover:bg-stone-50 text-neutral-600 font-mono transition-colors border-l border-black/10"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-neutral-400 font-light font-mono capitalize">
                    ({product.stock} units currently registered in Pune warehouse)
                  </span>
                </div>
              </div>

              {/* Information tabs toggle (desc, specs, guarantees) */}
              <div className="border-t border-black/10 pt-4">
                <div className="flex border-b border-stone-100 mb-3">
                  {(['desc', 'specs', 'shipping'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider relative cursor-pointer font-mono ${
                        activeTab === tab 
                          ? 'text-[#C5A880]' 
                          : 'text-neutral-400 hover:text-neutral-700'
                      }`}
                    >
                      {tab === 'desc' ? 'Atelier Story' : tab === 'specs' ? 'Specifications' : 'Priority Mail'}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A880]"></div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="h-40 overflow-y-auto text-xs text-neutral-500 font-light leading-relaxed pr-2">
                  {activeTab === 'desc' && (
                    <div className="space-y-3">
                      <p>{product.description}</p>
                      <ul className="list-disc pl-4 space-y-1 mt-2 text-neutral-600 font-sans">
                        {product.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <table className="w-full text-left font-sans text-xs border-collapse">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <tr key={key} className="border-b border-stone-50">
                            <td className="py-2 font-semibold text-neutral-700 capitalize pr-4">{key}</td>
                            <td className="py-2 text-neutral-500">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-2 font-sans text-xs text-neutral-500 leading-relaxed">
                      <p>
                        Our limited registers are packed with dual air cushion structures, wrapped inside customized monogram envelope boxes, and routed straight via top-grade expedited priority channels.
                      </p>
                      <p className="font-semibold text-[#1A1A1A]">
                        Standard priority timelines:
                      </p>
                      <p>
                        • Metro India: 2 to 4 Days | Rest of India: 3 to 5 Days | World Priority DHL: 4 to 7 Days.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Core checkout / wishlist triggers */}
            <div className="pt-6 border-t border-black/10 space-y-3">
              <div className="flex gap-3">
                <button 
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className={`flex-grow h-13 rounded-none text-xs uppercase tracking-widest font-semibold transition-all duration-350 flex items-center justify-center gap-2 cursor-pointer ${
                    product.stock === 0 
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                      : 'bg-[#1A1A1A] text-white hover:bg-[#C5A880]'
                  }`}
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>Allocate to Shopping Bag</span>
                </button>
                
                <button 
                  onClick={() => onToggleWishlist(product)}
                  className={`px-4 rounded-none border flex items-center justify-center cursor-pointer transition-colors ${
                    isWishlisted 
                      ? 'border-red-200 bg-red-50 text-red-500' 
                      : 'border-neutral-200 hover:border-red-500 text-neutral-400 hover:text-red-500 bg-white'
                  }`}
                  aria-label="Add to Wishlist"
                  title="Stash in Private Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* Razorpay gateway ready disclaimer under CTA */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-mono tracking-wider uppercase text-center py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>SECURED DIRECT SETTLE VIA RAZORPAY • ZERO DISPATCH COMMISSIONS</span>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
