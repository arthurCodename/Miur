"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { REGISTER_ERROR_MESSAGES } from "@/lib/auth/messages";
import { registerSchema } from "@/lib/auth/schemas";
import { useAccountsStore } from "@/lib/store/useAccountsStore";
import { useAuthStore } from "@/lib/store/useAuthStore";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerAccount = useAccountsStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: RegisterFormValues) {
    setRegisterError(null);
    if (process.env.NODE_ENV !== "production") {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 600);
      });
    }
    const result = registerAccount(data.email, data.password);
    if (!result.ok) {
      setRegisterError(REGISTER_ERROR_MESSAGES.email_taken);
      return;
    }
    const loginResult = login(data.email, data.password);
    if (!loginResult.ok) {
      setRegisterError("Nie udało się zalogować po rejestracji. Spróbuj się zalogować.");
      router.push("/logowanie");
      return;
    }
    toast.success("Konto zostało utworzone");
    router.push("/profile");
  }

  return (
    <div className="bg-white">
      <PageGradientHero title="Rejestracja" eyebrow="Konto" />
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-center text-sm text-zinc-600">Załóż konto, aby śledzić zamówienia i listę życzeń.</p>

          <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {registerError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
                {registerError}
              </p>
            ) : null}

            <AuthFormField
              id="register-email"
              label="E-mail"
              type="email"
              autoComplete="email"
              error={errors.email}
              registration={register("email")}
            />

            <AuthFormField
              id="register-password"
              label="Hasło"
              type="password"
              autoComplete="new-password"
              error={errors.password}
              registration={register("password")}
            />

            <AuthFormField
              id="register-confirm-password"
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
              {isSubmitting ? "Rejestracja…" : "Załóż konto"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600">
            Masz już konto?{" "}
            <Link href="/logowanie" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
              Zaloguj się
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-zinc-600">
            <Link href="/" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
              Wróć do sklepu
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
