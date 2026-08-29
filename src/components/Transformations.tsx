/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Sparkles,
  ArrowLeftRight,
  Users,
  Trophy,
  CalendarCheck,
  Star,
  Play,
  ArrowRight,
} from 'lucide-react';
import { TransformationItem } from '../types';
import transform1 from '../images/transform1.png';
import transform2 from '../images/transform2.png';
import transform3 from '../images/transform3.jpg';
import transform4 from '../images/transform4.png';
import transform5 from '../images/transform5.PNG';

interface TransformationsProps {
  items?: TransformationItem[];
  onCtaClick: () => void;
}

const STATS = [
  { icon: Users, value: '130K+', label: 'Community' },
  { icon: Trophy, value: '100+', label: 'Transformations' },
  { icon: CalendarCheck, value: '3+', label: 'Years Experience' },
  { icon: Star, value: '5.0', label: 'Client Rating' },
];

export default function Transformations({ items: itemsProp, onCtaClick }: TransformationsProps) {
  const defaultItems: TransformationItem[] = [
    {
      img:  transform1,
      name: ' Nanthesh',
      desc: 'Meet Nanthesh, all the way from the Netherlands! Over the past three months, we dove into online calisthenics training together, starting with a full assessment of his pushing, pulling, and overall endurance. From those fundamentals, we crafted a personalized plan that’s taken him from the basics right into the realm of intermediate skills. It’s been amazing to watch his transformation, and there’s so much more to come. Stay tuned for his journey!'
    },
    {
      img: transform2,
      name: 'Bharath, from Coorg, Karnataka.',
      desc: 'It’s been a gradual process, but the overall progress has been very positive. With a strong focus on injury prevention and improved body awareness, he’s now able to train more effectively, maintaining better full-body control and performance.'
    },
    {
      img: transform3,
      name: 'From Canada',
      desc: "Three months ago, he started training with me. He struggled a bit at first, but then he picked up and committed to a consistent training and diet, which led to this level of progress. The basics are fully completed, and he’s currently working on the intermediate level."
    },
    {
      img: transform4,
      name: 'Sidharth',
      desc: 'Muscle-ups, Handstands, and more! Sidharth has been training with me for the past 3 months, and his progress has been nothing short of amazing. From mastering the basics to achieving advanced skills, he’s shown incredible dedication and hard work. I’m proud to have been a part of his journey and can’t wait to see what he accomplishes next!'
    },
    {
      img: transform5,
      name: 'Nandha',
      desc: 'Built Muscle and Strength! This transformation is a testament to the power of consistent training and dedication. Over the past few months, he has made significant gains in muscle mass and overall strength.'
    }
  ];
  const items: TransformationItem[] = itemsProp && itemsProp.length > 0 ? itemsProp : defaultItems;
  const sectionRef = useRef<HTMLDivElement>(null);   // whole section — used for vertical scroll progress
  const trackRef = useRef<HTMLDivElement>(null);     // the flex row that actually gets transformed

  const [isDragging, setIsDragging] = useState(false); // only used for cursor styling

  // Motion state lives in refs (not React state) so the animation loop
  // never triggers re-renders — this is what keeps it frame-drop free.
  const isDraggingRef = useRef(false);
  const pointerStartXRef = useRef(0);
  const dragStartTranslateRef = useRef(0);

  const currentXRef = useRef(0); // current translateX (px, negative)
  const targetXRef = useRef(0);  // where currentX is easing toward
  const setWidthRef = useRef(0); // px width of ONE full set of items
  const initializedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Triplicate the items so the track always has a "previous" and "next"
  // copy to slide into — this is what makes the loop seamless no matter
  // how many items are passed in.
  const loopedItems = items.length > 0 ? [...items, ...items, ...items] : [];

  const applyTransform = (x: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
    }
  };

  // Measure one set's width and center the track on the middle copy.
  useEffect(() => {
    if (items.length === 0) return;

    const measure = () => {
      if (!trackRef.current) return;
      const w = trackRef.current.scrollWidth / 3;
      setWidthRef.current = w;
      if (!initializedRef.current && w > 0) {
        initializedRef.current = true;
        currentXRef.current = -w;
        targetXRef.current = -w;
        applyTransform(-w);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [items.length]);

  // Core animation loop. When the user is dragging, the track follows the
  // pointer 1:1. When released, it eases back to rest and then drifts on
  // its own in a continuous marquee-style auto-scroll (same visual idea as
  // the Reviews marquee, just driven by rAF instead of a CSS keyframe so it
  // can be interrupted/resumed by dragging at any time). Wrapping keeps the
  // track seamlessly looping regardless of item count.
  const AUTO_SCROLL_SPEED = 0.6; // px per frame

  useEffect(() => {
    if (items.length === 0) return;

    const tick = () => {
      const w = setWidthRef.current;
      if (w > 0) {
        if (isDraggingRef.current) {
          currentXRef.current = targetXRef.current;
        } else {
          const diff = targetXRef.current - currentXRef.current;
          if (Math.abs(diff) > 0.05) {
            currentXRef.current += diff * 0.12; // ease back after a drag release
          } else {
            // Continuous auto-scroll, always moving right-to-left.
            currentXRef.current -= AUTO_SCROLL_SPEED;
            targetXRef.current = currentXRef.current;
          }
        }

        // Seamless wrap: keep currentX (and target/drag anchors) within
        // one set-width of the middle copy, forever, regardless of
        // item count.
        if (currentXRef.current <= -2 * w) {
          currentXRef.current += w;
          targetXRef.current += w;
          dragStartTranslateRef.current += w;
        } else if (currentXRef.current > 0) {
          currentXRef.current -= w;
          targetXRef.current -= w;
          dragStartTranslateRef.current -= w;
        }

        applyTransform(currentXRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [items.length]);

  // Unified pointer handlers (covers mouse + touch + pen in one path).
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    pointerStartXRef.current = e.clientX;
    dragStartTranslateRef.current = currentXRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const delta = (e.clientX - pointerStartXRef.current) * 1.4; // drag sensitivity
    targetXRef.current = dragStartTranslateRef.current + delta;
  };

  const endDrag = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // "View More Stories" opens the client results Instagram page.
  const scrollToMoreStories = () => {
    window.open('https://www.instagram.com/surya_calis_client_result?igsh=ZW4wd21rOGF6MXp2', '_blank', 'noopener,noreferrer');
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-14 md:py-20 bg-brand-bg overflow-hidden relative border-t border-b border-brand-border"
      id="transformations"
    >
      {/* Section Header - Clean, Compact, Highly readable */}
      {/* <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-brand-primary uppercase block mb-1.5">
              ATHLETE EVOLUTION
            </span>
            <h2 className="text-3xl md:text-5xl font-serif italic font-normal tracking-tight text-brand-text leading-tight">
              Real People. <span className="text-brand-primary">Real Transformations.</span>
            </h2>
            <p className="text-brand-muted text-xs md:text-sm max-w-lg mt-2 font-light">
              Watch our athletes evolve on autoplay, or drag/swipe horizontally on any device to browse manually.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 font-mono text-[9px] text-brand-primary bg-brand-primary/5 border border-brand-primary/20 px-4 py-2 rounded-none uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-brand-primary" /> Performance-Linked</span>
            <span className="h-3 w-px bg-brand-border" />
            <span className="flex items-center gap-1.5"><ArrowLeftRight className="h-3 w-3 text-brand-primary animate-pulse" /> Drag to Browse</span>
          </div>
        </div>
      </div> */}

      {/* Swipeable & Scroll-Synced Track (transform-driven, infinite loop) */}
      <div className="relative w-full overflow-hidden">

          {/* Draggable viewport — overflow hidden, no native scrollbar/scroll-snap needed */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          className={`overflow-hidden px-6 md:px-16 py-4 touch-pan-y ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
        >
          {/* The actual sliding track — position controlled entirely via translate3d */}
          <div ref={trackRef} className="flex gap-4 md:gap-6 will-change-transform">
            {loopedItems.map((item, idx) => {
              const originalIdx = idx % items.length;
              const stage = (item.stage || (originalIdx % 2 === 0 ? 'BEFORE' : 'AFTER')).toUpperCase();
              const duration = item.duration || '12 Weeks';
              const program = item.program || 'TRANSFORMATION';

              return (
                <motion.div
                  key={idx}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className="w-[180px] xs:w-[210px] sm:w-[230px] md:w-[250px] shrink-0 bg-brand-card border border-brand-border rounded-none overflow-hidden relative group shadow-md flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/45"
                >
                  {/* Card Header */}
                  <div className="p-3 border-b border-brand-border bg-brand-card/50">
                    <div className="flex items-center justify-between text-[8px] font-mono text-brand-muted tracking-wider mb-1">
                      {/* <span className={`inline-flex items-center gap-0.5 font-bold tracking-widest uppercase text-[7px] px-2 py-0.5 ${
                        stage === 'AFTER'
                          ? 'bg-brand-primary text-white font-extrabold'
                          : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                      }`}>
                        {stage === 'AFTER' && <Sparkles className="h-2 w-2" />}
                        {stage}
                      </span> */}
                      {/* <span className="font-bold">{duration}</span> */}
                    </div>
                    <h4 className="text-xs md:text-sm font-serif italic font-normal text-brand-text tracking-tight truncate">
                      {item.name}
                    </h4>
                  </div>

                  {/* Proportional Image Frame */}
                  <div className="relative aspect-square overflow-hidden bg-brand-bg border-b border-brand-border">
                    <img
                      src={item.img}
                      alt={`${item.name} ${stage}`}
                      loading="lazy"
                      draggable={false}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none ${
                        stage === 'BEFORE'
                          ? 'filter brightness-[0.85] contrast-[1.05]'
                          : 'filter brightness-[0.95] contrast-[1.1]'
                      }`}
                    />
                  </div>

                  {/* Card Description */}
                  <div className="p-3 bg-brand-card flex-grow flex flex-col justify-between">
                    <p className="text-brand-muted text-[10px] md:text-xs leading-relaxed font-light mb-2.5 min-h-[30px] line-clamp-2">
                      {item.desc}
                    </p>
                    <div className="flex items-center justify-between text-[8px] font-mono text-brand-muted tracking-wider pt-2 border-t border-brand-border">
                      {/* <span className="opacity-80">PROGRAM</span>
                      <span className="text-brand-primary font-bold tracking-widest uppercase text-[8px] font-mono">{program}</span> */}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subtle touch indicator */}
      <div className="flex justify-center items-center gap-1.5 mt-2.5 text-[9px] font-mono text-brand-muted uppercase tracking-widest opacity-60">
        <ArrowLeftRight className="h-2.5 w-2.5 animate-pulse" />
        <span>Drag to browse</span>
      </div>

      {/* Quick stats strip */}
      <div className="max-w-3xl mx-auto px-6 mt-10 md:mt-14 relative z-10">
        <div className="grid grid-cols-4 gap-y-4">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="relative flex flex-col items-center text-center px-2">
                {idx > 0 && (
                  <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-brand-border" />
                )}
                <Icon className="h-4 w-4 md:h-5 md:w-5 text-brand-primary mb-1.5" strokeWidth={1.5} />
                <span className="text-sm md:text-base font-extrabold text-brand-text leading-none mb-0.5">
                  {stat.value}
                </span>
                <span className="text-[8px] md:text-[9px] text-brand-muted font-sans uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA banner */}
      <div className="max-w-4xl mx-auto px-6 mt-8 md:mt-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-t border-brand-border pt-8">
          <div className="border-l-4 border-brand-primary pl-3 md:pl-4">
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-brand-text leading-snug">
              Your transformation is
              <br className="hidden sm:block" />
              {' '}the next <span className="italic text-brand-primary">success story.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shrink-0">
            <motion.button
              onClick={onCtaClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 bg-brand-primary text-white pl-5 pr-1.5 py-1.5 rounded-full shadow-xl border border-brand-primary cursor-pointer transition-all duration-300"
            >
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.13em] font-mono whitespace-nowrap">
                Become the Next Success Story
              </span>
              <span className="w-7 h-7 rounded-full bg-white text-brand-primary flex items-center justify-center shrink-0">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            </motion.button>

            <button
              onClick={scrollToMoreStories}
              className="inline-flex items-center gap-2 group cursor-pointer"
            >
              <span className="h-7 w-7 rounded-full border border-brand-text/20 flex items-center justify-center text-brand-text group-hover:border-brand-primary group-hover:text-brand-primary transition-colors shrink-0">
                <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
              </span>
              <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest text-brand-text group-hover:text-brand-primary transition-colors whitespace-nowrap">
                View More Stories
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}