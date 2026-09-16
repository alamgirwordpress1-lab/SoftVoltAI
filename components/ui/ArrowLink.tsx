import Link from "next/link";
import { cn } from "@/lib/utils";

/** Quiet pill link used beside section headings ("See all services →"). */
export function ArrowLink({ href, children, dark = false, className }: { href: string; children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "ui group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200",
        dark ? "border-er-line text-er-ink hover:border-volt" : "border-line-strong bg-surface text-ink hover:border-ink",
        className,
      )}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
