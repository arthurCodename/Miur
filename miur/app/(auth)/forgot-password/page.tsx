"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { setPendingPasswordResetEmail } from "@/lib/auth/password-reset-session";
import { RESET_ERROR_MESSAGES } from "@/lib/auth/messages";
import { forgotEmailSchema } from "@/lib/auth/schemas";
import { useAccountsStore } from "@/lib/store/useAccountsStore";

type ForgotEmailValues = z.infer<typeof forgotEmailSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const hasAccount = useAccountsStore((s) => s.hasAccount);
  const [requestError, setRequestError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotEmailValues>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotEmailValues) {
    setRequestError(null);
    if (process.env.NODE_ENV !== "production") {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 600);
      });
    }
    if (!hasAccount(data.email)) {
      setRequestError(RESET_ERROR_MESSAGES.account_not_found);
      return;
    }
    setPendingPasswordResetEmail(data.email);
    router.push("/odzyskaj-haslo/ustaw");
  }

  return (
    <div className="bg-white">
      <PageGradientHero title="Odzyskaj hasło" eyebrow="Konto" />
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-center text-sm text-zinc-600">
            Podaj adres e-mail powiązany z kontem. Przejdziesz do ustawienia nowego hasła.
          </p>

          <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {requestError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
                {requestError}
              </p>
            ) : null}

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
              {isSubmitting ? "Sprawdzanie…" : "Kontynuuj"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600">
            <Link href="/logowanie" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
              Wróć do logowania
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
