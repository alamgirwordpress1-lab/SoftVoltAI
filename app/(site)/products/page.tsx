import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { bannerProps } from "@/components/ui/copy-props";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProductIcon } from "@/components/products/ProductIcon";
import { productGroups } from "@/content/products";
import { productsCopy } from "@/content/copy/products";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(productsCopy);
}

const kindLabel = { plugin: "WordPress plugin", theme: "WordPress theme" } as const;

export default async function ProductsPage() {
  const [copy, products] = await Promise.all([getCopy(productsCopy), cms.getProducts()]);

  return (
    <>
      <PageHero crumbs={[{ name: "Our Products", href: "/products" }]} {...bannerProps(copy.banner)} />

      <section id="products" className="container-x py-14 md:py-20" aria-labelledby="products-title">
        <span className="eyebrow">{copy.list.eyebrow}</span>
        <h2 id="products-title" className="display display-md mt-4">
          {copy.list.heading}
        </h2>

        {productGroups.map((group) => {
          const list = products.filter((p) => p.kind === group.kind);
          return (
            <div key={group.kind} className="mt-12">
              <h3 className="ui text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{group.title}</h3>
              <ul className="mt-5 grid gap-4">
                {list.length ? (
                  list.map((p) => (
                    <li key={p.slug} className="card shadow-soft grid gap-6 p-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8 md:p-8" data-reveal>
                      <ProductIcon icon={p.icon} size={72} />
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h4 className="ui text-[22px] font-bold leading-tight tracking-[-0.01em] text-ink">
                            <Link href={`/products/${p.slug}`} className="hover:underline">
                              {p.name}
                            </Link>
                          </h4>
                          {p.badge ? <span className="mono rounded-full bg-ok-bg px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-ok-fg">{p.badge}</span> : null}
                          <span className="mono rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-muted">{kindLabel[p.kind]}</span>
                        </div>
                        <p className="mt-3 max-w-[78ch] text-[15px] leading-relaxed text-muted md:text-base">{p.summary}</p>
                        <p className="mono mt-4 text-[11px] uppercase tracking-[0.08em] text-ink">
                          {p.price} <span className="text-muted">· {p.availability}</span>
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Button href={`/products/${p.slug}`}>Read more</Button>
                          <Button href={`/products/${p.slug}#compare`} variant="secondary">
                            Free and Pro
                          </Button>
                          <Button href="/contact" variant="ghost">
                            Get early access
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-5 rounded-[var(--radius-lg)] border border-dashed border-line-strong p-6 md:p-8">
                    <ProductIcon icon="placeholder" size={56} />
                    <div>
                      <p className="ui text-[17px] font-bold text-ink">Coming soon</p>
                      <p className="mt-1 text-[15px] text-muted">{group.empty}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </section>

      <section id="how-we-build" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="build-title">
        <span className="eyebrow">{copy.promises.eyebrow}</span>
        <h2 id="build-title" className="display display-md mt-4">
          {copy.promises.heading}
        </h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.promises.list.map((p, i) => (
            <li key={p.title} className="card shadow-soft p-6" data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand copy={copy.cta} />
    </>
  );
}
