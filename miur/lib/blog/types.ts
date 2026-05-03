/**
 * View model for the homepage blog carousel.
 * Map fields from your CMS / API into this shape via `getBlogPosts`.
 */
export type BlogPost = {
  /** Stable id from CMS */
  id: string;
  /** URL segment: `/blog/[slug]` */
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  /** Already formatted, e.g. "5 min" */
  readTime: string;
  /** Already formatted PL date, e.g. "12 marca 2026" */
  publishedAt: string;
};
