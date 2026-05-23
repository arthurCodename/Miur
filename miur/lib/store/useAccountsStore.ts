import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeEmail } from "@/lib/auth/normalize-email";
import type { LoginResult, RegisterResult, ResetPasswordResult } from "@/lib/auth/types";

/**
 * MOCK ONLY — client-side account store for development.
 *
 * Passwords are stored in plain text in localStorage.
 * This entire store MUST be replaced by real backend API calls
 * before going to production. Do NOT use in any environment
 * where real user data is present.
 */

interface StoredAccount {
  password: string;
}

interface AccountsState {
  accounts: Record<string, StoredAccount>;
  register: (email: string, password: string) => RegisterResult;
  verifyLogin: (email: string, password: string) => LoginResult;
  resetPassword: (email: string, newPassword: string) => ResetPasswordResult;
  hasAccount: (email: string) => boolean;
}

export const useAccountsStore = create<AccountsState>()(
  persist(
    (set, get) => ({
      accounts: {},

      hasAccount: (email) => {
        const key = normalizeEmail(email);
        return Boolean(get().accounts[key]);
      },

      register: (email, password) => {
        const key = normalizeEmail(email);
        if (get().accounts[key]) {
          return { ok: false, reason: "email_taken" };
        }
        set((state) => ({
          accounts: { ...state.accounts, [key]: { password } },
        }));
        return { ok: true };
      },

      verifyLogin: (email, password) => {
        const key = normalizeEmail(email);
        const account = get().accounts[key];
        if (!account) {
          return { ok: false, reason: "account_not_found" };
        }
        if (account.password !== password) {
          return { ok: false, reason: "wrong_password" };
        }
        return { ok: true };
      },

      resetPassword: (email, newPassword) => {
        const key = normalizeEmail(email);
        if (!get().accounts[key]) {
          return { ok: false, reason: "account_not_found" };
        }
        set((state) => ({
          accounts: {
            ...state.accounts,
            [key]: { password: newPassword },
          },
        }));
        return { ok: true };
      },
    }),
    {
      name: "miur-accounts-storage",
      partialize: (state): Pick<AccountsState, "accounts"> => ({
        accounts: state.accounts,
      }),
    },
  ),
);
