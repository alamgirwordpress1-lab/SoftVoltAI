import "server-only";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/**
 * The card a shared link unfolds into on Facebook, LinkedIn, X, WhatsApp and
 * Slack. Every route draws the same frame — the brand row, a small green line,
 * the page's own headline — so a link reads as SoftVolt AI before anyone opens
 * it. 1200×630 is the size all of them crop to without losing anything.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#0e1411";
const LINE = "#2a352f";
const VOLT = "#65f545";
const TEXT = "#f2f4f1";
const MUTED = "#9aa59e";

export interface ShareCard {
  /** The small green line above the headline. */
  eyebrow?: string;
  /** The headline. A list is set one entry per row, the last row in green — the home page's three lines. */
  title: string | string[];
  /** One or two lines under the headline. */
  subtitle?: string;
  /** A picture for the right-hand side: a case study's screenshot, a post's featured image. */
  image?: string | null;
}

type CardFont = { name: string; data: ArrayBuffer; weight: 600 | 800; style: "normal" };

// The card renderer reads TrueType, not the woff2 the site itself ships, so
// the same two families are asked of Google Fonts as plain TTF once per worker.
async function googleFont(family: string, weight: 600 | 800): Promise<CardFont | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return { name: family, data: await fetch(url).then((r) => r.arrayBuffer()), weight, style: "normal" };
  } catch {
    return null; // a card in the fallback face beats a failed build
  }
}

let fontList: Promise<CardFont[]> | undefined;
function fonts() {
  fontList ??= Promise.all([googleFont("Plus Jakarta Sans", 800), googleFont("Manrope", 600)]).then((list) => list.filter((f) => f !== null));
  return fontList;
}

/** A picture as a data URL, or null when it cannot be drawn — the renderer reads PNG and JPEG only. */
async function picture(src: string | null | undefined): Promise<string | null> {
  if (!src) return null;
  try {
    const res = await fetch(src.startsWith("/") ? `${site.url}${src}` : src, { signal: AbortSignal.timeout(8000) });
    const type = (res.headers.get("content-type") || "").split(";")[0];
    if (!res.ok || !/^image\/(png|jpeg)$/.test(type)) return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null; // no picture is better than no card
  }
}

/** Cuts at a word and adds an ellipsis, so a long headline never runs off the card. */
function clip(text: string, max: number) {
  const plain = text.replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).replace(/\s+\S*$/, "").replace(/[\s,;:—-]+$/, "")}…`;
}

/** The longer the headline, the smaller the type — two or three lines at most. */
function titleSize(chars: number, narrow: boolean, rows: number) {
  if (rows > 1) return narrow ? 52 : 76;
  if (narrow) return chars <= 28 ? 62 : chars <= 52 ? 52 : chars <= 80 ? 44 : 38;
  return chars <= 34 ? 80 : chars <= 64 ? 66 : chars <= 96 ? 56 : 46;
}

function Mark() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64">
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#1a211d" stroke={LINE} strokeWidth="1" />
      <path d="M35 9 17 35h12l-3 20 19-26H33l2-20Z" fill={VOLT} />
      <path d="M38 10.5h7" stroke={VOLT} strokeWidth="2" strokeLinecap="round" />
      <circle cx="49.5" cy="10.5" r="4" fill="#1a211d" stroke={VOLT} strokeWidth="2" />
      <circle cx="49.5" cy="10.5" r="1.5" fill={VOLT} />
    </svg>
  );
}

export async function shareCard({ eyebrow, title, subtitle, image }: ShareCard) {
  const [faces, photo] = await Promise.all([fonts(), picture(image)]);
  const rows = Array.isArray(title) ? title.map((line) => clip(line, 60)).filter(Boolean) : [clip(title, 120)];
  const narrow = photo !== null;
  const size = titleSize(rows.join(" ").length, narrow, rows.length);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          background: `radial-gradient(circle at 88% 8%, rgba(101,245,69,0.20), rgba(14,20,17,0) 46%), ${INK}`,
          color: TEXT,
          fontFamily: "Manrope",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Mark />
            <div style={{ display: "flex", fontFamily: "Plus Jakarta Sans", fontSize: 34, letterSpacing: -0.5 }}>
              SoftVolt<span style={{ color: VOLT, marginLeft: 9 }}>AI</span>
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: MUTED }}>softvoltai.com</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", width: narrow ? 600 : 1056 }}>
            {eyebrow ? (
              <div style={{ display: "flex", marginBottom: 22, fontSize: 22, color: VOLT, textTransform: "uppercase", letterSpacing: 3 }}>{clip(eyebrow, 58)}</div>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", fontFamily: "Plus Jakarta Sans", fontSize: size, lineHeight: 1.05, letterSpacing: -1.5 }}>
              {rows.map((row, i) => (
                <span key={i} style={{ color: rows.length > 1 && i === rows.length - 1 ? VOLT : TEXT }}>
                  {row}
                </span>
              ))}
            </div>
            {subtitle ? (
              <div style={{ display: "flex", marginTop: 26, fontSize: narrow ? 24 : 27, lineHeight: 1.35, color: MUTED }}>{clip(subtitle, narrow ? 120 : 170)}</div>
            ) : null}
          </div>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- the card renderer takes a plain <img>, not next/image
            <img src={photo} alt="" width={408} height={255} style={{ borderRadius: 18, border: `2px solid ${LINE}`, objectFit: "cover" }} />
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 56, height: 4, borderRadius: 2, background: VOLT }} />
          <div style={{ display: "flex", fontSize: 22, color: MUTED }}>{"White-label production & growth for agencies"}</div>
        </div>
      </div>
    ),
    // with no faces at all the renderer falls back to its own built-in one
    { ...OG_SIZE, fonts: faces.length ? faces : undefined },
  );
}
