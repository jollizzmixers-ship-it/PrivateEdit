import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#F5F2ED] py-12 md:py-20 border-b border-black/5" id="editorial-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          {/* LEFT: Structural Editorial Message */}
          <div className="md:col-span-6 space-y-6 lg:pr-10">
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <span className="h-[1px] w-6 bg-[#C5A880]"></span>
              <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.3em] uppercase text-[#C5A880]">
                Curated Capsule Register No. 07
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#1A1A1A] leading-[1.1] tracking-wide"
            >
              Silent Luxury.<br />
              Define <span className="italic font-normal text-[#C5A880]">Presence</span>.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm md:text-base text-neutral-500 font-light leading-relaxed max-w-lg"
            >
              Hand-selected Italian leather satchels, gilded waist cinches, and Swiss timepieces. Beautifully designed to assert standard elegance through silent sophistication, not loud logo branding.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button 
                onClick={onExploreClick}
                className="px-8 py-3.5 bg-[#1A1A1A] text-white hover:bg-neutral-800 border border-black/10 rounded-none text-[11px] uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Accompany Atelier Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Quick trust metrics for Razorpay approval */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="grid grid-cols-2 gap-4 pt-10 border-t border-black/5 max-w-sm font-mono text-[9.5px] uppercase tracking-wider text-neutral-400"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#C5A880]" />
                <span>TAXES INCLUDED<br />NO EXTRA COSTS</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#C5A880]" />
                <span>7-DAY EASY RETS<br />FREE COURIER PICKUP</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Big High-Fashion Composition Collage */}
          <div className="md:col-span-6 relative">
            <div className="grid grid-cols-12 gap-4 items-end">
              
              {/* Primary Large Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-8 relative rounded-none overflow-hidden border border-black/5 bg-[#EAE7E2]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80" 
                  alt="Elite Handbag Editorial" 
                  className="w-full h-[380px] md:h-[450px] object-cover hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/95 text-[9px] font-semibold uppercase tracking-widest py-1 px-2.5 rounded shadow-sm border border-black/5 font-mono text-[#C5A880]">
                  Alabaster Box Bag
                </div>
              </motion.div>

              {/* Offset Overlapping High Fashion Image */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-4 translate-y-6 md:translate-y-12 shrink-0 space-y-4"
              >
                <div className="rounded-none overflow-hidden border border-black/5 bg-[#EAE7E2]">
                  <img 
                    src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80" 
                    alt="Rose Gold watch close-up" 
                    className="w-full h-36 md:h-44 object-cover hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-[#EAE7E2] border border-black/5 rounded-none p-3 text-center">
                  <span className="block text-[8px] uppercase tracking-widest text-[#C5A880] font-bold font-mono">Precision Movement</span>
                  <span className="block text-xs font-serif text-[#1a1a1a] font-light italic mt-0.5">Swiss Caliber</span>
                </div>
              </motion.div>
            </div>
            
            {/* Visual background ambient details */}
            <div className="absolute -z-10 w-48 h-48 bg-[#F5EFE6] rounded-full blur-3xl -top-10 -right-10 opacity-60"></div>
          </div>

        </div>
      </div>
    </section>
  );
};
