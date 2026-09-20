import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * WordPress calls this when an editor saves.
 *
 * The site is static HTML on a CDN, so nothing changes on its own. The
 * WordPress side sends the paths and the cache tags a save touched, and this
 * drops exactly those — the next visitor gets the new page, everything else
 * stays cached. See wordpress/softvolt-headless/inc/revalidate.php.
 */
export async function POST(req: Request) {
  const secret = process.env.WP_PREVIEW_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Revalidation is not configured" }, { status: 503 });
  }

  const sent = req.headers.get("x-softvolt-secret") ?? new URL(req.url).searchParams.get("secret") ?? "";
  // a timing-safe compare is overkill for a webhook, but a length check is not
  if (sent.length !== secret.length || sent !== secret) {
    return NextResponse.json({ ok: false, error: "Bad secret" }, { status: 401 });
  }

  let body: { paths?: unknown; tags?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    // a body-less ping means "everything", which is what the admin bar button sends
  }

  const paths = Array.isArray(body.paths) ? body.paths.filter((p): p is string => typeof p === "string" && p.startsWith("/")) : [];
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string" && t.startsWith("wp:")) : [];

  // Next 16 wants a cache-life profile with the tag: "max" means "until this call"
  for (const tag of tags.length ? tags : ["wp:all"]) revalidateTag(tag, "max");
  // "page" is the whole route, which is what a content change means here
  for (const path of paths) revalidatePath(path, "page");

  return NextResponse.json({ ok: true, revalidated: { paths, tags: tags.length ? tags : ["wp:all"] }, at: Date.now() });
}

/** A GET is handy for checking the route is alive without sending a save. */
export async function GET() {
  return NextResponse.json({ ok: true, configured: Boolean(process.env.WP_PREVIEW_SECRET), cms: Boolean(process.env.WP_GRAPHQL_URL) });
}
