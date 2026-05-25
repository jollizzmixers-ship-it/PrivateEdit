import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Truck, Sparkles, ReceiptText } from 'lucide-react';

const ANNOUNCEMENTS = [
  { text: "THE PRIVATE EDIT RESIDES EXCLUSIVELY AT WWW.THEPRIVATEEDIT.STORE", icon: Sparkles },
  { text: "TAXES COMPREHENSIVELY INCLUDED IN ALL LISTED PRICING • NO SURPRISES AT CHECKOUT", icon: ReceiptText },
  { text: "COMPLIMENTARY DHL PRIORITIE WORLDWIDE EXPRESS SHIPPING ON ALL COGNAC & EMERALD PIECES", icon: Truck },
  { text: "GUEST CHECKOUT SECURED VIA RAZORPAY COOPERATIVE PAYMENTS • NO COD ACTIVE", icon: ShieldCheck }
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = ANNOUNCEMENTS[currentIndex].icon;

  return (
    <div className="bg-[#1A1A1A] text-white py-2.5 px-4 overflow-hidden border-b border-stone-800" id="announcement-bar">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center gap-2.5 text-[10px] md:text-xs tracking-[0.22em] text-center uppercase font-mono font-light selection:bg-[#C5A880]"
          >
            <CurrentIcon className="w-3.5 h-3.5 text-[#C5A880] animate-pulse shrink-0" />
            <span>{ANNOUNCEMENTS[currentIndex].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
