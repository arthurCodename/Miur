import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main className="min-h-[50vh] bg-white px-6 py-12 md:px-12 md:py-16" aria-busy="true" aria-label="Ładowanie produktu">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
        <Skeleton className="aspect-4/5 w-full rounded-sm" />

        <div className="flex flex-col gap-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full max-w-md md:h-12" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-3 w-full max-w-sm" />
          <Skeleton className="mt-4 h-14 w-full max-w-md rounded-full" />

          <div className="mt-8 space-y-3 border-t border-zinc-100 pt-10">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 max-w-lg" />
          </div>
        </div>
      </div>

      <section className="mx-auto mt-16 max-w-6xl border-t border-zinc-200 pt-14 md:mt-20 md:pt-16" aria-hidden>
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
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
        <Skeleton className="mt-10 h-11 w-44 rounded-full" />
      </section>
    </main>
  );
}
