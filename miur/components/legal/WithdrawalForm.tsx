"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { sellerLegal, sellerLegalComplete } from "@/lib/legal/seller";

export function WithdrawalForm() {
  const errId = useId();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    orderNumber: "",
    orderDate: "",
    receiptDate: "",
    productName: "",
    firstName: "",
    lastName: "",
    address: "",
    bankAccount: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerLegalComplete()) {
      setError("Formularz wymaga opublikowanych danych sprzedawcy. Skontaktuj się: " + sellerLegal.email);
      return;
    }
    setError(null);
    const body = [
      "Oświadczenie o odstąpieniu od umowy (wzór informacyjny)",
      "",
      `Do: ${sellerLegal.legalName}`,
      `E-mail: ${sellerLegal.email}`,
      "",
      `Numer zamówienia: ${form.orderNumber}`,
      `Data zamówienia: ${form.orderDate}`,
      `Data otrzymania towaru: ${form.receiptDate}`,
      `Nazwa towaru: ${form.productName}`,
      "",
      `Imię i nazwisko: ${form.firstName} ${form.lastName}`,
      `Adres: ${form.address}`,
      form.bankAccount ? `Nr konta (zwrot): ${form.bankAccount}` : "",
      "",
      "Ja niżej podpisany/a niniejszym informuję o moim odstąpieniu od umowy sprzedaży następujących towarów:",
      form.productName,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${sellerLegal.email}?subject=${encodeURIComponent(
      "Odstąpienie od umowy " + form.orderNumber,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    toast.message("Otwarto klienta poczty", {
      description: "Wyślij wiadomość lub skopiuj treść oświadczenia do własnego e-maila.",
    });
  };

  return (
    <form
      className="mt-8 space-y-4 rounded-sm border border-zinc-200 bg-zinc-50/80 p-6 md:p-8"
      onSubmit={onSubmit}
      noValidate
    >
      <p className="text-xs text-zinc-600">
        Wypełnij pola — wygenerujemy treść oświadczenia i otworzymy Twój program pocztowy. Możesz też
        wysłać oświadczenie listownie na adres sprzedawcy (patrz dane powyżej).
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Numer zamówienia"
          id="wd-order"
          value={form.orderNumber}
          onChange={(v) => setForm((f) => ({ ...f, orderNumber: v }))}
          required
        />
        <Field
          label="Data złożenia zamówienia"
          id="wd-order-date"
          type="date"
          value={form.orderDate}
          onChange={(v) => setForm((f) => ({ ...f, orderDate: v }))}
          required
        />
        <Field
          label="Data otrzymania towaru"
          id="wd-receipt"
          type="date"
          value={form.receiptDate}
          onChange={(v) => setForm((f) => ({ ...f, receiptDate: v }))}
          required
        />
        <Field
          label="Nazwa produktu"
          id="wd-product"
          value={form.productName}
          onChange={(v) => setForm((f) => ({ ...f, productName: v }))}
          required
        />
        <Field
          label="Imię"
          id="wd-fn"
          value={form.firstName}
          onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
          required
        />
        <Field
          label="Nazwisko"
          id="wd-ln"
          value={form.lastName}
          onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
          required
        />
      </div>
      <Field
        label="Adres (ulica, kod, miejscowość, kraj)"
        id="wd-address"
        value={form.address}
        onChange={(v) => setForm((f) => ({ ...f, address: v }))}
        required
        multiline
      />
      <Field
        label="Numer konta do zwrotu (IBAN) — opcjonalnie"
        id="wd-iban"
        value={form.bankAccount}
        onChange={(v) => setForm((f) => ({ ...f, bankAccount: v }))}
      />

      {error && (
        <p id={errId} role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-full bg-zinc-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Przygotuj e-mail z oświadczeniem
      </button>
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
        {required ? <span className="sr-only"> (wymagane)</span> : null}
      </label>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
        />
      )}
    </div>
  );
}
