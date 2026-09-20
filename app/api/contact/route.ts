import { NextResponse } from "next/server";
import { cf7FormId, sendToCf7 } from "@/lib/forms/cf7";
import { contactSchema } from "@/lib/forms/contact-schema";

export const runtime = "nodejs";

/** The short message form. The four-step brief posts to /api/brief instead. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields", issues: parsed.error.issues }, { status: 422 });
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true }); // honeypot filled: pretend success, send nothing

  const text = [
    `About: ${data.topic}`,
    `Budget: ${data.budget ?? "not given"}`,
    `NDA first: ${data.nda ? "yes" : "no"}`,
    `From: ${data.name}${data.company ? ` · ${data.company}` : ""} · ${data.email}${data.phone ? ` · ${data.phone}` : ""}`,
    "",
    data.message,
  ].join("\n");

  // WordPress first when it is configured: the same submission, delivered by CF7.
  if (await cf7FormId("contact")) {
    const result = await sendToCf7("contact", { ...data, website: undefined });
    if (result.sent) return NextResponse.json({ ok: true, delivered: true, via: "cf7" });
    console.error("[contact] CF7 rejected the submission", result);
    return NextResponse.json({ ok: false, error: result.message || "We could not send that just now. Email us directly and we will reply within a business day." }, { status: 502 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BRIEF_TO_EMAIL;
  const from = process.env.BRIEF_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.info("[contact] RESEND_API_KEY not set — message logged instead of emailed:\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Message · ${data.name}${data.company ? ` · ${data.company}` : ""} · ${data.topic}`,
      text,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return NextResponse.json({ ok: false, error: "We could not send that just now. Email us directly and we will reply within a business day." }, { status: 502 });
  }
}
