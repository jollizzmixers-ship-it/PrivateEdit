import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onProductOpen: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  currency: 'INR' | 'USD' | 'EUR';
  onAddToCartDirect: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductOpen,
  onToggleWishlist,
  isWishlisted,
  currency,
  onAddToCartDirect
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Formatter matching localized luxury expectations
  const formatPrice = (priceINR: number) => {
    if (currency === 'USD') {
      const converted = Math.round(priceINR * 0.012);
      return `$ ${converted.toLocaleString('en-US')}`;
    }
    if (currency === 'EUR') {
      const converted = Math.round(priceINR * 0.011);
      return `€ ${converted.toLocaleString('en-DE')}`;
    }
    // Base INR
    return `₹ ${priceINR.toLocaleString('en-IN')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-[#F5F2ED] border border-black/5 rounded-none overflow-hidden transition-all duration-500 hover:bg-white hover:shadow-sm product-card"
      id={`product-card-${product.id}`}
    >
      
      {/* CARD TOP SLOT (Image Gallery hover) */}
      <div 
        className="relative overflow-hidden cursor-pointer bg-[#EAE7E2]"
        onClick={() => onProductOpen(product)}
      >
        <img 
          src={isHovered ? product.hoverImage : product.image} 
          alt={product.name} 
          className="w-full h-[280px] sm:h-[340px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Floating Target Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full shadow-sm border border-stone-100 hover:scale-110 transition-all cursor-pointer z-10 ${
            isWishlisted 
              ? 'bg-red-50 border-red-100 text-red-500' 
              : 'bg-white text-neutral-400 hover:text-red-500 hover:bg-neutral-50'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 transition-all ${isWishlisted ? 'fill-red-500' : ''}`} />
        </button>

        {/* High-End Design Badges */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.bestSeller && (
            <span className="text-[8px] tracking-[0.15em] font-extrabold uppercase font-mono bg-[#1A1A1A] text-white py-1 px-2.5 rounded shadow-sm">
              BEST SELLER
            </span>
          )}
          {product.featured && (
            <span className="text-[8px] tracking-[0.15em] font-extrabold uppercase font-mono bg-[#C5A880] text-white py-1 px-2.5 rounded shadow-sm">
              ATELIER SELECTION
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-[8px] tracking-[0.1em] font-medium uppercase font-mono bg-red-100/90 border border-red-200 text-red-600 py-0.5 px-2 rounded">
              ONLY {product.stock} REGISTERED
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-[8px] tracking-[0.1em] font-medium uppercase font-mono bg-neutral-200 text-neutral-600 py-0.5 px-2 rounded">
              EXHAUSTED REGISTER
            </span>
          )}
        </div>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="p-5 flex-grow flex flex-col justify-between border-t border-black/5 bg-transparent">
        <div className="space-y-1">
          {/* Category breadcrumb */}
          <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-400 font-bold block font-mono">
            {product.category}
          </span>
          
          {/* Product Name */}
          <h3 
            onClick={() => onProductOpen(product)}
            className="text-base font-serif font-light text-[#1A1A1A] tracking-wider hover:text-[#C5A880] cursor-pointer transition-colors line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Core rating snippet */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-neutral-500">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-3 h-3 fill-amber-500 text-transparent" />
              ))}
            </div>
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Pricing Layout & Quick-Cart Actions */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-black/5">
          <div className="space-y-0.5">
            {/* Discount active display */}
            {product.discountPriceINR ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1A1A1A] font-mono">
                  {formatPrice(product.discountPriceINR)}
                </span>
                <span className="text-xs line-through text-neutral-400 font-light font-mono">
                  {formatPrice(product.priceINR)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-semibold text-[#1A1A1A] font-mono">
                {formatPrice(product.priceINR)}
              </span>
            )}
            <span className="text-[8px] text-neutral-400 font-mono tracking-wider block uppercase">Taxes & Courier Included</span>
          </div>

          <button 
            onClick={() => onAddToCartDirect(product)}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-full border border-black/5 hover:border-[#C5A880] transition-all cursor-pointer ${
              product.stock === 0 
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                : 'bg-[#F5F2ED] group-hover:bg-white text-neutral-800 hover:bg-neutral-950 hover:text-white'
            }`}
            title={product.stock === 0 ? "Product Retired" : "Quick Add to Base Registry"}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};
