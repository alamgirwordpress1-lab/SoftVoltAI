import { DesignCard } from "@/components/sections/PortfolioGrid";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { portfolioDesigns, type PortfolioDesign } from "@/content/portfolios";

/**
 * Designs a visitor can open live from a service page and ask us to build:
 * the service and something to buy side by side. The full gallery is on /portfolios.
 */
export function ServicePortfolio({
  designs,
  service,
}: {
  designs: PortfolioDesign[];
  service: string;
}) {
  if (!designs.length) return null;
  return (
    <section
      id="designs"
      className="section section-alt"
      aria-labelledby="designs-title"
    >
      <div className="container-x">
        <div
          className="flex flex-wrap items-end justify-between gap-6"
          data-reveal
        >
          <div className="max-w-[720px]">
            <span className="eyebrow">Designs you can start from</span>
            <h2 id="designs-title" className="display display-md mt-4">
              Like one? We build it for you.
            </h2>
            <p className="lede mt-4">
              Open any design live and try it on desktop, tablet and phone. Pick
              the one you like, and we build it as your website, with your name,
              words and brand, alongside the {service} work on this page.
            </p>
          </div>
          <ArrowLink href="/portfolios">
            See all {portfolioDesigns.length} designs
          </ArrowLink>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {designs.map((d, i) => (
            <li
              key={d.slug}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}
            >
              <DesignCard design={d} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
