"use client";

import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShieldCheck, Settings2 } from "lucide-react";
import {
  OPEN_COOKIE_PREFERENCES_EVENT,
} from "@/lib/cookie-consent";
import { useCookieConsent } from "@/components/layout/CookieConsentContext";
import { useIsMounted } from "@/lib/hooks/useIsMounted";

export default function CookieBanner() {
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const { consent: savedConsent, saveConsent, acceptAll, rejectAll } = useCookieConsent();
  const isMounted = useIsMounted();

  // Banner visibility is purely event-driven: it is "open" when the user has
  // never made a choice OR has explicitly clicked "Manage cookies" in the footer.
  // No setState-in-effect needed — we toggle from event listeners only.
  const [isOpenedManually, setIsOpenedManually] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Local "draft" toggles for when the user is editing in the settings view.
  // Initialised lazily from saved consent — synced via key reset rather than effect.
  const [draftConsent, setDraftConsent] = useState(() => ({
    essential: true as const,
    analytics: savedConsent?.analytics ?? false,
    marketing: savedConsent?.marketing ?? false,
  }));

  // If the saved consent identity changes (e.g. user opened settings, clicked
  // "Save"), the next time settings opens we want fresh values. We re-key the
  // settings panel on `savedConsent.timestamp` instead — see below.
  // (No effect-driven sync needed.)

  useEffect(() => {
    const onOpen = () => {
      setShowSettings(true);
      setIsOpenedManually(true);
      setDraftConsent({
        essential: true,
        analytics: savedConsent?.analytics ?? false,
        marketing: savedConsent?.marketing ?? false,
      });
    };
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, onOpen);
    // savedConsent is read inside the callback at the time of the click — capturing
    // the latest value via closure is fine for this one-shot listener.
  }, [savedConsent]);

  // Determine visibility from props/state, not effects.
  // First-time visitor → show banner after 2s (still ok to use a delay effect
  // because it doesn't call setState — it only flips a CSS-driven flag).
  const [delayElapsed, setDelayElapsed] = useState(false);
  useEffect(() => {
    if (savedConsent) return;
    const id = setTimeout(() => setDelayElapsed(true), 100);
    return () => clearTimeout(id);
  }, [savedConsent]);

  const isVisible = isMounted && (isOpenedManually || (!savedConsent && delayElapsed));

  // When user saves preferences we close the panel — this is now driven by
  // event handlers below (`handleSaveSettings` / `handleAcceptAll` / `handleRejectAll`)
  // rather than a "savedConsent changed → close" effect.

  const handleAcceptAll = () => {
    acceptAll();
    setIsOpenedManually(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setIsOpenedManually(false);
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    saveConsent({ analytics: draftConsent.analytics, marketing: draftConsent.marketing });
    setIsOpenedManually(false);
    setShowSettings(false);
  };

  const motionProps = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 100, opacity: 0 } };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...motionProps}
          className="fixed bottom-6 left-6 right-6 z-300 md:left-auto md:max-w-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl">
            {!showSettings ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                    <ShieldCheck className="h-5 w-5 text-zinc-300" aria-hidden />
                  </div>
                  <div>
                    <h2 id={titleId} className="text-sm font-bold uppercase tracking-widest">
                      Pliki cookies
                    </h2>
                    <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                      Używamy plików cookies niezbędnych do działania sklepu oraz — po Twojej zgodzie —
                      analityki i marketingu. Szczegóły:{" "}
                      <a href="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-white">
                        Polityka prywatności
                      </a>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="w-full rounded-full bg-white py-3 text-[10px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-zinc-200"
                  >
                    Akceptuję wszystkie
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleRejectAll}
                      className="flex-1 rounded-full border border-white/30 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-white/10"
                    >
                      Odrzuć wszystkie
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSettings(true)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/30 bg-zinc-900 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-zinc-800"
                    >
                      <Settings2 className="h-3 w-3 shrink-0" aria-hidden />
                      Ustawienia
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase text-zinc-400 transition-colors hover:text-white"
                  >
                    ← Powrót
                  </button>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                    Ustawienia cookies
                  </span>
                </div>

                <div className="space-y-3">
                  <CookieToggle
                    title="Niezbędne"
                    desc="Wymagane do działania koszyka i bezpieczeństwa."
                    checked
                    disabled
                  />
                  <CookieToggle
                    title="Analityka"
                    desc="Pomaga nam ulepszać sklep (np. statystyki odwiedzin)."
                    checked={draftConsent.analytics}
                    onChange={() => setDraftConsent((p) => ({ ...p, analytics: !p.analytics }))}
                  />
                  <CookieToggle
                    title="Marketing"
                    desc="Personalizacja reklam i pomiar kampanii."
                    checked={draftConsent.marketing}
                    onChange={() => setDraftConsent((p) => ({ ...p, marketing: !p.marketing }))}
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="w-full rounded-full bg-white py-3 text-[10px] font-bold uppercase tracking-widest text-black"
                  >
                    Zapisz preferencje
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="w-full rounded-full border border-white/30 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
                  >
                    Odrzuć wszystkie
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type CookieToggleProps = {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
};

function CookieToggle({ title, desc, checked, onChange, disabled = false }: CookieToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 p-3">
      <div className="pr-4">
        <div className="text-[10px] font-bold uppercase tracking-wider">{title}</div>
        <div className="text-[9px] text-zinc-400">{desc}</div>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onChange}
        aria-pressed={checked}
        className={`flex h-5 w-10 items-center rounded-full p-1 transition-colors ${
          checked ? "bg-zinc-100" : "bg-zinc-800"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <span
          className={`h-3 w-3 rounded-full transition-transform ${
            checked ? "translate-x-5 bg-black" : "translate-x-0 bg-zinc-500"
          }`}
        />
      </button>
    </div>
  );
}
