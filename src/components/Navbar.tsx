import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Landmark, Sliders, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  wishlistCount: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  currency: 'INR' | 'USD' | 'EUR';
  setCurrency: (curr: 'INR' | 'USD' | 'EUR') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  wishlistCount,
  cartCount,
  onOpenCart,
  onOpenWishlist,
  currency,
  setCurrency,
  searchTerm,
  setSearchTerm,
  onOpenAdmin,
  isAdminOpen
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Handbags', id: 'handbags' },
    { label: 'Belts', id: 'belts' },
    { label: 'Watches', id: 'watches' },
    { label: 'About Us', id: 'about-us' },
    { label: 'Contact', id: 'contact' },
    { label: 'Track Order', id: 'track-order' }
  ];

  const handleLinkClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    // Auto-scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCurrencySymbol = () => {
    if (currency === 'USD') return '$ USD';
    if (currency === 'EUR') return '€ EUR';
    return '₹ INR';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F5F2ED]/95 backdrop-blur-md border-b border-black/5" id="main-navigation-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-[#C5A880] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* LEFT: Branding Brand Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleLinkClick('home')}>
            <h1 className="text-3xl tracking-[-0.05em] font-serif italic font-light text-[#1A1A1A] select-none hover:opacity-60 transition-opacity">
              The Private Edit
            </h1>
          </div>

          {/* MIDDLE: Primary Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-7 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = activePage === link.id || 
                (link.id === 'handbags' && activePage === 'category-handbags') ||
                (link.id === 'belts' && activePage === 'category-belts') ||
                (link.id === 'watches' && activePage === 'category-watches');

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-[11px] uppercase tracking-widest font-medium transition-opacity cursor-pointer ${
                    isActive 
                      ? 'text-[#1A1A1A] border-b border-black/30' 
                      : 'text-neutral-500 hover:opacity-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Essential Controls Wishlist, Basket, Search, Switches */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            
            {/* Quick Search Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowSearchBox(!showSearchBox)}
                className={`p-2 rounded-full transition-colors text-neutral-700 hover:text-[#C5A880] ${showSearchBox ? 'bg-neutral-100 text-[#C5A880]' : ''}`}
                title="Search Products"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-black/10 text-neutral-700 bg-[#F5F2ED] text-xs font-mono font-medium rounded hover:opacity-75 transition-all"
                title="Switch Currency"
              >
                <span>{getCurrencySymbol()}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400 transition-transform duration-300" />
              </button>
              
              <AnimatePresence>
                {showCurrencyDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowCurrencyDropdown(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1 w-28 bg-white border border-black/5 rounded shadow-lg z-20 overflow-hidden font-mono text-xs"
                    >
                      <button 
                        onClick={() => { setCurrency('INR'); setShowCurrencyDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#F5F2ED] transition-colors flex items-center justify-between ${currency === 'INR' ? 'text-[#C5A880] font-bold' : 'text-neutral-700'}`}
                      >
                        <span>₹ INR</span>
                        {currency === 'INR' && <span className="w-1.5 h-1.5 bg-[#C5A880] rounded-full"></span>}
                      </button>
                      <button 
                        onClick={() => { setCurrency('USD'); setShowCurrencyDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 border-t border-stone-100 hover:bg-[#F5F2ED] transition-colors flex items-center justify-between ${currency === 'USD' ? 'text-[#C5A880] font-bold' : 'text-neutral-700'}`}
                      >
                        <span>$ USD</span>
                        {currency === 'USD' && <span className="w-1.5 h-1.5 bg-[#C5A880] rounded-full"></span>}
                      </button>
                      <button 
                        onClick={() => { setCurrency('EUR'); setShowCurrencyDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 border-t border-stone-100 hover:bg-[#F5F2ED] transition-colors flex items-center justify-between ${currency === 'EUR' ? 'text-[#C5A880] font-bold' : 'text-neutral-700'}`}
                      >
                        <span>€ EUR</span>
                        {currency === 'EUR' && <span className="w-1.5 h-1.5 bg-[#C5A880] rounded-full"></span>}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Icon with badge */}
            <button 
              onClick={onOpenWishlist}
              className="p-2 relative text-neutral-700 hover:text-red-500 transition-colors"
              title="View Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-red-500 font-bold text-white w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Index with badge */}
            <button 
              onClick={onOpenCart}
              className="p-2 relative text-neutral-700 hover:text-[#C5A880] transition-colors"
              title="Open Luxury Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-[#C5A880] font-semibold text-white w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hidden admin trigger for quick evaluations */}
            <button 
              onClick={onOpenAdmin}
              className={`p-2 rounded-full border hidden sm:flex items-center justify-center transition-all ${
                isAdminOpen 
                  ? 'bg-neutral-800 text-white border-neutral-800' 
                  : 'text-neutral-400 border-neutral-200 hover:border-[#C5A880]/50 hover:text-[#C5A880]'
              }`}
              title="Atelier Admin Registry"
            >
              <Sliders className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>

      {/* Floating Dynamic Search Drawer */}
      <AnimatePresence>
        {showSearchBox && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#F5F2ED] border-b border-black/5"
            id="global-search-drawer"
          >
            <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#C5A880] flex-shrink-0" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Exquisite luxury leather handbag, brass links watch..."
                className="w-full bg-transparent text-sm text-[#1A1A1A] outline-none placeholder-stone-400 font-light"
                autoFocus
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-xs uppercase tracking-wider text-neutral-400 hover:text-neutral-800 transition-colors font-mono"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={() => { setShowSearchBox(false); setSearchTerm(''); }}
                className="text-xs uppercase tracking-widest text-[#1A1A1A] border-l border-stone-200 pl-3 hover:text-[#C5A880] font-semibold"
              >
                Close
              </button>
            </div>
            {searchTerm && (
              <div className="bg-stone-50 border-t border-stone-100 text-[10px] text-stone-400 font-mono tracking-wider text-center py-2">
                Filtering our Limited Register collections for &quot;{searchTerm}&quot;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            ></motion.div>
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 md:hidden flex flex-col justify-between"
              id="mobile-navigation-drawer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-black/5 pb-5 mb-6">
                  <div>
                    <h3 className="font-serif font-light text-lg tracking-widest">THE PRIVATE EDIT</h3>
                    <span className="text-[7px] uppercase tracking-widest text-[#C5A880] font-light">Atelier Boutique</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 border border-black/5 rounded-none hover:bg-[#F5F2ED]"
                  >
                    <X className="w-5 h-5 text-neutral-700" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.id)}
                      className="text-left py-2 text-sm uppercase tracking-widest font-semibold border-b border-black/5 hover:text-[#C5A880] transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Mobile Footer & Quick Controls */}
              <div className="p-6 border-t border-black/5 bg-[#F5F2ED] space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-light font-mono">Boutique Relations</span>
                  <a href="tel:+917987205847" className="font-bold text-[#1A1A1A]">+91-7987205847</a>
                </div>
                <button 
                  onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                  className="w-full text-center bg-neutral-950 text-white py-3 rounded-none text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A880] transition-colors flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4" />
                  System Admin Panel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
