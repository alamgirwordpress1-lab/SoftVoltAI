import type { SearchIndex } from "@/lib/search/types";

let pending: Promise<SearchIndex> | null = null;

/** Fetches /search-index.json once per page load; a failed fetch can be retried. */
export function loadSearchIndex(): Promise<SearchIndex> {
  pending ??= fetch("/search-index.json")
    .then((res) => {
      if (!res.ok) throw new Error(`Search index returned ${res.status}`);
      return res.json() as Promise<SearchIndex>;
    })
    .catch((err) => {
      pending = null;
      throw err;
    });
  return pending;
}
