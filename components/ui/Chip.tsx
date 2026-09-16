import { cn } from "@/lib/utils";

export function Chip({ children, tone = "paper", className }: { children: React.ReactNode; tone?: "paper" | "dark" | "ok" | "volt"; className?: string }) {
  const tones = {
    paper: "border-line bg-surface text-muted",
    dark: "border-er-line bg-er-surface text-er-muted",
    ok: "border-transparent bg-ok-bg text-ok-fg",
    volt: "border-transparent bg-volt text-er-bg",
  } as const;
  return (
    <span className={cn("mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.08em]", tones[tone], className)}>
      {children}
    </span>
  );
}
