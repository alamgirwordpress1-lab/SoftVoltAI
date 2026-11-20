import { NextResponse } from "next/server";
import { cms } from "@/lib/cms";

export const runtime = "nodejs";

/**
 * Can a case study's live site be shown inside our page? The "Live visit" viewer
 * asks before it frames a site: a site that sends X-Frame-Options DENY/SAMEORIGIN
 * or a CSP frame-ancestors list without us would only show the browser's
 * "refused to connect" page, so the viewer shows its screenshot instead.
 *
 * Only the live URLs of our own case studies are checked, so this is never an
 * open header-fetcher for any address on the internet.
 */
const normalise = (value: string) => {
  try {
    const u = new URL(value);
    return u.protocol === "https:" ? `${u.origin}${u.pathname.replace(/\/+$/, "")}` : null;
  } catch {
    return null;
  }
};

/** true = framing allowed, false = the site refuses to be framed by us. */
function frameAllowed(headers: Headers): boolean {
  // CSP frame-ancestors overrides X-Frame-Options in every current browser
  const csp = headers.get("content-security-policy") ?? "";
  const ancestors = /(?:^|;)\s*frame-ancestors\s+([^;]*)/i.exec(csp)?.[1]?.trim().toLowerCase();
  if (ancestors !== undefined) {
    const sources = ancestors.split(/\s+/);
    if (sources.includes("*") || sources.includes("https:")) return true;
    return sources.some((s) => /(^|\.)softvoltai\.com$/.test(s.replace(/^https?:\/\//, "").replace(/\/.*$/, "")));
  }
  const xfo = headers.get("x-frame-options")?.trim().toLowerCase();
  return !(xfo === "deny" || xfo === "sameorigin" || xfo?.startsWith("allow-from"));
}

export async function GET(req: Request) {
  const target = normalise(new URL(req.url).searchParams.get("url") ?? "");
  if (!target) return NextResponse.json({ ok: false, error: "Invalid url" }, { status: 400 });

  const work = await cms.getWork();
  if (!work.some((w) => w.url && normalise(w.url) === target)) {
    return NextResponse.json({ ok: false, error: "Not a case study" }, { status: 404 });
  }

  let embeddable: boolean | null = null;
  try {
    const res = await fetch(target, {
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; SoftVoltAI live preview check)" },
    });
    embeddable = frameAllowed(res.headers);
    await res.body?.cancel();
  } catch {
    // no answer (timeout, bot wall): the viewer simply tries the frame
    embeddable = null;
  }

  return NextResponse.json(
    { ok: true, embeddable },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
