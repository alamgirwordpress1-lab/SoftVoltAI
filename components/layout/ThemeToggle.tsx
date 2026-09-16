"use client";

import { useSyncExternalStore } from "react";
import { getTheme, setTheme, subscribeTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Light / dark switch. Both icons are rendered and CSS shows the right one
 * from html[data-theme], so the icon is correct before hydration too.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "light" as const);
  const dark = theme === "dark";
  const label = dark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn(
        "theme-toggle inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line-strong bg-surface text-ink transition-colors duration-150 hover:border-ink",
        className,
      )}
    >
      {/* moon: shown in the light theme */}
      <svg className="theme-icon-moon" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      {/* sun: shown in the dark theme */}
      <svg className="theme-icon-sun" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M10 2v1.8M10 16.2V18M2 10h1.8M16.2 10H18M4.35 4.35l1.27 1.27M14.38 14.38l1.27 1.27M4.35 15.65l1.27-1.27M14.38 5.62l1.27-1.27"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
