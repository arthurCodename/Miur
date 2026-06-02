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
import { LOGIN_ERROR_MESSAGES } from "@/lib/auth/messages";
import { loginSchema } from "@/lib/auth/schemas";
import type { LoginFailureReason } from "@/lib/auth/types";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/profile";
  const [authError, setAuthError] = useState<LoginFailureReason | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    setAuthError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      setAuthError("invalid_credentials");
      return;
    }

    toast.success("Pomyślnie zalogowano!");
    router.push(callbackUrl);
  }

  return (
    <div className="bg-white">
      <PageGradientHero title="Logowanie" eyebrow="Konto" />
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-center text-sm text-zinc-600">
            Zaloguj się, aby zobaczyć swoje zamówienia.
          </p>

          <form
            className="mt-6 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {authError ? (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                role="alert"
              >
                {LOGIN_ERROR_MESSAGES[authError]}
              </p>
            ) : null}

            <AuthFormField
              id="login-email"
              label="E-mail"
              type="email"
              autoComplete="email"
              error={errors.email}
              registration={register("email")}
            />

            <AuthFormField
              id="login-password"
              label="Hasło"
              type="password"
              autoComplete="current-password"
              error={errors.password}
              registration={register("password")}
            />

            <div className="flex justify-end">
              <Link
                href="/odzyskaj-haslo"
                className="text-xs font-medium text-zinc-700 underline-offset-2 hover:text-black hover:underline"
              >
                Nie pamiętasz hasła?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:bg-black disabled:opacity-60"
            >
              {isSubmitting ? "Logowanie…" : "Zaloguj się"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600">
            Nie masz konta?{" "}
            <Link
              href="/rejestracja"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              Zarejestruj się
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-zinc-600">
            <Link
              href="/"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              Wróć do sklepu
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
