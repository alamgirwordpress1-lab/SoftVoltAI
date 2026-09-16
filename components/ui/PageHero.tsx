import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { cn } from "@/lib/utils";

/**
 * Inner-page opener: breadcrumbs, mono eyebrow, one H1, one lede.
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
  dark = false,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={cn("relative overflow-hidden", dark ? "er" : "grid-bg border-b border-line")}>
      {/* wide-x, not container-x: the opener shares the full-bleed rail with the
          header and the homepage hero, so their left edges line up. */}
      {/* same vertical rhythm as the homepage hero's inner column (pt-10 md:pt-16),
          mirrored at the bottom so the opener sits evenly inside its band */}
      <div className="wide-x relative py-10 md:py-16">
        <Breadcrumbs crumbs={crumbs} dark={dark} />
        <span className="eyebrow mt-8 block">{eyebrow}</span>
        <h1 className="display display-xl mt-5 max-w-[16ch]">{title}</h1>
        {lede ? <p className="lede mt-6 max-w-[64ch]">{lede}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
