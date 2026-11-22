/* eslint-disable @typescript-eslint/ban-ts-comment -- the OpenNext output exists only after a build */
/**
 * Worker entry: sends plain-http visits to https, then hands every request to
 * the OpenNext worker that `opennextjs-cloudflare build` generates.
 *
 * Without this, http://www.softvoltai.com answered 200 instead of redirecting,
 * leaving an http copy of each page for search engines to find. Cloudflare's
 * "Always Use HTTPS" setting does the same at the edge; this keeps the site
 * correct whether or not that setting is on.
 */
// @ts-ignore: generated at build time by `opennextjs-cloudflare build`
import { default as handler } from "./.open-next/worker.js";

const LOCAL = new Set(["localhost", "127.0.0.1", "[::1]"]);

const worker = {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);
    if (url.protocol === "http:" && !LOCAL.has(url.hostname)) {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    return handler.fetch(request, env, ctx);
  },
};

export default worker;

// The Durable Object classes wrangler binds must be exported from the entry.
// @ts-ignore: generated at build time by `opennextjs-cloudflare build`
export {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from "./.open-next/worker.js";
