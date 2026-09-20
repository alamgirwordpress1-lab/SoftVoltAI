import { NextResponse } from "next/server";
import { briefSchema } from "@/lib/forms/brief-schema";
import { cf7FormId, sendToCf7 } from "@/lib/forms/cf7";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = briefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields", issues: parsed.error.issues }, { status: 422 });
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true }); // honeypot filled: pretend success, send nothing

  const lines = [
    `Work: ${data.workType} · ${data.platforms.join(", ")}`,
    `Budget: ${data.budget}`,
    `Deadline: ${data.deadline || "not given"}`,
    `Figma: ${data.figmaUrl || "—"}`,
    `Live URL: ${data.liveUrl || "—"}`,
    `NDA before details: ${data.nda ? "yes" : "no"}`,
    `From: ${data.name} · ${data.agency} · ${data.email} · ${data.timeZone || "tz unknown"}`,
    "",
    data.brief,
  ];
  const text = lines.join("\n");

  // WordPress first when it is configured: the same submission, delivered by CF7.
  if (cf7FormId("brief")) {
    const result = await sendToCf7("brief", { ...data, website: undefined });
    if (result.sent) return NextResponse.json({ ok: true, delivered: true, via: "cf7" });
    console.error("[brief] CF7 rejected the submission", result);
    return NextResponse.json({ ok: false, error: result.message || "We could not send that just now. Email us directly and we will reply within a business day." }, { status: 502 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BRIEF_TO_EMAIL;
  const from = process.env.BRIEF_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.info("[brief] RESEND_API_KEY not set — brief logged instead of emailed:\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Brief · ${data.agency} · ${data.workType} (${data.platforms[0]})`,
      text,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[brief] delivery failed", err);
    return NextResponse.json({ ok: false, error: "We could not send that just now. Email us directly and we will reply within a business day." }, { status: 502 });
  }
}
