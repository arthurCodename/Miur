export type LoginFailureReason = "invalid_credentials";

export type RegisterResult = { ok: true } | { ok: false; reason: "email_taken" };

export type ResetPasswordResult =
  | { ok: true }
  | { ok: false; reason: "account_not_found" };
