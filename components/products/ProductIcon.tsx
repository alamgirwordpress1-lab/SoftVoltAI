import type { Product } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/**
 * Each product's icon, drawn on the same ink tile as the SoftVolt AI mark so
 * the products read as one family. Flat colours only: an icon shown in the
 * menu, a card and a banner at once needs no gradient ids to keep apart.
 */
export function ProductIcon({ icon, size = 48, className }: { icon: Product["icon"] | "placeholder"; size?: number; className?: string }) {
  if (icon === "placeholder") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={cn("shrink-0 text-line-strong", className)}>
        <rect x="3" y="3" width="58" height="58" rx="15" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
        <rect x="19" y="20" width="26" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M19 28h26M28 28v16" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    );
  }

  // voice-agent: a headset with a voice wave between the ear cups
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
