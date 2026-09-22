"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { SearchIcon } from "@/components/search/icons";
import { loadSearchIndex } from "@/components/search/load-index";

// the same dialog the header opens; it and the engine load on first use
const SearchDialog = dynamic(() => import("@/components/search/SearchDialog").then((m) => m.SearchDialog), { ssr: false });

/**
 * The search box in the blog sidebar. It hands what was typed to the site's
 * own search dialog rather than being a second search of its own, so one index
 * and one set of results serve the whole site.
 */
export function BlogSearch({ label, placeholder }: { label: string; placeholder: string }) {
  const [text, setText] = useState("");
  const [query, setQuery] = useState<string | null>(null);

  return (
    <div className="card p-6">
      <p className="eyebrow">{label}</p>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(text.trim());
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => loadSearchIndex().catch(() => {})}
          placeholder={placeholder}
          aria-label={label}
          className="w-full min-w-0 rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink"
        />
        <button
          type="submit"
          aria-label={label}
          className="ui grid h-[42px] w-[42px] shrink-0 place-items-center rounded-md bg-ink text-paper transition-colors hover:bg-ink-hover"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
      </form>

      {query !== null ? <SearchDialog key={query} open initialQuery={query} onClose={() => setQuery(null)} /> : null}
    </div>
  );
}
