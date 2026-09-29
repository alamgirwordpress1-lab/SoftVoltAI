import { cms } from "@/lib/cms";
import { shareCard } from "@/lib/og/card";

export const alt = "A SoftVolt AI product for WordPress";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// an image route does not inherit the page's params, so it lists them itself and every card is drawn at build
export async function generateStaticParams() {
  const products = await cms.getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

/** A product's card: what kind of product it is, its page headline and the description it gives search results. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await cms.getProduct(slug);
  if (!product) return shareCard({ eyebrow: "Our products", title: "WordPress plugins and themes by SoftVolt AI" });
  return shareCard({ eyebrow: `${product.kind === "theme" ? "WordPress theme" : "WordPress plugin"} · ${product.price}`, title: product.title, subtitle: product.seo });
}
