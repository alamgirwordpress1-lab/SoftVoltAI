"use client";

import { cn } from "@/lib/utils";

/**
 * "Try the live demo": opens Power, the voice agent in this site's corner, so a
 * visitor can try the kind of agent the plugin puts on their own site. The page
 * only offers it where the agent runs (see the product page's agentLive).
 */
export function DemoButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("volt:open"))}
      className={cn(
        "ui inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-line-strong bg-surface px-5 py-3 text-[15px] font-semibold leading-tight text-ink transition-[background-color,border-color,color,transform] duration-200 ease-[var(--ease-hover)] hover:border-ink active:translate-y-px",
        className,
      )}
    >
      <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden="true">
        <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-accent/40 motion-reduce:animate-none" />
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {label}
    </button>
  );
}
