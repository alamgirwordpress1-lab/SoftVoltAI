import { cn } from "@/lib/utils";

/**
 * Every section opens the same way. "split" (default): eyebrow and H2 on the
 * left, the short explanation and an optional action on the right, aligned to
 * the top of the heading so the two columns start on the same line. "stack": everything in one column, for headings that
 * live inside a narrow side column.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  aside,
  layout = "split",
  className,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  aside?: React.ReactNode;
  layout?: "split" | "stack";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  if (layout === "stack") {
    return (
      <div className={cn("max-w-3xl", className)} data-reveal>
        <span className="eyebrow">{eyebrow}</span>
        <Heading className="display display-lg mt-4">{title}</Heading>
        {lede ? <p className="lede mt-5">{lede}</p> : null}
        {aside ? <div className="mt-6">{aside}</div> : null}
      </div>
    );
  }
  return (
    <div className={cn(className)} data-reveal>
      <span className="eyebrow">{eyebrow}</span>
      <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
        <Heading className="display display-lg max-w-[18ch] lg:col-span-7">{title}</Heading>
        {lede || aside ? (
          <div className="lg:col-span-5 lg:pt-1">
            {lede ? <p className="lede max-w-[46ch]">{lede}</p> : null}
            {aside ? <div className={lede ? "mt-5" : ""}>{aside}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
