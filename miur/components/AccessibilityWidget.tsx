// Miur/miur/components/AccessibilityWidget.tsx
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Type, Link2, X, TextSelect, Palette, MousePointer2, Volume2, Focus } from 'lucide-react';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mouseY, setMouseY] = useState(0); // Для профілю ADHD
  
  const [settings, setSettings] = useState({
    largeText: false,
    readableFont: false,
    highContrast: false,
    grayscale: false,
    highlightLinks: false,
    bigCursor: false,
    screenReader: false, // Читання тексту
    adhdProfile: false,  // Маска фокусування
  });

  // Efekty (filter/zoom) na #a11y-site-content — nie na body, żeby fixed widget nie „jechał” przy scrollu.
  useEffect(() => {
    const siteContent =
      document.getElementById("a11y-site-content") ?? document.body;

    siteContent.classList.toggle("a11y-large-text", settings.largeText);
    siteContent.classList.toggle("a11y-readable-font", settings.readableFont);
    siteContent.classList.toggle("a11y-high-contrast", settings.highContrast);
    siteContent.classList.toggle("a11y-grayscale", settings.grayscale);
    siteContent.classList.toggle("a11y-highlight-links", settings.highlightLinks);
    siteContent.classList.toggle("a11y-big-cursor", settings.bigCursor);
  }, [settings]);

  // 3. ADHD reading mask — keep a 120px window around the cursor visible.
  useEffect(() => {
    if (!settings.adhdProfile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [settings.adhdProfile]);

  // 4. Screen reader (Web Speech API): when active, click any element with text
  //    to have it spoken in Polish. Cancels any pending utterance on click.
  useEffect(() => {
    if (!settings.screenReader) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find the closest element that carries a meaningful text label.
      const speakable = target.closest<HTMLElement>(
        "p, h1, h2, h3, h4, h5, h6, li, button, a, label, span, [data-speakable]",
      );
      if (!speakable) return;

      const text =
        speakable.getAttribute("aria-label") ||
        speakable.textContent?.trim() ||
        "";
      if (!text) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pl-PL";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    };

    document.body.classList.add("a11y-screen-reader-active");
    document.addEventListener("click", handleClick);
    return () => {
      window.speechSynthesis.cancel();
      document.body.classList.remove("a11y-screen-reader-active");
      document.removeEventListener("click", handleClick);
    };
  }, [settings.screenReader]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* ОВЕРЛЕЙ ДЛЯ ADHD (Маска читання) */}
      {settings.adhdProfile && (
        <div 
          className="fixed inset-0 z-[190] pointer-events-none transition-opacity duration-75"
          style={{
            // Створюємо градієнт: чорний зверху -> прозоре вікно 120px навколо миші -> чорний знизу
            background: `linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.85) ${mouseY - 60}px, transparent ${mouseY - 60}px, transparent ${mouseY + 60}px, rgba(0,0,0,0.85) ${mouseY + 60}px, rgba(0,0,0,0.85) 100%)`
          }}
        />
      )}

      {/* ВІДЖЕТ */}
      <div className="fixed bottom-6 left-6 z-[200] isolate font-sans">
        {/* Кнопка відкриття */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform border border-white/10"
        >
          <Accessibility className="w-5 h-5" />
        </button>

        {/* Панель налаштувань */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 left-0 w-72 bg-zinc-950 text-white border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Dostępność</span>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:text-zinc-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                
                {/* --- НОВІ ФУНКЦІЇ --- */}
                <SettingButton 
                  icon={<Volume2 className="w-4 h-4" />} 
                  title="Czytnik tekstu" 
                  isActive={settings.screenReader} 
                  onClick={() => toggleSetting('screenReader')} 
                />
                <SettingButton 
                  icon={<Focus className="w-4 h-4" />} 
                  title="Profil ADHD (Maska)" 
                  isActive={settings.adhdProfile} 
                  onClick={() => toggleSetting('adhdProfile')} 
                />
                
                <SettingButton 
                  icon={<Type className="w-4 h-4" />} 
                  title="Większy tekst" 
                  isActive={settings.largeText} 
                  onClick={() => toggleSetting('largeText')} 
                />
                <SettingButton 
                  icon={<TextSelect className="w-4 h-4" />} 
                  title="Czytelna czcionka" 
                  isActive={settings.readableFont} 
                  onClick={() => toggleSetting('readableFont')} 
                />              
                <SettingButton 
                  icon={<Palette className="w-4 h-4" />} 
                  title="Skala szarości" 
                  isActive={settings.grayscale} 
                  onClick={() => toggleSetting('grayscale')} 
                />
                <SettingButton 
                  icon={<Link2 className="w-4 h-4" />} 
                  title="Podświetl linki" 
                  isActive={settings.highlightLinks} 
                  onClick={() => toggleSetting('highlightLinks')} 
                />
                <SettingButton 
                  icon={<MousePointer2 className="w-4 h-4" />} 
                  title="Duży kursor" 
                  isActive={settings.bigCursor} 
                  onClick={() => toggleSetting('bigCursor')} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function SettingButton({ icon, title, isActive, onClick }: { icon: React.ReactNode, title: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all mb-1 last:mb-0
        ${isActive ? 'bg-white text-black' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'}`}
    >
      {icon}
      <span className="text-xs font-medium">{title}</span>
      <div className={`ml-auto w-8 h-4 rounded-full flex items-center p-0.5 transition-colors duration-300 ${isActive ? 'bg-black' : 'bg-zinc-700'}`}>
        <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${isActive ? 'translate-x-4 scale-90' : 'translate-x-0'}`} />
      </div>
    </button>
  );
}