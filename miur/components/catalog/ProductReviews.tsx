import { CheckCircle2, Star } from "lucide-react";
import type { ProductReview } from "@/lib/catalog/types";
import { getProductReviews } from "@/lib/api/products";
import { cn } from "@/lib/utils";
import { ProductReviewForm } from "@/components/catalog/ProductReviewForm";

function RatingStars({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const rounded = Math.round(value);
  const starClass = size === "sm" ? "size-3.5" : "size-5";
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Ocena ${value} z 5 gwiazdek`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(starClass, n <= rounded ? "fill-amber-400 text-amber-400" : "text-zinc-200")}
          strokeWidth={1.25}
        />
      ))}
    </div>
  );
}

function averageRating(reviews: ProductReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}

export async function ProductReviews({ slug }: { slug: string }) {
  const reviews = await getProductReviews(slug);
  const avg = averageRating(reviews);
  const avgLabel = reviews.length > 0 ? `${avg.toFixed(1)}/5` : "—/5";

  return (
    <section
      className="mx-auto mt-16 max-w-6xl border-t border-zinc-200 px-0 pt-14 md:mt-20 md:pt-16"
      aria-labelledby="product-reviews-heading"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <h2
            id="product-reviews-heading"
            className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl"
          >
            Opinie klientów
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Wszystkie opinie pochodzą od klientów, którzy zakupili ten produkt.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 rounded-xl border border-zinc-100 bg-zinc-50/90 px-5 py-4 md:items-end">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            Średnia ocena
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold tabular-nums text-zinc-900">{avgLabel}</span>
            <RatingStars value={reviews.length ? avg : 0} />
          </div>
          <span className="text-xs text-zinc-500">{reviews.length} opinii</span>
        </div>
      </div>

      <ul className="mt-10 flex flex-col gap-6">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm md:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-zinc-900">{review.author}</span>
                {review.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200/80">
                    <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden />
                    Opinia zweryfikowana
                  </span>
                ) : null}
              </div>
              <time className="text-xs text-zinc-500 tabular-nums" dateTime={review.date}>
                {review.date}
              </time>
            </div>
            <div className="mt-3">
              <RatingStars value={review.rating} size="sm" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">{review.comment}</p>
          </li>
        ))}
      </ul>

      <ProductReviewForm productSlug={slug} />
    </section>
  );
}
