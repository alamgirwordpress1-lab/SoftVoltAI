"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { loadSearchIndex } from "@/components/search/load-index";
import { ArrowIcon, ClockIcon, CloseIcon, KindIcon, SearchIcon } from "@/components/search/icons";
import {
  KIND_LABELS,
  KIND_ORDER,
  didYouMean,
  highlight,
  inlineCompletion,
  normalize,
  prepareIndex,
  search,
  suggest,
  type PreparedIndex,
  type SearchResult,
} from "@/lib/search/engine";
import type { SearchKind } from "@/lib/search/types";
import { cn } from "@/lib/utils";
import "./search-dialog.css";

type Filter = "all" | SearchKind;

interface Group {
  key: string;
  label: string;
  note: string;
  /** Each result with its position in the flat, keyboard-navigable list. */
  options: { result: SearchResult; index: number }[];
}

const RECENT_KEY = "softvolt-recent-searches";
const PER_GROUP = 4;

function readRecent(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(stored) ? stored.filter((s): s is string => typeof s === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    if (list.length) localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    else localStorage.removeItem(RECENT_KEY);
  } catch {
    // storage blocked: recent searches are a convenience only
  }
}

function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  return (
    <>
      {highlight(text, terms).map((part, i) =>
        part.hit ? (
          <mark key={i} className="search-mark">
            {part.text}
          </mark>
        ) : (
          part.text
        ),
      )}
    </>
  );
}

function Option({
  result,
  index,
  id,
  active,
  onHover,
  onSelect,
}: {
  result: SearchResult;
  index: number;
  id: string;
  active: boolean;
  onHover: (index: number) => void;
  onSelect: () => void;
}) {
  const { item, terms } = result;
  return (
    <Link
      href={item.url}
      id={id}
      role="option"
      aria-selected={active}
      data-option={index}
      tabIndex={-1}
      onMouseMove={() => onHover(index)}
      onClick={onSelect}
      className={cn("search-option", active && "is-active")}
    >
      <span className="search-option-icon" aria-hidden="true">
        <KindIcon kind={item.kind} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="ui truncate text-[15px] font-semibold text-ink">
            <Highlighted text={item.title} terms={terms} />
          </span>
          <span className="mono hidden shrink-0 text-[11px] uppercase tracking-[0.08em] text-muted sm:inline">{item.meta}</span>
        </span>
        <span className="mt-0.5 block truncate text-[13.5px] leading-snug text-muted">
          <Highlighted text={item.description} terms={terms} />
        </span>
      </span>
      <ArrowIcon className="search-option-arrow shrink-0" />
    </Link>
  );
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const lastPath = useRef<string | null>(null);
  const [index, setIndex] = useState<PreparedIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [cursor, setCursor] = useState({ key: "", index: 0 });
  const [recent, setRecent] = useState<string[]>(readRecent);
  const uid = useId();
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    loadSearchIndex()
      .then((raw) => {
        if (alive) setIndex(prepareIndex(raw));
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  // `open` drives the native modal dialog, which brings the focus trap, Escape and an inert page with it.
  useEffect(() => {
    const d = dialog.current;
    const root = document.documentElement;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      root.dataset.searchOpen = "";
      requestAnimationFrame(() => input.current?.select());
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) delete root.dataset.searchOpen;
  }, [open]);

  useEffect(() => {
    return () => {
      delete document.documentElement.dataset.searchOpen;
    };
  }, []);

  // Every way out of the dialog lands here: each visit starts from an empty box
  // showing recent and popular searches.
  const onClosed = useCallback(() => {
    delete document.documentElement.dataset.searchOpen;
    setQuery("");
    setFilter("all");
    onClose();
  }, [onClose]);

  const close = useCallback(() => {
    if (dialog.current?.open) dialog.current.close();
    onClosed();
  }, [onClosed]);

  // Any navigation — a result, a link elsewhere, the back button — closes search.
  useEffect(() => {
    if (lastPath.current !== null && lastPath.current !== pathname && dialog.current?.open) close();
    lastPath.current = pathname;
  }, [pathname, close]);

  const trimmed = query.trim();
  const outcome = useMemo(() => (index && trimmed ? search(index, trimmed) : null), [index, trimmed]);
  const results = useMemo(() => outcome?.results ?? [], [outcome]);
  const suggestions = useMemo(() => (index && trimmed ? suggest(index, query) : []), [index, query, trimmed]);
  const ghost = inlineCompletion(query, suggestions);
  const completion = ghost ? query + ghost : "";
  const acceptedCompletion = completion ? (suggestions.find((s) => s.toLowerCase() === completion.toLowerCase()) ?? completion) : "";
  const correction = useMemo(() => (index && trimmed && !results.length ? didYouMean(index, trimmed) : null), [index, trimmed, results.length]);

  const counts = useMemo(() => {
    const c = { all: results.length } as Record<Filter, number>;
    for (const k of KIND_ORDER) c[k] = 0;
    for (const r of results) c[r.item.kind]++;
    return c;
  }, [results]);

  const activeFilter: Filter = filter !== "all" && counts[filter] === 0 ? "all" : filter;

  const groups = useMemo((): Group[] => {
    let raw: { key: string; label: string; note: string; results: SearchResult[] }[];
    if (!trimmed) {
      raw = index?.quickLinks.length
        ? [{ key: "quick", label: "Quick links", note: "", results: index.quickLinks.map((item) => ({ item, score: 0, terms: [] })) }]
        : [];
    } else if (activeFilter !== "all") {
      raw = [{ key: activeFilter, label: KIND_LABELS[activeFilter], note: "", results: results.filter((r) => r.item.kind === activeFilter) }];
    } else {
      // Results arrive best first, so each group sits where its best match ranks.
      const byKind = new Map<SearchKind, SearchResult[]>();
      for (const r of results) byKind.set(r.item.kind, [...(byKind.get(r.item.kind) ?? []), r]);
      raw = [...byKind].map(([kind, list]) => ({
        key: kind,
        label: KIND_LABELS[kind],
        note: list.length > PER_GROUP ? `Top ${PER_GROUP} of ${list.length}` : "",
        results: list.slice(0, PER_GROUP),
      }));
    }
    let next = 0;
    return raw.map((g) => ({ key: g.key, label: g.label, note: g.note, options: g.results.map((result) => ({ result, index: next++ })) }));
  }, [trimmed, index, activeFilter, results]);

  const optionCount = groups.reduce((n, g) => n + g.options.length, 0);
  // The highlighted row resets whenever the list itself changes.
  const listKey = `${trimmed}|${activeFilter}`;
  const activeIndex = optionCount ? Math.min(cursor.key === listKey ? cursor.index : 0, optionCount - 1) : -1;
  const setActive = useCallback((i: number) => setCursor({ key: listKey, index: i }), [listKey]);

  useEffect(() => {
    body.current?.querySelector(`[data-option="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const select = () => {
    if (trimmed.length >= 2) {
      const next = [trimmed, ...recent.filter((r) => r.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      writeRecent(next);
      setRecent(next);
    }
    close();
  };

  const applyQuery = (value: string) => {
    setQuery(value);
    setFilter("all");
    input.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (optionCount) setActive((activeIndex + (e.key === "ArrowDown" ? 1 : -1) + optionCount) % optionCount);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = body.current?.querySelector<HTMLAnchorElement>(`[data-option="${activeIndex}"]`);
      if (target) target.click();
      else if (correction) applyQuery(correction);
    } else if ((e.key === "Tab" && !e.shiftKey) || e.key === "ArrowRight") {
      const el = e.currentTarget;
      const atEnd = el.selectionStart === query.length && el.selectionEnd === query.length;
      if (acceptedCompletion && atEnd) {
        e.preventDefault();
        setQuery(acceptedCompletion);
      }
    }
  };

  const listId = `${uid}-results`;
  const typed = normalize(query);

  return (
    <dialog
      ref={dialog}
      className="search-dialog"
      aria-labelledby={`${uid}-title`}
      data-lenis-prevent
      onClose={onClosed}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onKeyDown={(e) => {
        // Escape from a chip or button inside the dialog; the input handles its own
        if (e.key === "Escape" && !e.defaultPrevented) {
          e.preventDefault();
          close();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="search-panel">
        <h2 id={`${uid}-title`} className="sr-only">
          Search SoftVolt AI
        </h2>

        <div className="flex items-center gap-3 border-b border-line px-4 sm:px-5">
          <SearchIcon className="shrink-0 text-muted" />
          <div className="relative min-w-0 flex-1">
            {ghost && (
              <div className="search-ghost" aria-hidden="true">
                <span className="invisible">{query}</span>
                <span className="text-muted">{ghost}</span>
              </div>
            )}
            <input
              ref={input}
              type="text"
              inputMode="search"
              role="combobox"
              aria-expanded={optionCount > 0}
              aria-controls={listId}
              aria-autocomplete="both"
              aria-activedescendant={activeIndex >= 0 ? `${uid}-option-${activeIndex}` : undefined}
              aria-describedby={`${uid}-help`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
              placeholder="Search services, case studies, pricing…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              className="search-input"
            />
          </div>
          {query && (
            <button type="button" onClick={() => applyQuery("")} aria-label="Clear search" className="search-icon-btn">
              <CloseIcon />
            </button>
          )}
          <button type="button" onClick={close} className="search-esc" aria-label="Close search">
            <kbd className="mono hidden sm:inline-block">Esc</kbd>
            <span className="ui px-1 text-[14px] font-semibold sm:hidden">Cancel</span>
          </button>
        </div>
        <p id={`${uid}-help`} className="sr-only">
          Use the up and down arrows to move through results, Enter to open one, and Tab to accept the suggested keyword.
        </p>

        {trimmed && suggestions.length > 0 && (
          <div className="search-row" role="group" aria-label="Suggested keywords">
            <span className="search-row-label">Suggestions</span>
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => applyQuery(s)} className="search-chip">
                <span>
                  <Highlighted text={s} terms={typed ? [typed] : []} />
                </span>
              </button>
            ))}
          </div>
        )}

        {trimmed && results.length > 0 && (
          <div className="search-row" role="group" aria-label="Filter results">
            {(["all", ...KIND_ORDER] as Filter[])
              .filter((f) => f === "all" || counts[f] > 0)
              .map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={activeFilter === f}
                  onClick={() => {
                    setFilter(f);
                    input.current?.focus();
                  }}
                  className="search-filter"
                >
                  {f === "all" ? "All" : KIND_LABELS[f]}
                  <span className="mono text-[11px]">{counts[f]}</span>
                </button>
              ))}
          </div>
        )}

        <div ref={body} className="search-body" data-lenis-prevent>
          {!index && !failed && (
            <div className="space-y-3 p-5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-raised" />
              ))}
            </div>
          )}

          {failed && <p className="p-6 text-[15px] text-muted">Search could not load just now. Try again in a moment, or use the menu above.</p>}

          {index && !trimmed && (
            <div className="space-y-5 px-3 pt-4 sm:px-4">
              {recent.length > 0 && (
                <section aria-labelledby={`${uid}-recent`}>
                  <div className="search-group-label">
                    <span id={`${uid}-recent`}>Recent searches</span>
                    <button
                      type="button"
                      className="mono text-[11px] uppercase tracking-[0.08em] text-muted underline-offset-4 hover:text-ink hover:underline"
                      onClick={() => {
                        writeRecent([]);
                        setRecent([]);
                        input.current?.focus();
                      }}
                    >
                      Clear
                    </button>
                  </div>
                  <ul className="flex flex-wrap gap-2 px-2">
                    {recent.map((r) => (
                      <li key={r}>
                        <button type="button" onClick={() => applyQuery(r)} className="search-chip">
                          <ClockIcon className="text-muted" />
                          {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section aria-labelledby={`${uid}-popular`}>
                <div className="search-group-label">
                  <span id={`${uid}-popular`}>Popular searches</span>
                </div>
                <div className="flex flex-wrap gap-2 px-2">
                  {index.popular.map((p) => (
                    <button key={p} type="button" onClick={() => applyQuery(p)} className="search-chip">
                      {p}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {index && trimmed && !results.length && (
            <div className="px-6 py-8 text-center">
              <p className="ui text-[16px] font-semibold text-ink">No results for “{trimmed}”</p>
              {correction && (
                <p className="mt-2 text-[15px] text-muted">
                  Did you mean{" "}
                  <button type="button" onClick={() => applyQuery(correction)} className="font-semibold text-accent underline underline-offset-4">
                    {correction}
                  </button>
                  ?
                </p>
              )}
              <p className="mx-auto mt-3 max-w-[42ch] text-[14px] text-muted">
                Not listed?{" "}
                <Link href="/contact" onClick={select} className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
                  Send us a brief
                </Link>{" "}
                — a named producer replies within one business day.
              </p>
            </div>
          )}

          {index && outcome?.partial && <p className="px-5 pt-3 text-[13px] text-muted">No page matches every word — showing the closest results.</p>}

          {index && groups.length > 0 && (
            <div id={listId} role="listbox" aria-label={trimmed ? "Search results" : "Quick links"} className="px-2 pb-2 pt-1 sm:px-3">
              {groups.map((g) => (
                <div key={g.key} role="group" aria-labelledby={`${uid}-group-${g.key}`} className="pt-3">
                  <div className="search-group-label" id={`${uid}-group-${g.key}`}>
                    <span>{g.label}</span>
                    {g.note && <span className="mono normal-case tracking-normal">{g.note}</span>}
                  </div>
                  {g.options.map(({ result, index: i }) => (
                    <Option
                      key={result.item.id}
                      result={result}
                      index={i}
                      id={`${uid}-option-${i}`}
                      active={i === activeIndex}
                      onHover={setActive}
                      onSelect={select}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="search-footer" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>Tab</kbd> complete
          </span>
          <span>
            <kbd>Esc</kbd> close
          </span>
        </div>
        <div className="sr-only" aria-live="polite">
          {index && trimmed ? `${results.length} ${results.length === 1 ? "result" : "results"}` : ""}
        </div>
      </div>
    </dialog>
  );
}
