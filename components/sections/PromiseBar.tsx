import type { Promise as SitePromise } from "@/lib/cms/types";

const ICONS: Record<string, React.ReactNode> = {
  nda: <path d="M6 3h7l4 4v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v4h4M8 12h6M8 15h4" />,
  "no-contact": (
    <path d="M3 3l16 16M9.9 5.1A9 9 0 0 1 20 11c-.6 1.2-1.4 2.3-2.3 3.2M6.6 6.6A9 9 0 0 0 2 11c2 3.9 5.5 6 9 6 1.3 0 2.5-.3 3.7-.8M9.2 9.2a3 3 0 0 0 4.2 4.2" />
  ),
  producer: <path d="M11 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-7 9a7 7 0 0 1 14 0M15 13l2 2 4-4" />,
  fixed: <path d="M4 4h7l9 9-7 7-9-9V4Zm3.5 3.5h.01M12 14l3-3" />,
  defects: <path d="M14.5 6.5a3.5 3.5 0 0 0-4.8 4.1L4 16.3V19h2.7l5.7-5.7a3.5 3.5 0 0 0 4.1-4.8l-2.3 2.3-1.8-1.8 2.1-2.5Z" />,
};

/**
 * Where most agency sites put a logo strip, we put commitments — a new
 * company has no client logos to show and should not pretend otherwise.
 * Styled like a logo strip: one full-width band of equal cells split by
 * hairlines, icon and label centred in each.
 */
export function PromiseBar({ promises }: { promises: SitePromise[] }) {
  return (
    <section id="commitments" aria-label="Our commitments" className="py-12 md:py-16">
      <ul className="grid grid-cols-1 gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {promises.map((p, i) => (
          <li
            key={p.id}
            data-reveal
            style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
            title={p.detail}
            className="group relative flex min-h-[112px] items-center justify-center gap-3 bg-surface px-6 py-8 text-center transition-colors duration-300 hover:bg-paper sm:last:col-span-2 lg:last:col-span-1"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 text-ink transition-[color,transform] duration-300 ease-[var(--ease-out-quint)] group-hover:scale-110 group-hover:text-accent"
            >
              {ICONS[p.id]}
            </svg>
            <span className="ui text-[13px] font-bold uppercase leading-snug tracking-[0.08em] text-ink">{p.label}</span>
            <span className="sr-only">— {p.detail}</span>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-x-100"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
