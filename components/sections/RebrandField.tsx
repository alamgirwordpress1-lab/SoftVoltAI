"use client";

export const BRAND_PRESETS = ["#2b4c7e", "#b23a1f", "#6b3fa0", "#0f766e", "#c2410c"] as const;

export function RebrandField({
  name,
  color,
  onName,
  onColor,
  label = "Your agency name — try it",
  colourLabel = "Brand colour",
}: {
  name: string;
  color: string;
  onName: (v: string) => void;
  onColor: (v: string) => void;
  /** Both labels are written on the home page in WordPress. */
  label?: string;
  colourLabel?: string;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-end gap-3">
      <label className="flex min-w-[200px] flex-1 flex-col gap-1.5">
        <span className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{label}</span>
        <input
          id="hero-agency-name"
          type="text"
          value={name}
          maxLength={32}
          autoComplete="organization"
          spellCheck={false}
          onChange={(e) => onName(e.target.value)}
          className="h-11 rounded-md border border-line-strong bg-surface px-3 text-[15px] font-medium text-ink outline-none transition-colors focus:border-ink"
        />
      </label>
      <fieldset className="flex items-center gap-2">
        <legend className="mono mb-1.5 text-[11px] uppercase tracking-[0.1em] text-muted">{colourLabel}</legend>
        {BRAND_PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Use brand colour ${c}`}
            aria-pressed={color === c}
            onClick={() => onColor(c)}
            className="h-8 w-8 rounded-full border-2 transition-transform duration-150 hover:scale-110"
            style={{ background: c, borderColor: color === c ? "var(--color-ink)" : "transparent" }}
          />
        ))}
      </fieldset>
    </div>
  );
}
