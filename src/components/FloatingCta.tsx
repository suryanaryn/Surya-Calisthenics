/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame } from 'lucide-react';

interface FloatingCtaProps {
  onClick: () => void;
}

export default function FloatingCta({ onClick }: FloatingCtaProps) {
  const content = { button_text: 'Join 1-1 Personal Training' };
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const videoSection = document.getElementById('video');
      const threshold = videoSection ? videoSection.offsetTop + videoSection.offsetHeight * 0.45 : window.innerHeight;

      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-8 right-8 z-50 pointer-events-auto"
        >
          <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-brand-primary text-white pl-6 pr-2 py-2 rounded-full shadow-2xl border border-brand-primary group cursor-pointer transition-all duration-300"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] font-mono">{content.button_text}</span>
            <div className="w-8 h-8 rounded-full bg-white text-brand-primary flex items-center justify-center animate-pulse shrink-0">
              <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
