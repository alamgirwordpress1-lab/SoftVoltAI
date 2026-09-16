import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * One button style across the whole site: a solid ink button and its outline
 * partner. On dark sections the pair inverts (white solid, light outline) so
 * the shape, size and weight stay identical.
 */
type Variant = "primary" | "secondary" | "onDark" | "outlineDark" | "ghost";

const base =
  "ui inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 py-3 text-[15px] font-semibold leading-tight transition-[background-color,border-color,color,transform] duration-200 ease-[var(--ease-hover)] active:translate-y-px";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-hover",
  secondary: "border border-line-strong bg-surface text-ink hover:border-ink",
  onDark: "bg-paper text-ink hover:bg-white",
  outlineDark: "border border-er-line bg-transparent text-er-ink hover:border-volt",
  ghost: "text-ink underline decoration-1 underline-offset-4 hover:decoration-2",
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </Link>
  );
}

export function SubmitButton({
  variant = "primary",
  className,
  children,
  ...rest
}: { variant?: Variant; className?: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="submit" className={cn(base, variants[variant], "disabled:cursor-wait disabled:opacity-60", className)} {...rest}>
      {children}
    </button>
  );
}
