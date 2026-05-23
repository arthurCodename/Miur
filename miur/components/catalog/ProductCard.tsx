import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BestsellerProduct } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import { ProductCardCartButton } from "@/components/catalog/ProductCardCartButton";
import {
  pillMarkerTypography,
  productImageTagLight,
  productImageTagShell,
} from "@/lib/ui/pill-marker-classes";

type ProductCardProps = Omit<ComponentPropsWithoutRef<"article">, "children"> & {
  product: BestsellerProduct;
  /** Pass true for above-the-fold images in LCP-sensitive layouts */
  priority?: boolean;
};

/**
 * Product list tile.
 *
 * Pattern: two visible <Link>s (image + heading) point to the product page,
 * the "Add to cart" button is a sibling — never nested in a link.
 * This keeps the markup valid (no interactive-in-interactive) and lets
 * keyboard / screen reader users distinguish between "open product" and
 * "add product to cart".
 */
export function ProductCard({ product, className, priority = false, ...props }: ProductCardProps) {
  const productHref = `/produkt/${product.slug}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col md:hover:z-30 md:focus-within:z-30",
        className,
      )}
      {...props}
    >
      <div className="relative mb-6 aspect-3/4 overflow-hidden bg-zinc-50">
        {product.tag ? (
          <div className={cn(productImageTagShell, productImageTagLight)}>
            <span className={cn(pillMarkerTypography, "min-w-0 truncate")}>{product.tag}</span>
          </div>
        ) : null}

        <Link
          href={productHref}
          aria-label={`Zobacz produkt: ${product.name}`}
          className="absolute inset-0 z-0 block outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-zinc-900"
        >
          <Image
            src={product.image}
            alt={`${product.name} — zdjęcie produktu`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 group-hover:opacity-0"
          />
          <Image
            src={product.hoverImage}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        </Link>

        <ProductCardCartButton
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            category: product.category,
            price: product.price,
          }}
        />
      </div>

      <div className="relative flex flex-col gap-1">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-700">{product.category}</span>
        <h3 className="mb-1 text-sm font-bold tracking-tight text-zinc-900">
          <Link
            href={productHref}
            className="outline-none transition-colors hover:text-black focus-visible:underline focus-visible:underline-offset-2"
          >
            {product.name}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-black">{product.price}</span>
          {product.oldPrice ? (
            <del className="text-xs font-medium text-zinc-600 line-through">
              <span className="sr-only">Poprzednia cena: </span>
              {product.oldPrice}
            </del>
          ) : null}
        </div>
        {product.oldPrice ? (
          <span className="mt-1 text-[8px] uppercase tracking-tighter text-zinc-600">
            {product.omnibus
              ? `Najniższa cena z 30 dni przed obniżką: ${product.omnibus}`
              : "Najniższa cena z 30 dni przed obniżką: uzupełnij w systemie (wymóg Omnibus)."}
          </span>
        ) : null}
        {product.hygieneReturnExcluded !== false ? (
          <p
            className={cn(
              "mt-2 rounded-sm border border-amber-200/80 bg-amber-50/90 p-2 text-[8px] font-medium leading-snug text-amber-950",
              "transition-opacity duration-200",
              /* md+: out of document flow so hover does not shift sibling tiles */
              /* Below title/price — not upward over them (was bottom-0 on whole card) */
              "md:absolute md:left-0 md:right-0 md:top-full md:z-20 md:mt-1.5 md:shadow-md",
              "md:opacity-0 md:invisible md:pointer-events-none",
              "md:group-hover:visible md:group-hover:opacity-100 md:group-hover:pointer-events-auto",
              "md:group-focus-within:visible md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto",
            )}
          >
            Po otwarciu opakowania zwrot może być wykluczony ze względów higienicznych (art. 38 pkt 5 ustawy o
            prawach konsumenta). Szczegóły:{" "}
            <Link className="underline underline-offset-1" href="/zwroty-reklamacje">
              Zwroty i reklamacje
            </Link>
            .
          </p>
        ) : null}
      </div>
    </article>
  );
}
