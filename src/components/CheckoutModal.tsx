import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Ticket, CheckCircle2, AlertCircle, ArrowRight, CreditCard, Landmark, CircleAlert } from 'lucide-react';
import { Product, CartItem, Coupon, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
  currency: 'INR' | 'USD' | 'EUR';
  coupons: Coupon[];
  onAddNewOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
  currency,
  coupons,
  onAddNewOrder
}) => {
  if (!isOpen) return null;

  // Guest Billing State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Payment Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment-select' | 'processing' | 'success'>('details');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [creditCardExpiry, setCreditCardExpiry] = useState('');
  const [creditCardCVV, setCreditCardCVV] = useState('');

  // Sizing of totals
  const subtotalINR = cartItems.reduce((acc, item) => {
    const price = item.product.discountPriceINR || item.product.priceINR;
    return acc + (price * item.quantity);
  }, 0);

  const getSubtotalInActiveCurrency = () => {
    if (currency === 'USD') return subtotalINR * 0.012;
    if (currency === 'EUR') return subtotalINR * 0.011;
    return subtotalINR;
  };

  const getDiscountInActiveCurrency = () => {
    if (!appliedCoupon) return 0;
    
    let discountINR = 0;
    if (appliedCoupon.discountType === 'percentage') {
      discountINR = (subtotalINR * appliedCoupon.value) / 100;
    } else {
      discountINR = appliedCoupon.value;
    }

    if (currency === 'USD') return discountINR * 0.012;
    if (currency === 'EUR') return discountINR * 0.011;
    return discountINR;
  };

  const getTotalInActiveCurrency = () => {
    const sub = getSubtotalInActiveCurrency();
    const dis = getDiscountInActiveCurrency();
    return Math.max(0, sub - dis);
  };

  const getTaxesInActiveCurrency = () => {
    // Standard tax is included in pricing (meaning base cost = price / 1.18, tax = price - base cost)
    const total = getTotalInActiveCurrency();
    const baseCost = total / 1.18;
    return total - baseCost;
  };

  const formatPrice = (value: number) => {
    const floored = Math.round(value);
    if (currency === 'USD') return `$ ${floored.toLocaleString('en-US')}`;
    if (currency === 'EUR') return `€ ${floored.toLocaleString('en-DE')}`;
    return `₹ ${floored.toLocaleString('en-IN')}`;
  };

  // Coupon matching
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const cleanInput = couponCodeInput.trim().toUpperCase();
    if (!cleanInput) return;

    const matched = coupons.find(c => c.code.toUpperCase() === cleanInput);
    if (!matched) {
      setCouponError('Invalid promotion token. Verify characters.');
      setAppliedCoupon(null);
      return;
    }

    if (matched.minPurchase && subtotalINR < matched.minPurchase) {
      setCouponError(`Min checkout spend ₹${matched.minPurchase.toLocaleString()} required for this voucher.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(matched);
    let successVal = matched.discountType === 'percentage' ? `${matched.value}%` : `₹${matched.value.toLocaleString()}`;
    setCouponSuccess(`Voucher accepted: Secured ${successVal} off discount!`);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('payment-select');
  };

  // Simulated Payment Trigger for Razorpay compliance
  const triggerRazorpayInstantSimulate = () => {
    setIsProcessing(true);
    setCheckoutStep('processing');

    setTimeout(() => {
      // Create Order payload
      const orderId = `TPE-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: orderId,
        items: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.discountPriceINR || item.product.priceINR,
          color: item.selectedColor
        })),
        shippingAddress: {
          name,
          email,
          phone,
          street,
          city,
          state: stateName,
          pincode,
          country
        },
        subtotal: subtotalINR,
        discount: appliedCoupon 
          ? (appliedCoupon.discountType === 'percentage' ? (subtotalINR * appliedCoupon.value) / 100 : appliedCoupon.value)
          : 0,
        total: Math.max(0, subtotalINR - (appliedCoupon ? (appliedCoupon.discountType === 'percentage' ? (subtotalINR * appliedCoupon.value) / 100 : appliedCoupon.value) : 0)),
        currency: 'INR', // Internal storage of orders in default INR
        status: 'Processing',
        date: new Date().toISOString().split('T')[0],
        trackingNumber: `DHL-${Math.floor(10000 + Math.random() * 89999)}-TPE`
      };

      // Add to main state orders record
      onAddNewOrder(newOrder);
      setCreatedOrder(newOrder);
      setIsProcessing(false);
      setCheckoutStep('success');
      onClearCart();
    }, 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="checkout-container-backdrop">
        
        {/* Soft layout backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal body container sheet */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          className="relative bg-[#F5F2ED] border border-black/5 rounded-none max-w-4xl w-full max-h-[92vh] overflow-hidden z-10 shadow-2xl flex flex-col md:flex-row"
          id="checkout-interactive-sheet"
        >
          
          {/* Close button top right */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 border border-black/5 rounded-none hover:bg-stone-50 text-neutral-800 transition-colors z-20 cursor-pointer"
            aria-label="Cancel checkout"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT: Guest inputs & checkout progress */}
          <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto h-[50vh] md:h-[85vh] bg-white border-b md:border-b-0 md:border-r border-black/5">
            
            {/* Step navigation display */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider font-semibold uppercase text-neutral-400 mb-8">
              <span className={checkoutStep === 'details' ? 'text-[#C5A880]' : 'text-neutral-500'}>01 coordinates</span>
              <span>•</span>
              <span className={checkoutStep === 'payment-select' ? 'text-[#C5A880]' : 'text-neutral-500'}>02 Direct pay</span>
              <span>•</span>
              <span className={checkoutStep === 'success' ? 'text-[#C5A880]' : 'text-neutral-500'}>03 dispatch docket</span>
            </div>

            <AnimatePresence mode="wait">
              
              {/* STEP 1: Billing Detail form */}
              {checkoutStep === 'details' && (
                <motion.div 
                  key="details-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6 animate-fadeIn"
                >
                  <div>
                    <h3 className="text-2xl font-serif text-[#1A1A1A] font-light leading-tight">Secure Guest Checkout</h3>
                    <p className="text-xs text-neutral-500 font-light mt-1">
                      No accounts required. All listed retail prices are fully inclusive. Complimentary worldwide express routing active.
                    </p>
                  </div>

                  <form onSubmit={handleDetailsSubmit} className="space-y-4" id="checkout-guest-form">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-mono">Recipient Name</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-black/10 text-sm text-[#1A1A1A] rounded-none focus:outline-none focus:border-[#C5A880] font-light"
                          placeholder="e.g. Radhika Mehra"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-mono">Secure Email Account</label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-black/10 text-sm text-[#1A1A1A] rounded-none focus:outline-none focus:border-[#C5A880] font-light"
                          placeholder="e.g. radhika@gmail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-mono">Secure Contact Mobile</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-black/10 text-sm text-[#1A1A1A] rounded-none focus:outline-none focus:border-[#C5A880] font-light"
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-mono">Physical Shipping Address</label>
                      <input 
                        type="text" 
                        required
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-black/10 text-sm text-[#1A1A1A] rounded-none focus:outline-none focus:border-[#C5A880] font-light"
                        placeholder="Street details, apartment number, villa reference..."
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-mono">City / Hub</label>
                        <input 
                          type="text" 
                          required
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-black/10 text-sm text-[#1A1A1A] rounded-none focus:outline-none focus:border-[#C5A880] font-light"
                          placeholder="e.g. Pune"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-mono">State / Union</label>
                        <input 
                          type="text" 
                          required
                          value={stateName}
                          onChange={e => setStateName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-black/10 text-sm text-[#1A1A1A] rounded-none focus:outline-none focus:border-[#C5A880] font-light"
                          placeholder="e.g. Maharashtra"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-mono">Postal Pincode</label>
                        <input 
                          type="text" 
                          required
                          value={pincode}
                          onChange={e => setPincode(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-black/10 text-sm text-[#1A1A1A] rounded-none focus:outline-none focus:border-[#C5A880] font-light"
                          placeholder="e.g. 412105"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-mono">Territory</label>
                        <select 
                          value={country}
                          onChange={e => setCountry(e.target.value)}
                          className="w-full px-2 py-2.5 bg-[#FAF9F6] border border-black/10 text-xs text-[#1A1A1A] rounded-none focus:outline-none focus:border-black"
                        >
                          <option value="India">India (Registered)</option>
                          <option value="France">France</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Germany">Germany</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full h-14 bg-neutral-900 hover:bg-[#C5A880] text-white rounded-none text-xs uppercase tracking-widest font-semibold transition-all duration-300 mt-6 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Payment Matrix</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: Payment select (Gateway simulator) */}
              {checkoutStep === 'payment-select' && (
                <motion.div 
                  key="payment-selection animate-fadeIn"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setCheckoutStep('details')}
                      className="text-xs uppercase text-[#C5A880] hover:underline font-semibold font-mono"
                    >
                      &larr; Back to coordinates
                    </button>
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif text-[#1A1A1A] font-light leading-tight">Digital Settlement Options</h3>
                    <p className="text-xs text-neutral-500 font-light mt-1 text-red-500">
                      * No Cash on Delivery (COD) services are active for luxury registry capsules under onboarding laws.
                    </p>
                  </div>

                  <div className="bg-stone-50 border border-black/5 p-4 flex gap-3 text-stone-700">
                    <CircleAlert className="w-5 h-5 text-[#C5A880] flex-shrink-0" />
                    <div>
                      <span className="text-xs font-semibold block">Secure Checkout Sandbox</span>
                      <p className="text-[10px] font-light leading-normal mt-0.5">
                        Please use any simulated payment details to process your purchase. The system will create a secure order record, check voucher codes, and issue a tracking docket.
                      </p>
                    </div>
                  </div>

                  {/* Payment Simulator Selection */}
                  <div className="space-y-4">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Simulated Wallet credentials</span>
                    <div className="border border-black/5 rounded-none bg-[#EAE7E2] p-6 space-y-4">
                      <div className="flex items-center gap-2 border-b border-stone-200/60 pb-3">
                        <CreditCard className="w-4.5 h-4.5 text-[#C5A880]" />
                        <span className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]">Sandbox Credit / Debit Cards</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-3">
                          <label className="block text-[9px] font-mono text-neutral-400 uppercase">Test card digits</label>
                          <input 
                            type="text" 
                            value={creditCardNumber}
                            onChange={e => setCreditCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                            maxLength={19}
                            className="w-full px-3 py-2 bg-white border border-black/10 text-xs text-[#1A1A1A] rounded-none font-mono outline-none"
                            placeholder="4111 2222 3333 4444 (Razorpay Test)"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[9px] font-mono text-neutral-400 uppercase font-light">Expr</label>
                          <input 
                            type="text" 
                            maxLength={5}
                            value={creditCardExpiry}
                            onChange={e => setCreditCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-black/10 text-xs text-[#1A1A1A] rounded-none font-mono outline-none"
                            placeholder="12/29"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[9px] font-mono text-neutral-400 uppercase font-light">CVV</label>
                          <input 
                            type="password" 
                            maxLength={3}
                            value={creditCardCVV}
                            onChange={e => setCreditCardCVV(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-black/10 text-xs text-[#1A1A1A] rounded-none font-mono outline-none"
                            placeholder="107"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={triggerRazorpayInstantSimulate}
                      className="w-full h-14 bg-[#1A1A1A] hover:bg-[#C5A880] text-white rounded-none text-xs uppercase tracking-widest font-semibold transition-all duration-300 mt-4 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <span>Confirm Razorpay Direct Settlement</span>
                    </button>
                    <p className="text-[10px] text-center text-neutral-400 font-mono uppercase tracking-wider">
                      Direct Settlement Order Value: {formatPrice(getTotalInActiveCurrency())}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Visual loading spinner */}
              {checkoutStep === 'processing' && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center space-y-6"
                >
                  <div className="w-16 h-16 border-4 border-stone-200 border-t-[#C5A880] rounded-full animate-spin mx-auto"></div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] font-mono">Securing Allocation</h4>
                    <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto leading-relaxed mt-2">
                      Securing order allocation, registering tracking code blocks with courier, and stamping custom invoices...
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Success confirmation invoice */}
              {checkoutStep === 'success' && createdOrder && (
                <motion.div 
                  key="success animate-fadeIn"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-6"
                  id="checkout-success-view"
                >
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="text-[9.5px] uppercase tracking-[0.2em] text-[#C5A880] font-bold font-mono">Invoice Dispatched</span>
                    <h3 className="text-2xl font-serif text-[#1A1A1A] font-light mt-1">Allocation Success</h3>
                    <p className="text-xs text-neutral-500 font-light mt-1.5 max-w-sm mx-auto leading-relaxed">
                      Thank you for your purchase, <strong className="text-neutral-800">{createdOrder.shippingAddress.name}</strong>. Your payment was approved and your items are now registered!
                    </p>
                  </div>

                  {/* Summary slip */}
                  <div className="border border-black/10 rounded-none bg-[#FAF9F6] p-5 space-y-3 font-mono text-left max-w-sm mx-auto shadow-sm">
                    <div className="flex justify-between border-b border-stone-200/50 pb-2 text-[11px] text-[#1A1A1A] font-semibold">
                      <span>Order Docket:</span>
                      <span className="text-[#C5A880]">{createdOrder.id}</span>
                    </div>
                    <div className="space-y-1 text-[10px] text-neutral-500">
                      <p>Recipient: {createdOrder.shippingAddress.name}</p>
                      <p>Carrier: DHL Express Priority</p>
                      <p>Consignment Label: {createdOrder.trackingNumber}</p>
                      <p>Destination: {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.country}</p>
                    </div>
                    <div className="border-t border-stone-200/50 pt-2 flex justify-between items-baseline">
                      <span className="text-[10px] uppercase font-bold text-[#1A1A1A]">Total Checked out:</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">{formatPrice(getTotalInActiveCurrency())}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-neutral-400 max-w-xs mx-auto leading-relaxed">
                    A copies confirmation will reach <strong className="text-neutral-700">{createdOrder.shippingAddress.email}</strong> shortly. Pin your Docket ID in the <strong>Track Order</strong> page to check routing details.
                  </p>

                  <button 
                    onClick={onClose}
                    className="w-full bg-[#1A1A1A] hover:bg-[#C5A880] text-white py-3.5 rounded-none text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer"
                  >
                    Finish luxury session
                  </button>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* RIGHT: Order review side drawer */}
          <div className="md:w-2/5 p-6 md:p-8 bg-[#F5F2ED] flex flex-col justify-between">
            <div className="space-y-6">
              <span className="block text-[10px] font-bold text-neutral-400 tracking-[0.2em] uppercase font-mono border-b border-stone-200/60 pb-3">Bag Allocation Ledger</span>
              
              {/* Product item listings */}
              <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-neutral-400 font-light font-sans py-4">Allocations are currently empty.</p>
                ) : (
                  cartItems.map((item) => {
                    const price = item.product.discountPriceINR || item.product.priceINR;
                    const convertedPrice = currency === 'USD' ? price * 0.012 : currency === 'EUR' ? price * 0.011 : price;

                    return (
                      <div key={`${item.product.id}-${item.selectedColor}`} className="flex items-start gap-3">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-12 h-16 object-cover rounded-none border border-black/5 bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow space-y-0.5">
                          <h5 className="text-xs text-[#1A1A1A] font-serif tracking-wide">{item.product.name}</h5>
                          <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                            <span>Finish: {item.selectedColor}</span>
                            <span>QTY: {item.quantity}</span>
                          </div>
                          <span className="text-xs font-semibold font-mono text-[#1A1A1A] block pt-0.5">
                            {formatPrice(convertedPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Coupon execution field */}
              {checkoutStep !== 'success' && (
                <form onSubmit={handleApplyCoupon} className="space-y-2 border-t border-black/10 pt-4" id="checkout-coupon-form">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Approve Atelier Voucher</span>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      className="flex-grow px-3 py-2 bg-white border border-stone-200 rounded text-xs tracking-widest uppercase font-mono outline-none focus:border-[#C5A880]"
                      placeholder="e.g. THEPRIVATEEDIT"
                      value={couponCodeInput}
                      onChange={e => setCouponCodeInput(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white rounded text-[10px] uppercase font-bold tracking-wider hover:bg-[#C5A880] transition-colors cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  
                  {couponError && (
                    <p className="text-[10px] text-red-500 font-light flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1"><Ticket className="w-3.5 h-3.5 text-emerald-500" /> {couponSuccess}</p>
                  )}

                  {/* Coupon tip helper */}
                  <div className="bg-[#FAF9F6] border border-black/5 rounded-none p-2 text-[9px] text-[#A58860] flex flex-wrap justify-between">
                    <span>Try: <strong>THEPRIVATEEDIT</strong> (10% Off)</span>
                    <span>•</span>
                    <span>or <strong>L007ELEVATE</strong> (₹2,000 Off &gt; 15k)</span>
                  </div>
                </form>
              )}
            </div>

            {/* Total Math summary box */}
            <div className="border-t border-black/10 pt-4 mt-6 space-y-2.5 font-sans">
              <div className="flex justify-between text-xs text-neutral-500 font-light">
                <span>Subtotal Items</span>
                <span className="font-mono">{formatPrice(getSubtotalInActiveCurrency())}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-xs text-emerald-600 font-medium font-mono">
                  <span>Promo ({appliedCoupon.code})</span>
                  <span>- {formatPrice(getDiscountInActiveCurrency())}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-neutral-400 italic">
                <span>Estimated Local Taxes (Included)</span>
                <span className="font-mono">{formatPrice(getTaxesInActiveCurrency())}</span>
              </div>

              <div className="flex justify-between text-xs text-neutral-500 font-light">
                <span>Complimentary Express Delivery</span>
                <span className="font-mono text-[10px] text-[#C5A880] uppercase tracking-wider font-semibold">FREE PRIORITY</span>
              </div>

              <div className="border-t border-black/10 pt-3 flex justify-between items-baseline font-mono">
                <span className="text-xs uppercase font-bold text-[#1A1A1A]">Unified Account Payable:</span>
                <span className="text-base font-bold text-[#1A1A1A]">
                  {formatPrice(getTotalInActiveCurrency())}
                </span>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
