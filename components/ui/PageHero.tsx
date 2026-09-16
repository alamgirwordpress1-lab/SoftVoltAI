import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { PageHeroVisual, type PageHighlight } from "@/components/ui/PageHeroVisual";
import { cn } from "@/lib/utils";

/**
 * Inner-page opener: breadcrumbs, mono eyebrow, one H1, one lede — and, from xl
 * up, the orbit visual carrying up to three of the page's key facts.
 *
 * Sits on the full-bleed `wide-x` rail so its left edge lines up with the header
 * and the homepage hero. The bottom hairline belongs here rather than to the
 * section that follows: some pages open with a bordered section and some do not,
 * so owning the edge is the only way every page reads as a distinct banner.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lede,
  children,
  highlights,
  dark = false,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  /** Facts shown on the banner's floating cards; each must come from the page's own content. */
  highlights?: PageHighlight[];
  dark?: boolean;
}) {
  const visual = Boolean(highlights?.length);
  return (
    <section className={cn("relative overflow-hidden", dark ? "er" : "grid-bg border-b border-line")}>
      {/* wide-x, not container-x: the opener shares the full-bleed rail with the
          header and the homepage hero, so their left edges line up. The top matches
          the homepage hero's inner column; the bottom leaves a wider gap before the
          hairline so the banner ends as a band of its own. */}
      <div className={cn("wide-x relative pb-16 pt-10 md:pb-24 md:pt-16", visual && "xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] xl:items-center xl:gap-16")}>
        <div>
          <Breadcrumbs crumbs={crumbs} dark={dark} />
          <span className="eyebrow mt-8 block">{eyebrow}</span>
          <h1 className="display display-xl mt-5 max-w-[16ch]">{title}</h1>
          {lede ? <p className="lede mt-6 max-w-[64ch]">{lede}</p> : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
        {visual && highlights ? (
          <div className="hidden xl:block">
            <PageHeroVisual highlights={highlights} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
