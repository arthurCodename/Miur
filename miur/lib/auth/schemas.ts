import { z } from "zod";

export const emailField = z
  .string({ error: "Email jest wymagany" })
  .min(1, "Email jest wymagany")
  .email("Podaj prawidłowy adres email");

export const passwordField = z.string().min(6, "Hasło musi mieć co najmniej 6 znaków");

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const registerSchema = z
  .object({
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Potwierdź hasło"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
  });

export const forgotEmailSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, "Potwierdź hasło"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
  });
