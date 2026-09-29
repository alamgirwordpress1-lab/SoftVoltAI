import Image from "next/image";
import type { Product } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/** Products whose icon is drawn here rather than uploaded. */
const DRAWN: Record<string, "voice-agent"> = { "softvolt-ai-voice-agent": "voice-agent" };

type IconProduct = Pick<Product, "slug" | "name" | "image">;

/**
 * A product's icon: the picture uploaded in WordPress (the Featured image);
 * without one, the icon drawn for it here, on the same ink tile as the
 * SoftVolt AI mark; without that, its initials on the tile. `placeholder` is
 * the dashed "coming soon" tile.
 */
export function ProductIcon({ product, size = 48, className }: { product: IconProduct | "placeholder"; size?: number; className?: string }) {
  if (product === "placeholder") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={cn("shrink-0 text-line-strong", className)}>
        <rect x="3" y="3" width="58" height="58" rx="15" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
        <rect x="19" y="20" width="26" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M19 28h26M28 28v16" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    );
  }

  if (product.image?.src) {
    return (
      <Image
        src={product.image.src}
        alt=""
        width={size}
        height={size}
        unoptimized={/\.svg($|\?)/i.test(product.image.src)}
        className={cn("shrink-0 rounded-[25%] object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  if (DRAWN[product.slug] === "voice-agent") {
    // a headset with a voice wave between the ear cups
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={cn("shrink-0", className)}>
        <rect x="2" y="2" width="60" height="60" rx="16" fill="#121614" />
        <rect x="2" y="2" width="60" height="60" rx="16" fill="none" className="logo-tile-edge" />
        <path d="M16.5 36v-5a15.5 15.5 0 0 1 31 0v5" fill="none" stroke="#65f545" strokeWidth="4" strokeLinecap="round" />
        <rect x="12.5" y="33" width="9" height="13" rx="4" fill="#65f545" />
        <rect x="42.5" y="33" width="9" height="13" rx="4" fill="#65f545" />
        <path d="M47 46v1.5a5 5 0 0 1-5 5h-6" fill="none" stroke="#65f545" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="33.5" cy="52.5" r="3" fill="#a6ff8a" />
        <path d="M27 37.5v5M32 34v12M37 37.5v5" stroke="#a6ff8a" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  const initials = product.name
    .split(/\s+/)
    .filter((w) => /^[a-z0-9]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={cn("shrink-0", className)}>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#121614" />
      <rect x="2" y="2" width="60" height="60" rx="16" fill="none" className="logo-tile-edge" />
      <text x="32" y="41" textAnchor="middle" fontSize="24" fontWeight="800" fill="#65f545" style={{ fontFamily: "var(--font-display), sans-serif" }}>
        {initials || "·"}
      </text>
    </svg>
  );
}
