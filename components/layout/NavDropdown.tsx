"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

/**
 * Compact header dropdown (Agency Solutions, About). Same interaction model as
 * the services mega menu: hover intent, click, Escape, outside click or focus
 * leaving closes it. The panel lifts in and its links stagger.
 */
export function NavDropdown({
  label,
  items,
  footer,
  active = false,
  width = 340,
}: {
  label: string;
  items: DropdownItem[];
  footer?: DropdownItem;
  active?: boolean;
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const panelId = useId();

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
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

  return (
    <div
      ref={rootRef}
      className="relative"
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

      <div
        id={panelId}
        style={{ width }}
        className={cn(
          // +38px clears the 80px header and leaves the same small gap the mega menu has
          "absolute left-1/2 top-[calc(100%+38px)] z-50 -translate-x-1/2 rounded-xl border border-line bg-surface p-2 shadow-float transition-[opacity,translate,visibility] duration-300 ease-[var(--ease-out-quint)]",
          open ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0",
        )}
      >
        {/* invisible bridge so the pointer can cross the gap */}
        <span aria-hidden="true" className="absolute inset-x-0 -top-10 h-10" />
        <ul>
          {items.map((it, i) => (
            <li
              key={it.href}
              className={cn("transition-[opacity,translate] duration-500 ease-[var(--ease-out-quint)]", open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0")}
              style={{ transitionDelay: open ? `${50 + i * 35}ms` : "0ms" }}
            >
              <Link
                href={it.href}
                onClick={close}
                tabIndex={open ? 0 : -1}
                className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-paper"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong transition-[background-color,box-shadow] duration-200 group-hover:bg-accent group-hover:shadow-[0_0_0_3px_rgba(30,122,50,0.15)]" aria-hidden="true" />
                <span>
                  <span className="ui block text-[14px] font-semibold text-ink">{it.label}</span>
                  {it.description ? <span className="mt-0.5 block text-[13px] leading-snug text-muted">{it.description}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {footer ? (
          <Link
            href={footer.href}
            onClick={close}
            tabIndex={open ? 0 : -1}
            // same dark action bar as the mega menu: full-bleed to the panel
            // edges (clears the panel's p-2), matching radius and volt label
            className="er ui -mx-2 -mb-2 mt-2 flex items-center justify-between gap-4 rounded-b-[17px] px-5 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-volt transition-colors hover:bg-[#1b2320]"
          >
            {footer.label}
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
