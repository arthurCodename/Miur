import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  login: (email: string) => void;
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

      login: (email) => {
        set({
          user: {
            email,
            name: displayNameFromEmail(email),
          },
        });
      },

      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state): Pick<AuthState, "user"> => ({ user: state.user }),
    },
  ),
);
