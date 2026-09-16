import type { SearchKind } from "@/lib/search/types";

type IconProps = { className?: string };

const stroke = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

export function SearchIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <circle cx="8.5" cy="8.5" r="5.75" {...stroke} strokeWidth={1.7} />
      <path d="m13 13 4.25 4.25" {...stroke} strokeWidth={1.7} />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" {...stroke} />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="7" {...stroke} />
      <path d="M10 6v4l2.5 2" {...stroke} />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="m5 5 10 10M15 5 5 15" {...stroke} strokeWidth={1.8} />
    </svg>
  );
}

const kindPaths: Record<SearchKind, React.ReactNode> = {
  service: (
    <>
      <rect x="3" y="3" width="6" height="6" rx="1.5" {...stroke} />
      <rect x="11" y="3" width="6" height="6" rx="1.5" {...stroke} />
      <rect x="3" y="11" width="6" height="6" rx="1.5" {...stroke} />
      <rect x="11" y="11" width="6" height="6" rx="1.5" {...stroke} />
    </>
  ),
  agency: (
    <>
      <rect x="2.75" y="6" width="14.5" height="10.5" rx="2" {...stroke} />
      <path d="M7 6V4.75A1.75 1.75 0 0 1 8.75 3h2.5A1.75 1.75 0 0 1 13 4.75V6M2.75 10.5h14.5" {...stroke} />
    </>
  ),
  work: (
    <>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" {...stroke} />
      <path d="M2.5 7.5h15" {...stroke} />
      <circle cx="5" cy="5.5" r=".6" fill="currentColor" />
      <circle cx="7" cy="5.5" r=".6" fill="currentColor" />
    </>
  ),
  page: (
    <>
      <path d="M5 2.75h6.5L15.5 7v9.25A1.75 1.75 0 0 1 13.75 18h-8.5A1.75 1.75 0 0 1 3.5 16.25V4.5A1.75 1.75 0 0 1 5 2.75Z" {...stroke} />
      <path d="M11.5 2.75V7h4M6.5 11h7M6.5 14h5" {...stroke} />
    </>
  ),
  faq: (
    <>
      <circle cx="10" cy="10" r="7.25" {...stroke} />
      <path d="M7.9 7.6a2.2 2.2 0 1 1 3.1 2c-.65.3-1 .8-1 1.5v.4" {...stroke} />
      <circle cx="10" cy="14.2" r=".85" fill="currentColor" />
    </>
  ),
};

export function KindIcon({ kind, className }: { kind: SearchKind } & IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className={className}>
      {kindPaths[kind]}
    </svg>
  );
}
