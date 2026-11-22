import Link from "@/components/ui/Link";
import { ProductIcon } from "@/components/products/ProductIcon";
import type { Product } from "@/lib/cms/types";

/**
 * Our own products that fit the page the reader is on: a blog post about
 * launches points to FlyLive, a security service to AI GuardWall. The product
 * name is the link text, which is what helps each name rank.
 */
export function ProductLinks({
  products,
  slugs,
  variant = "section",
}: {
  products: Product[];
  slugs: string[] | undefined;
  /** "section": a full-width band on a service page. "inline": a box inside a blog post. */
  variant?: "section" | "inline";
}) {
  const picks = (slugs ?? [])
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));
  if (!picks.length) return null;

  const list = (
    <ul
      className={
        variant === "section"
          ? "mt-8 grid gap-4 md:grid-cols-2"
          : "mt-5 grid gap-3"
      }
    >
      {picks.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/products/${p.slug}`}
            className="card card-lift flex h-full gap-4 p-5 md:p-6"
          >
            <ProductIcon product={p} size={44} />
            <span className="min-w-0">
              <span className="mono block text-[11px] uppercase tracking-[0.1em] text-muted">
                {p.kind}
              </span>
              <span className="ui mt-1 block text-[17px] font-bold text-ink">
                {p.name}
              </span>
              <span className="mt-1.5 block text-[14px] leading-relaxed text-muted">
                {p.summary || p.tagline}
              </span>
              <span className="ui mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent">
                See {p.name} <span aria-hidden="true">→</span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  if (variant === "inline") {
    return (
      <aside
        className="mt-12 rounded-lg border border-line bg-raised p-5 md:p-6"
        aria-labelledby="tools-title"
      >
        <span className="eyebrow">From SoftVolt AI</span>
        <h2
          id="tools-title"
          className="mt-3 text-[20px] font-semibold text-ink"
        >
          {picks.length > 1
            ? "Tools we built for this"
            : "A tool we built for this"}
        </h2>
        {list}
      </aside>
    );
  }

  return (
    <section
      id="tools"
      className="container-x border-t border-line py-14 md:py-20"
      aria-labelledby="tools-title"
    >
      <span className="eyebrow">Our own products</span>
      <h2 id="tools-title" className="display display-md mt-4">
        {picks.length > 1
          ? "Tools we built for this work."
          : "A tool we built for this work."}
      </h2>
      {list}
    </section>
  );
}
