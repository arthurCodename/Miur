"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShoppingBag } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import type { InPostModal, InPostPoint } from "@/lib/inpost/types";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { useCartStore } from "@/lib/store/useCartStore";
import { useIsMounted } from "@/lib/hooks/useIsMounted";

/**
 * Polish phone: 9 digits, optionally prefixed with +48 / 48 / 0048.
 * Examples accepted: 600100200, +48 600 100 200, 48-600-100-200, 0048600100200
 */
const PL_PHONE_REGEX = /^(?:\+?48|0048)?\s?-?\d{3}\s?-?\d{3}\s?-?\d{3}$/;

/** Polish postal code: NN-NNN */
const PL_POSTAL_CODE_REGEX = /^\d{2}-\d{3}$/;

const checkoutSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Podaj imię i nazwisko (min. 3 znaki)")
      .max(80, "Imię i nazwisko jest zbyt długie")
      .regex(
        /^[\p{L}][\p{L} '\-\.]+$/u,
        "Imię i nazwisko może zawierać tylko litery, spacje i myślniki",
      ),
    email: z
      .string()
      .min(1, "Podaj e-mail")
      .email("Nieprawidłowy adres e-mail"),
    phone: z
      .string()
      .min(1, "Podaj numer telefonu")
      .regex(
        PL_PHONE_REGEX,
        "Nieprawidłowy numer telefonu (9 cyfr, opcjonalnie z prefiksem +48)",
      ),
    deliveryMethod: z.enum(["paczkomat", "courier"]),
    paczkomatCode: z.string().optional(),
    paczkomatAddress: z.string().optional(),
    addressLine: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),

    // RODO + UoPK consents
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, {
        message: "Akceptacja regulaminu jest wymagana",
      }),
    acceptPrivacy: z
      .boolean()
      .refine((v) => v === true, {
        message:
          "Potwierdzenie zapoznania się z polityką prywatności jest wymagane",
      }),
    marketingOptIn: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === "paczkomat") {
      if (!data.paczkomatCode || !data.paczkomatAddress) {
        ctx.addIssue({
          path: ["paczkomatCode"],
          code: "custom",
          message: "Wybierz Paczkomat z listy",
        });
      }
    }
    if (data.deliveryMethod === "courier") {
      if (!data.addressLine || data.addressLine.length < 5) {
        ctx.addIssue({
          path: ["addressLine"],
          code: "custom",
          message: "Podaj ulicę i numer (min. 5 znaków)",
        });
      }
      if (!data.city || data.city.length < 2) {
        ctx.addIssue({
          path: ["city"],
          code: "custom",
          message: "Podaj miasto",
        });
      }
      if (!data.postalCode || !PL_POSTAL_CODE_REGEX.test(data.postalCode)) {
        ctx.addIssue({
          path: ["postalCode"],
          code: "custom",
          message: "Nieprawidłowy kod pocztowy (format: NN-NNN)",
        });
      }
    }
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const isMounted = useIsMounted();
  const cartItems = useCartStore((s) => s.items);
  const { data: session, status: authStatus } = useSession();

  const [selectedPaczkomat, setSelectedPaczkomat] = useState<{
    name: string;
    address: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      deliveryMethod: "paczkomat",
      paczkomatCode: "",
      paczkomatAddress: "",
      addressLine: "",
      city: "",
      postalCode: "",
      acceptTerms: false,
      acceptPrivacy: false,
      marketingOptIn: false,
    },
  });

  const deliveryMethod = useWatch({ control, name: "deliveryMethod" });

  // Logged-in users get their contact details prefilled; guests type them in.
  // Only fill empty fields so we never clobber what the user already entered.
  useEffect(() => {
    if (authStatus !== "authenticated") return;
    const user = session?.user;
    if (user?.email && !getValues("email")) {
      setValue("email", user.email);
    }
    if (user?.name && !getValues("fullName")) {
      setValue("fullName", user.name);
    }
  }, [authStatus, session, getValues, setValue]);

  // Inject InPost widget stylesheet into <head> (cannot live in <body> per HTML spec).
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://geowidget.easypack24.net/css/easypack.css";
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  const openInPostWidget = useCallback(() => {
    if (typeof window === "undefined") return;
    const ep = window.easyPack;
    if (!ep) {
      toast.info("Mapa Paczkomatów wczytuje się — spróbuj za chwilę.");
      return;
    }
    ep.modalMap(
      (point: InPostPoint, modal: InPostModal) => {
        const next = { name: point.name, address: point.address.line1 };
        setSelectedPaczkomat(next);
        setValue("paczkomatCode", next.name, { shouldValidate: true });
        setValue("paczkomatAddress", next.address, { shouldValidate: true });
        modal.closeModal();
      },
      { language: "pl" },
    );
  }, [setValue]);

  async function onSubmit(_data: CheckoutFormValues) {
    // Simulate server action latency in dev only. In real flow this would be a
    // Server Action posting to /api/orders, then redirecting to Przelewy24 / BLIK.
    if (process.env.NODE_ENV !== "production") {
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
    }
    toast.success("Zamówienie złożone");
    router.push("/checkout/success");
  }

  return (
    <>
      <Script
        src="https://geowidget.easypack24.net/js/sdk-for-javascript.js"
        strategy="lazyOnload"
      />

      <div className="bg-white">
        <PageGradientHero title="Kasa" eyebrow="Zamówienie" />
        {isMounted && cartItems.length === 0 ? (
          <main className="mx-auto flex min-h-[40vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16 text-center md:py-24">
            <div className="rounded-full border border-zinc-200 bg-zinc-50 p-6">
              <ShoppingBag
                className="size-10 text-zinc-400"
                strokeWidth={1.25}
                aria-hidden
              />
            </div>
            <p className="max-w-sm text-base font-medium leading-snug text-zinc-700">
              Twój koszyk jest pusty — dodaj produkty, aby przejść do kasy.
            </p>
            <Link
              href="/produkty"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-900 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              Przeglądaj produkty
            </Link>
          </main>
        ) : (
          <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <p className="text-sm text-zinc-600">
              Uzupełnij dane dostawy i płatności.
            </p>

            {authStatus === "unauthenticated" ? (
              <p className="mt-6 max-w-2xl rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-700">
                Kupujesz jako gość — zamówienie złożysz bez zakładania konta.{" "}
                <Link
                  href="/login?callbackUrl=/checkout"
                  className="font-semibold text-zinc-900 underline underline-offset-2"
                >
                  Zaloguj się
                </Link>
                , jeśli chcesz mieć historię zamówień na koncie.
              </p>
            ) : null}

            <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
              <aside className="lg:order-2 lg:sticky lg:top-24">
                <OrderSummary deliveryMethod={deliveryMethod} />
              </aside>

              <form
                className="flex flex-col gap-8 lg:order-1"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Personal details */}
                <fieldset className="flex flex-col gap-4">
                  <legend className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">
                    Dane kontaktowe
                  </legend>

                  <FormField
                    label="Imię i nazwisko"
                    htmlFor="fullName"
                    error={errors.fullName?.message}
                  >
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      aria-invalid={errors.fullName ? true : undefined}
                      {...register("fullName")}
                      className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
                    />
                  </FormField>

                  <FormField
                    label="E-mail"
                    htmlFor="email"
                    error={errors.email?.message}
                  >
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={errors.email ? true : undefined}
                      {...register("email")}
                      className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
                    />
                  </FormField>

                  <FormField
                    label="Telefon"
                    htmlFor="phone"
                    error={errors.phone?.message}
                  >
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+48 600 100 200"
                      aria-invalid={errors.phone ? true : undefined}
                      {...register("phone")}
                      className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
                    />
                  </FormField>
                </fieldset>

                {/* Delivery */}
                <fieldset className="flex flex-col gap-4">
                  <legend className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">
                    Sposób dostawy
                  </legend>

                  <Controller
                    name="deliveryMethod"
                    control={control}
                    render={({ field }) => (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <DeliveryOption
                          title="Paczkomat InPost"
                          desc="Najpopularniejsza opcja — odbiór 24/7"
                          selected={field.value === "paczkomat"}
                          onSelect={() => field.onChange("paczkomat")}
                        />
                        <DeliveryOption
                          title="Kurier"
                          desc="Doręczenie pod wskazany adres"
                          selected={field.value === "courier"}
                          onSelect={() => field.onChange("courier")}
                        />
                      </div>
                    )}
                  />

                  {deliveryMethod === "paczkomat" ? (
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={openInPostWidget}
                        className="inline-flex min-h-11 max-w-md items-center justify-center rounded-full border border-zinc-900 bg-white px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                      >
                        {selectedPaczkomat
                          ? "Zmień Paczkomat"
                          : "Wybierz Paczkomat"}
                      </button>
                      {selectedPaczkomat ? (
                        <p className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-800">
                          <span className="font-semibold text-zinc-900">
                            Wybrany Paczkomat:{" "}
                          </span>
                          {selectedPaczkomat.name}, {selectedPaczkomat.address}
                        </p>
                      ) : null}
                      {errors.paczkomatCode ? (
                        <p className="text-sm text-red-600" role="alert">
                          {errors.paczkomatCode.message}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <FormField
                        label="Adres (ulica i numer)"
                        htmlFor="addressLine"
                        error={errors.addressLine?.message}
                      >
                        <input
                          id="addressLine"
                          type="text"
                          autoComplete="street-address"
                          aria-invalid={errors.addressLine ? true : undefined}
                          {...register("addressLine")}
                          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
                        />
                      </FormField>

                      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                        <FormField
                          label="Miasto"
                          htmlFor="city"
                          error={errors.city?.message}
                        >
                          <input
                            id="city"
                            type="text"
                            autoComplete="address-level2"
                            aria-invalid={errors.city ? true : undefined}
                            {...register("city")}
                            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
                          />
                        </FormField>

                        <FormField
                          label="Kod pocztowy"
                          htmlFor="postalCode"
                          error={errors.postalCode?.message}
                        >
                          <input
                            id="postalCode"
                            type="text"
                            placeholder="00-001"
                            autoComplete="postal-code"
                            maxLength={6}
                            inputMode="numeric"
                            aria-invalid={errors.postalCode ? true : undefined}
                            {...register("postalCode")}
                            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm tabular-nums text-zinc-900 outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
                          />
                        </FormField>
                      </div>
                    </div>
                  )}
                </fieldset>

                {/* Consents (RODO + UoPK) */}
                <fieldset className="flex flex-col gap-4">
                  <legend className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">
                    Zgody
                  </legend>

                  <ConsentCheckbox
                    id="acceptTerms"
                    error={errors.acceptTerms?.message}
                    {...register("acceptTerms")}
                  >
                    Zapoznałem/am się z{" "}
                    <Link
                      href="/regulamin"
                      target="_blank"
                      className="underline underline-offset-2"
                    >
                      Regulaminem
                    </Link>{" "}
                    sklepu i akceptuję jego treść.{" "}
                    <span className="text-red-600">*</span>
                  </ConsentCheckbox>

                  <ConsentCheckbox
                    id="acceptPrivacy"
                    error={errors.acceptPrivacy?.message}
                    {...register("acceptPrivacy")}
                  >
                    Zapoznałem/am się z{" "}
                    <Link
                      href="/polityka-prywatnosci"
                      target="_blank"
                      className="underline underline-offset-2"
                    >
                      Polityką prywatności
                    </Link>{" "}
                    i przyjmuję do wiadomości sposób przetwarzania moich danych
                    osobowych zgodnie z RODO.{" "}
                    <span className="text-red-600">*</span>
                  </ConsentCheckbox>

                  <ConsentCheckbox
                    id="marketingOptIn"
                    {...register("marketingOptIn")}
                  >
                    Chcę otrzymywać newsletter z ofertami i nowościami (zgoda
                    jest dobrowolna i można ją w każdej chwili wycofać).
                  </ConsentCheckbox>
                </fieldset>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 max-w-md items-center justify-center rounded-full bg-zinc-900 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Przekierowywanie do płatności…"
                    : "Przejdź do płatności"}
                </button>
              </form>
            </div>
          </main>
        )}
      </div>
    </>
  );
}

/* ---- Field primitives ---- */

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold uppercase tracking-wide text-zinc-700"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type DeliveryOptionProps = {
  title: string;
  desc: string;
  selected: boolean;
  onSelect: () => void;
};

function DeliveryOption({
  title,
  desc,
  selected,
  onSelect,
}: DeliveryOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col items-start rounded-md border-2 p-4 text-left transition-colors ${
        selected
          ? "border-zinc-900 bg-zinc-50"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <span className="text-sm font-bold text-zinc-900">{title}</span>
      <span className="mt-1 text-xs text-zinc-600">{desc}</span>
    </button>
  );
}

type ConsentCheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  error?: string;
  children: React.ReactNode;
};

const ConsentCheckbox = function ConsentCheckbox({
  id,
  error,
  children,
  ...rest
}: ConsentCheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="flex items-start gap-3 text-sm leading-relaxed text-zinc-700"
      >
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          className="mt-1 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
          {...rest}
        />
        <span>{children}</span>
      </label>
      {error ? (
        <p className="ml-7 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
