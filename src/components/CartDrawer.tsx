import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart, Trash2, ArrowRight, ShieldCheck, CornerDownRight } from 'lucide-react';
import { CartItem, Product, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'cart' | 'wishlist';
  cartItems: CartItem[];
  onRemoveCartItem: (productId: string, color: string) => void;
  onUpdateCartItemQty: (productId: string, color: string, qty: number) => void;
  wishlist: Product[];
  onRemoveWishlistItem: (p: Product) => void;
  onMoveToCart: (product: Product) => void;
  currency: 'INR' | 'USD' | 'EUR';
  onCheckoutClick: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  type,
  cartItems,
  onRemoveCartItem,
  onUpdateCartItemQty,
  wishlist,
  onRemoveWishlistItem,
  onMoveToCart,
  currency,
  onCheckoutClick
}) => {
  if (!isOpen) return null;

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

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product.discountPriceINR || item.product.priceINR;
      return acc + (price * item.quantity);
    }, 0);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end" id="cart-drawer-overlay">
        
        {/* Soft layout backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#121110]/50 backdrop-blur-xs"
        />

        {/* Sliding Panel sheet */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 220 }}
          className="relative bg-[#F5F2ED] border-l border-black/5 w-full max-w-md h-full shadow-2xl z-10 flex flex-col justify-between"
          id="cart-drawer-sheet"
        >
          
          {/* Drawer Editorial Header */}
          <div className="p-6 border-b border-black/5 flex justify-between items-center bg-[#F5F2ED]">
            <div className="flex items-center gap-2">
              {type === 'cart' ? (
                <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
              ) : (
                <Heart className="w-5 h-5 text-[#C5A880]" />
              )}
              <h3 className="text-lg font-serif font-light text-[#1A1A1A] uppercase tracking-wider">
                {type === 'cart' ? 'Your Shopping Bag' : 'Your Private Wishlist'}
              </h3>
            </div>
            
            <button 
              onClick={onClose}
              className="p-1.5 border border-black/5 rounded-none hover:bg-stone-100 text-neutral-800 transition-colors pointer-cursor"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Core Body Container List */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            
            {/* CART VIEW */}
            {type === 'cart' && (
              <>
                {cartItems.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-12 h-12 rounded-none border border-black/10 flex items-center justify-center mx-auto text-neutral-300">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Allocation Empty</h4>
                      <p className="text-xs text-neutral-400 font-light mt-1 max-w-xs mx-auto">
                        Your private bag details are empty. Browse our standard luxury handbags, watches and belts registries to stash pieces.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {cartItems.map((item) => {
                      const price = item.product.discountPriceINR || item.product.priceINR;
                      
                      return (
                        <div 
                          key={`${item.product.id}-${item.selectedColor}`} 
                          className="flex gap-4 border-b border-black/5 pb-5"
                          id={`drawer-item-${item.product.id}`}
                        >
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-16 h-20 object-cover rounded-none border border-black/5 bg-[#EAE7E2]"
                            referrerPolicy="no-referrer"
                          />
                          
                          <div className="flex-grow space-y-1.5">
                            <div className="flex justify-between items-start">
                              <h5 className="text-sm font-serif font-light text-[#1A1A1A] line-clamp-1">{item.product.name}</h5>
                              <button 
                                onClick={() => onRemoveCartItem(item.product.id, item.selectedColor)}
                                className="text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono tracking-wide uppercase">
                              <span>Finish: <strong className="text-neutral-700">{item.selectedColor}</strong></span>
                              <span>Taxes Pre-settled</span>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              {/* Quantity selection counter */}
                              <div className="flex items-center border border-black/10 rounded-none bg-white h-8">
                                <button 
                                  onClick={() => onUpdateCartItemQty(item.product.id, item.selectedColor, Math.max(1, item.quantity - 1))}
                                  className="px-2 h-full hover:bg-neutral-100 text-neutral-600 font-mono transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-3 text-xs font-mono font-semibold text-neutral-800">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateCartItemQty(item.product.id, item.selectedColor, Math.min(item.product.stock, item.quantity + 1))}
                                  className="px-2 h-full hover:bg-neutral-100 text-neutral-600 font-mono transition-colors"
                                >
                                  +
                                </button>
                              </div>

                              {/* Price */}
                              <span className="text-xs font-bold text-neutral-900 font-mono">
                                {formatPrice(price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* WISHLIST VIEW */}
            {type === 'wishlist' && (
              <>
                {wishlist.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-12 h-12 rounded-none border border-black/10 flex items-center justify-center mx-auto text-neutral-300">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider font-sans">Wishlist Empty</h4>
                      <p className="text-xs text-neutral-400 font-light mt-1 max-w-xs mx-auto">
                        Your private stashed coordinates are empty. Store fashion accessories with heart metrics in the catalog.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 animate-fadeIn">
                    {wishlist.map((product) => {
                      const price = product.discountPriceINR || product.priceINR;

                      return (
                        <div key={product.id} className="flex gap-4 border-b border-black/5 pb-5" id={`wishlist-item-${product.id}`}>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-16 h-20 object-cover rounded-none border border-black/5 bg-[#EAE7E2]"
                            referrerPolicy="no-referrer"
                          />
                          
                          <div className="flex-grow space-y-2">
                            <div className="flex justify-between items-start">
                              <h5 className="text-sm font-serif font-light text-[#1A1A1A] line-clamp-1">{product.name}</h5>
                              <button 
                                onClick={() => onRemoveWishlistItem(product)}
                                className="text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-neutral-900 font-mono">
                                {formatPrice(price)}
                              </span>
                              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono">{product.category}</span>
                            </div>

                            {/* Options to shift to checkout basket */}
                            <button 
                              onClick={() => onMoveToCart(product)}
                              className="w-full h-8 border border-neutral-800 text-neutral-800 hover:bg-neutral-900 hover:text-white rounded-none text-[10px] uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer col-span-2"
                            >
                              <CornerDownRight className="w-3.5 h-3.5" />
                              <span>Transfer To Shopping Bag</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

          </div>

          {/* Drawer Editorial Footer */}
          <div className="p-6 border-t border-black/10 bg-[#FAF6F0] space-y-4">
            
            {type === 'cart' && cartItems.length > 0 && (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-neutral-500 font-light">Subtotal Allocations:</span>
                    <span className="text-base font-bold text-[#1A1A1A]">
                      {formatPrice(getSubtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                    <span>Included Taxes</span>
                    <span>Fully Included</span>
                  </div>
                </div>

                <button 
                  onClick={onCheckoutClick}
                  className="w-full h-14 bg-neutral-900 hover:bg-[#C5A880] text-white rounded text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Proceed to Guest checkout</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </>
            )}

            {type === 'wishlist' && wishlist.length > 0 && (
              <p className="text-[10px] text-center text-neutral-400 font-mono uppercase tracking-wider leading-relaxed">
                Stashed products are stored securely. Click card titles to check detailed leather and structural specifications.
              </p>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[9.5px] text-neutral-400 font-mono tracking-wider uppercase text-center border-t border-neutral-200/50 pt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Complimentary Courier Delivery Worldwide</span>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
