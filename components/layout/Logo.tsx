import Image from "next/image";
import type { SiteLogo } from "@/lib/cms/site";
import { cn } from "@/lib/utils";

/**
 * SoftVolt AI mark: an ink tile, a volt bolt, and a spark gap to a signal
 * node at the bolt's tip — the charge (volt) meeting the signal (AI).
 * Pass a unique `id` per instance on a page so the gradient ids never collide.
 */
export function LogoMark({ size = 28, id = "lm", className }: { size?: number; id?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={cn("shrink-0", className)}>
      <defs>
        <linearGradient id={`${id}-volt`} x1="18" y1="10" x2="46" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a6ff8a" />
          <stop offset="0.5" stopColor="#65f545" />
          <stop offset="1" stopColor="#2fbf62" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.42" cy="0.52" r="0.6">
          <stop offset="0" stopColor="#65f545" stopOpacity="0.42" />
          <stop offset="1" stopColor="#65f545" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#121614" />
      <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#${id}-glow)`} className="logo-tile-edge" />
      <path d="M35 9 17 35h12l-3 20 19-26H33l2-20Z" fill={`url(#${id}-volt)`} />
      <path d="M38 10.5h7" stroke="#65f545" strokeWidth="2" strokeLinecap="round" />
      <circle cx="49.5" cy="10.5" r="4" fill="#121614" stroke="#65f545" strokeWidth="2" />
      <circle cx="49.5" cy="10.5" r="1.5" fill="#65f545" />
    </svg>
  );
}

/** The wordmark as it is drawn in the design: the second word carries the accent. */
function Wordmark({ name, dark }: { name: string; dark: boolean }) {
  const words = name.trim().split(/\s+/);
  const last = words.length > 1 ? words.pop() : "";
  return (
    <span className={cn("whitespace-nowrap font-display text-[19px] font-extrabold tracking-[-0.035em]", dark ? "text-er-ink" : "text-ink")}>
      {words.join(" ")}
      {last ? <span className={dark ? "text-volt" : "text-accent"}> {last}</span> : null}
    </span>
  );
}

/**
 * The brand, in the header and the footer. An editor who uploads a logo on the
 * Headless settings screen gets that picture instead of the built-in mark and
 * wordmark — unoptimised, because a logo is usually an SVG or a small PNG and
 * both should reach the page exactly as they were drawn.
 */
export function Logo({
  dark = false,
  className,
  id = "lm",
  name = "SoftVolt AI",
  image = null,
}: {
  dark?: boolean;
  className?: string;
  id?: string;
  /** The brand name from the settings screen. */
  name?: string;
  /** The uploaded logo, when there is one. */
  image?: SiteLogo | null;
}) {
  if (image?.src) {
    const height = 34;
    const width = image.width && image.height ? Math.round((image.width / image.height) * height) : height * 4;
    return (
      <span className={cn("inline-flex items-center", className)}>
        <Image src={image.src} alt={image.alt || name} width={width} height={height} unoptimized className="h-[34px] w-auto" priority />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={30} id={id} />
      <Wordmark name={name} dark={dark} />
    </span>
  );
}
