"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { forgotEmailSchema } from "@/lib/auth/schemas";

type ForgotEmailValues = z.infer<typeof forgotEmailSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotEmailValues>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotEmailValues) {
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
    } catch {
      // catch some shit silently bruh
    }
    setSent(true);
  }

  return (
    <div className="bg-white">
      <PageGradientHero title="Odzyskaj hasło" eyebrow="Konto" />
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
          {sent ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-zinc-900">
                Sprawdź skrzynkę e-mail
              </h2>
              <p className="mt-4 text-sm text-zinc-600">
                Jeśli istnieje konto powiązane z podanym adresem, wysłaliśmy na
                nie link do ustawienia nowego hasła. Link wygasa za 30 minut.
              </p>
              <p className="mt-6 text-sm text-zinc-600">
                Nie widzisz wiadomości? Sprawdź folder spam lub{" "}
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="font-medium text-zinc-900 underline-offset-2 hover:underline"
                >
                  spróbuj ponownie
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-zinc-600">
                Podaj adres e-mail powiązany z kontem. Wyślemy Ci link do
                ustawienia nowego hasła.
              </p>

              <form
                className="mt-6 flex flex-col gap-5"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <AuthFormField
                  id="forgot-email"
                  label="E-mail"
                  type="email"
                  autoComplete="email"
                  error={errors.email}
                  registration={register("email")}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:bg-black disabled:opacity-60"
                >
                  {isSubmitting ? "Wysyłanie…" : "Wyślij link"}
                </button>
              </form>
            </>
          )}

          <p className="mt-8 text-center text-sm text-zinc-600">
            <Link
              href="/logowanie"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              Wróć do logowania
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
