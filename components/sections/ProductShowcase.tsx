import Link from "@/components/ui/Link";
import type { Product } from "@/lib/cms/types";
import { ProductIcon } from "@/components/products/ProductIcon";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ProductShowcaseCopy {
  eyebrow: string;
  heading: string;
  lede: string;
  points: string[];
  button: { text: string; url: string };
}

/** A product is "on WordPress.org" when its availability says so: the words are the proof. */
const onWpOrg = (p: Product) => /wordpress\.org/i.test(p.availability);

/**
 * The home page's products band (light, like the rest of the page below the hero): the plugins we build and maintain
 * ourselves. Most white-label shops only sell hours; this is the part of the
 * page that shows code with our name on it. Listed products come from
 * WordPress (Products), so a new plugin appears here the day it is published,
 * and the ones already on WordPress.org lead.
 */
export function ProductShowcase({ products, copy }: { products: Product[]; copy: ProductShowcaseCopy }) {
  if (!products.length) return null;
  const ordered = [...products].sort((a, b) => Number(onWpOrg(b)) - Number(onWpOrg(a)));
  const live = products.filter(onWpOrg).length;

  return (
    <section id="products" className="section relative overflow-hidden" aria-labelledby="products-home-title">
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7" data-reveal>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 id="products-home-title" className="display display-lg mt-4 max-w-[18ch]">
              {copy.heading}
            </h2>
            <p className="lede mt-5 max-w-[60ch]">{copy.lede}</p>
          </div>
          <div className="lg:col-span-5 lg:self-end" data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
            {/* counted from the product list, so the figures can never run ahead of the truth */}
            <dl className="grid grid-cols-2 gap-4">
              <div className="card shadow-soft p-5">
                <dt className="mono text-[11px] uppercase tracking-[0.12em] text-muted">Plugins we build</dt>
                <dd className="display mt-2 text-[44px] leading-none text-ink">{products.length}</dd>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-accent/25 bg-accent-soft p-5">
                <dt className="mono text-[11px] uppercase tracking-[0.12em] text-accent">On WordPress.org</dt>
                <dd className="display mt-2 text-[44px] leading-none text-accent">{live}</dd>
              </div>
            </dl>
            {copy.points.length ? (
              <ul className="mt-6 space-y-2.5">
                {copy.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-[15px] leading-snug text-muted">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {pt}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((p, i) => (
            <li key={p.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <Link
                href={`/products/${p.slug}`}
                prefetch={false}
                className={cn(
                  "card card-lift shadow-soft group/p flex h-full flex-col p-6 transition-colors duration-200 hover:border-accent",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <ProductIcon product={p} size={56} />
                  <span
                    className={cn(
                      "mono rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.08em]",
                      onWpOrg(p) ? "bg-accent-soft text-ok-fg" : "border border-line text-muted",
                    )}
                  >
                    {onWpOrg(p) ? "On WordPress.org" : p.badge || "Coming soon"}
                  </span>
                </div>
                <h3 className="ui mt-5 text-[20px] font-bold leading-tight text-ink">{p.name}</h3>
                {p.kind ? <p className="mono mt-1.5 text-[11px] uppercase tracking-[0.1em] text-muted">{p.kind}</p> : null}
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{p.tagline || p.summary}</p>
                <p className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-[13px]">
                  <span className="font-semibold text-ink">{p.price}</span>
                  <span className="text-accent transition-transform duration-200 group-hover/p:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {copy.button.text ? (
          <div className="mt-10" data-reveal>
            <Button href={copy.button.url} variant="primary">
              {copy.button.text}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
