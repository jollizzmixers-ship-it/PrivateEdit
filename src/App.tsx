import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Mail, Phone, MapPin, ShieldCheck, Truck, Star, Info, 
  Sparkles, CheckCircle, ChevronUp, Instagram, Clock, Gift, Award
} from 'lucide-react';

// Data and Type Imports
import { Product, CartItem, Order, Customer, Coupon } from './types';
import { LUXURY_PRODUCTS, MOCK_COUPONS, INITIAL_MOCK_ORDERS, INITIAL_MOCK_CUSTOMERS } from './data/products';

// Component Imports
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { CartDrawer } from './components/CartDrawer';
import { 
  AboutPage, ContactPage, TrackOrderPage, PrivacyPolicy, 
  TermsOfService, RefundPolicy, ShippingPolicy 
} from './components/PolicyPages';

export default function App() {
  // --- CORE SYSTEM STATE ---
  const [products, setProducts] = useState<Product[]>(LUXURY_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tpe_orders_audit');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_ORDERS;
  });
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('tpe_customers_audit');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_CUSTOMERS;
  });
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');

  // --- CLIENT SELECTIONS ---
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tpe_client_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tpe_client_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // --- DRAWER & DIALOG TRIGGERS ---
  const [activePage, setActivePage] = useState<string>('home'); // home, handbags, watches, about-us, contact, track-order, privacy, terms, refund, shipping
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'handbags' | 'watches'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- AUXILIARY STATIC STATES ---
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tpe_client_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('tpe_client_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('tpe_orders_audit', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tpe_customers_audit', JSON.stringify(customers));
  }, [customers]);

  // Adjust scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- CART MANAGEMENT ---
  const handleAddToCart = (product: Product, color: string, qty: number) => {
    if (product.stock === 0) return;
    
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.selectedColor === color);
      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = Math.min(product.stock, next[existingIdx].quantity + qty);
        next[existingIdx].quantity = newQty;
        return next;
      }
      return [...prev, { product, quantity: qty, selectedColor: color }];
    });
    setIsCartOpen(true);
  };

  const handleAddToCartDirect = (product: Product) => {
    // Select first colorway as default
    const color = product.colors[0] || 'Default Custom';
    handleAddToCart(product, color, 1);
  };

  const handleRemoveCartItem = (productId: string, color: string) => {
    setCartItems(prev => prev.filter(item => !(item.product.id === productId && item.selectedColor === color)));
  };

  const handleUpdateCartQty = (productId: string, color: string, qty: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedColor === color) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // --- WISHLIST MANAGEMENT ---
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleMoveToCart = (product: Product) => {
    handleAddToCartDirect(product);
    // Remove from wishlist
    setWishlist(prev => prev.filter(item => item.id !== product.id));
  };

  // --- NEW WORK ORDER FROM GUEST CHECKOUT ---
  const handleAddNewOrder = (newOrder: Order) => {
    // Deduct stock limits in static registers
    setProducts(prevProducts => prevProducts.map(p => {
      const purchasedItem = newOrder.items.find(item => item.productId === p.id);
      if (purchasedItem) {
        return { ...p, stock: Math.max(0, p.stock - purchasedItem.quantity) };
      }
      return p;
    }));

    // Register Order in Admin Board
    setOrders(prev => [newOrder, ...prev]);

    // Insert or update Guest customer file
    setCustomers(prevCusts => {
      const existsIdx = prevCusts.findIndex(c => c.email.toLowerCase() === newOrder.shippingAddress.email.toLowerCase());
      if (existsIdx > -1) {
        const list = [...prevCusts];
        list[existsIdx].ordersCount += 1;
        list[existsIdx].totalSpent += newOrder.total;
        return list;
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now().toString().slice(-4)}`,
          name: newOrder.shippingAddress.name,
          email: newOrder.shippingAddress.email,
          phone: newOrder.shippingAddress.phone,
          ordersCount: 1,
          totalSpent: newOrder.total
        };
        return [newCust, ...prevCusts];
      }
    });
  };

  // --- ADMIN FUNCTIONS ---
  const handleUpdateStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, priceINR: newPrice, discountPriceINR: undefined } : p));
  };

  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons(prev => [...prev, newCoupon]);
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
  };

  // --- HELPER MATH ---
  const formatValue = (priceINR: number) => {
    if (currency === 'USD') {
      return `$ ${Math.round(priceINR * 0.012).toLocaleString('en-US')}`;
    }
    if (currency === 'EUR') {
      return `€ ${Math.round(priceINR * 0.011).toLocaleString('en-DE')}`;
    }
    return `₹ ${priceINR.toLocaleString('en-IN')}`;
  };

  // Filter products based on active filters and search terms
  const getFilteredProducts = () => {
    let list = [...products];
    
    // Page constraints
    if (activePage === 'handbags') list = list.filter(p => p.category === 'handbags');
    if (activePage === 'watches') list = list.filter(p => p.category === 'watches');

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    }

    return list;
  };

  // Manage direct category click actions on home
  const triggerCategoryFilter = (cat: 'handbags' | 'watches') => {
    setActivePage(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F5F2ED] text-[#1A1A1A] font-sans min-h-screen selection:bg-[#C5A880]/20 flex flex-col justify-between" id="root-portal">
      
      {/* Top Banner Ticker */}
      <AnnouncementBar />

      {/* Main Luxury Header */}
      <Navbar 
        activePage={activePage}
        setActivePage={setActivePage}
        wishlistCount={wishlist.length}
        cartCount={cartItems.length}
        onOpenCart={() => { setIsCartOpen(true); setIsWishlistOpen(false); }}
        onOpenWishlist={() => { setIsWishlistOpen(true); setIsCartOpen(false); }}
        currency={currency}
        setCurrency={setCurrency}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminOpen={isAdminOpen}
      />

      {/* Dynamic Main Body Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* HOME VIEW: Multiple luxury homepage sections */}
          {activePage === 'home' && (
            <motion.div
              key="homepage-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-16 pb-16"
              id="home-segment"
            >
              {/* SECTION 1: Narrative Editorial Hero Banner */}
              <HeroBanner onExploreClick={() => {
                const catalogEl = document.getElementById('boutique-catalog');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
              }} />

              {/* SECTION 2: Highly Articulate Categories */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12" id="featured-categories">
                <div className="text-center space-y-2 mb-10">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-bold font-mono">The Atelier Pillars</span>
                  <h2 className="text-3xl font-serif text-[#1A1A1A] font-light leading-snug tracking-wide">Featured Accessory Registers</h2>
                  <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Category 1: Handbags */}
                  <div 
                    onClick={() => triggerCategoryFilter('handbags')}
                    className="group relative h-96 rounded-none overflow-hidden border border-black/5 bg-[#EAE7E2] cursor-pointer"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80" 
                      alt="Premium Handbags Segment" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter saturate-90 group-hover:saturate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6">
                      <span className="text-[9.5px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">Limited Pieces</span>
                      <h3 className="text-xl font-serif font-light text-white tracking-wider mt-1">Exquisite Handbags</h3>
                      <button className="text-xs uppercase tracking-wider text-[#C5A880] hover:text-white font-semibold flex items-center gap-1.5 mt-2 transition-colors">
                        Inspect collection <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Category 2: Watches */}
                  <div 
                    onClick={() => triggerCategoryFilter('watches')}
                    className="group relative h-96 rounded-none overflow-hidden border border-black/5 bg-[#EAE7E2] cursor-pointer"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80" 
                      alt="Swiss Watches Segment" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter saturate-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6">
                      <span className="text-[9.5px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">Fine Swiss Caliber</span>
                      <h3 className="text-xl font-serif font-light text-white tracking-wider mt-1">Eternelle Watches</h3>
                      <button className="text-xs uppercase tracking-wider text-[#C5A880] hover:text-white font-semibold flex items-center gap-1.5 mt-2 transition-colors">
                        Inspect collection <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Main Product Catalog Grid */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-24" id="boutique-catalog">
                <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-black/10 pb-5 mb-10 gap-4">
                  <div>
                    <span className="text-[9.5px] uppercase tracking-[0.22em] text-[#C5A880] font-bold font-mono">The Catalog Register</span>
                    <h2 className="text-2xl font-serif font-light text-[#1A1A1A] tracking-wider mt-1">Limited-Run Capsules</h2>
                  </div>
                  
                  {/* In-catalog sorting tabs */}
                  <div className="flex flex-wrap gap-2">
                    {['all', 'handbags', 'watches'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          if (cat === 'all') {
                            setCategoryFilter('all');
                            setActivePage('home');
                          } else {
                            triggerCategoryFilter(cat as any);
                          }
                        }}
                        className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-none transition-colors cursor-pointer ${
                          (cat === 'all' && activePage === 'home')
                            ? 'bg-[#1A1A1A] text-white' 
                            : 'text-neutral-500 hover:bg-white hover:text-[#1A1A1A]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getFilteredProducts().map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onProductOpen={(p) => setSelectedProduct(p)}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.some(w => w.id === product.id)}
                      currency={currency}
                      onAddToCartDirect={handleAddToCartDirect}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 4: Craftsmanship Editorial Banner */}
              <section className="bg-[#F5F2ED] border-t border-b border-black/5 py-20" id="craftsmanship-manifesto">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
                  <span className="text-xs tracking-[0.25em] text-[#C5A880] uppercase font-bold font-mono block">The Atelier Manifesto</span>
                  <h3 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] tracking-wider leading-snug">
                    &quot;True luxury is whispered in silence. It exists in the flawless straight stitch, the heavy click of the solid brass lock, and the organic coolness of French calfskins.&quot;
                  </h3>
                  <div className="w-12 h-0.5 bg-[#C5A880] mx-auto"></div>
                  <p className="text-neutral-500 text-sm italic font-light max-w-xl mx-auto leading-relaxed">
                    We select our partner leather houses exclusively from historical guilds in Lyon and Florence. Every handbag requires 48 hours of uninterrupted hand-finishing, and each is registered on an exclusive production log inside Pune HQ before release.
                  </p>
                </div>
              </section>

              {/* SECTION 5: Why Choose Us (Razorpay/Trust) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="boutique-assurances">
                <div className="text-center space-y-2 mb-12">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-bold font-mono">Uncompromising Integrity</span>
                  <h2 className="text-2xl font-serif text-[#1A1A1A] font-light leading-snug tracking-wide">Client Experience Standards</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="bg-[#F5F2ED] border border-black/5 rounded-none p-6 text-center space-y-3 hover:bg-white transition-colors duration-500 shadow-xs">
                    <div className="w-10 h-10 bg-[#EAE7E2] text-[#1A1A1A] rounded-full flex items-center justify-center mx-auto border border-black/5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-neutral-800">Secure Direct Gateways</h4>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      Encrypted transactions through Razorpay merchant routing, accepting credit/debit networks and UPI securely.
                    </p>
                  </div>

                  <div className="bg-[#F5F2ED] border border-black/5 rounded-none p-6 text-center space-y-3 hover:bg-white transition-colors duration-500 shadow-xs">
                    <div className="w-10 h-10 bg-[#EAE7E2] text-[#1A1A1A] rounded-full flex items-center justify-center mx-auto border border-black/5">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-neutral-800">Priority Worldwide Air</h4>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      Priority dispatch through DHL Express or FedEx, featuring double-box rigid protection layers and real-time tracking milestones.
                    </p>
                  </div>

                  <div className="bg-[#F5F2ED] border border-black/5 rounded-none p-6 text-center space-y-3 hover:bg-white transition-colors duration-500 shadow-xs">
                    <div className="w-10 h-10 bg-[#EAE7E2] text-[#1A1A1A] rounded-full flex items-center justify-center mx-auto border border-black/5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-neutral-800">7-Day Return Trial</h4>
                    <p className="text-xs text-[#957850] font-light leading-relaxed font-sans">
                      Complimentary courier return pickup within 7 days from physical delivery. Unified online wallet refunds guaranteed.
                    </p>
                  </div>

                  <div className="bg-[#F5F2ED] border border-black/5 rounded-none p-6 text-center space-y-3 hover:bg-white transition-colors duration-500 shadow-xs">
                    <div className="w-10 h-10 bg-[#EAE7E2] text-[#1A1A1A] rounded-full flex items-center justify-center mx-auto border border-black/5">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-neutral-800">Comprehensive Taxes</h4>
                    <p className="text-xs text-[#957850] font-light leading-relaxed font-sans">
                      No surprise charges. All retail taxes and duties are comprehensively pre-calculated.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 6: Testimonials Carousel */}
              <section className="bg-stone-900 text-white py-20" id="client-testimonials">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                  <div className="md:col-span-4 space-y-4">
                    <span className="text-[10px] text-[#C5A880] uppercase tracking-[0.25em] font-bold font-mono">The Ledger of trust</span>
                    <h3 className="text-2xl md:text-3xl font-serif text-white tracking-wider font-light">Accolades from the Journal</h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      Hear from women who demand meticulous detailing for their investment capsule fashion additions. All profiles verified via guest checkout registers.
                    </p>
                  </div>

                  <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1F1E1D] border border-stone-800 rounded-xl p-6 space-y-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                      <p className="text-xs italic text-neutral-300 font-light leading-relaxed">
                        &quot;The Amandine Box Bag far exceeds standard luxury expectations. The stiffness of the Tuscany calfskin leather is perfection, holding its structural lines exactly. Dispatched with beautiful packaging.&quot;
                      </p>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase">
                        <strong>Radhika Mehra</strong>
                        <span>Gurugram Client</span>
                      </div>
                    </div>

                    <div className="bg-[#1F1E1D] border border-stone-800 rounded-xl p-6 space-y-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                      <p className="text-xs italic text-neutral-300 font-light leading-relaxed">
                        &quot;Absolutely stunning classic watch! The mother-of-pearl dial catches dawn light beautifully, and the Milanese mesh band fits like custom jewelry. It is indeed a silent luxury piece.&quot;
                      </p>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase">
                        <strong>Clara Dubois</strong>
                        <span>Paris Fashion Editor</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 7: Instagram-style gallery */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="boutique-lookbook">
                <div className="text-center space-y-2 mb-10">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-bold font-mono">The Aesthetic Edit</span>
                  <h2 className="text-2xl font-serif text-[#1A1A1A] font-light tracking-wide">Journal Lookbook</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1566150905458-1bf1fc15a7a0?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1624222247344-550fb8ecf7c2?auto=format&fit=crop&w=800&q=80"
                  ].map((url, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-none aspect-square border border-black/5 bg-[#EAE7E2]">
                      <img 
                        src={url} 
                        alt="Aesthetic accessory styling lookbook" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter saturate-90 group-hover:saturate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-[#C5A880]" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 8: Highly Aesthetic Newsletter signup */}
              <section className="max-w-3xl mx-auto px-6 py-12 text-center" id="newsletter-segment">
                <div className="bg-[#F5F2ED] border border-black/5 rounded-none p-8 md:p-12 space-y-6 hover:bg-white transition-all duration-700 shadow-xs">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-bold font-mono block">Atelier Bulletins</span>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-light text-[#1A1A1A]">Subcribe for Limited Launch Alarms</h3>
                    <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                      We transmit fewer than two briefings per capsule launch. Discover reserved stocks directly in your primary secure inbox.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {newsletterSubscribed ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#EAE7E2] border border-black/5 rounded-none p-5 text-center text-[#1A1A1A] space-y-2 max-w-sm mx-auto"
                        id="newsletter-success"
                      >
                        <CheckCircle className="w-5 h-5 mx-auto text-neutral-800" />
                        <span className="text-xs uppercase font-bold tracking-widest font-mono">Bulletin Access Registered</span>
                      </motion.div>
                    ) : (
                      <form 
                        onSubmit={(e) => { e.preventDefault(); if (newsletterEmail) setNewsletterSubscribed(true); }}
                        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                        id="newsletter-form"
                      >
                        <input 
                          type="email"
                          required
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="e.g. name@domain.com"
                          className="flex-grow px-4 py-3 bg-[#FAF9F6] border border-black/10 text-xs rounded-none text-[#1A1A1A] outline-none focus:border-black font-light"
                        />
                        <button 
                          type="submit"
                          className="px-6 py-3 bg-[#1A1A1A] text-white hover:bg-stone-850 rounded-none text-[10px] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer text-center"
                        >
                          Send Alarm Code
                        </button>
                      </form>
                    )}
                  </AnimatePresence>
                </div>
              </section>

            </motion.div>
          )}

          {/* CATALOG VIEWS (HANDBAGS, WATCHES) */}
          {(activePage === 'handbags' || activePage === 'watches') && (
            <motion.div 
              key={`catalog-view-${activePage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn"
              id="sub-category-segment"
            >
              <div className="border-b border-black/10 pb-6 mb-12 flex flex-col sm:flex-row justify-between items-baseline gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#C5A880] font-bold font-mono block">Atelier Register</span>
                  <h1 className="text-3xl font-serif text-[#1A1A1A] font-light capitalize tracking-wider mt-1">{activePage} Exclusive Edition</h1>
                </div>

                <div className="text-xs font-mono font-medium text-neutral-400 capitalize">
                  Found {getFilteredProducts().length} Limited registers in our central logistics node
                </div>
              </div>

              {/* Grid layout */}
              {getFilteredProducts().length === 0 ? (
                <p className="text-sm text-neutral-400 italic text-center py-20">No matching luxury coordinates found inside Pune registers.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getFilteredProducts().map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onProductOpen={(p) => setSelectedProduct(p)}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.some(w => w.id === product.id)}
                      currency={currency}
                      onAddToCartDirect={handleAddToCartDirect}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* EDITORIAL SUPPLEMENT PAGES */}
          {activePage === 'about-us' && <AboutPage key="about-us" />}
          {activePage === 'contact' && <ContactPage key="contact" />}
          {activePage === 'track-order' && <TrackOrderPage key="track-order" />}
          {activePage === 'privacy' && <PrivacyPolicy key="privacy" />}
          {activePage === 'terms' && <TermsOfService key="terms" />}
          {activePage === 'refund' && <RefundPolicy key="refund" />}
          {activePage === 'shipping' && <ShippingPolicy key="shipping" />}

        </AnimatePresence>
      </main>

      {/* COMPREHENSIVE LUXURY FOOTER BRANDING */}
      <footer className="bg-[#FAF6F0] border-t border-black/5 pt-16 pb-8" id="premium-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-stone-100 pb-12 mb-8">
            
            {/* Bureau 1: Core credentials */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-serif font-light text-lg tracking-[0.2em] text-[#1A1A1A]">THE PRIVATE EDIT</h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm">
                A highly curated accessory registry defined by whispering elegance. Every leather craft is inspected, logged, and certified clinically in our private Indian distribution headquarters.
              </p>
              
              {/* Trust metrics */}
              <div className="space-y-2 font-mono text-[10px] text-neutral-600">
                <span className="block font-bold text-neutral-700">Pune Distribution Center:</span>
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#C5A880]" /> Lodha Belmondo, Gahunje, Pune - 412105</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#C5A880]" /> +91-7987205847</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#C5A880]" /> Jollizzmixers@gmail.com</p>
              </div>
            </div>

            {/* Bureau 2: Quick categories */}
            <div className="md:col-span-2 space-y-3">
              <span className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest font-mono">Collectives</span>
              <ul className="space-y-2 text-xs text-neutral-400 font-light">
                <li><button onClick={() => triggerCategoryFilter('handbags')} className="hover:text-[#C5A880] transition-colors cursor-pointer">Premium Handbags</button></li>
                <li><button onClick={() => triggerCategoryFilter('watches')} className="hover:text-[#C5A880] transition-colors cursor-pointer">Eternelle Swiss Watches</button></li>
                <li><button onClick={() => { setActivePage('home'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-[#C5A880] transition-colors cursor-pointer">All Limited Registers</button></li>
              </ul>
            </div>

            {/* Bureau 3: Policies Ledger */}
            <div className="md:col-span-3 space-y-3">
              <span className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest font-mono">Studio Legalities</span>
              <ul className="space-y-2 text-xs text-neutral-400 font-light">
                <li><button onClick={() => { setActivePage('shipping'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-[#C5A880] transition-colors cursor-pointer">Shipping & priority Air</button></li>
                <li><button onClick={() => { setActivePage('refund'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-[#C5A880] transition-colors cursor-pointer">7-Day Refund Policy</button></li>
                <li><button onClick={() => { setActivePage('privacy'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-[#C5A880] transition-colors cursor-pointer">Platform Privacy Shield</button></li>
                <li><button onClick={() => { setActivePage('terms'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-[#C5A880] transition-colors cursor-pointer">Terms of Digital Service</button></li>
              </ul>
            </div>

            {/* Bureau 4: Quick Help lines */}
            <div className="md:col-span-3 space-y-3">
              <span className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest font-mono">Boutique Journals</span>
              <ul className="space-y-2 text-xs text-neutral-400 font-light font-sans">
                <li><button onClick={() => { setActivePage('about-us'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-[#C5A880] transition-colors cursor-pointer">The Atelier Story</button></li>
                <li><button onClick={() => { setActivePage('contact'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-[#C5A880] transition-colors cursor-pointer">Concierge Desk</button></li>
                <li><button onClick={() => { setActivePage('track-order'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-[#C5A880] transition-colors cursor-pointer">Track Consignment</button></li>
                <li>
                  <button 
                    onClick={() => setIsAdminOpen(true)}
                    className="text-[9px] font-mono text-neutral-500 uppercase font-bold tracking-widest border border-black/10 rounded-none px-2.5 py-1 hover:border-[#C5A880] hover:text-[#C5A880]"
                  >
                    Staff Verification Portal
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Footer baseline copyright */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-neutral-400 uppercase tracking-wider gap-4">
            <p className="font-light">
              &copy; {new Date().getFullYear()} The Private Edit INC. All Rights Reserved.
            </p>
            <div className="flex gap-4">
              <span className="text-stone-300">|</span>
              <span>Pune distribution</span>
              <span className="text-stone-300">|</span>
              <span>Verified Secure Distribution</span>
              <span className="text-stone-300">|</span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- CART/WISHLIST SIDE DRAWER PANEL --- */}
      <CartDrawer 
        isOpen={isCartOpen || isWishlistOpen}
        onClose={() => { setIsCartOpen(false); setIsWishlistOpen(false); }}
        type={isCartOpen ? 'cart' : 'wishlist'}
        cartItems={cartItems}
        onRemoveCartItem={handleRemoveCartItem}
        onUpdateCartItemQty={handleUpdateCartQty}
        wishlist={wishlist}
        onRemoveWishlistItem={handleToggleWishlist}
        onMoveToCart={handleMoveToCart}
        currency={currency}
        onCheckoutClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />

      {/* --- DETAILED PRODUCT INSPECT DIALOG --- */}
      <ProductDetailModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlist.some(w => w.id === selectedProduct.id) : false}
        currency={currency}
        onAddToCart={handleAddToCart}
      />

      {/* --- GUEST CHECKOUT MODAL SHEET --- */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={handleClearCart}
        currency={currency}
        coupons={coupons}
        onAddNewOrder={handleAddNewOrder}
      />

      {/* --- ATELIER SYSTEM ADMINISTRATIVE CONTROL PANEL --- */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProductStock={handleUpdateStock}
        onUpdateProductPrice={handleUpdatePrice}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        customers={customers}
        coupons={coupons}
        onAddCoupon={handleAddCoupon}
        onDeleteCoupon={handleDeleteCoupon}
      />

      {/* --- BACK-TO-TOP TARGET --- */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 p-3 bg-white hover:bg-neutral-950 hover:text-white border border-black/10 rounded-none shadow-lg text-neutral-800 transition-all cursor-pointer z-35"
            title="Return to peak"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
