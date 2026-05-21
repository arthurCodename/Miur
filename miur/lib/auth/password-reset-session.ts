const STORAGE_KEY = "miur-password-reset-email";

export function setPendingPasswordResetEmail(email: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, normalizeEmailForStorage(email));
}

export function getPendingPasswordResetEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function clearPendingPasswordResetEmail(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

function normalizeEmailForStorage(email: string): string {
  return email.trim().toLowerCase();
}
