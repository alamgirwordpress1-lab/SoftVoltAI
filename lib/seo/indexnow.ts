import "server-only";
import { site } from "@/content/site";

/**
 * IndexNow: one request tells Bing, Yandex and the other engines that share
 * the protocol which pages changed, instead of waiting for their next crawl.
 *
 * The key proves the request is ours: the engines fetch the file named after
 * it (public/<key>.txt, which holds nothing but the key) and compare. The key
 * is public by design, so it lives in the repo; INDEXNOW_KEY can replace it,
 * as long as a matching public/<key>.txt is deployed with it.
 */

const DEFAULT_KEY = "0bb59e9649e9711c2fc1bd649b64ca2c";
const ENDPOINT = "https://api.indexnow.org/indexnow";
/** The most URLs one request may carry. */
const MAX_URLS = 10_000;

/**
 * Only the live site may ping: a preview deployment or a local production
 * build would announce URLs that are not the public ones, or not yet.
 */
function isProduction(): boolean {
  const vercel = process.env.VERCEL_ENV;
  return vercel ? vercel === "production" : process.env.NODE_ENV === "production";
}

/** Tells IndexNow these paths changed. Never throws: a failed ping is logged and forgotten. */
export async function pingIndexNow(paths: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY || DEFAULT_KEY;
  if (!isProduction()) return;

  try {
    const origin = site.url.replace(/\/+$/, "");
    const urlList = [...new Set(paths.filter((p) => p.startsWith("/")).map((p) => `${origin}${p}`))].slice(0, MAX_URLS);
    if (!urlList.length) return;

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(origin).hostname, key, keyLocation: `${origin}/${key}.txt`, urlList }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    // 200 and 202 both mean received; anything else is worth a line in the log
    if (!res.ok) {
      console.warn(`[indexnow] ${res.status} for ${urlList.length} URL(s):`, await res.text().catch(() => ""));
    }
  } catch (error) {
    console.warn("[indexnow] ping failed:", error instanceof Error ? error.message : error);
  }
}
