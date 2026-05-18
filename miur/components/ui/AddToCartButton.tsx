"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { resolveCartUnitPrice } from "@/lib/cart/parse-pl-price";
import { useCartStore } from "@/lib/store/useCartStore";
import { cn } from "@/lib/utils";

export type AddToCartProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  /** PLN amount; pass a number or a Polish-formatted string from mocks (e.g. "349,00 zł"). */
  price: number | string;
};

type AddToCartButtonProps = {
  product: AddToCartProduct;
  className?: string;
};

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      type="button"
      onClick={() => {
        const unitPrice = resolveCartUnitPrice(product.price);
        addItem({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: unitPrice,
          image: product.image,
          category: product.category,
        });
        toast.success("Dodano do koszyka", { description: product.name });
      }}
      className={cn(
        "inline-flex min-h-14 w-full max-w-md items-center justify-center gap-3 rounded-full bg-zinc-900 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-sm transition-[transform,colors,box-shadow] hover:bg-black hover:shadow-md active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900",
        className,
      )}
    >
      <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden />
      Dodaj do koszyka
    </button>
  );
}
