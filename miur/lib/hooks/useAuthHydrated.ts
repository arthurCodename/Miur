"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";

/** Czy stan auth z persist (localStorage) jest już odczytany po hydracji. */
export function useAuthHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useAuthStore.persist.onFinishHydration(cb),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
