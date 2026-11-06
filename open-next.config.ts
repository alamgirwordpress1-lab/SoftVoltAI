import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

/**
 * Cloudflare Workers (free plan) caching for the site.
 *
 * - Pages and WordPress reads are cached in Workers KV. KV needs no card, unlike
 *   R2, so the whole site runs on the free plan.
 * - Cache tags (wp:all, wp:post:…) live in D1, so a WordPress save can drop
 *   exactly the pages it touched through /api/revalidate.
 * - Background refreshes go through a Durable Object queue, so a stale page is
 *   rebuilt once, not once per visitor.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  queue: doQueue,
});
