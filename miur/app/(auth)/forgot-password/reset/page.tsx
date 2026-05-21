"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import {
  clearPendingPasswordResetEmail,
  getPendingPasswordResetEmail,
} from "@/lib/auth/password-reset-session";
import { resetPasswordSchema } from "@/lib/auth/schemas";
import { useAccountsStore } from "@/lib/store/useAccountsStore";

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const resetPassword = useAccountsStore((s) => s.resetPassword);
  const [email, setEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    const pending = getPendingPasswordResetEmail();
    if (!pending) {
      router.replace("/odzyskaj-haslo");
      return;
    }
    setEmail(pending);
  }, [router]);

  async function onSubmit(data: ResetFormValues) {
    if (!email) return;
    if (process.env.NODE_ENV !== "production") {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 600);
      });
    }
    const result = resetPassword(email, data.password);
    if (!result.ok) {
      clearPendingPasswordResetEmail();
      router.replace("/odzyskaj-haslo");
      return;
    }
    clearPendingPasswordResetEmail();
    toast.success("Hasło zostało zmienione. Możesz się zalogować.");
    router.push("/logowanie");
  }

  if (!email) {
    return (
      <div className="bg-white">
        <PageGradientHero title="Nowe hasło" eyebrow="Konto" />
        <main className="flex min-h-[40vh] items-center justify-center px-6 py-16">
          <p className="text-sm text-zinc-600">Ładowanie…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <PageGradientHero title="Nowe hasło" eyebrow="Konto" />
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-center text-sm text-zinc-600">
            Ustaw nowe hasło dla konta{" "}
            <span className="font-medium text-zinc-900">{email}</span>.
          </p>

          <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            <Link href="/logowanie" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
              Wróć do logowania
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
