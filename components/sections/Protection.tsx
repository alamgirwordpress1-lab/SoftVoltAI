import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";

/** Agency protection, shown as the document it actually is: a contract, signed. */
export function Protection({
  clauses,
  /** The security page carries these same clauses, so it does not link to itself. */
  linkToSecurity = true,
}: {
  clauses: { title: string; body: string }[];
  linkToSecurity?: boolean;
}) {
  return (
    <section id="protection" className="section container-x" aria-labelledby="protection-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Agency protection"
            title={<span id="protection-title">Your client stays yours. In writing.</span>}
            lede="Most white-label sites mention an NDA once. These are the terms we work under on every project — the full text goes into your contract."
            layout="stack"
            aside={linkToSecurity ? <ArrowLink href="/security">How credentials and client data are handled</ArrowLink> : undefined}
          />
          <div className="draw card shadow-float relative mt-10 max-w-md overflow-hidden p-6" data-reveal aria-hidden="true">
            <div className="mono relative text-[11px] uppercase tracking-[0.1em] text-muted">Agency protection agreement · schedule A</div>
            <div className="relative mt-4 space-y-2">
              {[88, 72, 80, 60].map((w, i) => (
                <span key={i} className="block h-2 rounded bg-raised" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="relative mt-6 grid grid-cols-2 gap-6 border-t border-line pt-5">
              <div>
                <span className="mono block text-[10px] uppercase tracking-[0.1em] text-muted">Agency</span>
                <span className="mt-1 block h-2 w-3/4 rounded bg-raised" />
              </div>
              <div>
                <span className="mono block text-[10px] uppercase tracking-[0.1em] text-muted">SoftVolt AI</span>
                <svg viewBox="0 0 160 40" className="mt-1 h-8 w-32">
                  <path
                    d="M4 30 C 14 8, 22 8, 26 26 S 40 36, 48 18 S 62 6, 70 24 S 86 34, 96 16 S 112 6, 120 22 S 140 30, 156 12"
                    className="stroke-accent draw-path"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    pathLength={1}
                  />
                </svg>
              </div>
            </div>
            <span className="mono absolute right-6 top-[38%] rotate-[-8deg] rounded-md border-2 border-accent bg-surface/80 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-accent">
              Signed before the brief
            </span>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {clauses.map((c, i) => (
            <li
              key={c.title}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
              className="grid gap-2 border-t border-line py-6 last:border-b md:grid-cols-[56px_1fr] md:gap-6"
            >
              <span className="mono text-[12px] text-accent">§{i + 1}</span>
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">{c.title}</h3>
                <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-muted md:text-base">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
