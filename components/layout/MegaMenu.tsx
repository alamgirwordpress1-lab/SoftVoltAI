"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { PillarGroup } from "@/lib/cms/types";
import { resourceLinks } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Services mega menu: one wide floating panel in the same style as the other
 * header dropdowns — white card, bullet links, dark action bar at the bottom.
 * Opens on hover intent, focus or click; closes on leave, Escape, outside
 * click, navigation or focus leaving the panel.
 */
export function MegaMenu({ pillars, active = false }: { pillars: PillarGroup[]; active?: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const panelId = useId();
  const build = pillars.find((p) => p.id === "build");
  const automate = pillars.find((p) => p.id === "automate");

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

  const link = (href: string, label: string, delay: number) => (
    <li
      key={href}
      className={cn("transition-[opacity,translate] duration-500 ease-[var(--ease-out-quint)]", open ? "translate-x-0 opacity-100" : "-translate-x-1.5 opacity-0")}
      style={{ transitionDelay: open ? `${delay}ms` : "0ms" }}
    >
      <Link
        href={href}
        // the panel holds thirty links and is only visibility-hidden when closed:
        // without this every page load prefetches the whole menu
        prefetch={false}
        onClick={close}
        tabIndex={open ? 0 : -1}
        className="group -mx-2 flex items-center gap-2.5 rounded-md px-2 py-[7px] text-[14px] text-ink transition-colors duration-150 hover:bg-paper"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong transition-[background-color,box-shadow] duration-200 group-hover:bg-accent group-hover:shadow-[0_0_0_3px_rgba(30,122,50,0.15)]" aria-hidden="true" />
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">{label}</span>
      </Link>
    </li>
  );

  const column = (p: PillarGroup | undefined, col: number, twoUp = false) =>
    p ? (
      <div
        className={cn("transition-[opacity,translate] duration-500 ease-[var(--ease-out-quint)]", open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
        style={{ transitionDelay: open ? `${60 + col * 55}ms` : "0ms" }}
      >
        <Link href={`/services#pillar-${p.id}`} prefetch={false} onClick={close} tabIndex={open ? 0 : -1} className="eyebrow hover:underline">
          {p.name}
        </Link>
        <p className="mt-2 max-w-[42ch] text-[13px] leading-snug text-muted">{p.tagline}</p>
        <ul className={cn("mt-4 gap-x-6", twoUp ? "grid sm:grid-cols-2" : "grid")}>
          {p.services.map((s, i) => link(`/services/${s.slug}`, s.name, 110 + col * 55 + i * 22))}
        </ul>
      </div>
    ) : null;

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
        Services
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className={cn("transition-transform duration-300 ease-[var(--ease-out-quint)]", open && "rotate-180")}>
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* one wide panel, floating just under the header — same small gap as the other dropdowns */}
      <div
        id={panelId}
        className={cn(
          "absolute left-1/2 top-[calc(100%+8px)] z-50 w-[min(1120px,calc(100vw-3rem))] -translate-x-1/2 rounded-2xl border border-line bg-surface shadow-float transition-[opacity,translate,visibility] duration-300 ease-[var(--ease-out-quint)]",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        {/* invisible bridge so the pointer can cross the gap */}
        <span aria-hidden="true" className="absolute inset-x-0 -top-3 h-3" />
        <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-10 lg:p-8">
          {column(build, 0, true)}
          {column(automate, 1)}

          <div
            className={cn("border-line transition-[opacity,translate] duration-500 ease-[var(--ease-out-quint)] lg:border-l lg:pl-8", open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
            style={{ transitionDelay: open ? "170ms" : "0ms" }}
          >
            <span className="eyebrow">Resources</span>
            <p className="mt-2 text-[13px] leading-snug text-muted">Proof, pricing and where to start.</p>
            <ul className="mt-4 grid">{resourceLinks.map((l, i) => link(l.href, l.label, 220 + i * 22))}</ul>
          </div>
        </div>

        <div className="er flex flex-wrap items-center justify-between gap-4 rounded-b-[15px] px-6 py-4 lg:px-8">
          <p className="text-[14px] text-er-ink">Not sure which service fits? Send the brief — the scope tells you.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/contact" onClick={close} tabIndex={open ? 0 : -1} className="ui inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-volt hover:underline">
              Send us a brief <span aria-hidden="true">→</span>
            </Link>
            <Link href="/services" onClick={close} tabIndex={open ? 0 : -1} className="ui inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-er-muted transition-colors hover:text-er-ink">
              All services <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
