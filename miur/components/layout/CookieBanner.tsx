"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Settings2, ChevronRight } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Стан для різних типів кукі
  const [consent, setConsent] = useState({
    essential: true, // Завжди true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Перевіряємо, чи користувач вже давав згоду
    const savedConsent = localStorage.getItem('miur_cookie_consent');
    if (!savedConsent) {
      // Показуємо банер через 2 секунди після завантаження
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = { essential: true, analytics: true, marketing: true };
    saveConsent(fullConsent);
  };

  const handleSaveSettings = () => {
    saveConsent(consent);
  };

  const saveConsent = (data: typeof consent) => {
    localStorage.setItem('miur_cookie_consent', JSON.stringify(data));
    setIsVisible(false);
    // Тут у майбутньому можна ініціалізувати Google Analytics або Pixel
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[300]"
        >
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-white overflow-hidden relative">
            
            {!showSettings ? (
              /* Головний вигляд */
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest">Prywatność</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
                      Używamy plików cookies, aby zapewnić najlepszą jakość korzystania z Miur.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    onClick={handleAcceptAll}
                    className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    Akceptuję wszystko
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowSettings(true)}
                      className="flex-1 py-3 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-full hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings2 className="w-3 h-3" /> Ustawienia
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Вигляд налаштувань */
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <button onClick={() => setShowSettings(false)} className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white flex items-center gap-1">
                    ← Powrót
                  </button>
                  <span className="text-[10px] uppercase font-bold tracking-widest">Ustawienia</span>
                </div>

                <div className="space-y-3">
                  <CookieToggle 
                    title="Niezbędne" 
                    desc="Wymagane do działania strony." 
                    checked={true} 
                    disabled={true} 
                  />
                  <CookieToggle 
                    title="Analityka" 
                    desc="Pomaga nam ulepszać sklep." 
                    checked={consent.analytics} 
                    onChange={() => setConsent(p => ({...p, analytics: !p.analytics}))}
                  />
                  <CookieToggle 
                    title="Marketing" 
                    desc="Personalizowane oferty." 
                    checked={consent.marketing} 
                    onChange={() => setConsent(p => ({...p, marketing: !p.marketing}))}
                  />
                </div>

                <button 
                  onClick={handleSaveSettings}
                  className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full mt-4"
                >
                  Zapisz preferencje
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Допоміжний компонент для перемикачів
function CookieToggle({ title, desc, checked, onChange, disabled = false }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-white/5">
      <div className="pr-4">
        <div className="text-[10px] font-bold uppercase tracking-wider">{title}</div>
        <div className="text-[9px] text-zinc-500">{desc}</div>
      </div>
      <button 
        disabled={disabled}
        onClick={onChange}
        className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${checked ? 'bg-zinc-100' : 'bg-zinc-800'} ${disabled ? 'opacity-50' : ''}`}
      >
        <div className={`w-3 h-3 rounded-full transition-transform ${checked ? 'translate-x-5 bg-black' : 'translate-x-0 bg-zinc-500'}`} />
      </button>
    </div>
  );
}