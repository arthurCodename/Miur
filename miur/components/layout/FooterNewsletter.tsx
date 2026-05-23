"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Podaj prawidłowy adres e-mail.");
      return;
    }
    if (!consent) {
      toast.error("Zaznacz zgodę na newsletter, aby zapisać się na listę.");
      return;
    }
    toast.success("Sprawdź skrzynkę — wyślemy link potwierdzający (double opt-in).", {
      description: email ? `Na adres: ${email}` : undefined,
    });
    setEmail("");
    setConsent(false);
  };

  return (
    <div className="mb-6 flex w-full max-w-sm flex-col">
      <form className="group relative flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <div className="flex items-center border-b border-zinc-400 pb-2 transition-colors duration-500 hover:border-black">
          <label htmlFor="footer-newsletter-email" className="sr-only">
            Adres e-mail do newslettera
          </label>
          <input
            id="footer-newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Twój adres e-mail:"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="footer-newsletter-consent-hint"
            className="w-full bg-transparent text-[12px] tracking-wide outline-none transition-colors placeholder:text-zinc-500 focus:placeholder:text-zinc-900"
          />
          <button
            type="submit"
            aria-label="Zapisz się do newslettera"
            className="text-zinc-500 transition-colors duration-300 group-hover:text-black"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.2} />
          </button>
        </div>

        <div className="flex items-start gap-2 text-left">
          <input
            id="footer-newsletter-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-3.5 w-3.5 shrink-0 rounded border border-zinc-400 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            aria-describedby="footer-newsletter-consent-hint"
          />
          <label htmlFor="footer-newsletter-consent" className="text-[9px] leading-relaxed text-zinc-600">
            Wyrażam zgodę na otrzymywanie newslettera Miur (informacje handlowe) na podany adres e-mail,
            zgodnie z{" "}
            <Link href="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-zinc-900">
              Polityką prywatności
            </Link>
            . Zgodę mogę wycofać w każdej chwili. Aktywacja po potwierdzeniu linku w e-mailu (double opt-in).
          </label>
        </div>
      </form>
      <p id="footer-newsletter-consent-hint" className="mt-3 max-w-md text-[9px] leading-relaxed text-zinc-500">
        Rabat -10 PLN przy zamówieniu min. 150 zł — zgodnie z aktualnymi zasadami promocji. Nie wysyłamy
        spamu; wypisanie jednym kliknięciem w każdej wiadomości.
      </p>
    </div>
  );
}
