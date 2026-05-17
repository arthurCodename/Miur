import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main className="min-h-[50vh] bg-white pt-24 md:pt-28" aria-busy="true" aria-label="Ładowanie produktu">
      <div className="mx-auto max-w-6xl border-b border-zinc-200 px-6 pb-12 md:px-12 md:pb-16 lg:pb-20">
        <Skeleton className="mb-8 h-4 w-full max-w-md md:mb-10" />

        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <Skeleton className="aspect-4/5 w-full rounded-sm" />

          <div className="flex flex-col gap-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full max-w-md md:h-12" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-3 w-full max-w-sm" />
            <Skeleton className="h-16 w-full max-w-lg" />
            <Skeleton className="mt-2 h-14 w-full max-w-md rounded-full" />
            <div className="mt-6 space-y-0">
              <Skeleton className="h-12 w-full border-b border-zinc-100" />
              <Skeleton className="h-12 w-full border-b border-zinc-100" />
              <Skeleton className="h-12 w-full border-b border-zinc-100" />
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto mt-0 max-w-6xl px-6 py-12 md:px-12 md:py-16" aria-hidden>
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
          <Skeleton className="h-24 w-full max-w-[200px] rounded-xl md:shrink-0" />
        </div>
        <div className="mt-10 flex flex-col gap-6">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
        <Skeleton className="mt-10 h-11 w-44 rounded-full" />
      </section>
    </main>
  );
}
