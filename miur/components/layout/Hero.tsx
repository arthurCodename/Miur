// Miur/miur/components/layout/Hero.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionConfig } from "framer-motion";
import { ArrowDown, Play, Pause } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { MiurWordmark } from "@/components/brand/MiurWordmark";
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [userPaused, setUserPaused] = useState(false);
  const isPlaying = !userPaused && !reducedMotion;

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
      document.documentElement.style.setProperty("--app-vh", `${window.innerHeight * 0.01}px`);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.play().catch(() => {
        // Autoplay może zostać zablokowany — użytkownik może wznowić przyciskiem.
      });
    } else {
      v.pause();
    }
  }, [isPlaying]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const toggleVideo = () => {
    setUserPaused((prev) => !prev);
  };

  const finalScale = isMobileOrTablet ? 0.25 : 0.18;
  const scale = useTransform(scrollYProgress, [0, 0.6, 1], [1, finalScale, finalScale]);

  const finalX = isMobileOrTablet ? "0%" : "-38.5vw";
  const x = useTransform(scrollYProgress, [0, 0.6, 1], ["0%", finalX, finalX]);

  const finalY = isMobileOrTablet ? "-36vh" : "-38vh";
  const y = useTransform(scrollYProgress, [0, 0.6, 1], ["0vh", finalY, finalY]);

  const logoOpacity = useTransform(scrollYProgress, [0.58, 0.65], [1, 0]);

  const heroScrollHeightVh = isMobileOrTablet ? 155 : 106;

  const videoToggleLabel = isPlaying
    ? "Zatrzymaj odtwarzanie filmu w tle"
    : "Odtwórz film w tle";

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={containerRef}
        className="relative flex w-full max-w-full flex-col overflow-x-clip overflow-y-visible bg-white font-sans"
        style={{ height: `calc(var(--app-vh, 1vh) * ${heroScrollHeightVh})` }}
      >
        <div
          className="sticky top-0 z-10 w-full max-w-full shrink-0 overflow-x-clip overflow-y-visible bg-black"
          style={{ height: "calc(var(--app-vh, 1vh) * 100)" }}
        >
          <video
            ref={videoRef}
            autoPlay={!reducedMotion}
            loop
            muted
            playsInline
            poster="/hero-poster.jpg"
            preload="metadata"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-50"
          >
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          <div className="pointer-events-none absolute inset-0 z-50 flex max-w-full items-center justify-center overflow-x-clip px-6 py-8 lg:justify-end lg:px-24 lg:py-10">
            <motion.div
              style={{
                scale,
                x,
                y,
                opacity: logoOpacity,
                transformOrigin: isMobileOrTablet
                  ? "center center"
                  : "right center",
              }}
              className="isolate flex max-w-full flex-col items-center lg:items-end"
            >
              <h1 className="px-1 py-2 leading-[1.05] text-white drop-shadow-2xl md:px-2 md:py-3">
                <MiurWordmark
                  title="Miur"
                  className="mx-auto text-[min(20.7vw,30.75rem)] leading-[inherit] lg:mx-0 lg:text-[min(14vw,22rem)]"
                />
              </h1>
            </motion.div>
          </div>

          <div className="absolute bottom-28 left-6 z-20 max-w-[250px] md:bottom-20 md:left-10 md:max-w-[300px]">
            <motion.p
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]),
              }}
              className="text-[9px] font-medium uppercase leading-relaxed tracking-[0.25em] text-white/50 md:text-[10px]"
            >
              Twoja chwila wellness <br />
              w starannie dobranym wydaniu.
            </motion.p>
          </div>

          <div className="absolute bottom-20 right-6 z-30 md:right-10">
            <button
              type="button"
              onClick={toggleVideo}
              aria-label={videoToggleLabel}
              disabled={reducedMotion}
              title={reducedMotion ? "Wyłączone przez ustawienia ograniczenia ruchu" : undefined}
              className="group flex items-center gap-3 text-white/30 transition-all duration-300 hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <span className="hidden text-[8px] uppercase tracking-[0.3em] opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block">
                {isPlaying ? "Zatrzymaj ruch" : "Włącz ruch"}
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 backdrop-blur-sm transition-colors group-hover:border-white/30 md:bg-transparent md:backdrop-blur-none">
                {isPlaying ? (
                  <Pause className="h-3 w-3 fill-current" aria-hidden />
                ) : (
                  <Play className="h-3 w-3 translate-x-px fill-current" aria-hidden />
                )}
              </span>
            </button>
          </div>

          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
            className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 opacity-30"
          >
            <span className="text-[8px] uppercase tracking-[0.5em] text-white/40">
              Scroluj
            </span>
            <ArrowDown
              className="h-3 w-3 text-white/40 motion-safe:animate-bounce"
              aria-hidden
            />
          </motion.div>
        </div>

        {/* Biały tor scroll pod animacją logo. */}
        <div className="min-h-0 flex-1 bg-white" aria-hidden />
      </section>
    </MotionConfig>
  );
}
