import { cn } from "@/lib/utils";

/** The voice agent's mark: a support headset with the live dot on its corner (it pulses faster while active). */
export function SupportIcon({ active = false }: { active?: boolean }) {
  return (
    <span className="volt-support-icon" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3.5 12v-2a6.5 6.5 0 0 1 13 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="2.5" y="11" width="3.5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="14" y="11" width="3.5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M15.75 16v.5a2 2 0 0 1-2 2H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className={cn("volt-orb", active && "is-active")} />
    </span>
  );
}
