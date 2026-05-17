import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailSection } from "@/components/catalog/ProductDetailSection";
import { ProductReviews } from "@/components/catalog/ProductReviews";
import { getProductBySlug } from "@/lib/api/products";
import { findMockProductBySlug } from "@/lib/catalog/find-mock-product";
import { productBreadcrumbTrail } from "@/lib/navigation/product-breadcrumb-trail";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findMockProductBySlug(slug);
  if (!product) {
    return { title: "Produkt — Miur" };
  }
  return {
    title: `${product.name} — Miur`,
    description: `${product.category}: ${product.name}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-[50vh] bg-white">
      <ProductDetailSection product={product} breadcrumbTrail={productBreadcrumbTrail(product)} />

      <div className="px-6 py-12 md:px-12 md:py-16">
        <ProductReviews slug={slug} />
      </div>
    </main>
  );
}
