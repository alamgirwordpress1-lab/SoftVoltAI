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
  // A submission it refuses as spam is the end of it; one it accepts but cannot
  // post — WordPress on a container with no mail server — falls through to
  // email below rather than losing a brief someone spent four steps writing.
  let cf7Reason = "";
  if (await cf7FormId("brief")) {
    const result = await sendToCf7("brief", { ...data, website: undefined, recaptcha: undefined }, data.recaptcha);
    if (result.sent) return NextResponse.json({ ok: true, delivered: true, via: "cf7" });
    cf7Reason = result.reason ?? "";
    console.error("[brief] CF7 did not send the submission", result);
    if (cf7Reason === "spam") {
      return NextResponse.json({ ok: false, reason: cf7Reason, error: result.message || "That did not go through. Please try again, or email us directly." }, { status: 403 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BRIEF_TO_EMAIL;
  const from = process.env.BRIEF_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.info("[brief] RESEND_API_KEY not set — brief logged instead of emailed:\n" + text);
    // Nothing delivered it, so do not say it sent. A live site always has
    // WordPress configured, so "nothing configured at all" only ever happens in
    // development, where logging it is the point.
    if (cf7Reason || process.env.WP_GRAPHQL_URL || process.env.CF7_BASE_URL) {
      return NextResponse.json(
        { ok: false, reason: cf7Reason || "no-delivery-configured", error: "We could not send that just now. Email us directly and we will reply within a business day." },
        { status: 502 },
      );
    }
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
    return NextResponse.json({ ok: true, delivered: true, via: cf7Reason ? "email-after-cf7" : "email" });
  } catch (err) {
    console.error("[brief] delivery failed", err);
    return NextResponse.json({ ok: false, error: "We could not send that just now. Email us directly and we will reply within a business day." }, { status: 502 });
  }
}
