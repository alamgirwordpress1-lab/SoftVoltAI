import { NextResponse } from "next/server";
import * as z from "@/lib/forms/zod";
import { VoltUnavailableError, voltReply } from "@/lib/volt/assistant";

export const runtime = "nodejs";
// a reply plus a tool call can mean two model calls and a webhook
export const maxDuration = 60;

const bodySchema = z.object({
  sessionId: z.string().trim().min(8).max(100),
  message: z.string().trim().min(1).max(1000),
  /** The conversation so far, oldest first. The browser keeps it; the server keeps nothing. */
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(60)
    .optional()
    .default([]),
});

const FALLBACK =
  "Sorry, I couldn't answer just now. You can send us a brief at softvoltai.com/contact and the team will reply within a business day.";

/**
 * Every message costs a model call, so one visitor gets a generous but finite
 * allowance. Kept per server instance: a best-effort brake on abuse, not a
 * guarantee.
 */
const WINDOW_MS = 10 * 60 * 1000;
const PER_WINDOW = 30;
const seen = new Map<string, { count: number; resetAt: number }>();

function allowed(ip: string): boolean {
  const now = Date.now();
  if (seen.size > 5000) seen.clear();
  const entry = seen.get(ip);
  if (!entry || entry.resetAt < now) {
    seen.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= PER_WINDOW;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ output: FALLBACK }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ output: FALLBACK }, { status: 422 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowed(ip)) {
    return NextResponse.json(
      { output: "You've sent a lot of messages in a short time. Please try again in a few minutes, or send us a brief at softvoltai.com/contact." },
      { status: 429 },
    );
  }

  const { sessionId, message, history } = parsed.data;
  try {
    const output = await voltReply(history.slice(-16), message, sessionId);
    return NextResponse.json({ output: output || FALLBACK });
  } catch (err) {
    const known = err instanceof VoltUnavailableError;
    console.error("[volt] reply failed", known ? err.message : err);
    return NextResponse.json({ output: FALLBACK }, { status: known ? 503 : 502 });
  }
}
