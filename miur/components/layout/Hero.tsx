"use client";
import { useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { ArrowDown, Play, Pause } from 'lucide-react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Функція для перемикання відео
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Анімація польоту Miur
  const scale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.18, 0.18]);
  const x = useTransform(scrollYProgress, [0, 0.6, 1], ["0%", "-38.5vw", "-38.5vw"]); 
  const y = useTransform(scrollYProgress, [0, 0.6, 1], ["0vh", "-38vh", "-38vh"]);
  const logoOpacity = useTransform(scrollYProgress, [0.58, 0.65], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[130vh] w-full bg-white font-sans">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black z-10">
        
        {/* ВІДЕО ФОН */}
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 h-full w-full object-cover z-0 opacity-50"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* ГОЛОВНИЙ БЛОК Miur */}
        <div className="absolute inset-0 z-50 flex items-center justify-end px-6 md:px-24 pointer-events-none overflow-visible">
          <motion.div
            style={{ scale, x, y, opacity: logoOpacity, transformOrigin: "right center" }}
            className="flex flex-col items-end overflow-visible" 
          >
            <h1 className="text-[14vw] font-bold leading-none tracking-tighter text-white font-[family-name:var(--font-logo)] drop-shadow-2xl">
              Miur
            </h1>
            <motion.p 
              style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
              className="text-[8px] font-bold uppercase tracking-[1.5em] text-white/40 mt-8 text-right translate-x-20 whitespace-nowrap"
            >
              Wellness Essence
            </motion.p>
          </motion.div>
        </div>

        {/* ТЕКСТ ЗЛІВА ПОЛЬСЬКОЮ */}
        <div className="absolute bottom-20 left-10 z-20 max-w-[300px]">
          <motion.p 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
            className="text-[10px] leading-relaxed text-white/50 uppercase tracking-[0.25em] font-medium"
          >
            Twoja chwila wellness <br /> 
            w starannie dobranym wydaniu.
          </motion.p>
        </div>

        {/* КНОПКА ВИМКНЕННЯ ВІДЕО (Bottom Right) */}
        <div className="absolute bottom-20 right-10 z-30">
          <button 
            onClick={toggleVideo}
            className="group flex items-center gap-3 text-white/30 hover:text-white transition-all duration-300"
            aria-label={isPlaying ? "Pause Video" : "Play Video"}
          >
            <span className="text-[8px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {isPlaying ? "Pause Motion" : "Play Motion"}
            </span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
              {isPlaying ? (
                <Pause className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3 h-3 fill-current translate-x-[1px]" />
              )}
            </div>
          </button>
        </div>

        {/* СКРОЛЛ ІНДИКАТОР */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-30"
        >
           <span className="text-[8px] uppercase tracking-[0.5em] text-white/40">Scroll</span>
           <ArrowDown className="w-3 h-3 text-white/40 animate-bounce" />
        </motion.div>
      </div>

      <div className="h-[30vh] w-full" />
    </section>
  );
}