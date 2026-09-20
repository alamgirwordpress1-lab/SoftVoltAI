import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * The editor's Preview button lands here.
 *
 * WordPress sends the shared secret with the post it wants shown. Draft mode
 * goes on — which also switches every page off the static cache for this
 * browser — and the reader is sent to /preview, which fetches the draft from
 * WordPress and renders it.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = process.env.WP_PREVIEW_SECRET;
  const sent = url.searchParams.get("secret") ?? "";
  const id = url.searchParams.get("id") ?? "";
  const type = url.searchParams.get("type") ?? "";

  if (!secret) {
    return NextResponse.json({ ok: false, error: "Previews are not configured on this site" }, { status: 503 });
  }
  if (sent.length !== secret.length || sent !== secret || !id) {
    return NextResponse.json({ ok: false, error: "Bad preview link" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  const target = new URL("/preview", url.origin);
  target.searchParams.set("id", id);
  if (type) target.searchParams.set("type", type);
  return NextResponse.redirect(target);
}
