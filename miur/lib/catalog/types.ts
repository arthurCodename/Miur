export type BestsellerProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: string;
  oldPrice: string | null;
  omnibus: string | null;
  hygieneReturnExcluded?: boolean;
  image: string;
  hoverImage: string;
  tag: string | null;
};

export type Category = {
  title: string;
  href: string;
  image: string;
  desc: string;
};

export type SaleCategoryTile = {
  title: string;
  href: string;
  image: string;
  desc: string;
};

export type ProductReview = {
  id: string;
  author: string;
  /** 1–5 */
  rating: number;
  comment: string;
  /** Wyświetlana data (demo — string). */
  date: string;
  isVerified: boolean;
};
