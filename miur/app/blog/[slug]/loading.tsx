import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <main className="min-h-[50vh] bg-white" aria-busy="true" aria-label="Ładowanie wpisu">
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-12 md:py-16">
        <Skeleton className="h-4 w-28" />
        <div className="mt-8 flex gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="mt-5 h-5 w-full max-w-2xl" />
        <Skeleton className="mt-2 h-5 w-3/4 max-w-2xl" />
        <Skeleton className="relative mt-10 aspect-3/2 w-full rounded-sm" />
        <div className="mt-12 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </main>
  );
}
