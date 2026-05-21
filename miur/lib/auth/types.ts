export type LoginFailureReason = "account_not_found" | "wrong_password";

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: LoginFailureReason };

export type RegisterResult = { ok: true } | { ok: false; reason: "email_taken" };

export type ResetPasswordResult =
  | { ok: true }
  | { ok: false; reason: "account_not_found" };
