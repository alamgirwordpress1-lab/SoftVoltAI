import "server-only";

/**
 * The one way this site talks to WordPress.
 *
 * Every read goes through `wpQuery`, which caches the answer against a tag.
 * WordPress calls /api/revalidate on publish with the tags it touched, so a
 * page changes seconds after an editor saves without anything being rebuilt
 * that did not change.
 *
 * With WP_GRAPHQL_URL unset the whole thing is inert: `wpReady()` is false and
 * the content layer stays on the typed files in /content.
 */

export const WP_URL = process.env.WP_GRAPHQL_URL || "";
const WP_SECRET = process.env.WP_PREVIEW_SECRET || "";
/** How long a cached answer is served before it is refreshed in the background. */
const DEFAULT_REVALIDATE = Number(process.env.WP_REVALIDATE_SECONDS || 3600);

export function wpReady(): boolean {
  return Boolean(WP_URL);
}

export class WpError extends Error {
  constructor(
    message: string,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = "WpError";
  }
}

interface WpQueryOptions {
  variables?: Record<string, unknown>;
  /** Cache tags. WordPress sends the same names when it invalidates. */
  tags?: string[];
  revalidate?: number | false;
  /** A draft read for the preview route: never cached, and authenticated. */
  preview?: boolean;
}

export async function wpQuery<T>(query: string, { variables, tags = [], revalidate, preview = false }: WpQueryOptions = {}): Promise<T> {
  if (!WP_URL) {
    throw new WpError("WP_GRAPHQL_URL is not set");
  }

  const res = await fetch(WP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(preview && WP_SECRET ? { "X-Softvolt-Secret": WP_SECRET } : {}),
    },
    body: JSON.stringify({ query, variables }),
    // a draft is looked at once, by one person: caching it would be wrong
    ...(preview
      ? { cache: "no-store" as const }
      : { next: { tags: ["wp:all", ...tags], revalidate: revalidate === false ? undefined : (revalidate ?? DEFAULT_REVALIDATE) } }),
  });

  if (!res.ok) {
    throw new WpError(`WordPress answered ${res.status}`, await res.text().catch(() => ""));
  }

  const body = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (body.errors?.length) {
    throw new WpError(body.errors.map((e) => e.message).join("; "), body.errors);
  }
  if (!body.data) {
    throw new WpError("WordPress returned no data");
  }
  return body.data;
}

/**
 * The same read, but a failure is not fatal.
 *
 * A CMS that is down, half-migrated or simply empty should not take the site
 * with it — the caller falls back to the content in /content instead. The
 * error is logged, because silence during a migration is worse than noise.
 */
export async function wpTry<T>(query: string, options: WpQueryOptions = {}): Promise<T | null> {
  if (!wpReady()) return null;
  try {
    return await wpQuery<T>(query, options);
  } catch (error) {
    console.warn("[wp] falling back to local content:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** A textarea holds a list, one item per line — see softvolt_lines() on the WordPress side. */
export function lines(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** WordPress hands back HTML for title and excerpt fields; the design wants text. */
export function plain(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .trim();
}
