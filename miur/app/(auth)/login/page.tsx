"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useAuthStore } from "@/lib/store/useAuthStore";

const loginSchema = z.object({
  email: z
    .string({ error: "Email jest wymagany" })
    .min(1, "Email jest wymagany")
    .email("Podaj prawidłowy adres email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    if (process.env.NODE_ENV !== "production") {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    login(data.email);
    toast.success("Zalogowano pomyślnie");
    router.push("/profile");
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-center text-2xl font-bold tracking-tight text-zinc-900">Logowanie</h1>
        <p className="mt-2 text-center text-sm text-zinc-600">Zaloguj się, aby zobaczyć swoje zamówienia.</p>

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
              aria-invalid={errors.email ? true : undefined}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
              Hasło
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
              aria-invalid={errors.password ? true : undefined}
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.password.message}
              </p>
            ) : null}
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
          <Link href="/" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
            Wróć do sklepu
          </Link>
        </p>
      </div>
    </main>
  );
}
