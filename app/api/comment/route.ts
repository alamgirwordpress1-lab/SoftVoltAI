import { NextResponse } from "next/server";
import { commentSchema } from "@/lib/forms/comment-schema";
import { wpBase } from "@/lib/forms/cf7";

export const runtime = "nodejs";

/**
 * A comment written under a blog post.
 *
 * WordPress does the real work: its own route checks the post, the Discussion
 * settings and the moderation rules, then either publishes the comment or holds
 * it for approval. This handler only keeps obvious rubbish off the wire and
 * turns whatever WordPress says into something the form can show.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields", issues: parsed.error.issues }, { status: 422 });
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true, approved: false }); // honeypot filled: pretend success, send nothing

  const base = wpBase();
  if (!base) {
    console.info("[comment] no WordPress configured — comment logged instead of posted:", data);
    return NextResponse.json({ ok: true, approved: false, delivered: false });
  }

  try {
    const res = await fetch(`${base}/wp-json/softvolt/v1/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ post: data.post, parent: data.parent ?? 0, name: data.name, email: data.email, content: data.content }),
    });
    const answer = (await res.json().catch(() => null)) as { ok?: boolean; approved?: boolean; message?: string } | null;
    if (!res.ok || !answer?.ok) {
      return NextResponse.json(
        { ok: false, error: answer?.message || "We could not save that just now. Please try again in a moment." },
        { status: res.status === 403 ? 403 : 502 },
      );
    }
    return NextResponse.json({ ok: true, approved: Boolean(answer.approved), delivered: true });
  } catch (err) {
    console.error("[comment] WordPress did not answer", err);
    return NextResponse.json({ ok: false, error: "We could not save that just now. Please try again in a moment." }, { status: 502 });
  }
}
