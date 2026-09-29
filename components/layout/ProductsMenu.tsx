"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { productGroups, products } from "@/content/products";
import { ProductIcon } from "@/components/products/ProductIcon";
import { cn } from "@/lib/utils";

/**
 * "Our Products" mega menu: the WordPress plugins and themes, each with its
 * icon, a flag and one line, a "What's new" card beside them, and the same
 * dark action bar as the Services panel. Same interaction model as the other
 * header menus: hover intent, focus or click to open; leave, Escape, outside
 * click, navigation or focus leaving the panel to close.
 */
export function ProductsMenu({ label, href, active = false }: { label: string; href: string; active?: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const panelId = useId();
  const featured = products[0];

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  };
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const reveal = (delay: number) => ({
    className: cn("transition-[opacity,translate] duration-500 ease-[var(--ease-out-quint)]", open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"),
    style: { transitionDelay: open ? `${delay}ms` : "0ms" },
  });

  return (
    <div
      ref={rootRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && show()}
      onPointerLeave={(e) => e.pointerType === "mouse" && hideSoon()}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-[15px] transition-colors duration-150 hover:text-ink", open || active ? "text-ink" : "text-muted")}
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className={cn("transition-transform duration-300 ease-[var(--ease-out-quint)]", open && "rotate-180")}>
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* one wide panel under the header, like the Services menu */}
      <div
        id={panelId}
        className={cn(
          "absolute left-1/2 top-[calc(100%+8px)] z-50 w-[min(1040px,calc(100vw-3rem))] -translate-x-1/2 rounded-2xl border border-line bg-surface shadow-float transition-[opacity,translate,visibility] duration-300 ease-[var(--ease-out-quint)]",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        {/* invisible bridge so the pointer can cross the gap */}
        <span aria-hidden="true" className="absolute inset-x-0 -top-3 h-3" />
        <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:gap-10 lg:p-8">
          <div className="grid gap-7">
            {productGroups.map((group, g) => {
              const list = products.filter((p) => p.kind === group.kind);
              return (
                <div key={group.kind} {...reveal(60 + g * 60)}>
                  <span className="eyebrow">{group.title}</span>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {list.length ? (
                      list.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/products/${p.slug}`}
                            // closed menus are only invisible, so their links would prefetch on every page
                            prefetch={false}
                            onClick={close}
                            tabIndex={open ? 0 : -1}
                            className="group -mx-2 flex items-start gap-3.5 rounded-xl px-2 py-2.5 transition-colors duration-150 hover:bg-paper"
                          >
                            <ProductIcon icon={p.icon} size={44} className="transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5" />
                            <span className="min-w-0">
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="ui text-[15px] font-bold leading-snug text-ink">{p.name}</span>
                                {p.badge ? <span className="mono rounded-full bg-ok-bg px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-ok-fg">{p.badge}</span> : null}
                              </span>
                              <span className="mt-1 block text-[13px] leading-snug text-muted">{p.tagline}</span>
                            </span>
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="-mx-2 flex items-start gap-3.5 px-2 py-2.5">
                        <ProductIcon icon="placeholder" size={44} />
                        <span>
                          <span className="ui block text-[15px] font-bold leading-snug text-ink">Coming soon</span>
                          <span className="mt-1 block text-[13px] leading-snug text-muted">{group.empty}</span>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>

          {featured ? (
            <div className={cn("border-line lg:border-l lg:pl-8", reveal(170).className)} style={reveal(170).style}>
              <span className="eyebrow">What&rsquo;s new</span>
              <Link
                href={`/products/${featured.slug}`}
                prefetch={false}
                onClick={close}
                tabIndex={open ? 0 : -1}
                className="group mt-4 block rounded-xl border border-line bg-paper p-5 transition-colors duration-200 hover:border-line-strong"
              >
                <ProductIcon icon={featured.icon} size={40} />
                <p className="ui mt-4 text-[15px] font-bold leading-snug text-ink">{featured.name} 1.0</p>
                <p className="mt-2 text-[13px] leading-snug text-muted">
                  Voice and text chat, bookings, WooCommerce product cards and lead alerts. Free, with a Pro add-on on the way.
                </p>
                <span className="ui mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-accent">
                  Explore the plugin <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </div>
          ) : null}
        </div>

        <div className="er flex flex-wrap items-center justify-between gap-4 rounded-b-[15px] px-6 py-4 lg:px-8">
          <p className="text-[14px] text-er-ink">Free plugins for WordPress, with Pro add-ons and licences coming soon.</p>
          <Link href={href} onClick={close} tabIndex={open ? 0 : -1} className="ui inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-volt hover:underline">
            All products <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
