import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Leaves draft mode, so this browser sees the published, cached site again. */
export async function GET(req: Request) {
  const draft = await draftMode();
  draft.disable();
  return NextResponse.redirect(new URL("/", new URL(req.url).origin));
}
