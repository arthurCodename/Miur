// Miur/miur/components/layout/Blog.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog/types";

type BlogProps = {
  posts: BlogPost[];
};

const seeAllLinkClass =
  "inline-flex flex-col items-stretch gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-900 hover:opacity-50 focus-visible:opacity-50 transition-opacity duration-500 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 rounded-sm";

const carouselArrowBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 transition-all duration-500 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white";

export function Blog({ posts }: BlogProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-carousel-card]")?.clientWidth ?? 320;
    const gap = 24;
    el.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      className="relative w-full bg-white px-6 md:px-12 py-24 md:py-32 border-t border-zinc-100"
      aria-labelledby="blog-heading"
    >
      <div className="relative z-10">
        <div className="mb-10 md:mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4">
              Journal
            </span>
            <h2
              id="blog-heading"
              className="text-3xl md:text-4xl font-bold tracking-tighter text-zinc-900 uppercase"
            >
              Blog
            </h2>
          </div>
          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollBy("left")}
                aria-label="Poprzedni wpis na blogu"
                className={carouselArrowBtnClass}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy("right")}
                aria-label="Następny wpis na blogu"
                className={carouselArrowBtnClass}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <Link href="/blog" className={seeAllLinkClass}>
              Zobacz wszystko
              <span className="h-px w-full shrink-0 bg-zinc-900" aria-hidden />
            </Link>
          </div>
        </div>

        <div
          id="blog-carousel"
          ref={scrollerRef}
          role="region"
          aria-label="Najnowsze wpisy z bloga, przewijana lista. Do przewijania użyj strzałek lub gestów na urządzeniu dotykowym."
          className="flex gap-5 md:gap-8 overflow-x-auto overscroll-x-contain snap-x snap-mandatory snap-always scroll-smooth touch-pan-x pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {posts.map((post, index) => (
            <article
              key={post.id}
              data-carousel-card
              className="group relative flex shrink-0 snap-start snap-always w-[min(82vw,360px)] md:w-[min(360px,42vw)] lg:w-[min(380px,32vw)]"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="relative flex w-full overflow-hidden rounded-sm bg-zinc-100 aspect-3/4 md:aspect-4/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-900"
                aria-labelledby={`blog-title-${post.id}`}
                aria-describedby={
                  post.sponsored
                    ? `blog-meta-${post.id} blog-sponsored-${post.id}`
                    : `blog-meta-${post.id}`
                }
              >
                <Image
                  src={post.cover}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 2}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-90" />

                <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-black shadow-sm">
                    {post.category}
                  </span>
                  {post.sponsored ? (
                    <span
                      id={`blog-sponsored-${post.id}`}
                      className="rounded-full border border-white/40 bg-black/55 px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-white backdrop-blur-sm"
                    >
                      Materiał sponsorowany
                    </span>
                  ) : null}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex justify-between items-end gap-4">
                  <div className="flex flex-col min-w-0">
                    <span
                      id={`blog-meta-${post.id}`}
                      className="text-white/70 text-[9px] uppercase tracking-widest mb-2 font-medium"
                    >
                      {post.publishedAt} · {post.readTime}
                    </span>
                    <h3
                      id={`blog-title-${post.id}`}
                      className="text-white text-lg md:text-xl font-bold leading-tight line-clamp-3"
                    >
                      {post.title}
                    </h3>
                    <p className="mt-2 hidden md:block text-white/75 text-xs leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <ArrowUpRight className="w-5 h-5" strokeWidth={1.5} aria-hidden />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] text-zinc-500 uppercase tracking-[0.25em] sm:hidden">
          Przesuń palcem, aby zobaczyć więcej
        </p>
      </div>
    </section>
  );
}