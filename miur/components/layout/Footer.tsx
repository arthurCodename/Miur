// Miur/miur/components/layout/Footer.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white text-zinc-900 pt-24 pb-12 px-6 lg:px-12 flex flex-col items-center font-sans border-t border-zinc-100 overflow-visible">
        
        {/* --- СЕКЦІЯ 1: NEWSLETTER --- */}
        <div className="w-full max-w-xl flex flex-col items-center text-center mb-24">
           <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-900 mb-3">
             Mamy dla Ciebie bonus
           </h3>
           <p className="text-sm md:text-base text-zinc-600 mb-8">
             Zapisz się do newslettera i odbierz 10zł zniżki na pierwsze zakupy
           </p>
           
           <form className="relative flex items-center w-full max-w-sm border-b border-zinc-400 pb-2 group hover:border-black transition-colors duration-500 mb-6">
              <input 
                type="email" 
                placeholder="Twój adres e-mail:" 
                required
                className="w-full bg-transparent outline-none text-[12px] tracking-wide placeholder:text-zinc-500 focus:placeholder:text-zinc-900 transition-colors"
              />
              <button 
                type="submit" 
                className="text-zinc-500 group-hover:text-black transition-colors duration-300"
              >
                 <ArrowRight className="w-4 h-4" strokeWidth={1.2} />
              </button>
           </form>

           <p className="text-[9px] text-zinc-500 leading-relaxed max-w-md">
             Rabat -10 PLN aktywny w koszyku o wartości produktów min 150zł. Nie martw się, nie będziemy Cie spamować, a zrezygnować z newslettera możesz w każdej chwili. Sprawdź naszą{' '}
             <Link href="/polityka-prywatnosci" className="underline hover:text-zinc-800 transition-colors">
               politykę prywatności
             </Link>.
           </p>
        </div>

        {/* --- СЕКЦІЯ 2: НАВІГАЦІЙНА СІТКА --- */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
           
           {/* Колонка 1: Допомога */}
           <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 mb-6">Potrzebujesz pomocy?</span>
              <span className="text-xs text-zinc-500 mb-2">Pn-Pt 8:00-16:00</span>
              <a href="mailto:pomoc@miur.pl" className="text-xs font-medium text-zinc-800 hover:text-black transition-colors">
                pomoc@miur.pl
              </a>
           </div>

           {/* Колонка 2: Інформація */}
           <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 mb-3">Informacje</span>
              <Link href="/regulamin" className="text-xs text-zinc-500 hover:text-black transition-colors">Regulamin</Link>
              <Link href="/polityka-prywatnosci" className="text-xs text-zinc-500 hover:text-black transition-colors">Polityka prywatności</Link>
              <Link href="/blog" className="text-xs text-zinc-500 hover:text-black transition-colors">Blog</Link>
              <Link href="/program-partnerski" className="text-xs text-zinc-500 hover:text-black transition-colors">Program partnerski</Link>
              <Link href="/opinie" className="text-xs text-zinc-500 hover:text-black transition-colors">Opinie o Miur</Link>
           </div>

           {/* Колонка 3: Акаунт */}
           <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 mb-3">Twoje konto</span>
              <Link href="/rejestracja" className="text-xs text-zinc-500 hover:text-black transition-colors">Rejestracja</Link>
              <Link href="/logowanie" className="text-xs text-zinc-500 hover:text-black transition-colors">Logowanie</Link>
              <Link href="/moje-konto/edycja" className="text-xs text-zinc-500 hover:text-black transition-colors">Edycja konta</Link>
              <Link href="/lista-zyczen" className="text-xs text-zinc-500 hover:text-black transition-colors">Lista życzeń, schowek</Link>
              <Link href="/moje-zamowienia" className="text-xs text-zinc-500 hover:text-black transition-colors">Twoje zamówienia</Link>
              <button className="text-xs text-left text-zinc-500 hover:text-black transition-colors">Wyloguj</button>
           </div>

           {/* Колонка 4: Обслуговування клієнта */}
           <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 mb-3">Obsługa klienta</span>
              <Link href="/kontakt" className="text-xs text-zinc-500 hover:text-black transition-colors">Kontakt</Link>
              <Link href="/dostawa-platnosc" className="text-xs text-zinc-500 hover:text-black transition-colors">Dostawa / Płatność</Link>
              <Link href="/dyskretna-paczka" className="text-xs text-zinc-500 hover:text-black transition-colors">Dyskretna paczka</Link>
              <Link href="/zwroty-reklamacje" className="text-xs text-zinc-500 hover:text-black transition-colors">Zwroty i reklamacje</Link>
           </div>
           
        </div>

        {/* --- СЕКЦІЯ 3: ЛОГОТИП ТА КОПІРАЙТ --- */}
        <div className="w-full flex justify-center items-center mb-8 overflow-visible">
            <span className="text-[10vw] md:text-[6vw] leading-none font-bold tracking-tighter font-[family-name:var(--font-logo)] text-zinc-900 select-none pl-6 md:pl-10 pr-4">
              Miur
            </span>
        </div>

        <div className="text-[9px] uppercase tracking-widest text-zinc-400">
          © {new Date().getFullYear()} MIUR. WSZELKIE PRAWA ZASTRZEŻONE.
        </div>

    </footer>
  );
}