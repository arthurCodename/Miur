import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <main className="min-h-[50vh] bg-white px-6 py-12 md:px-12 md:py-16" aria-busy="true" aria-label="Wyszukiwanie">
      <div className="mx-auto mb-10 max-w-7xl space-y-3 md:mb-14">
        <Skeleton className="h-9 w-56 max-w-full md:h-10" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16 lg:grid-cols-4 lg:gap-y-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="aspect-3/4 w-full rounded-sm" />
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </main>
  );
}
