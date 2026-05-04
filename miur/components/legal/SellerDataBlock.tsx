import { sellerAddressBlock, sellerLegal, sellerLegalComplete } from "@/lib/legal/seller";

export function SellerDataBlock() {
  if (!sellerLegalComplete()) {
    return (
      <div className="rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-medium">Dane sprzedawcy — do uzupełnienia przed uruchomieniem sklepu</p>
        <p className="mt-2 text-xs leading-relaxed text-amber-900/90">
          Zgodnie z UŚUDE (art. 5) oraz RODO (art. 13) należy opublikować pełną nazwę prawną, adres, NIP i
          REGON. Skonfiguruj zmienne środowiskowe{" "}
          <code className="rounded bg-amber-100/80 px-1">NEXT_PUBLIC_SELLER_*</code> (patrz{" "}
          <code className="rounded bg-amber-100/80 px-1">.env.example</code>).
        </p>
        <p className="mt-3 text-sm">
          Kontakt:{" "}
          <a className="font-medium underline" href={`mailto:${sellerLegal.email}`}>
            {sellerLegal.email}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 text-sm text-zinc-700">
      <p className="font-semibold text-zinc-900">{sellerLegal.legalName}</p>
      <p>{sellerAddressBlock()}</p>
      <p>
        NIP: {sellerLegal.nip}
        <br />
        REGON: {sellerLegal.regon}
        {sellerLegal.krs ? (
          <>
            <br />
            KRS: {sellerLegal.krs}
          </>
        ) : null}
      </p>
      <p>
        E-mail:{" "}
        <a className="underline underline-offset-2 hover:text-zinc-900" href={`mailto:${sellerLegal.email}`}>
          {sellerLegal.email}
        </a>
        {sellerLegal.phone ? (
          <>
            <br />
            Tel.:{" "}
            <a className="underline underline-offset-2 hover:text-zinc-900" href={`tel:${sellerLegal.phone}`}>
              {sellerLegal.phone}
            </a>
          </>
        ) : null}
      </p>
    </div>
  );
}
