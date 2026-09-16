import Link from "next/link";
import { site } from "@/content/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  href: string;
}

/** Visible trail plus BreadcrumbList structured data. The last crumb is the current page. */
export function Breadcrumbs({ crumbs, dark = false }: { crumbs: Crumb[]; dark?: boolean }) {
  const all: Crumb[] = [{ name: "Home", href: "/" }, ...crumbs];
  return (
    <nav aria-label="Breadcrumb">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${site.url}${c.href}` })),
        }}
      />
      <ol className={cn("mono flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.1em]", dark ? "text-er-muted" : "text-muted")}>
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={dark ? "text-er-ink" : "text-ink"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className={cn("transition-colors", dark ? "hover:text-er-ink" : "hover:text-ink")}>
                  {c.name}
                </Link>
              )}
              {last ? null : <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
