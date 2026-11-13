import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * next/link without prefetching, unless a link asks for it. Prefetching fires a
 * burst of requests for the same pages at once (every menu link on every page
 * view), and on Cloudflare Workers concurrent requests for one page can share a
 * cache read and hang. A click still loads the page as fast as a normal visit.
 */
export default function Link({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
