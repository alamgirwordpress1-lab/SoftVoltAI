"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { loadSearchIndex } from "@/components/search/load-index";
import { SearchIcon } from "@/components/search/icons";

// The dialog and the search engine load the first time search is opened.
const SearchDialog = dynamic(() => import("@/components/search/SearchDialog").then((m) => m.SearchDialog), { ssr: false });

const isTypingTarget = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

const noSubscribe = () => () => {};
const shortcutLabel = () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘ K" : "Ctrl K");

/**
 * Header search: a field-like button on wide screens, an icon below that.
 * Ctrl/⌘ K, or "/" outside a text field, opens it from anywhere on the page.
 */
export function SiteSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shortcut = useSyncExternalStore(noSubscribe, shortcutLabel, () => "Ctrl K");
  const trigger = useRef<HTMLButtonElement>(null);

  const show = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        setMounted(true);
        setOpen((v) => !v);
      } else if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTypingTarget(e.target)) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  // Warm the index as soon as someone looks like they are about to search.
  const prefetch = () => {
    loadSearchIndex().catch(() => {});
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={show}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Control+K Meta+K /"
        aria-label="Search the site"
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-md border border-line-strong bg-surface text-ink transition-colors duration-150 hover:border-ink",
          "xl:w-[196px] xl:justify-start xl:px-3 xl:text-muted xl:hover:text-ink",
          className,
        )}
      >
        <SearchIcon className="shrink-0" />
        <span className="ui hidden text-[14px] xl:inline">Search</span>
        <kbd className="mono ml-auto hidden rounded border border-line bg-raised px-1.5 py-0.5 text-[11px] leading-none text-muted xl:inline">{shortcut}</kbd>
      </button>
      {mounted && <SearchDialog open={open} onClose={hide} />}
    </>
  );
}
