export type SearchKind = "service" | "agency" | "work" | "page" | "faq";

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  /** The short name people search by, when it differs from the title ("WordPress"). */
  name?: string;
  url: string;
  /** One line under the title. */
  description: string;
  /** Short context shown beside the title: pillar, region · category, "FAQ · Rates"… */
  meta: string;
  /** Names, tools and phrases this item should be found by. Matched with high weight. */
  keywords: string[];
  /** Longer copy, matched with low weight. */
  body: string;
}

/** Served statically at /search-index.json and fetched the first time search opens. */
export interface SearchIndex {
  items: SearchItem[];
  /** Autocomplete vocabulary, most common first. */
  keywords: string[];
  /** Suggested before anything is typed. */
  popular: string[];
  /** Item ids shown as quick links before anything is typed. */
  quickLinks: string[];
}
