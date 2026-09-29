import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { ChatDemo } from "@/components/products/ChatDemo";
import { DemoButton } from "@/components/products/DemoButton";
import { PlanCard } from "@/components/products/PlanCard";
import { ProductIcon } from "@/components/products/ProductIcon";
import { ProductTabs } from "@/components/products/ProductTabs";
import { site } from "@/content/site";
import { cms, type ProductPage } from "@/lib/cms";
import { shareMetadata } from "@/lib/seo/share";

export async function generateStaticParams() {
  const products = await cms.getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await cms.getProduct(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.seo,
    alternates: { canonical: `/products/${slug}` },
    ...shareMetadata({ title: `${product.title} · SoftVolt AI`, description: product.seo, path: `/products/${slug}` }),
  };
}

/** The same test the layout uses: without a DeepSeek key there is no agent in the corner to try. */
const agentLive = Boolean(process.env.DEEPSEEK_API_KEY);

/** Products with a visual drawn for them in code, shown beside "Why choose it". */
const DEMOS: Record<string, { visual: React.ReactNode; caption: string }> = {
  "softvolt-ai-voice-agent": {
    visual: <ChatDemo />,
    caption: agentLive ? "An example conversation. The agent in the corner of this page is live — try it." : "An example conversation.",
  },
};

function Yes() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="mx-auto text-accent" role="img" aria-label="Included">
      <path d="m4 9.5 3.2 3.2L14 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function No() {
  return (
    <span className="mx-auto block w-3 border-t-2 border-line-strong" role="img" aria-label="Not included">
      <span className="sr-only">Not included</span>
    </span>
  );
}

function Features({ product }: { product: ProductPage }) {
  return (
    <section className="container-x py-14 md:py-20" aria-labelledby="features-title">
      <span className="eyebrow">Features</span>
      <h2 id="features-title" className="display display-md mt-4 max-w-[26ch]">
        {product.headings.features || "What it does."}
      </h2>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {product.features.map((f, i) => (
          <li key={f.title} className="card shadow-soft p-6">
            <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">{f.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{f.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Compare({ product }: { product: ProductPage }) {
  const [free, pro] = product.plans;
  return (
    <section className="container-x py-14 md:py-20" aria-labelledby="compare-title">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-7">
          <span className="eyebrow">Free and Pro</span>
          <h2 id="compare-title" className="display display-md mt-4 max-w-[22ch]">
            {product.headings.compare || "Side by side."}
          </h2>
        </div>
        {product.pro.text ? <p className="lede max-w-[46ch] lg:col-span-5 lg:pb-1.5">{product.pro.text}</p> : null}
      </div>

      <div className="card shadow-float mt-10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <caption className="sr-only">What the free plugin and the planned Pro add-on include</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="ui px-6 py-5 text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
                  Feature
                </th>
                <th scope="col" className="ui w-[22%] px-6 py-5 text-center text-[15px] font-bold text-ink">
                  {free?.name ?? "Free"}
                  <span className="mono mt-1 block text-[11px] font-normal uppercase tracking-[0.08em] text-muted">{free?.price}</span>
                </th>
                <th scope="col" className="ui w-[22%] bg-accent-soft/50 px-6 py-5 text-center text-[15px] font-bold text-ink">
                  {pro?.name ?? "Pro"}
                  <span className="mono mt-1 block text-[11px] font-normal uppercase tracking-[0.08em] text-accent">{pro?.price}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {product.compare.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-6 py-4 text-[14px] font-normal leading-snug text-ink">
                    {row.label}
                  </th>
                  <td className="px-6 py-4 text-center">{row.free ? <Yes /> : <No />}</td>
                  <td className="bg-accent-soft/50 px-6 py-4 text-center">{row.pro ? <Yes /> : <No />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {product.pro.features.length ? (
        <>
          <h3 className="ui mt-14 text-[20px] font-bold tracking-[-0.01em] text-ink">{product.pro.heading || "What is planned"}</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.pro.features.map((f) => (
              <li key={f.title} className="card p-6">
                <span className="mono rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-muted">Planned</span>
                <p className="ui mt-4 text-[16px] font-bold leading-snug text-ink">{f.title}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{f.text}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {pro ? (
        <div className="mt-8">
          <Button href={pro.action.href} variant="secondary">
            {pro.action.label}
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function Info({ product }: { product: ProductPage }) {
  return (
    <section className="container-x py-14 md:py-20" aria-labelledby="info-title">
      <span className="eyebrow">Info</span>
      <h2 id="info-title" className="display display-md mt-4">
        {product.headings.info || "The technical facts."}
      </h2>
      <dl className="card shadow-soft mt-10 divide-y divide-line">
        {product.info.map((row) => (
          <div key={row.label} className="grid gap-1 px-6 py-4 md:grid-cols-[240px_1fr] md:gap-8">
            <dt className="ui text-[14px] font-bold text-ink">{row.label}</dt>
            <dd className="text-[15px] leading-relaxed text-muted">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Questions({ product }: { product: ProductPage }) {
  return (
    <section className="container-x py-14 md:py-20" aria-labelledby="faq-title">
      <span className="eyebrow">FAQ</span>
      <h2 id="faq-title" className="display display-md mt-4">
        {product.headings.faq || "Questions people ask first."}
      </h2>
      <ul className="mt-10 grid gap-3">
        {product.faqs.map((f, i) => (
          <li key={f.q}>
            <details className="faq card group overflow-hidden transition-colors duration-200 open:border-line-strong hover:border-line-strong">
              <summary className="flex cursor-pointer items-start gap-4 p-6">
                <span className="mono mt-1 text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="ui flex-1 text-[17px] font-bold leading-snug text-ink">{f.q}</span>
                <span className="faq-icon mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-accent transition-colors group-open:border-accent" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 18 18">
                    <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="faq-body px-6 pb-6 pl-[4.25rem]">
                <p className="max-w-[68ch] text-[15px] leading-relaxed text-muted md:text-base">{f.a}</p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Why({ product, demo }: { product: ProductPage; demo?: { visual: React.ReactNode; caption: string } }) {
  return (
    <section id="why" className="container-x grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-10" aria-labelledby="why-title">
      <div className={demo ? "lg:col-span-6" : "lg:col-span-8"} data-reveal>
        <span className="eyebrow">Why this {product.kind.split(" ").pop()?.toLowerCase() || "product"}</span>
        <h2 id="why-title" className="display display-md mt-4 max-w-[20ch]">
          {product.why.heading}
        </h2>
        {product.why.paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-muted">
            {p}
          </p>
        ))}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {product.why.points.map((pt) => (
            <li key={pt.title} className="border-t border-line pt-4">
              <p className="ui text-[15px] font-bold text-ink">{pt.title}</p>
              <p className="mt-1 text-[14px] leading-snug text-muted">{pt.text}</p>
            </li>
          ))}
        </ul>
      </div>
      {demo ? (
        <div id="demo" className="scroll-mt-28 lg:col-span-5 lg:col-start-8" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
          {demo.visual}
          <p className="mt-4 text-center text-[13px] text-muted">{demo.caption}</p>
        </div>
      ) : null}
    </section>
  );
}

function Steps({ product }: { product: ProductPage }) {
  return (
    <section id="how-it-works" className="er relative scroll-mt-20 overflow-hidden" aria-labelledby="how-title">
      <div className="glow -right-24 -top-24 h-[420px] w-[420px]" aria-hidden="true" />
      <div className="container-x relative py-14 md:py-20">
        <span className="eyebrow">How it works</span>
        <h2 id="how-title" className="display display-md mt-4 max-w-[24ch]">
          {product.headings.steps || "How it works."}
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-6">
          {product.steps.map((step, i) => (
            <li key={step.title} className="border-t border-er-line pt-5" data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <span className="mono text-[12px] text-volt">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="ui mt-3 text-[17px] font-bold leading-snug text-er-ink">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-er-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Help({ product }: { product: ProductPage }) {
  return (
    <section id="help" className="container-x py-14 md:py-20" aria-labelledby="help-title">
      <span className="eyebrow">How we help you</span>
      <h2 id="help-title" className="display display-md mt-4 max-w-[26ch]">
        {product.headings.help || "You are not on your own with it."}
      </h2>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {product.help.map((h, i) => (
          <li key={h.title} className="card shadow-soft flex flex-col p-6" data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
            <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">{h.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{h.text}</p>
            {h.action ? (
              <Link href={h.action.href} className="ui mt-auto inline-flex items-center gap-2 pt-5 text-[14px] font-semibold text-accent hover:underline">
                {h.action.label} <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProductPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await cms.getProduct(slug);
  if (!product) notFound();
  const url = `${site.url}/products/${slug}`;
  const free = /^(\$?0([.,]0+)?|free)$/i.test(product.plans[0]?.price.trim() ?? "");
  const demo = DEMOS[slug];
  const tabs = [
    product.features.length ? { id: "features", label: "Features", count: product.features.length, content: <Features product={product} /> } : null,
    product.compare.length ? { id: "compare", label: "Compare", content: <Compare product={product} /> } : null,
    product.info.length ? { id: "info", label: "Info", content: <Info product={product} /> } : null,
    product.faqs.length ? { id: "faq", label: "FAQ", count: product.faqs.length, content: <Questions product={product} /> } : null,
  ].filter((t) => t !== null);
  const actions = product.actions.filter((a) => a.kind !== "demo" || agentLive);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: product.name,
          description: product.seo,
          applicationCategory: "BusinessApplication",
          operatingSystem: "WordPress",
          softwareVersion: product.info.find((i) => i.label === "Version")?.value,
          ...(free ? { offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } } : {}),
          publisher: { "@id": `${site.url}/#organization` },
          url,
        }}
      />

      <PageHero
        crumbs={[
          { name: "Our Products", href: "/products" },
          { name: product.name, href: `/products/${slug}` },
        ]}
        eyebrow={[product.kind, product.price].filter(Boolean).join(" · ")}
        title={product.title}
        lede={product.intro}
        aside={product.plans.length ? <PlanCard product={product} plans={product.plans} /> : undefined}
      >
        <div className="flex flex-wrap items-center gap-3">
          {actions.map((a) =>
            a.kind === "demo" ? (
              <DemoButton key={a.label} label={a.label} />
            ) : (
              <Button key={a.label} href={a.href} variant={a.kind === "primary" ? "primary" : "secondary"}>
                {a.label}
              </Button>
            ),
          )}
        </div>
        {product.availability ? <p className="mono mt-5 text-[11px] uppercase tracking-[0.08em] text-muted">{product.availability}</p> : null}
      </PageHero>

      {product.why.heading || product.why.paragraphs.length ? <Why product={product} demo={demo} /> : null}
      {product.steps.length ? <Steps product={product} /> : null}
      {product.help.length ? <Help product={product} /> : null}

      {tabs.length ? (
        <div id="details" className="border-t border-line">
          <ProductTabs label={`About ${product.name}`} tabs={tabs} />
        </div>
      ) : null}

      {product.others.length ? (
        <section className="container-x border-t border-line py-14 md:py-20" aria-labelledby="more-title">
          <span className="eyebrow">More from SoftVolt AI</span>
          <h2 id="more-title" className="display display-md mt-4">
            Our other products.
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {product.others.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} className="card card-lift flex gap-4 p-6">
                  <ProductIcon product={p} size={44} />
                  <span>
                    <span className="ui block text-[16px] font-bold text-ink">{p.name}</span>
                    <span className="mt-1 block text-[14px] leading-snug text-muted">{p.tagline}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CtaBand
        copy={
          product.cta.heading
            ? product.cta
            : { pill: "Custom work", heading: "Need something built for your business?", accent: "We do that too.", lede: "Send the brief and get a written scope." }
        }
      />
    </>
  );
}
