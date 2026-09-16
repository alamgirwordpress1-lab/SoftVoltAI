import { LogoMark } from "@/components/layout/Logo";
import "./page-hero.css";

export interface PageHighlight {
  label: string;
  value: string;
}

/**
 * The right-hand side of an inner-page banner: the brand mark inside two orbit
 * rings, echoing the homepage globe, with up to three facts about the page
 * floating around it. Every fact comes from the page's own content.
 */
export function PageHeroVisual({ highlights }: { highlights: PageHighlight[] }) {
  return (
    <div className="phv">
      <span className="phv-orbit phv-orbit-outer" aria-hidden="true" />
      <span className="phv-orbit phv-orbit-inner" aria-hidden="true" />
      <span className="phv-glow" aria-hidden="true" />
      <span className="phv-emblem" aria-hidden="true">
        <LogoMark size={64} id="page-hero-mark" />
      </span>
      <ul className="phv-cards" aria-label="At a glance">
        {highlights.slice(0, 3).map((h, i) => (
          <li key={h.label} className={`phv-card phv-card-${i + 1}`}>
            <span className="phv-card-label">{h.label}</span>
            <span className="phv-card-value">{h.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
