"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const reviewFormSchema = z.object({
  author: z.string().min(2, "Podaj imię lub pseudonim (min. 2 znaki)"),
  rating: z
    .number({ error: "Wybierz ocenę" })
    .refine((n) => n >= 1 && n <= 5, "Wybierz ocenę od 1 do 5 gwiazdek"),
  comment: z.string().min(10, "Opinia musi mieć co najmniej 10 znaków"),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

type ProductReviewFormProps = {
  productSlug: string;
};

export function ProductReviewForm({ productSlug: _productSlug }: ProductReviewFormProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      author: "",
      rating: 0,
      comment: "",
    },
  });

  function onSubmit(_data: ReviewFormValues) {
    toast.success("Dziękujemy! Twoja opinia została wysłana do moderacji.");
    reset({ author: "", rating: 0, comment: "" });
    setOpen(false);
  }

  return (
    <div className="mt-10 border-t border-zinc-100 pt-10">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-900 bg-white px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Dodaj opinię
        </button>
      ) : (
        <form className="max-w-xl space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-900">Twoja opinia</h3>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="review-author" className="text-xs font-semibold text-zinc-700">
              Imię lub pseudonim
            </label>
            <input
              id="review-author"
              type="text"
              autoComplete="name"
              className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10"
              aria-invalid={errors.author ? true : undefined}
              {...register("author")}
            />
            {errors.author ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.author.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-zinc-700">Ocena</span>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="rounded-md p-1 transition-colors hover:bg-zinc-100"
                      onClick={() => field.onChange(n)}
                      aria-label={`Ocena ${n} z 5`}
                    >
                      <Star
                        className={cn(
                          "size-8",
                          n <= field.value ? "fill-amber-400 text-amber-400" : "text-zinc-300",
                        )}
                        strokeWidth={1.25}
                      />
                    </button>
                  ))}
                  <span className="sr-only" aria-live="polite">
                    {field.value ? `Wybrano ${field.value} z 5 gwiazdek` : "Nie wybrano oceny"}
                  </span>
                </div>
              )}
            />
            {errors.rating ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.rating.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="review-comment" className="text-xs font-semibold text-zinc-700">
              Treść opinii
            </label>
            <textarea
              id="review-comment"
              rows={4}
              className="resize-y rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10"
              aria-invalid={errors.comment ? true : undefined}
              {...register("comment")}
            />
            {errors.comment ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.comment.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-900 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:bg-black disabled:opacity-60"
            >
              Wyślij opinię
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Anuluj
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
