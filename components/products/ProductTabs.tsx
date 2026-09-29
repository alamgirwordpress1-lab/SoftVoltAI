"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ProductTab {
  id: string;
  label: string;
  /** A small figure beside the label: how many features, questions… */
  count?: number;
  content: React.ReactNode;
}

/**
 * The detail of a product page in tabs — Features, Compare, Info, FAQ. Every
 * panel is in the HTML, so all of it is readable and indexable; only the one
 * chosen is shown. A link to #compare (or any tab's id) anywhere on the page
 * opens that tab and brings it into view, and the arrow keys move between tabs.
 */
export function ProductTabs({ tabs, label }: { tabs: ProductTab[]; label: string }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const barRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

  const reveal = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    const header = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
    window.scrollTo({ top: bar.getBoundingClientRect().top + window.scrollY - header + 1, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const ids = new Set(tabs.map((t) => t.id));
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (!ids.has(id)) return false;
      setActive(id);
      requestAnimationFrame(reveal);
      return true;
    };
    fromHash();
    // capture phase, ahead of next/link: a hidden panel cannot be scrolled to,
    // so the tab has to open before anything tries
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='#']");
      const id = a?.getAttribute("href")?.slice(1) ?? "";
      if (!ids.has(id) || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      e.stopPropagation();
      window.history.replaceState(null, "", `#${id}`);
      setActive(id);
      requestAnimationFrame(reveal);
    };
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick, true);
    };
  }, [tabs, reveal]);

  const onKey = (e: React.KeyboardEvent, index: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : step ? (index + step + tabs.length) % tabs.length : -1;
    if (to < 0) return;
    e.preventDefault();
    setActive(tabs[to].id);
    buttons.current[tabs[to].id]?.focus();
  };

  return (
    <div>
      {/* sticks under the header, so the tabs stay in reach through a long panel */}
      <div ref={barRef} className="sticky top-16 z-20 border-b border-line bg-surface/95 backdrop-blur md:top-20">
        <div role="tablist" aria-label={label} className="container-x flex gap-1 overflow-x-auto">
          {tabs.map((t, i) => {
            const on = t.id === active;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  buttons.current[t.id] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={on}
                aria-controls={t.id}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(t.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "ui relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-4 text-[15px] font-semibold transition-colors duration-150",
                  "after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-300",
                  on ? "text-ink after:scale-x-100" : "text-muted after:scale-x-0 hover:text-ink",
                )}
              >
                {t.label}
                {t.count ? <span className="mono rounded-full bg-paper px-1.5 py-0.5 text-[11px] text-muted">{t.count}</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={t.id} aria-labelledby={`tab-${t.id}`} hidden={t.id !== active} tabIndex={0} className="scroll-mt-40 outline-none">
          {t.content}
        </div>
      ))}
    </div>
  );
}
