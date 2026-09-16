"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { briefSchema, WORK_TYPES, PLATFORMS, BUDGETS, type BriefInput } from "@/lib/forms/brief-schema";
import { SubmitButton } from "@/components/ui/Button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const STEPS: { title: string; fields: FieldPath<BriefInput>[] }[] = [
  { title: "What kind of work", fields: ["workType", "platforms"] },
  { title: "What exists already", fields: ["figmaUrl", "liveUrl", "brief"] },
  { title: "Timing and budget", fields: ["deadline", "budget"] },
  { title: "Where to send the scope", fields: ["name", "agency", "email", "nda", "consent"] },
];

const chip = (on: boolean) =>
  cn(
    "cursor-pointer rounded-md border px-3.5 py-2 text-[14px] font-medium transition-colors duration-150",
    on ? "border-ink bg-ink text-paper" : "border-line-strong bg-surface text-ink hover:border-ink",
  );
const input =
  "w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink aria-[invalid=true]:border-danger";
const label = "mono mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-muted";

export function BriefForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const form = useForm<BriefInput>({
    resolver: zodResolver(briefSchema),
    mode: "onTouched",
    defaultValues: { platforms: [], nda: true, consent: false as unknown as true, brief: "", figmaUrl: "", liveUrl: "", deadline: "", timeZone: "", website: "" },
  });
  const { register, handleSubmit, trigger, setValue, control, formState } = form;
  const { errors } = formState;

  useEffect(() => {
    try {
      setValue("timeZone", Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {}
  }, [setValue]);

  const workType = useWatch({ control, name: "workType" });
  const platforms = useWatch({ control, name: "platforms" });
  const budget = useWatch({ control, name: "budget" });

  const next = async () => {
    const ok = await trigger(STEPS[step].fields, { shouldFocus: true });
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = handleSubmit(async (data) => {
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/brief", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  });

  if (status === "sent") {
    return (
      <div className="card p-8 md:p-10" role="status">
        <span className="eyebrow">Brief received</span>
        <h3 className="display display-md mt-4">Thank you. You will hear from a named producer within one business day.</h3>
        <p className="mt-4 max-w-[56ch] text-muted">
          The scope and fixed price follow within two business days. If you asked for the NDA first, it arrives before any client
          detail is discussed.
        </p>
        {site.calUrl ? (
          <a href={site.calUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-ink underline underline-offset-4">
            Want to talk it through sooner? Book the 20-minute scoping call ↗
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card shadow-float p-6 md:p-8" aria-labelledby="brief-form-title">
      <div className="flex items-center justify-between gap-4">
        <h3 id="brief-form-title" className="text-lg font-semibold text-ink">
          {STEPS[step].title}
        </h3>
        <span className="mono text-[12px] uppercase tracking-[0.1em] text-muted">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span key={s.title} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i <= step ? "bg-accent" : "bg-raised")} />
        ))}
      </div>

      {/* step 1 */}
      <fieldset hidden={step !== 0} className="mt-7 space-y-6">
        <div>
          <span className={label}>Kind of work</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Kind of work">
            {WORK_TYPES.map((w) => (
              <label key={w} className={chip(workType === w)}>
                <input type="radio" value={w} {...register("workType")} className="sr-only" />
                {w}
              </label>
            ))}
          </div>
          <FieldError msg={errors.workType?.message} />
        </div>
        <div>
          <span className={label}>Platform — pick any that apply</span>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <label key={p} className={chip(platforms?.includes(p))}>
                <input type="checkbox" value={p} {...register("platforms")} className="sr-only" />
                {p}
              </label>
            ))}
          </div>
          <FieldError msg={errors.platforms?.message} />
        </div>
      </fieldset>

      {/* step 2 */}
      <fieldset hidden={step !== 1} className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="brief-figma" className={label}>
              Figma URL (optional)
            </label>
            <input id="brief-figma" type="url" placeholder="https://www.figma.com/…" {...register("figmaUrl")} aria-invalid={!!errors.figmaUrl} className={input} />
            <FieldError msg={errors.figmaUrl?.message} />
          </div>
          <div>
            <label htmlFor="brief-live" className={label}>
              Live or staging URL (optional)
            </label>
            <input id="brief-live" type="url" placeholder="https://" {...register("liveUrl")} aria-invalid={!!errors.liveUrl} className={input} />
            <FieldError msg={errors.liveUrl?.message} />
          </div>
        </div>
        <div>
          <label htmlFor="brief-text" className={label}>
            The brief, in your words
          </label>
          <textarea
            id="brief-text"
            rows={6}
            placeholder="What the client needs, what exists today, what 'done' looks like. Client names can wait until the NDA."
            {...register("brief")}
            aria-invalid={!!errors.brief}
            className={input}
          />
          <FieldError msg={errors.brief?.message} />
        </div>
      </fieldset>

      {/* step 3 */}
      <fieldset hidden={step !== 2} className="mt-7 space-y-6">
        <div>
          <label htmlFor="brief-deadline" className={label}>
            Deadline (a date, or &quot;flexible&quot;)
          </label>
          <input id="brief-deadline" type="text" placeholder="e.g. client launch 24 October, or flexible" {...register("deadline")} className={input} />
        </div>
        <div>
          <span className={label}>Budget range</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Budget range">
            {BUDGETS.map((b) => (
              <label key={b} className={chip(budget === b)}>
                <input type="radio" value={b} {...register("budget")} className="sr-only" />
                {b}
              </label>
            ))}
          </div>
          <FieldError msg={errors.budget?.message} />
        </div>
      </fieldset>

      {/* step 4 */}
      <fieldset hidden={step !== 3} className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="brief-name" className={label}>
              Your name
            </label>
            <input id="brief-name" type="text" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} className={input} />
            <FieldError msg={errors.name?.message} />
          </div>
          <div>
            <label htmlFor="brief-agency" className={label}>
              Agency
            </label>
            <input id="brief-agency" type="text" autoComplete="organization" {...register("agency")} aria-invalid={!!errors.agency} className={input} />
            <FieldError msg={errors.agency?.message} />
          </div>
        </div>
        <div>
          <label htmlFor="brief-email" className={label}>
            Work email
          </label>
          <input id="brief-email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} className={input} />
          <FieldError msg={errors.email?.message} />
        </div>
        <input type="hidden" {...register("timeZone")} />
        <div className="hidden" aria-hidden="true">
          <label htmlFor="brief-website">Website</label>
          <input id="brief-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>
        <label className="flex items-start gap-3 text-[15px] text-ink">
          <input id="brief-nda" type="checkbox" {...register("nda")} className="mt-1 h-4 w-4 accent-accent" />
          Send me your mutual NDA before I share client details
        </label>
        <label className="flex items-start gap-3 text-[15px] text-ink">
          <input id="brief-consent" type="checkbox" {...register("consent")} aria-invalid={!!errors.consent} className="mt-1 h-4 w-4 accent-accent" />
          <span>
            You may use these details to reply about this brief. Nothing else, no newsletter.
            <FieldError msg={errors.consent?.message} />
          </span>
        </label>
      </fieldset>

      {status === "error" ? (
        <p role="alert" className="mt-5 rounded-md bg-danger-bg px-3 py-2 text-[14px] text-danger-fg">
          {serverError} — or email <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-md border border-line-strong px-5 py-3 text-[15px] font-medium text-ink hover:border-ink">
            Back
          </button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-paper hover:bg-ink-hover">
            Continue
          </button>
        ) : (
          <SubmitButton disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send the brief"}</SubmitButton>
        )}
        <p className="mono text-[11px] uppercase tracking-[0.08em] text-muted">Reply within 1 business day</p>
      </div>
    </form>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? (
    <p className="mt-1.5 text-[13px] text-danger-fg" role="alert">
      {msg}
    </p>
  ) : null;
}
