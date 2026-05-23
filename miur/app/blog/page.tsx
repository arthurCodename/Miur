import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageGradientHero } from "@/components/layout/PageGradientHero";
import { getBlogPosts } from "@/lib/blog/posts";
import { cn } from "@/lib/utils";
import { blogCardPillBase, pillMarkerTypography } from "@/lib/ui/pill-marker-classes";

export const metadata: Metadata = {
  title: "Blog — Miur",
  description: "Edukacja, wellness i intymność. Artykuły o świadomej trosce o ciało.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-[50vh] bg-white">
      <PageGradientHero title="Blog" eyebrow="Journal" />
      <div className="px-6 py-12 md:px-12 md:py-16">
      <header className="mx-auto mb-10 max-w-6xl md:mb-14">
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-700 md:text-base">
          Edukacja i inspiracje od ekspertów. Tematy o wellness intymności, bezpieczeństwie i pielęgnacji.
        </p>
      </header>

      <ul
        className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Lista wpisów na blogu"
      >
        {posts.map((post, index) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-4 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 rounded-sm"
            >
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm bg-zinc-100">
                <Image
                  src={post.cover}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 2}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span
                    className={cn(
                      blogCardPillBase,
                      pillMarkerTypography,
                      "bg-white text-black shadow-sm",
                    )}
                  >
                    {post.category}
                  </span>
                  {post.sponsored ? (
                    <span
                      className={cn(
                        blogCardPillBase,
                        pillMarkerTypography,
                        "border border-white/40 bg-black/55 text-white",
                      )}
                    >
                      Materiał sponsorowany
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  {post.publishedAt} · {post.readTime}
                </span>
                <h2 className="text-base font-bold tracking-tight text-zinc-900 leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed text-zinc-600">{post.excerpt}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </main>
  );
}
