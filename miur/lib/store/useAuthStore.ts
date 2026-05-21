import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginResult } from "@/lib/auth/types";
import { useAccountsStore } from "@/lib/store/useAccountsStore";

export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
}

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim();
  if (!local) return "Użytkownik";
  const withSpaces = local.replace(/[._-]+/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: (email, password) => {
        const result = useAccountsStore.getState().verifyLogin(email, password);
        if (!result.ok) {
          return result;
        }
        set({
          user: {
            email: email.trim().toLowerCase(),
            name: displayNameFromEmail(email),
          },
        });
        return { ok: true };
      },

      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state): Pick<AuthState, "user"> => ({ user: state.user }),
    },
  ),
);
