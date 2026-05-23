import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <main className="min-h-[50vh] bg-white px-6 py-12 md:px-12 md:py-16" aria-busy="true" aria-label="Ładowanie blogu">
      <div className="mx-auto mb-10 max-w-6xl space-y-4 md:mb-14">
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="flex flex-col gap-4">
            <Skeleton className="aspect-4/5 w-full rounded-sm" />
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </li>
        ))}
      </ul>
    </main>
  );
}
