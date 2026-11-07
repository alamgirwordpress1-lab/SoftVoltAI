/**
 * The facts row under the banner: a few numbers a visitor can check. Each
 * figure is either typed in WordPress or counted from the site's own content,
 * never a round number someone hoped was true.
 */
export function ProofStats({ stats }: { stats: { value: string; label: string }[] }) {
  const shown = stats.filter((s) => s.value && s.label);
  if (!shown.length) return null;
  return (
    <section id="proof" className="container-x py-10 md:py-14" aria-label="SoftVolt AI in numbers">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line md:grid-cols-4">
        {shown.map((s, i) => (
          <div key={s.label} className="flex flex-col-reverse bg-surface px-6 py-6 md:px-8 md:py-7" data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
            {/* label first for screen readers; the number is drawn on top */}
            <dt className="mt-2.5 text-[14px] leading-snug text-muted">{s.label}</dt>
            <dd className="display text-[40px] leading-none tracking-[-0.03em] text-ink md:text-[48px]">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
