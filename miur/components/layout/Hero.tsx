// Miur/miur/components/layout/Hero.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, MotionConfig } from "framer-motion";
import { ArrowDown, Play, Pause } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { MiurWordmark } from "@/components/brand/MiurWordmark";

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function useViewportMetrics() {
  const [metrics, setMetrics] = useState(() => ({
    isMobileOrTablet: typeof window !== "undefined" && window.innerWidth < 1024,
    scrollRunwayVh:
      typeof window !== "undefined" && window.innerWidth < 1024 ? 152 : 108,
  }));

  // Tracks last vhUnitPx for the resize-dedup check without putting it in state.
  const lastVhRef = useRef(0);

  useEffect(() => {
    function sync() {
      const width = window.innerWidth;
      const height = window.visualViewport?.height ?? window.innerHeight;
      const isMobileOrTablet = width < 1024;
      const vhUnitPx = height * 0.01;

      document.documentElement.style.setProperty("--app-vh", `${vhUnitPx}px`);

      setMetrics((prev) => {
        const scrollRunwayVh = isMobileOrTablet ? 152 : 108;
        const heightDelta = Math.abs(lastVhRef.current - vhUnitPx);
        if (
          prev.isMobileOrTablet === isMobileOrTablet &&
          prev.scrollRunwayVh === scrollRunwayVh &&
          heightDelta < 4
        ) {
          return prev;
        }
        lastVhRef.current = vhUnitPx;
        return { isMobileOrTablet, scrollRunwayVh };
      });
    }

    // Set --app-vh on mount without triggering setState (DOM-only write).
    const initialHeight = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty("--app-vh", `${initialHeight * 0.01}px`);
    lastVhRef.current = initialHeight * 0.01;

    window.addEventListener("resize", sync);
    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("resize", sync);
      viewport?.removeEventListener("resize", sync);
    };
  }, []);

  return metrics;
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [userPaused, setUserPaused] = useState(false);
  const isPlaying = !userPaused && !reducedMotion;

  const { isMobileOrTablet, scrollRunwayVh } = useViewportMetrics();

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

  /** Mobile: 1:1 ze scrollem (bez spring/ease). Desktop: łagodniejsza krzywa. */
  const easedProgress = useTransform(scrollYProgress, (value) => {
    const v = Math.min(1, Math.max(0, value));
    if (isMobileOrTablet) return v;
    return easeOutCubic(v);
  });

  /** Desktop (lg+): logo jedzie w stronę navbara. Mobile: bez transformacji. */
  const scale = useTransform(easedProgress, (t) => 1 - t * (1 - 0.18));
  const x = useTransform(easedProgress, (t) => `${t * -38.5}vw`);
  const y = useTransform(easedProgress, (t) => `${t * -34}%`);
  const logoOpacity = useTransform(easedProgress, (t) => {
    if (t <= 0.62) return 1;
    if (t >= 0.88) return 0;
    return 1 - (t - 0.62) / 0.26;
  });

  const taglineOpacity = useTransform(easedProgress, (t) => {
    if (t <= 0.12) return 1;
    if (t >= 0.28) return 0;
    return 1 - (t - 0.12) / 0.16;
  });

  const scrolujOpacity = useTransform(easedProgress, (t) => {
    if (t <= 0.06) return 1;
    if (t >= 0.14) return 0;
    return 1 - (t - 0.06) / 0.08;
  });

  const toggleVideo = () => {
    setUserPaused((prev) => !prev);
  };

  const videoToggleLabel = isPlaying
    ? "Zatrzymaj odtwarzanie filmu w tle"
    : "Odtwórz film w tle";

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={containerRef}
        className="relative flex w-full max-w-full flex-col overflow-x-visible overflow-y-visible bg-white font-sans"
        style={{ height: `calc(var(--app-vh, 1vh) * ${scrollRunwayVh})` }}
      >
        <div
          className="sticky top-0 z-10 w-full max-w-full shrink-0 overflow-x-visible overflow-y-visible bg-black transform-gpu"
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

          <div className="pointer-events-none absolute inset-0 z-50 flex max-w-full items-center justify-center overflow-visible px-6 py-8 lg:justify-end lg:px-24 lg:py-10">
            {/*
              Single <h1> rendered once; CSS controls layout per breakpoint.
              Two wrapper spans handle visual positioning, but only ONE heading
              element exists in the DOM — avoids duplicate-h1 WCAG issue.
            */}
            <h1 className="contents" aria-label="Miur">
              {/* Mobile / tablet: static */}
              <span className="isolate flex w-max max-w-full flex-col items-center px-1 py-2 text-white lg:hidden md:px-2 md:py-3">
                <MiurWordmark
                  decorative
                  className="mx-auto text-[min(20.7vw,30.75rem)] drop-shadow-2xl"
                />
              </span>
              {/* Desktop: scroll animation */}
              <motion.span
                style={{
                  scale,
                  x,
                  y,
                  opacity: logoOpacity,
                  transformOrigin: "right center",
                  willChange: "transform, opacity",
                }}
                className="isolate hidden w-max max-w-full shrink-0 flex-col items-end backface-hidden px-2 py-3 text-white lg:flex"
              >
                <MiurWordmark
                  decorative
                  className="text-[min(14vw,22rem)] drop-shadow-2xl"
                />
              </motion.span>
            </h1>
          </div>

          <div className="absolute bottom-28 left-6 z-20 max-w-[250px] md:bottom-20 md:left-10 md:max-w-[300px]">
            <motion.p
              style={{ opacity: taglineOpacity }}
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
              className="group flex items-center gap-3 text-white/30 transition-all duration-300 hover:text-white disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 rounded-sm"
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
            style={{ opacity: scrolujOpacity }}
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

        <div className="min-h-0 flex-1 bg-white" aria-hidden />
      </section>
    </MotionConfig>
  );
}
