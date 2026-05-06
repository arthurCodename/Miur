// Miur/miur/components/layout/Hero.tsx
"use client";
import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, MotionConfig } from 'framer-motion';
import { ArrowDown, Play, Pause } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Single source of truth: did the user explicitly pause via the button?
  // Final play state is derived from this + OS reduced-motion preference.
  const [userPaused, setUserPaused] = useState(false);
  const isPlaying = !userPaused && !reducedMotion;

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Imperatively sync the <video> element to derived state. Effect only
  // calls play/pause on the DOM node — no React state updates here, which
  // keeps us compatible with React 19's set-state-in-effect rule.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.play().catch(() => {
        // play() can reject (e.g. autoplay blocked); we ignore — the user can
        // still resume via the toggle button.
      });
    } else {
      v.pause();
    }
  }, [isPlaying]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const toggleVideo = () => {
    setUserPaused((prev) => !prev);
  };

  const finalScale = isMobileOrTablet ? 0.25 : 0.18;
  const scale = useTransform(scrollYProgress, [0, 0.6, 1], [1, finalScale, finalScale]);
  
  const finalX = isMobileOrTablet ? "0%" : "-38.5vw";
  const x = useTransform(scrollYProgress, [0, 0.6, 1], ["0%", finalX, finalX]); 
  
  // ТУТ ЗМІНЕНО: на телефоні політ закінчується на -36vh замість -43vh
  const finalY = isMobileOrTablet ? "-36vh" : "-38vh";
  const y = useTransform(scrollYProgress, [0, 0.6, 1], ["0vh", finalY, finalY]);

  const logoOpacity = useTransform(scrollYProgress, [0.58, 0.65], [1, 0]);

  return (
    <MotionConfig reducedMotion="user">
    <section ref={containerRef} className="relative h-[130vh] w-full bg-white font-sans">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black z-10">

        <video
          ref={videoRef}
          autoPlay={!reducedMotion}
          loop
          muted
          playsInline
          poster="/hero-poster.jpg"
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-50"
        >
          {/* Single H.264 source — covers all evergreen browsers and is currently
              smaller than our WebM master. Re-add a <source type="video/webm">
              ABOVE this <source> only after re-encoding to <5 MB. */}
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-50 flex items-center justify-center lg:justify-end px-6 lg:px-24 pointer-events-none overflow-visible">
          <motion.div
            style={{ 
              scale,
              x,
              y,
              opacity: logoOpacity,
              transformOrigin: isMobileOrTablet ? "center center" : "right center"
            }}
            className="flex flex-col items-center lg:items-end overflow-visible" 
          >
            <h1 className="text-[20vw] lg:text-[14vw] font-bold leading-none tracking-tighter text-white font-[family-name:var(--font-logo)] drop-shadow-2xl">
              Miur
            </h1>
          </motion.div>
        </div>

        <div className="absolute bottom-28 md:bottom-20 left-6 md:left-10 z-20 max-w-[250px] md:max-w-[300px]">
          <motion.p 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
            className="text-[9px] md:text-[10px] leading-relaxed text-white/50 uppercase tracking-[0.25em] font-medium"
          >
            Twoja chwila wellness <br /> 
            w starannie dobranym wydaniu.
          </motion.p>
        </div>

        <div className="absolute bottom-20 right-6 md:right-10 z-30">
          <button 
            onClick={toggleVideo}
            className="group flex items-center gap-3 text-white/30 hover:text-white transition-all duration-300"
          >
            <span className="hidden md:block text-[8px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {isPlaying ? "Pause Motion" : "Play Motion"}
            </span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors bg-black/20 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none cursor-pointer">
              {isPlaying ? (
                <Pause className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3 h-3 fill-current translate-x-[1px]" />
              )}
            </div>
          </button>
        </div>

        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-30"
        >
           <span className="text-[8px] uppercase tracking-[0.5em] text-white/40">Scroluj</span>
           <ArrowDown className="w-3 h-3 text-white/40 motion-safe:animate-bounce" />
        </motion.div>
      </div>

      <div className="h-[30vh] w-full bg-white" />
    </section>
    </MotionConfig>
  );
}