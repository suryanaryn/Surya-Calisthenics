/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// Content is now hardcoded inside each component.

// Core layout section components
import Hero from './components/Hero';
import FloatingCta from './components/FloatingCta';
import Transformations from './components/Transformations';
import VideoTestimonials from './components/VideoTestimonials';
import About from './components/About';
import VideoSection from './components/VideoSection';
import Reviews from './components/Reviews';
import ProgramDetails from './components/ProgramDetails';
import Faq from './components/Faq';
import Footer from './components/Footer';
import JoinForm from './components/JoinForm';

// Lucide icon imports
import { X, Award, Flame, Zap, ShieldCheck } from 'lucide-react';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const instagramDmUrl = 'https://ig.me/m/surya_calisthenics';

  const triggerSignupPortal = () => {
    window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSdk2ypkGUNJOYUwSAfm_Nun9gGeS0zgC4ycJyEtLlRJC1NV2g/viewform';
  };

  const triggerInstagramDm = () => {
    window.open(instagramDmUrl, '_blank', 'noopener,noreferrer');
  };

  // Used by the Hero's secondary CTA ("View Client Results") to jump to the transformations gallery
  const scrollToResults = () => {
    const el = document.getElementById('transformations');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // No async content loading — render immediately.

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text font-sans antialiased selection:bg-brand-primary selection:text-white scroll-smooth">
      

     {/* 3. Video Section */}
      <VideoSection />

        {/* 4. Client Transformations Gallery */}
      <Transformations onCtaClick={triggerSignupPortal} />

      {/* 1. Hero Section */}
      <Hero onPrimaryCtaClick={triggerInstagramDm} onSecondaryCtaClick={scrollToResults} />

      
     {/* 5. Video Testimonials Carousel */}
      <VideoTestimonials />

      {/* 6. About the Coach */}
      <About onCtaClick={triggerSignupPortal} />

      

      {/* 2. Persistent Floating CTA */}
      <FloatingCta onClick={triggerSignupPortal} />

      


     

      

      {/* 7. Reviews / Testimonials (Infinite Marquee) */}
      <Reviews />

      {/* 8. Program Details */}
      <ProgramDetails onCtaClick={triggerSignupPortal} />

      

      {/* 9. FAQ */}
      <Faq />

      {/* Dedicated On-Page Signup Segment (for structural completeness and anchor targets) */}
      {/* <section className="py-24 bg-brand-bg border-t border-brand-border px-6 relative" id="enrollment-portal">
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-12">
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-brand-muted uppercase block mb-3">
            SECURE YOUR SPOT
          </span>
          <h2 className="text-4xl md:text-6xl font-serif italic font-normal tracking-tight text-brand-text">
            Apply For Personal Coaching
          </h2>
          <p className="text-brand-muted text-sm max-w-lg mx-auto mt-4 font-light">
            Submit your profile. Coach Surya personally reviews every submission via Instagram to maintain high program standards.
          </p>
        </div>

        <div className="max-w-xl mx-auto relative z-10">
          <JoinForm />
        </div>
      </section> */}

      {/* 8. Footer */}
      <Footer onJoinCtaClick={triggerSignupPortal} />

      {/* Modal Popup Sign-Up Portal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            {/* Dark glassmorphic backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Body Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-xl z-10 bg-[#0D0D0D] border border-white/10 rounded-none overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 z-50 text-zinc-400 hover:text-white bg-black hover:bg-white/5 p-2 rounded-none border border-white/10 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Form Content */}
              <JoinForm onSuccessClose={() => setIsModalOpen(false)} isModal={true} />
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}