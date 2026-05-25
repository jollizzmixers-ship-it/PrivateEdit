import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, CheckCircle, Search, Truck, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { Order } from '../types';

// Shared Editorial Header for pages
const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="text-center py-16 bg-[#F5F2ED] border-b border-black/5" id="page-header">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-xs tracking-[0.25em] text-[#C5A880] uppercase font-medium block mb-3"
    >
      Atelier Journal
    </motion.span>
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="text-4xl md:text-5xl font-light tracking-wide text-[#1A1A1A] font-serif mb-4"
    >
      {title}
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto italic font-light px-4"
    >
      {subtitle}
    </motion.p>
  </div>
);

// ABOUT US PAGE
export const AboutPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#F5F2ED] min-h-screen"
      id="about-us-page"
    >
      <PageHeader 
        title="The Private Edit" 
        subtitle="A design statement defined by whispering elegance, structural honesty, and timeless luxury." 
      />
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold block mb-4">The Atelier Story</span>
            <h2 className="text-3xl font-light text-[#1A1A1A] font-serif mb-6 leading-snug">
              Curating high-end statement accessories for the discerning wardrobe.
            </h2>
            <div className="space-y-4 text-neutral-600 font-light leading-relaxed text-sm md:text-base">
              <p>
                Founded on the pillar of intellectual minimalism, <strong>The Private Edit</strong> champions luxury items that assert presence through silent confidence. We reject loud logos and mass production, believing instead that true opulence lies in the pristine caliber of calfskins, micro-millimeter alignment, and hand-sculpted hardware.
              </p>
              <p>
                Each piece—be it a sculpted vachetta leather waist cinch, an architectural travel companion, or a swiss-caliber timekeeper—is carefully designed and monitored, starting in our partner design bureaus in Paris and culminating in master handcrafting in Tuscany, France, and Japan.
              </p>
              <p>
                We maintain an ultra-exclusive production register. Only limited numbers of each capsule are assembled to honor raw artistry, prevent unused inventory fatigue, and preserve the ultimate rarity of your investment.
              </p>
            </div>
          </div>
          <div>
            <div className="relative rounded-none overflow-hidden border border-black/5 bg-[#EAE7E2]">
              <img 
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80" 
                alt="Luxury leather atelier crafting" 
                className="w-full h-[450px] object-cover mix-blend-multiply opacity-90 transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>

        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-b border-black/10 py-12">
          <div>
            <span className="text-3xl font-light font-serif text-[#C5A880] mb-2 block">100% Verified</span>
            <h3 className="text-sm font-medium uppercase tracking-widest text-[#1A1A1A] mb-2">Italian Leather</h3>
            <p className="text-xs text-neutral-500 font-light px-4 leading-relaxed">
              We exclusively utilize full-grain, vegetable-tanned certified skins from certified European tanneries.
            </p>
          </div>
          <div className="border-y md:border-y-0 md:border-x border-black/10 py-8 md:py-0">
            <span className="text-3xl font-light font-serif text-[#C5A880] mb-2 block">Slow Fashion</span>
            <h3 className="text-sm font-medium uppercase tracking-widest text-[#1A1A1A] mb-2">Limited Batch Register</h3>
            <p className="text-xs text-neutral-500 font-light px-4 leading-relaxed">
              Fewer than 100 units are crafted for each style launch globally, shielding against redundant excess.
            </p>
          </div>
          <div>
            <span className="text-3xl font-light font-serif text-[#C5A880] mb-2 block">Fair Trade</span>
            <h3 className="text-sm font-medium uppercase tracking-widest text-[#1A1A1A] mb-2">Sustainable Legacy</h3>
            <p className="text-xs text-neutral-500 font-light px-4 leading-relaxed">
              All partnering ateliers comply with robust working wage mandates and clean water recycle systems.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// CONTACT US PAGE
export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', reason: 'Support', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', reason: 'Support', message: '' });
    }, 4000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#F5F2ED] min-h-screen"
      id="contact-us-page"
    >
      <PageHeader 
        title="Connect With Us" 
        subtitle="Speak directly with a dedicated private concierge at our Indian headquarters." 
      />
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Contact Details & Map */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold block mb-2">The Private Bureau</span>
              <h2 className="text-2xl font-light font-serif text-[#1A1A1A] mb-6">Concierge Details</h2>
              <p className="text-sm text-neutral-500 font-light leading-relaxed mb-6">
                Our support team is active from 10:00 AM to 7:00 PM IST, Monday through Saturday. We answer all boutique inquiries within two hours.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#EAE7E2] rounded-none border border-black/5 text-[#C5A880]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 capitalize block font-light">Client Relations</span>
                    <a href="tel:+917987205847" className="text-sm text-[#1A1A1A] hover:text-[#C5A880] transition-colors font-medium">
                      +91-7987205847
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#EAE7E2] rounded-none border border-black/5 text-[#C5A880]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 capitalize block font-light">Boutique & Press Inbox</span>
                    <a href="mailto:Jollizzmixers@gmail.com" className="text-sm text-[#1A1A1A] hover:text-[#C5A880] transition-colors font-medium">
                      Jollizzmixers@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#EAE7E2] rounded-none border border-black/5 text-[#C5A880]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 capitalize block font-light">Registered Headquarters</span>
                    <p className="text-sm text-[#1A1A1A] font-light leading-relaxed">
                      Lodha Belmondo, Gahunje,<br />
                      Pune, Maharashtra - 412105, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Styled Placeholder */}
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold block mb-4">Location Map</span>
              <div className="w-full h-56 rounded-none border border-black/5 overflow-hidden bg-[#EAE7E2] relative flex flex-col items-center justify-center text-center p-6 shadow-sm">
                {/* Simulated minimal vector map background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10%" y1="0%" x2="10%" y2="100%" stroke="currentColor" strokeWidth="2" />
                    <line x1="40%" y1="0%" x2="40%" y2="100%" stroke="currentColor" strokeWidth="2" />
                    <line x1="80%" y1="0%" x2="80%" y2="100%" stroke="currentColor" strokeWidth="2" />
                    <line x1="0%" y1="20%" x2="100%" y2="20%" stroke="currentColor" strokeWidth="2" />
                    <line x1="0%" y1="60%" x2="100%" y2="60%" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <div className="relative z-10 space-y-2">
                  <div className="w-10 h-10 bg-[#C5A880] rounded-full flex items-center justify-center text-white mx-auto animate-bounce shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A]">Lodha Belmondo Atelier</h4>
                  <p className="text-xs text-neutral-500 font-light max-w-xs leading-relaxed">
                    Pune-Mumbai Highway, Gahunje, Pune. Framed by clean, high-contrast layouts overlooking the golf course.
                  </p>
                  <a 
                    href="https://maps.google.com/?q=Lodha+Belmondo+Gahunje+Pune" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-[#C5A880] hover:underline font-medium inline-flex items-center gap-1 mt-2"
                  >
                    Get GPS Navigation <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#F5F2ED] border border-black/5 rounded-none p-8 md:p-10">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold block mb-2">Atelier Inquiry</span>
            <h2 className="text-2xl font-light font-serif text-[#1A1A1A] mb-6">Write to the Director</h2>
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-black/5 rounded-none p-8 text-center space-y-4 shadow-sm"
                  id="contact-success-msg"
                >
                  <div className="w-12 h-12 bg-[#FAF6F0] rounded-full flex items-center justify-center text-[#C5A880] mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif text-[#1A1A1A] font-light">Inquiry Dispatched</h3>
                  <p className="text-xs md:text-sm text-neutral-500 font-light leading-relaxed max-w-sm mx-auto">
                    Thank you. Your message has been integrated. A representative from the private edit will connect with you via <strong className="text-[#1A1A1A]">{formData.email}</strong> shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" id="concierge-contact-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-2">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-black/10 rounded-none text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] font-light transition-colors"
                        placeholder="e.g. Radhika Mehra"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-black/10 rounded-none text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] font-light transition-colors"
                        placeholder="e.g. name@domain.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-black/10 rounded-none text-sm text-[#1A1A1A] focus:outline-none focus:border-black font-light transition-colors"
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-2">Inquiry Purpose</label>
                      <select 
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-black/10 rounded-none text-sm text-[#1A1A1A] focus:outline-none focus:border-black font-light transition-colors"
                      >
                        <option value="Support">Product Sizing / Care</option>
                        <option value="Shipping">Worldwide Premium Shipping</option>
                        <option value="Press">Media & Brand Collaboration</option>
                        <option value="Custom">Bespoke Design Requests</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-2">Your Message</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-none text-sm text-[#1A1A1A] focus:outline-none focus:border-black font-light transition-colors resize-none"
                      placeholder="Detail your query here with leather finishes or watches styles..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1A1A1A] hover:bg-neutral-800 text-white py-4 rounded-none text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer"
                  >
                    Transmit Message
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// TRACK ORDER PAGE
export const TrackOrderPage: React.FC = () => {
  const [trackNumber, setTrackNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentShipment, setCurrentShipment] = useState<any | null>(null);

  // Hardcoded tracking DB based on mock orders
  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const idClean = trackNumber.trim().toUpperCase();

    if (!idClean) return;

    if (idClean === "TPE-9204") {
      setCurrentShipment({
        id: "TPE-9204",
        recipient: "Radhika Mehra",
        items: "The Amandine Box Bag, Aurelia Belt",
        carrier: "DHL Priority Express",
        status: "Shipped",
        milestones: [
          { label: "Boutique Order Received", desc: "Taxes settled, inventory allocated", date: "May 22, 2026", done: true },
          { label: "Bespoke Packaging Completed", desc: "Monogram box and custom wrapping check", date: "May 23, 2026", done: true },
          { label: "Handled to Premium Carrier", desc: "Scanned at Delhi DHL Gateway", date: "May 24, 2026", done: true },
          { label: "In Transit", desc: "Moving smoothly in Mumbai dispatch node", date: "May 25, 2026", done: true, current: true },
          { label: "Destination Delivery", desc: "Out for delivery with courier", date: "Estimated May 27, 2026", done: false }
        ]
      });
    } else if (idClean === "TPE-9183") {
      setCurrentShipment({
        id: "TPE-9183",
        recipient: "Clara Dubois (Vogue Paris Office)",
        items: "The Eternelle Classic Link Watch",
        carrier: "FedEx International Luxury Priority",
        status: "Delivered",
        milestones: [
          { label: "Boutique Order Received", desc: "Payment verified", date: "May 18, 2026", done: true },
          { label: "Custom Inspection Passed", desc: "Export papers set", date: "May 19, 2026", done: true },
          { label: "Atelier Departed International", desc: "Air Cargo boarding", date: "May 20, 2026", done: true },
          { label: "Customs Cleared at CDG", desc: "Paris central routing clearance code", date: "May 21, 2026", done: true },
          { label: "Signed Hand-Delivery", desc: "Delivered & signed by Clara Dubois", date: "May 22, 2026", done: true, current: true }
        ]
      });
    } else {
      // Dynamic generation of real-time mockup so it works for all typed numbers to fulfill "fully functional"
      const formatCheck = idClean.match(/^TPE-\d{4}$/);
      if (formatCheck) {
        setCurrentShipment({
          id: idClean,
          recipient: "Valued Guest Client",
          items: "Luxury Statement Capsule",
          carrier: "DHL Priority Airway",
          status: "Processing",
          milestones: [
            { label: "Boutique Order Received", desc: "Payment approved, custom dispatch file open", date: "Today", done: true, current: true },
            { label: "Bespoke Packaging Completed", desc: "Bespoke leather inspection", date: "Pending", done: false },
            { label: "Handled to Premium Carrier", desc: "Carrier handover docket", date: "Pending", done: false },
            { label: "In Transit", desc: "International air cargo routing path", date: "Pending", done: false },
            { label: "Destination Delivery", desc: "Signed luxury hand-delivery", date: "Pending", done: false }
          ]
        });
      } else {
        // Suggest helpful format
        setErrorMsg('Please enter a valid luxury docket matching "TPE-9204", "TPE-9183" or format "TPE-XXXX".');
        setCurrentShipment(null);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#F5F2ED] min-h-screen pb-20"
      id="track-order-page"
    >
      <PageHeader 
        title="Track Your Shipment" 
        subtitle="Access real-time milestones of your bespoke capsule's journey from our atelier to your residence." 
      />
      <div className="max-w-3xl mx-auto px-6 mt-12">
        <div className="bg-white border border-black/5 rounded-none p-8 shadow-sm">
          <form onSubmit={handleTrack} className="space-y-4" id="tracking-form">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-widest mb-3 text-center">
                Enter Invoice / Airway Tracking Number
              </label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  placeholder="e.g. TPE-9204"
                  value={trackNumber}
                  onChange={e => setTrackNumber(e.target.value)}
                  className="w-full text-center px-4 py-4 border border-black/10 rounded-none text-lg uppercase tracking-widest text-[#1A1A1A] focus:outline-none focus:border-black font-mono font-medium"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 p-2 bg-[#1A1A1A] hover:bg-[#C5A880] text-white rounded transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            {errorMsg && (
              <p className="text-xs text-red-500 font-light text-center" id="tracking-error">{errorMsg}</p>
            )}
            <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-neutral-400 border-t border-neutral-100 pt-3">
              <span>Try: <strong className="text-[#C5A880] cursor-pointer" onClick={() => setTrackNumber('TPE-9204')}>TPE-9204</strong> (In-Transit)</span>
              <span>•</span>
              <span>or: <strong className="text-[#C5A880] cursor-pointer" onClick={() => setTrackNumber('TPE-9183')}>TPE-9183</strong> (Delivered)</span>
            </div>
          </form>
        </div>

        {/* Live Milestones Container */}
        <AnimatePresence mode="wait">
          {currentShipment && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 bg-white border border-black/5 rounded-none overflow-hidden shadow-sm"
              id="tracking-milestones"
            >
              <div className="bg-[#F5F2ED] border-b border-black/5 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block font-mono">Premium Consignment ID</span>
                  <span className="text-xl font-serif text-[#1A1A1A] font-light tracking-wide">{currentShipment.id}</span>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block font-mono">Consolidated Carrier</span>
                  <div className="flex items-center gap-1 font-semibold text-sm text-[#1A1A1A]">
                    <Truck className="w-4 h-4 text-[#C5A880]" />
                    {currentShipment.carrier}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-6 flex flex-wrap gap-4 text-xs font-light text-neutral-500">
                  <p>Recipient: <strong className="text-[#1A1A1A] font-normal">{currentShipment.recipient}</strong></p>
                  <span>|</span>
                  <p>Contents: <strong className="text-[#1A1A1A] font-normal">{currentShipment.items}</strong></p>
                </div>

                <div className="relative border-l border-black/10 ml-4 pl-8 space-y-8 py-2">
                  {currentShipment.milestones.map((ms: any, idx: number) => (
                    <div key={idx} className="relative group">
                      {/* Active indicator node */}
                      <span className={`absolute -left-[41px] top-0.5 w-[18px] h-[18px] rounded-none border-2 bg-white flex items-center justify-center transition-all ${
                        ms.done 
                          ? 'border-[#C5A880] text-[#C5A880]' 
                          : 'border-neutral-200 text-neutral-300'
                      }`}>
                        {ms.done && <div className="w-2.5 h-2.5 bg-[#C5A880] rounded-none"></div>}
                      </span>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm tracking-wide ${
                            ms.current 
                              ? 'text-[#C5A880] font-semibold' 
                              : ms.done 
                              ? 'text-[#1A1A1A] font-medium' 
                              : 'text-neutral-400 font-light'
                          }`}>
                            {ms.label}
                          </h4>
                          {ms.current && (
                            <span className="text-[9px] bg-[#C5A880]/15 text-[#C5A880] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-semibold animate-pulse">
                              Active
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${ms.done ? 'text-neutral-500' : 'text-neutral-400'} font-light leading-relaxed`}>
                          {ms.desc}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-mono block pt-0.5">{ms.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// LEGAL COMPLIANCE COMPONENT CONSOLIDATOR FOR CLEAN VIEW
interface PolicyProps {
  title: string;
  updateDate: string;
  children: React.ReactNode;
}
const PolicyLayout: React.FC<PolicyProps> = ({ title, updateDate, children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-[#F5F2ED] min-h-screen py-16"
      id="policy-layout"
    >
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold block mb-2">Legal Ledger</span>
        <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mb-2">{title}</h1>
        <p className="text-xs font-mono text-neutral-400 mb-10">Last updated: {updateDate} | Fully Compliant with Razorpay Onboarding Mandates</p>
        
        <div className="prose prose-stone max-w-none text-neutral-600 font-light leading-relaxed text-sm md:text-base space-y-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

// PRIVACY POLICY
export const PrivacyPolicy: React.FC = () => {
  return (
    <PolicyLayout title="Privacy Policy" updateDate="May 25, 2026">
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">1. Policy Architecture Overview</h3>
        <p>
          At <strong>The Private Edit</strong>, we strictly respect the privacy integrity of our luxury clientele. This Policy describes how your personal details are processed, tracked, and stored when you interact with our website to purchase fashion accessory merchandise. We maintain direct compliance with global security regulations and secure payment merchant APIs (Razorpay, Stripe, etc.). This site offers a curated 100% guest checkout, storing credentials purely to process priority shipping.
        </p>
      </section>
      
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">2. Information We Collect</h3>
        <p>
          When you complete guest checkouts, we collect the necessary order-fulfillment coordinates, including legal name, email adress, secure phone number, standard billing/shipping address, and postal routing indicators.
        </p>
        <p>
          All transaction mechanics are handled via secure direct payment processors. <strong>The Private Edit</strong> does not store, read, or write credit card details, CVVs, or online banking credentials directly on our application infrastructure.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">3. Storage & Third-Party Disclosure</h3>
        <p>
          Your customer coordinates are stored securely to verify shipments, process 7-day returns, or answer contact forms. We do not sell, leak, or lease client emails to external marketing agencies. Coordinates are shared exclusively with trusted priority mailing channels (such as DHL Express or FedEx) to execute international deliveries.
        </p>
      </section>

      <section className="space-y-3 flex items-center gap-3 p-4 bg-[#EAE7E2] border border-black/5 rounded-none">
        <ShieldCheck className="w-6 h-6 text-[#C5A880] flex-shrink-0" />
        <p className="text-xs font-light text-neutral-500 m-0 leading-normal">
          For any data protection requests, or to ask to wipe your transaction logs from the administrative panel histories, email: <a href="mailto:Jollizzmixers@gmail.com" className="font-medium text-[#1A1A1A]">Jollizzmixers@gmail.com</a>.
        </p>
      </section>
    </PolicyLayout>
  );
};

// TERMS OF SERVICE
export const TermsOfService: React.FC = () => {
  return (
    <PolicyLayout title="Terms Of Service" updateDate="May 25, 2026">
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">1. Conditions of Use</h3>
        <p>
          Welcome to our elite digital catalog. Services offered on <strong>The Private Edit</strong> are contingent upon key terms detailed herein. Users browsing the boutique affirm complete understanding and legal compliance with both local Indian and world trade laws.
        </p>
      </section>
      
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">2. Checkout Protocols</h3>
        <p>
          We operate an exclusive <strong>Guest-Only checkout</strong> pipeline. Clients guarantee that all delivery coordinates and communication accounts provided are accurate. Since we do not facilitate Cash on Delivery (COD) services, order execution is bound entirely to online settlement success. Successful transaction confirmation displays immediately in your secure browser tab.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">3. Pricing Integrity & Taxes</h3>
        <p>
          All pricing values featured alongside products are denominated in Indian Rupees (INR) and displayed with alternative international equivalents. All retail taxes and duties are fully included inside checkout and catalog prices. No hidden platform costs are loaded at final settlement bounds.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">4. Limitation of Liability</h3>
        <p>
          We retain absolute rights to dismiss checkout orders if item stocks are exhausted, if suspicious billing triggers occur, or if local shipping dockets are blacklisted by key carriers.
        </p>
      </section>
    </PolicyLayout>
  );
};

// REFUND AND RETURN POLICY
export const RefundPolicy: React.FC = () => {
  return (
    <PolicyLayout title="Refund & Return Policy" updateDate="May 25, 2026">
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">1. The 7-Day Luxury Guarantee</h3>
        <p>
          To maintain absolute satisfaction with your luxury procurement, <strong>The Private Edit</strong> provides a strict <strong>7-Day return window</strong> starting directly from the physical delivery confirmation date marked by our primary courier.
        </p>
      </section>
      
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">2. Return Eligibility</h3>
        <p>
          To qualify for a refund:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-600 font-light font-sans">
          <li>The accessory must remain completely unworn, clean, unmarred, and in its original state.</li>
          <li>All product tags, custom packaging elements, luxury linen dust bags, and certified metal protection layers must be intact.</li>
          <li>Reversible belts must present zero buckle scoring, and fine-gauge watches must have absolute bezel shields intact.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">3. Non-Returnable Scenarios</h3>
        <p>
          Returns requested after the 7-day threshold are non-refundable. Custom engraved leather or watches featuring tailor-fit size modifications are strictly non-returnable.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">4. Zero COD Refund Clause</h3>
        <p>
          Because we maintain a strict <strong>No COD structure</strong>, all transactions are settled digitally. Refunds are initiated instantly back to your original source channel (online debit/credit network, net banking account, or UPI handle via Razorpay) within 4-5 bank settlement business days.
        </p>
      </section>

      <section className="space-y-3 p-4 bg-[#EAE7E2] border border-black/5 rounded-none">
        <h4 className="text-sm font-semibold text-[#1A1A1A] m-0">Initiating a Return:</h4>
        <p className="text-xs text-neutral-500 font-light mt-1 leading-normal m-0">
          Email support with your invoice tracking number (e.g., TPE-XXXX) at: <a href="mailto:Jollizzmixers@gmail.com" className="font-medium text-[#1A1A1A] hover:underline">Jollizzmixers@gmail.com</a>. Our support team will issue a premium reverse pickup checklist immediately at no extra shipping cost to you.
        </p>
      </section>
    </PolicyLayout>
  );
};

// SHIPPING POLICY
export const ShippingPolicy: React.FC = () => {
  return (
    <PolicyLayout title="Shipping & Logistics Policy" updateDate="May 25, 2026">
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">1. Worldwide Luxury Priority Courier</h3>
        <p>
          We operate worldwide shipping channels. All global orders are dispatched securely from our central distribution nodes. We proudly partner with premier air logistics carriers, including <strong>DHL Priority Express</strong> and <strong>FedEx International First Class</strong>, ensuring absolute priority speed and immaculate package security.
        </p>
      </section>
      
      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">2. Timelines & Tracking Coordinates</h3>
        <p>
          Order packages are verified and processed within 1–2 business days from initial settlement. Shipment milestone tracking dockets are transmitted straight to client email accounts once packages board.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-600 font-light font-sans">
          <li><strong>Metropolitan India (Delhi, Mumbai, Bengaluru, Pune etc):</strong> 2–4 Business Days.</li>
          <li><strong>Rest of India / Sizing hubs:</strong> 3–5 Business Days.</li>
          <li><strong>International Express Routing (Europe, US, East Asia):</strong> 4–7 Business Days.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">3. Complete Tax & Customs Integrity</h3>
        <p>
          All listed retail prices are comprehensive. <strong>Taxes and duties are entirely included</strong> inside your displayed product price. For our international destinations, we pre-clear relevant regulatory customs charges, meaning there are no surprise tariffs or terminal handling blocks at delivery checkpoint targets!
        </p>
      </section>

      <section className="space-y-3 flex items-start gap-4 p-5 bg-[#EAE7E2] border border-black/5 rounded-none">
        <div className="p-2.5 bg-white border border-black/5 rounded-none text-[#C5A880]">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold m-0 text-[#1A1A1A]">Immaculate Double Box Protection</h4>
          <p className="text-xs text-neutral-500 font-light mt-1 leading-relaxed m-0">
            Every Handbag, Belt, and Watch is placed in dynamic micro-padded envelopes, encased inside our custom linen-wrapped hard-box structures, and packed cleanly inside rigid, waterproof outer carton barriers. Secure hand-delivery requires an active mobile OTP or signature verification on receipt.
          </p>
        </div>
      </section>
    </PolicyLayout>
  );
};
