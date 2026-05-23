import { create } from "zustand";
import { persist } from "zustand/middleware";
import { resolveCartUnitPrice } from "@/lib/cart/parse-pl-price";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  /** Unit price in PLN (numeric; display formatting happens in UI). */
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export type CartLineInput = Omit<CartItem, "quantity">;

export interface CartState {
  items: CartItem[];
  addItem: (item: CartLineInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

function migrateItemsFromStorage(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];

  const items: CartItem[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const o = entry as Record<string, unknown>;
    if (
      typeof o.id !== "string" ||
      typeof o.slug !== "string" ||
      typeof o.name !== "string" ||
      typeof o.image !== "string"
    ) {
      continue;
    }

    const quantity =
      typeof o.quantity === "number" && Number.isFinite(o.quantity) && o.quantity > 0
        ? Math.floor(o.quantity)
        : 1;

    const price = resolveCartUnitPrice(
      typeof o.price === "number" || typeof o.price === "string" ? o.price : 0,
    );

    const category = typeof o.category === "string" ? o.category : "";

    items.push({ id: o.id, slug: o.slug, name: o.name, price, image: o.image, category, quantity });
  }

  return items;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const index = state.items.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            const next = state.items.slice();
            const existing = next[index]!;
            const nextQty = Math.min(existing.quantity + 1, 99);
            next[index] = { ...existing, quantity: nextQty };
            return { items: next };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          const clamped = Math.min(quantity, 99);
          return {
            items: state.items.map((i) => (i.id === id ? { ...i, quantity: clamped } : i)),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state): Pick<CartState, "items"> => ({ items: state.items }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as { items?: unknown } | undefined;
        return {
          ...currentState,
          items:
            persisted?.items !== undefined
              ? migrateItemsFromStorage(persisted.items)
              : currentState.items,
        };
      },
    },
  ),
);
