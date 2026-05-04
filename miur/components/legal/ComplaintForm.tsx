"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { sellerLegal, sellerLegalComplete } from "@/lib/legal/seller";

export function ComplaintForm() {
  const errId = useId();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    orderNumber: "",
    productName: "",
    purchaseDate: "",
    defectDescription: "",
    discoveryDate: "",
    requestType: "repair" as "repair" | "replacement" | "price_reduction" | "withdrawal",
    email: "",
    phone: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerLegalComplete()) {
      setError("Dane sprzedawcy nie są uzupełnione. Napisz na: " + sellerLegal.email);
      return;
    }
    setError(null);
    const reqLabel: Record<typeof form.requestType, string> = {
      repair: "naprawa",
      replacement: "wymiana na wolny od wad",
      price_reduction: "obniżenie ceny",
      withdrawal: "odstąpienie od umowy",
    };
    const body = [
      "Reklamacja towaru",
      "",
      `Do: ${sellerLegal.legalName}`,
      `E-mail: ${sellerLegal.email}`,
      "",
      `Nr zamówienia: ${form.orderNumber}`,
      `Produkt: ${form.productName}`,
      `Data zakupu: ${form.purchaseDate}`,
      `Opis wady: ${form.defectDescription}`,
      `Data stwierdzenia wady: ${form.discoveryDate}`,
      `Żądanie: ${reqLabel[form.requestType]}`,
      "",
      `Kontakt zwrotny — e-mail: ${form.email}`,
      form.phone ? `Telefon: ${form.phone}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${sellerLegal.email}?subject=${encodeURIComponent(
      "Reklamacja " + form.orderNumber,
    )}&body=${encodeURIComponent(body)}`;
    toast.message("Otwarto klienta poczty z treścią reklamacji.");
  };

  return (
    <form className="mt-8 space-y-4 rounded-sm border border-zinc-200 bg-white p-6 md:p-8" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          id="cf-order"
          label="Numer zamówienia"
          value={form.orderNumber}
          onChange={(v) => setForm((f) => ({ ...f, orderNumber: v }))}
          required
        />
        <Field
          id="cf-product"
          label="Nazwa produktu"
          value={form.productName}
          onChange={(v) => setForm((f) => ({ ...f, productName: v }))}
          required
        />
        <Field
          id="cf-purchase"
          label="Data zakupu"
          type="date"
          value={form.purchaseDate}
          onChange={(v) => setForm((f) => ({ ...f, purchaseDate: v }))}
          required
        />
        <Field
          id="cf-discovery"
          label="Data stwierdzenia wady"
          type="date"
          value={form.discoveryDate}
          onChange={(v) => setForm((f) => ({ ...f, discoveryDate: v }))}
          required
        />
      </div>
      <Field
        id="cf-defect"
        label="Opis wady"
        value={form.defectDescription}
        onChange={(v) => setForm((f) => ({ ...f, defectDescription: v }))}
        required
        multiline
      />
      <div>
        <label htmlFor="cf-req" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Żądanie
        </label>
        <select
          id="cf-req"
          value={form.requestType}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              requestType: e.target.value as typeof form.requestType,
            }))
          }
          className="mt-1 w-full rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
        >
          <option value="repair">Naprawa</option>
          <option value="replacement">Wymiana</option>
          <option value="price_reduction">Obniżenie ceny</option>
          <option value="withdrawal">Odstąpienie od umowy</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          id="cf-email"
          label="E-mail kontaktowy"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          required
        />
        <Field
          id="cf-phone"
          label="Telefon (opcjonalnie)"
          type="tel"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
        />
      </div>
      {error && (
        <p id={errId} role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="rounded-full bg-zinc-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Przygotuj e-mail z reklamacją
      </button>
      <p className="text-xs text-zinc-500">
        Sprzedawca ustosunkuje się do reklamacji w terminie 14 dni (brak odpowiedzi w tym terminie, przy
        spełnionych przesłankach, może oznaczać uznanie reklamacji zgodnie z przepisami).
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  type = "text",
  multiline,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-sm border border-zinc-200 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-sm border border-zinc-200 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
        />
      )}
    </div>
  );
}
