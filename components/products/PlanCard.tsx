import Link from "next/link";
import type { Product, ProductPlan } from "@/lib/cms/types";
import { Button } from "@/components/ui/Button";
import { ProductIcon } from "@/components/products/ProductIcon";

function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="mt-0.5 shrink-0 text-accent">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The price card beside a product's banner: the first plan in full on the
 * white card, the next one on the dark strip underneath — the same white card
 * and dark bar the header menus use.
 */
export function PlanCard({ product, plans }: { product: Pick<Product, "slug" | "name" | "image">; plans: ProductPlan[] }) {
  const [main, next] = plans;
  if (!main) return null;
  return (
    <div className="card shadow-float overflow-hidden">
      <div className="p-6 md:p-7">
        <div className="flex items-center justify-between gap-4">
          <ProductIcon product={product} size={44} />
          <span className="mono rounded-full bg-ok-bg px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-ok-fg">{main.name}</span>
        </div>
        <p className="mt-6 flex items-baseline gap-2">
          <span className="display text-[44px] leading-none">{main.price}</span>
          {main.period ? <span className="text-[15px] text-muted">{main.period}</span> : null}
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">{main.note}</p>
        <ul className="mt-5 space-y-2.5">
          {main.points.map((p) => (
            <li key={p} className="flex gap-2.5 text-[14px] leading-snug text-ink">
              <Tick />
              {p}
            </li>
          ))}
        </ul>
        <Button href={main.action.href} className="mt-6 w-full">
          {main.action.label}
        </Button>
      </div>

      {next ? (
        <div className="er px-6 py-5 md:px-7">
          <div className="flex items-center justify-between gap-4">
            <p className="ui text-[15px] font-bold text-er-ink">{next.name}</p>
            <span className="mono rounded-full border border-er-line px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-volt">{next.price}</span>
          </div>
          <p className="mt-2 text-[13px] leading-snug text-er-muted">{next.note}</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {next.points.map((p) => (
              <li key={p} className="flex items-center gap-1.5 text-[13px] text-er-ink">
                <span className="h-1 w-1 rounded-full bg-volt" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <Link href={next.action.href} className="ui mt-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-volt hover:underline">
            {next.action.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
