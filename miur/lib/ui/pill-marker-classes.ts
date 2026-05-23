/**
 * Wspólne klasy „pigułek” (blog, karty produktów): tekst na środku w pionie i poziomie.
 * Same stringi — bez dodatkowego komponentu React.
 */
export const pillMarkerTypography =
  "text-center text-[8px] font-bold uppercase leading-none tracking-widest";

/** Obudowa absolutna na zdjęciu produktu (bestsellery / wyprzedaż). */
export const productImageTagShell =
  "pointer-events-none absolute left-3 top-3 z-10 flex min-h-[1.35em] min-w-0 max-w-[min(calc(100%-1.5rem),12rem)] items-center justify-center overflow-hidden rounded-full px-3 py-1";

export const productImageTagLight = "bg-white text-black shadow-sm ring-1 ring-black/5";

export const productImageTagPromo = "bg-amber-500 text-zinc-950 shadow-md shadow-black/25";

/** Kafelek bloga / lista wpisów — nie absolutny, ale ta sama geometria tekstu. */
export const blogCardPillBase =
  "inline-flex min-h-[1.35em] min-w-0 max-w-[min(100%,14rem)] items-center justify-center overflow-hidden rounded-full px-3 py-1";
