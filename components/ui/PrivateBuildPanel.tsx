/**
 * What a case study card shows when the client asked not to be named: no
 * screenshot (it would carry their brand) and no address, just the kind of
 * build and who it was for, in words they have agreed to.
 */

/** Shown in the address bar of a card whose client is not named. */
export const PRIVATE_URL_LABEL = "Client name withheld at their request";

/** "https://www.example.com/" → "www.example.com" */
export const siteHost = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export function PrivateBuildPanel({ category, client, stack, large = false }: { category: string; client: string; stack: string[]; large?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-end gap-3 overflow-hidden bg-raised p-6 md:p-8"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
        backgroundSize: large ? "64px 64px" : "40px 40px",
      }}
    >
      <span className="eyebrow">{category}</span>
      <span className={large ? "display display-md text-ink" : "ui text-xl font-bold leading-snug text-ink"}>{client}</span>
      {stack.length ? (
        <span className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{stack.slice(0, 3).join(" · ")}</span>
      ) : null}
    </div>
  );
}
