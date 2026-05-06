"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { resolveCartUnitPrice } from "@/lib/cart/parse-pl-price";
import { useCartStore } from "@/lib/store/useCartStore";
import type { AddToCartProduct } from "@/components/ui/AddToCartButton";

type ProductCardCartButtonProps = {
  product: AddToCartProduct;
};

/**
 * "Do koszyka" button rendered inside a ProductCard.
 *
 * Visually identical to the original decorative button (slides up on hover,
 * fades in on focus) but actually adds the product to the global cart.
 *
 * Lives in a separate file so the parent ProductCard can stay a Server
 * Component — only this small button is shipped to the browser as JS.
 */
export function ProductCardCartButton({ product }: ProductCardCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleClick = () => {
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
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute right-4 bottom-4 left-4 z-10 translate-y-12 rounded-full bg-black py-3 min-h-11 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 focus:translate-y-0 focus:opacity-100 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label={`Dodaj ${product.name} do koszyka`}
    >
      <span className="flex items-center justify-center gap-2">
        <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="text-[9px] font-bold uppercase tracking-widest">Do koszyka</span>
      </span>
    </button>
  );
}
