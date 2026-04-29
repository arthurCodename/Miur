import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-48 w-full border-t border-zinc-200 pt-48 pb-32 px-6 font-sans">
      
      {/* Твій блідий градієнт (65% жовтий) */}
      <div 
        className="absolute inset-0 -z-10" 
        style={{
          background: 'linear-gradient(to bottom, #FFFBEB 0%,rgb(254, 247, 229) 65%,rgb(211, 202, 255) 100%)'
        }}
      />
      
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-24 gap-y-48">
          
          {/* ЛІВА ЧАСТИНА: Витончена навігація (зменшений шрифт) */}
          <div className="lg:col-span-5 flex flex-col">
            <nav className="flex flex-col space-y-16"> 
              {[
                { name: 'Katalog', href: '/katalog' },
                { name: 'Kontakt', href: '/kontakt' },
                { name: 'LinkedIn', href: '#' },
                { name: 'Instagram', href: '#' },
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="group flex items-center text-xl lg:text-3xl font-bold tracking-tight text-zinc-900 font-[family-name:var(--font-logo)] hover:opacity-30 transition-all duration-500 leading-none"
                >
                  {item.name}
                  <span className="ml-4 inline-block transform transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">
                    <ArrowUpRight className="w-5 h-5 lg:w-7 lg:h-7 stroke-[1.2px]" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* ПРАВА ЧАСТИНА: Інформаційні блоки */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
            
            <div className="flex flex-col space-y-32"> 
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-12">Informacje</h4>
                <nav className="flex flex-col space-y-8 text-sm font-medium text-zinc-800"> 
                  <Link href="/regulamin" className="hover:opacity-50 transition-opacity">Regulamin sklepu</Link>
                  <Link href="/polityka" className="hover:opacity-50 transition-opacity">Polityka prywatności</Link>
                  <Link href="/o-nas" className="hover:opacity-50 transition-opacity">Obudź zmysły з Miur</Link>
                </nav>
              </div>
              
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-12">Twoje konto</h4>
                <nav className="flex flex-col space-y-8 text-sm font-medium text-zinc-800">
                  <Link href="/login" className="hover:opacity-50 transition-opacity">Logowanie</Link>
                  <Link href="/zamowienia" className="hover:opacity-50 transition-opacity">Moje zamówienia</Link>
                </nav>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-32">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-12">Kontakt</h4>
                <div className="space-y-8">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Pn-Pt 8:00-16:00</p>
                  <a href="mailto:contact@miur-wellness.com" className="block text-lg lg:text-xl font-medium hover:opacity-50 transition-opacity">
                    contact@miur-wellness.com
                  </a>
                </div>
              </div>

              <div className="pt-24 border-t border-zinc-200">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-10">Newsletter</h4>
                <div className="relative group max-w-sm">
                  <input 
                    type="email" 
                    placeholder="TWOJE EMAIL" 
                    className="w-full bg-transparent border-b border-zinc-300 pb-6 text-xs font-bold uppercase tracking-widest outline-none focus:border-zinc-900 transition-all placeholder:text-zinc-300"
                  />
                  <button className="absolute right-0 bottom-6 transform transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">
                    <ArrowUpRight className="w-5 h-5 text-zinc-900" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* НИЖНЯ ПАНЕЛЬ */}
        <div className="mt-64 pt-16 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-end gap-16">
          <div className="flex flex-col space-y-6">
            <h3 className="text-4xl font-bold tracking-tighter text-zinc-800 font-[family-name:var(--font-logo)]">Miur</h3>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.4em]">
              © {new Date().getFullYear()} Miur Wellness Store
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-16 gap-y-6 text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400">
            <span>NIP: 0000000000</span>
            <span>BDO: 000000000</span>
            <Link href="/cookies" className="hover:text-zinc-900 transition-colors">Cookies</Link>
            <Link href="/legal" className="hover:text-zinc-900 transition-colors">Legal Notices</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}