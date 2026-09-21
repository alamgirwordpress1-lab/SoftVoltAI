import "server-only";
import { cache } from "react";
import type { CopyOf, Field, PageCopy } from "@/content/copy/schema";
import { wpTry } from "@/lib/wp/client";

/**
 * The words on a designed page: what an editor wrote in WordPress, with
 * anything left empty filled from the page definition in content/copy.
 *
 * WordPress sends a page's words as one JSON field (pageCopy), keyed exactly
 * like the definition — section, then field, lists as "steps_1", "steps_2"…
 * One small query per page, however many words it holds.
 */

type Raw = Record<string, unknown> | null | undefined;

const PAGE_COPY = /* GraphQL */ `
  query PageCopy($uri: ID!) {
    page(id: $uri, idType: URI) {
      pageCopy
    }
  }
`;

const rows = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** Empty keeps the original; a lone dash is how an editor says "show nothing here". */
function words(value: unknown, fallback: string): string {
  const v = str(value);
  if (v === "-") return "";
  return v || fallback;
}

function mergeField(key: string, field: Field, raw: Raw): unknown {
  switch (field.kind) {
    case "text":
    case "para":
      return words(raw?.[key], field.value);
    case "lines": {
      const v = str(raw?.[key]);
      if (v === "-") return [];
      const list = v
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      return list.length ? list : field.value;
    }
    case "link": {
      const link = raw?.[key] as Raw;
      return { text: words(link?.text, field.value.text), url: str(link?.url) || field.value.url };
    }
    case "items": {
      const keys = Object.keys(field.fields);
      const found = rows(field.slots)
        .map((i) => raw?.[`${key}_${i}`] as Raw)
        .filter((row): row is Record<string, unknown> => Boolean(row) && keys.some((k) => str(row?.[k])))
        .map((row) => Object.fromEntries(keys.map((k) => [k, str(row[k])])));
      return found.length ? found : field.value;
    }
  }
}

/** {count}, {email} and friends: values only the page knows, dropped into the words. */
function fill<T>(value: T, tokens: Record<string, string>): T {
  if (typeof value === "string") {
    return value.replace(/\{([a-z_]+)\}/gi, (whole, key: string) => (key in tokens ? tokens[key] : whole)) as T;
  }
  if (Array.isArray(value)) return value.map((v) => fill(v, tokens)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fill(v, tokens)])) as T;
  }
  return value;
}

/** One WordPress read per page per request, however many sections ask. */
const readPage = cache(async (slug: string, uri: string): Promise<Record<string, Raw> | null> => {
  const data = await wpTry<{ page: { pageCopy: string | null } | null }>(PAGE_COPY, { variables: { uri }, tags: ["wp:page", `wp:page:${slug}`] });
  const json = data?.page?.pageCopy;
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, Raw>) : null;
  } catch {
    console.warn(`[wp] page copy for ${slug} is not valid JSON; using the built-in words`);
    return null;
  }
});

export async function getCopy<P extends PageCopy>(page: P, tokens: Record<string, string> = {}): Promise<CopyOf<P>> {
  // the home page lives at "/" on the site but at /home/ in WordPress
  const wp = await readPage(page.slug, page.uri === "/" ? `/${page.slug}/` : page.uri);

  const merged = Object.fromEntries(
    Object.entries(page.sections).map(([key, section]) => {
      const raw = wp?.[key] ?? null;
      return [key, Object.fromEntries(Object.entries(section.fields).map(([fieldKey, field]) => [fieldKey, mergeField(fieldKey, field, raw)]))];
    }),
  );

  return fill(merged, tokens) as CopyOf<P>;
}
