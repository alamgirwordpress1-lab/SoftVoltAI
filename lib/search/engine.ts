/**
 * Client-side search over the small static index: typo-tolerant matching,
 * synonyms, keyword autocomplete and highlight ranges. Pure functions, no DOM.
 */
import type { SearchIndex, SearchItem, SearchKind } from "@/lib/search/types";

export const KIND_ORDER: SearchKind[] = ["service", "agency", "work", "page", "faq"];

export const KIND_LABELS: Record<SearchKind, string> = {
  service: "Services",
  agency: "Agency solutions",
  work: "Case studies",
  page: "Pages",
  faq: "FAQs",
};

const KIND_BONUS: Record<SearchKind, number> = { service: 4, page: 3, work: 2, agency: 2, faq: 0 };

/** Query words that carry no meaning on their own. */
const STOP_WORDS = new Set(
  "a an the and or of for to in on at by from with as if it its is are was were be been am do does did how what which who can could will would should have has had i me my we our you your they them this that there here much many need want please".split(" "),
);

/**
 * What people type → words the site actually uses. Keys and values are
 * normalised (lower case, no punctuation inside words: "next.js" → "nextjs").
 * A value with a space is matched as a phrase.
 */
const SYNONYMS: Record<string, string[]> = {
  wp: ["wordpress"],
  woo: ["woocommerce"],
  ecommerce: ["woocommerce", "shopify"],
  ecom: ["woocommerce", "shopify"],
  shop: ["shopify", "woocommerce"],
  store: ["woocommerce", "shopify"],
  cms: ["headless", "payload", "sanity", "prismic"],
  react: ["nextjs"],
  next: ["nextjs"],
  node: ["nodejs"],
  php: ["laravel", "wordpress"],
  postgres: ["postgresql"],
  database: ["postgresql"],
  ai: ["automation", "claude", "openai"],
  gpt: ["openai"],
  chatgpt: ["openai"],
  llm: ["claude", "openai"],
  chatbot: ["assistants", "chat"],
  bot: ["assistants", "chat"],
  automate: ["automation"],
  zapier: ["workflow automation", "n8n"],
  ppc: ["google ads"],
  adwords: ["google ads"],
  sem: ["google ads"],
  facebook: ["meta ads", "meta"],
  instagram: ["meta ads", "meta"],
  fb: ["meta ads"],
  ranking: ["seo"],
  rankings: ["seo"],
  rank: ["seo"],
  gbp: ["local seo"],
  gmb: ["local seo"],
  hacked: ["malware", "security"],
  hack: ["malware", "security"],
  virus: ["malware"],
  slow: ["performance"],
  speed: ["performance"],
  pagespeed: ["performance"],
  cwv: ["core web vitals", "performance"],
  broken: ["rescue", "bug fixing"],
  bug: ["bug fixing", "rescue"],
  fix: ["bug fixing", "rescue"],
  error: ["rescue", "bug fixing"],
  updates: ["maintenance"],
  care: ["maintenance"],
  migrate: ["migration"],
  move: ["migration"],
  ga: ["analytics", "ga4"],
  gtm: ["tag manager", "analytics"],
  tracking: ["analytics"],
  ab: ["conversion rate optimisation"],
  cro: ["conversion rate optimisation"],
  conversion: ["conversion rate optimisation"],
  design: ["branding", "figma"],
  price: ["rates", "pricing"],
  prices: ["rates", "pricing"],
  pricing: ["rates"],
  cost: ["rates", "pricing"],
  costs: ["rates", "pricing"],
  budget: ["rates"],
  package: ["plans"],
  packages: ["plans"],
  confidential: ["confidentiality", "nda"],
  gdpr: ["security", "data"],
  password: ["credentials"],
  passwords: ["credentials"],
  hire: ["brief"],
  meeting: ["call"],
  whitelabel: ["white label"],
  portfolio: ["case studies"],
  examples: ["case studies"],
  bangladesh: ["dhaka"],
  timezone: ["hours"],
};

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/([a-z0-9])[.'’-](?=[a-z0-9])/g, "$1")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const words = (normalized: string) => (normalized ? normalized.split(" ") : []);

interface PreparedItem {
  item: SearchItem;
  title: string;
  name: string;
  titleWords: string[];
  keywords: string[];
  keywordWords: string[];
  description: string;
  descriptionWords: string[];
  /** Padded with spaces so " term" finds word starts. */
  body: string;
  fuzzyWords: string[];
}

interface VocabEntry {
  display: string;
  norm: string;
}

export interface PreparedIndex {
  items: PreparedItem[];
  vocab: VocabEntry[];
  /** Every word typos are checked against. */
  fuzzyWords: string[];
  popular: string[];
  quickLinks: SearchItem[];
}

export function prepareIndex(index: SearchIndex): PreparedIndex {
  const items = index.items.map((item): PreparedItem => {
    const title = normalize(item.title);
    const name = normalize(item.name ?? "");
    const keywords = [...new Set([name, ...item.keywords.map(normalize)])].filter(Boolean);
    const description = normalize(item.description);
    const titleWords = words(title);
    const keywordWords = [...new Set(keywords.flatMap(words))];
    return {
      item,
      title,
      name,
      titleWords,
      keywords,
      keywordWords,
      description,
      descriptionWords: words(description),
      body: ` ${normalize(item.body)} ${description} `,
      fuzzyWords: [...new Set([...titleWords, ...keywordWords])].filter((w) => w.length >= 4),
    };
  });
  const seen = new Set<string>();
  const vocab: VocabEntry[] = [];
  for (const display of index.keywords) {
    const norm = normalize(display);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    vocab.push({ display, norm });
  }
  const byId = new Map(index.items.map((i) => [i.id, i]));
  return {
    items,
    vocab,
    fuzzyWords: [...new Set(items.flatMap((p) => p.fuzzyWords))],
    popular: index.popular,
    quickLinks: index.quickLinks.map((id) => byId.get(id)).filter((i): i is SearchItem => Boolean(i)),
  };
}

/** Optimal-string-alignment distance, abandoned as soon as it must exceed `max`. */
function withinDistance(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev2 = new Array<number>(b.length + 1).fill(0);
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  let cur = new Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return false;
    [prev2, prev, cur] = [prev, cur, prev2];
  }
  return prev[b.length] <= max;
}

/** A typo of the word itself, or of the start of it while it is still being typed. */
function isTypoOf(token: string, word: string): boolean {
  const max = token.length >= 7 ? 2 : 1;
  if (withinDistance(token, word, max)) return true;
  for (const len of [token.length, token.length + 1]) {
    if (len < word.length && withinDistance(token, word.slice(0, len), max)) return true;
  }
  return false;
}

function variantsOf(token: string): [string, number][] {
  const out = new Map<string, number>([[token, 1]]);
  // Plurals both ways. Prefix matching already finds "plugin" in "plugins"; not "agency" in "agencies".
  if (token.length >= 5 && token.endsWith("ies")) out.set(`${token.slice(0, -3)}y`, 0.95);
  else if (token.length >= 4 && token.endsWith("s") && !token.endsWith("ss")) out.set(token.slice(0, -1), 0.95);
  else if (token.length >= 4 && token.endsWith("y")) out.set(`${token.slice(0, -1)}ies`, 0.95);
  for (const s of SYNONYMS[token] ?? []) if (!out.has(s)) out.set(s, 0.8);
  return [...out];
}

function scoreVariant(p: PreparedItem, v: string): number {
  if (v.includes(" ")) {
    if (p.title.includes(v)) return 34;
    if (p.keywords.some((k) => k.includes(v))) return 24;
    if (p.description.includes(v)) return 8;
    return p.body.includes(` ${v} `) ? 4 : 0;
  }
  const short = v.length <= 2;
  if (p.titleWords.includes(v)) return 40;
  if (p.titleWords.some((w) => w.startsWith(v))) return 30;
  if (p.keywords.includes(v)) return 26;
  if (p.keywordWords.some((w) => w.startsWith(v))) return 20;
  if (v.length === 1) return 0;
  if (!short && p.title.includes(v)) return 18;
  if (!short && p.keywords.some((k) => k.includes(v))) return 12;
  if (p.descriptionWords.some((w) => w.startsWith(v))) return 8;
  if (short) return 0;
  return p.body.includes(` ${v}`) ? 4 : 0;
}

export interface SearchResult {
  item: SearchItem;
  score: number;
  /** Query words and synonyms that matched, for highlighting. */
  terms: string[];
}

export interface SearchOutcome {
  results: SearchResult[];
  /** True when no item matched every word, so results match only some of them. */
  partial: boolean;
}

export function search(index: PreparedIndex, query: string): SearchOutcome {
  const all = [...new Set(words(normalize(query)))];
  if (!all.length) return { results: [], partial: false };
  const meaningful = all.filter((t) => !STOP_WORDS.has(t));
  const tokens = meaningful.length ? meaningful : all;
  const phrase = tokens.join(" ");

  // scores[item][token]: the best match of that word (or a synonym) in that item
  const scores = index.items.map((p) =>
    tokens.map((token) => {
      let best = { score: 0, term: "" };
      for (const [v, weight] of variantsOf(token)) {
        const s = scoreVariant(p, v) * weight;
        if (s > best.score) best = { score: s, term: v };
      }
      return best;
    }),
  );
  // A word found nowhere is probably a typo: match it against similar words instead.
  tokens.forEach((token, t) => {
    if (token.length < 4 || scores.some((row) => row[t].score > 0)) return;
    const typos = new Set(index.fuzzyWords.filter((w) => isTypoOf(token, w)));
    if (!typos.size) return;
    index.items.forEach((p, i) => {
      const typo = p.fuzzyWords.find((w) => typos.has(w));
      if (typo) scores[i][t] = { score: p.titleWords.includes(typo) ? 10 : 7, term: typo };
    });
  });

  const hits: (SearchResult & { matched: number })[] = [];
  index.items.forEach((p, i) => {
    const found = scores[i].filter((s) => s.score > 0);
    const matched = found.length;
    if (matched === 0) return;
    let total = found.reduce((sum, s) => sum + s.score, 0);
    const terms = found.map((s) => s.term);
    if (p.name && p.name === phrase) total += 30;
    else if (p.name.startsWith(phrase)) total += 10;
    if (p.title === phrase) total += 30;
    else if (tokens.length > 1 && p.title.includes(phrase)) total += 25;
    else if (p.title.startsWith(phrase)) total += 8;
    if (p.keywords.includes(phrase)) total += 12;
    total += KIND_BONUS[p.item.kind];
    hits.push({ item: p.item, score: total, terms, matched });
  });

  const rank = (a: SearchResult, b: SearchResult) =>
    b.score - a.score || KIND_ORDER.indexOf(a.item.kind) - KIND_ORDER.indexOf(b.item.kind) || a.item.title.localeCompare(b.item.title);
  const strip = ({ item, score, terms }: SearchResult) => ({ item, score, terms });

  const complete = hits.filter((h) => h.matched === tokens.length);
  if (complete.length || tokens.length === 1) return { results: complete.map(strip).sort(rank), partial: false };

  const some = hits
    .filter((h) => h.matched >= Math.ceil(tokens.length / 2))
    .map((h) => ({ ...strip(h), score: h.score * (h.matched / tokens.length) * 0.6 }))
    .sort(rank);
  return { results: some, partial: some.length > 0 };
}

/** Keyword suggestions for what has been typed so far, best first. */
export function suggest(index: PreparedIndex, query: string, limit = 6): string[] {
  const nq = normalize(query);
  if (!nq) return [];
  const tokens = words(nq);
  const last = tokens[tokens.length - 1];
  const phrase: string[] = [];
  const inner: string[] = [];
  for (const v of index.vocab) {
    if (v.norm === nq) continue;
    if (v.norm.startsWith(nq)) phrase.push(v.display);
    else if (tokens.length === 1 && last.length >= 2 && words(v.norm).some((w) => w.startsWith(last))) inner.push(v.display);
  }
  const related: string[] = [];
  for (const s of SYNONYMS[nq] ?? []) {
    for (const v of index.vocab) if (v.norm === s || v.norm.startsWith(`${s} `)) related.push(v.display);
  }
  const out = [...new Set([...phrase, ...inner, ...related])];
  if (!out.length) {
    const close = didYouMean(index, query);
    if (close) out.push(close);
  }
  return out.slice(0, limit);
}

/** The rest of the best suggestion, when it continues exactly what was typed. */
export function inlineCompletion(query: string, suggestions: string[]): string {
  if (!query.trim() || /\s$/.test(query)) return "";
  const q = query.toLowerCase();
  const hit = suggestions.find((s) => s.length > query.length && s.toLowerCase().startsWith(q));
  return hit ? hit.slice(query.length) : "";
}

/** The closest keyword to a query with a typo in it — "wordpres" → "WordPress". */
export function didYouMean(index: PreparedIndex, query: string): string | null {
  const nq = normalize(query);
  if (nq.length < 3) return null;
  const max = nq.length >= 7 ? 2 : 1;
  for (let d = 1; d <= max; d++) {
    const hit = index.vocab.find((v) => v.norm !== nq && withinDistance(nq, v.norm, d));
    if (hit) return hit.display;
  }
  return null;
}

export interface TextPart {
  text: string;
  hit: boolean;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Splits text into plain and highlighted parts. Matches start at a word boundary. */
export function highlight(text: string, terms: string[]): TextPart[] {
  const patterns = [...new Set(terms)]
    .filter((t) => t.length >= 2)
    .sort((a, b) => b.length - a.length)
    .map((t) =>
      t
        .split(" ")
        .map((w) => w.split("").map(escapeRe).join("[.'’\\-]?"))
        .join("[^a-z0-9]+"),
    );
  if (!patterns.length) return [{ text, hit: false }];
  const re = new RegExp(`(?<![a-z0-9])(?:${patterns.join("|")})`, "gi");
  const parts: TextPart[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start), hit: false });
    parts.push({ text: m[0], hit: true });
    last = start + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), hit: false });
  return parts.length ? parts : [{ text, hit: false }];
}
