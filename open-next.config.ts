import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Cloudflare Workers (free plan): serve the pages the build prerendered, and
 * never render on request.
 *
 * The free plan gives a request 10 ms of CPU, which is not enough to render a
 * Next.js page, and Workers KV takes only 1,000 writes a day. With the KV page
 * cache, every page a WordPress save revalidated (or the daily refresh expired)
 * had to render on request and answered 500/1102 until the next build.
 *
 * - Pages come from the build output in Workers static assets: no KV, no
 *   D1 tag cache, no render queue, nothing written at runtime.
 * - Cache interception answers a cached page before the Next.js server even
 *   loads, which keeps a request far inside the CPU limit.
 * - A WordPress change shows after the next build (a push to the
 *   cloudflare-workers branch, or Retry build in the Cloudflare dashboard).
 *
 * When the site moves to a server with real CPU, go back to the KV cache with
 * the D1 tag cache and the Durable Object queue for on-demand revalidation.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
