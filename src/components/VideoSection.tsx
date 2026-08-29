/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Film, Play, Volume2, VolumeX } from 'lucide-react';
import logoImage from '../images/favicon.png';

interface VideoSectionProps {}

export default function VideoSection(_: VideoSectionProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const content = { youtube_id: 'A2Pyek_zsq0', video_title: 'Online Calisthenics Coaching' };
  const sectionRef = useRef<HTMLDivElement>(null);
  const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdk2ypkGUNJOYUwSAfm_Nun9gGeS0zgC4ycJyEtLlRJC1NV2g/viewform';

  // Video playback & sound states
  const [isPlaying, setIsPlaying] = useState(false);
  const [wantsSound, setWantsSound] = useState(true);
  const [isInView, setIsInView] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = `https://www.youtube.com/embed/${content.youtube_id}?autoplay=0&mute=1&loop=1&playlist=${content.youtube_id}&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&cc_load_policy=0&showinfo=0&enablejsapi=1&origin=${origin}`;

  // Helper to post messages to YouTube iframe
  const postCommand = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      'https://www.youtube.com'
    );
  }, []);

  const disableCaptions = useCallback(() => {
    postCommand('setOption', ['captions', 'track', {}]);
    postCommand('unloadModule', ['captions']);
  }, [postCommand]);

  const disableCaptionsWithRetry = useCallback(() => {
    disableCaptions();
    window.setTimeout(disableCaptions, 250);
    window.setTimeout(disableCaptions, 900);
  }, [disableCaptions]);

  // Handle Play button click: Start playing AND unmute audio
  const handleStartPlay = () => {
    setIsPlaying(true);
    setWantsSound(true);
    postCommand('unMute');
    postCommand('playVideo');
    disableCaptionsWithRetry();
  };

  const handleApplyClick = () => {
    window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
  };

  // Toggle Mute / Unmute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWantsSound((prev) => !prev);
  };

  // Sync mute/unmute state when toggled
  useEffect(() => {
    if (isPlaying) {
      postCommand(wantsSound ? 'unMute' : 'mute');
    }
  }, [wantsSound, isPlaying, postCommand]);

  // Pause video if scrolled out of view; resume if playing was previously triggered
  useEffect(() => {
    if (!isPlaying) return;

    if (isInView) {
      postCommand('playVideo');
    } else {
      postCommand('pauseVideo');
    }
  }, [isInView, isPlaying, postCommand]);

  // Intersection Observer for viewport tracking
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.3);
      },
      { threshold: [0, 0.3, 0.5, 1] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-brand-bg text-brand-text border-b border-brand-border" id="video">
      {/* Top nav bar pinned to the top edge of the video section */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="w-full px-3 sm:px-5 md:px-6">
          <div className="flex items-center justify-start pt-3 sm:pt-4 pb-1">
            <div className="flex items-center gap-3">
              <img
                src={logoImage}
                alt="Surya Calisthenics logo"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
                loading="eager"
              />
              <div className="text-left leading-none">
                <span className="font-script block text-xl sm:text-2xl text-brand-primary leading-none">
                  Surya
                </span>
                <span className="block text-[9px] sm:text-[10px] font-extrabold tracking-[0.25em] text-brand-text mt-1">
                  CALISTHENICS
                </span>
              </div>
            </div>
            {/* Placeholder trigger only — wire this up to a mobile nav drawer if/when one exists */}
            {/* <button
              type="button"
              aria-label="Open menu"
              className="p-2 -mr-2 text-brand-text cursor-pointer"
            >
              <Menu className="h-6 w-6" strokeWidth={2} />
            </button> */}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10 text-center min-h-[100vh] flex flex-col justify-center py-4 md:py-6">
        <div className="mb-4 md:mb-5 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-[3.2rem] font-serif italic font-normal tracking-tight text-brand-text leading-tight">
            <span className="text-brand-primary">⚠️</span>{' '}
            <span className="text-brand-primary">Watch Before Joining</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-xs sm:text-sm leading-relaxed text-brand-muted">
            Meet <span>Coach Surya</span>, discover how you can build your own body  through calisthenics. <span className='font-bold text-brand-secondary'> LIMITED SEATS LEFT !!!</span>
          </p>
        </div>

        {/* Video Player Frame */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-none shadow-3xl group w-full max-w-[1100px] mx-auto"
        >
          <div className="relative rounded-none p-[1px] bg-brand-border">
            <div className="relative aspect-video w-full rounded-none overflow-hidden bg-black max-h-[58vh]">
              
              {/* YouTube Iframe */}
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title={content.video_title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className="absolute top-0 left-0 w-full h-full border-0"
              />

              {/* Custom Overlay & Play Button (Shown until user clicks play) */}
              {!isPlaying && (
                <div 
                  onClick={handleStartPlay}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] cursor-pointer group/overlay transition-all hover:bg-black/40"
                >
                  {/* Thumbnail / Poster Image Background Fallback */}
                  <img
                    src={`https://img.youtube.com/vi/${content.youtube_id}/maxresdefault.jpg`}
                    alt={content.video_title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  
                  <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-4">
                    {/* Glowing Play Button Icon */}
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-brand-primary/90 text-black flex items-center justify-center shadow-2xl transition-transform transform group-hover/overlay:scale-110">
                      <Play className="h-5 w-5 sm:h-7 sm:w-7 fill-current ml-1" />
                    </div>
                    <span className="font-mono text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-widest text-white bg-black/80 px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20 shadow-lg">
                      Meet your coach Surya
                    </span>
                  </div>
                </div>
              )}

              {/* Interaction blocker so user cannot touch YouTube chrome while playing */}
              {isPlaying && (
                <div
                  className="absolute top-0 left-0 w-full h-full z-10 cursor-default pointer-events-auto"
                  aria-hidden="true"
                />
              )}

              {/* Mute/Unmute toggle button (Visible while playing) */}
              {isPlaying && (
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={wantsSound ? 'Mute video' : 'Unmute video'}
                  aria-pressed={wantsSound}
                  className="absolute bottom-3 right-3 z-30 flex items-center justify-center h-9 w-9 rounded-none bg-black/70 border border-white/20 text-white hover:bg-black/90 transition-colors backdrop-blur-sm"
                >
                  {wantsSound ? (
                    <Volume2 className="h-4 w-4 text-brand-primary" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>
              )}

            </div>
          </div>
        </motion.div>

        <div className="mt-4 md:mt-5 flex justify-center ">
          <motion.button
            type="button"
            onClick={handleApplyClick}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(255, 0, 0, 0.2), 0 8px 18px rgba(255, 0, 0, 0.18)',
                '0 0 0 6px rgba(255, 0, 0, 0.12), 0 12px 28px rgba(255, 0, 0, 0.34)',
                '0 0 0 0 rgba(255, 0, 0, 0.2), 0 8px 18px rgba(255, 0, 0, 0.18)'
              ]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-[84%] max-w-[320px] sm:w-auto px-6 md:px-8 py-3 bg-brand-primary text-white border-2 border-[#111111] hover:bg-brand-secondary hover:border-[#111111] transition-colors font-mono text-[11px] md:text-xs uppercase tracking-[0.18em] font-bold cursor-pointer rounded-xl shadow-[0_6px_0_#111111]"
          >
            Book 1-1 Personal Training
          </motion.button>
        </div>

        {/* Section Header */}
        {/* <div className="my-12">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-[0.3em] text-brand-primary uppercase mb-3">
            <Film className="h-3.5 w-3.5 text-brand-primary" /> INSIDE MY COACHING SYSTEM
          </span>
          <h2 className="text-4xl md:text-6xl font-serif italic font-normal tracking-tight text-brand-text">
            Train smarter <span className="text-brand-primary">Progress faster</span>
          </h2>
          <p className="text-brand-muted text-sm md:text-sm max-w-xl mx-auto mt-4 font-sans font-light">
            {content.video_title} — Discover the proven training methods, progressions, and coaching strategies I use to help athletes build real strength, master Basic to advanced calisthenics skills, and achieve consistent results—without wasting time on ineffective workouts.
          </p>
        </div> */}
      </div>
    </section>
  );
}