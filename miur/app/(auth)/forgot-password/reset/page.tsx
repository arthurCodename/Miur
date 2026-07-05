"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { PageGradientHero } from "@/components/layout/PageGradientHero";

import { resetPasswordSchema } from "@/lib/auth/schemas";

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [resetError, setResetError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(data: ResetFormValues) {
    setResetError(null);

    if (!token) {
      setResetError(
        "Brak tokenu w linku. Otwórz link z wiadomości e-mail jeszcze raz.",
      );
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: data.password }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setResetError(
        body.error ?? "Nie udało się ustawić nowego hasła. Spróbuj ponownie.",
      );
      return;
    }

    toast.success("Hasło zostało zmienione. Możesz się zalogować.");
    router.push("/logowanie");
  }

  // No token in URL → render the form anyway but block submission. The error
  // message appears the moment they hit submit. (We avoid a "wrong page!"
  // server-side check so a stale link still has a clear UX path.)

  return (
    <div className="bg-white">
      <PageGradientHero title="Nowe hasło" eyebrow="Konto" />
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-center text-sm text-zinc-600">
            Ustaw nowe hasło dla swojego konta.
          </p>

          <form
            className="mt-6 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {resetError ? (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                role="alert"
              >
                {resetError}
              </p>
            ) : null}

            <AuthFormField
              id="reset-password"
              label="Nowe hasło"
              type="password"
              autoComplete="new-password"
              error={errors.password}
              registration={register("password")}
            />

            <AuthFormField
              id="reset-confirm-password"
              label="Potwierdź hasło"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword}
              registration={register("confirmPassword")}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:bg-black disabled:opacity-60"
            >
              {isSubmitting ? "Zapisywanie…" : "Zapisz nowe hasło"}
            </button>
          </form>

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
