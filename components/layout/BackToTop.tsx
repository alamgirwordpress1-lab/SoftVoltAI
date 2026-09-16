"use client";

import { scrollToTop } from "@/components/motion/MotionRoot";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="ui group grid h-10 w-10 place-items-center rounded-full border border-er-line text-er-ink transition-colors duration-200 hover:border-volt hover:text-volt"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 12 12"
        aria-hidden="true"
        className="transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5"
      >
        <path d="M6 10V2m0 0L2.5 5.5M6 2l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
