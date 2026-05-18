import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog/posts";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Wpis — Miur" };
  }
  return {
    title: `${post.title} — Miur`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.cover],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-white px-6 py-12 md:px-12 md:py-16">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          Wróć do bloga
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-zinc-900 px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-white">
            {post.category}
          </span>
          {post.sponsored ? (
            <span className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-zinc-900">
              Materiał sponsorowany
            </span>
          ) : null}
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            {post.publishedAt} · {post.readTime}
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tighter text-zinc-900 md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          {post.title}
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-700 md:text-lg">{post.excerpt}</p>

        <div className="relative mt-10 aspect-3/2 w-full overflow-hidden rounded-sm bg-zinc-100">
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 768px"
            priority
            className="object-cover"
          />
        </div>

        <div className="mt-12 space-y-6 text-base leading-[1.7] text-zinc-700">
          <p>
            Pełna treść artykułu pojawi się tutaj wkrótce. Pracujemy nad publikacjami przygotowanymi przez
            ekspertów z obszaru wellness, edukacji seksualnej i bezpieczeństwa zakupów.
          </p>
          <p>
            Jeśli interesuje Cię ten temat — zapisz się do newslettera w stopce strony, abyśmy poinformowali
            Cię, gdy wpis się ukaże.
          </p>
        </div>
      </article>
    </main>
  );
}
