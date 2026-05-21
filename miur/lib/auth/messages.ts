import type { LoginFailureReason } from "@/lib/auth/types";

export const LOGIN_ERROR_MESSAGES: Record<LoginFailureReason, string> = {
  account_not_found:
    "Nie znaleziono konta o podanym adresie e-mail. Sprawdź adres lub załóż konto.",
  wrong_password: "Nieprawidłowe hasło. Spróbuj ponownie lub odzyskaj hasło.",
};

export const REGISTER_ERROR_MESSAGES = {
  email_taken: "Konto z tym adresem e-mail już istnieje. Zaloguj się.",
} as const;

export const RESET_ERROR_MESSAGES = {
  account_not_found:
    "Nie znaleziono konta o podanym adresie e-mail. Sprawdź adres lub załóż konto.",
} as const;
