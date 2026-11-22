"use client";

import { useEffect, useState } from "react";
import Link from "@/components/ui/Link";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { briefSchema, WORK_TYPES, PLATFORMS, BUDGETS, type BriefInput } from "@/lib/forms/brief-schema";
import { SubmitButton } from "@/components/ui/Button";
import { site } from "@/content/site";
import type { BriefFormCopy } from "@/lib/cms/copy-types";
import { loadRecaptchaOnInteraction, recaptchaToken } from "@/lib/forms/recaptcha";
import { RecaptchaNotice } from "@/components/ui/RecaptchaNotice";
import { cn } from "@/lib/utils";

/**
 * The quote form: four short steps, so a visitor answers one kind of question
 * at a time. Big cards for the kind of work and the budget, the platforms that
 * fit the work shown first, quick picks for timing, and a summary of every
 * answer before it is sent. The words come from WordPress (the "Brief form"
 * fields); the options are the schema's, so the form and /api/brief agree.
 */

const STEPS: { title: string; fields: FieldPath<BriefInput>[] }[] = [
  { title: "What kind of work", fields: ["workType", "platforms"] },
  { title: "What exists already", fields: ["figmaUrl", "liveUrl", "brief"] },
  { title: "Timing and budget", fields: ["deadline", "budget"] },
  { title: "Where to send the scope", fields: ["name", "agency", "email", "nda", "consent"] },
];

type Work = (typeof WORK_TYPES)[number];
type Platform = (typeof PLATFORMS)[number];

/** What each kind of work means, in a few words, with its own small drawing. */
const WORK: Record<Work, { note: string; icon: React.ReactNode }> = {
  Build: {
    note: "A website, online store or web app",
    icon: <path d="M4 6h16v12H4zM4 9h16M8 13h5" />,
  },
  Automate: {
    note: "AI agents, chatbots and workflows",
    icon: <path d="M12 3v3M12 18v3M3 12h3M18 12h3M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />,
  },
  Grow: {
    note: "SEO, Google Ads and Meta Ads",
    icon: <path d="M4 18l5-5 4 3 7-8M15 8h5v5" />,
  },
  Support: {
    note: "Care plans, fixes, speed and migration",
    icon: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4" />,
  },
};

/** The platforms that usually go with each kind of work; the rest sit behind "More options". */
const SUGGESTED: Record<Work, Platform[]> = {
  Build: ["WordPress", "WooCommerce", "Elementor", "Headless + Next.js", "Shopify", "Webflow", "Laravel"],
  Automate: ["AI automation", "Next.js app + PostgreSQL", "WordPress plugin", "Analytics & tracking"],
  Grow: ["SEO", "Google Ads", "Meta Ads", "Analytics & tracking"],
  Support: ["Maintenance & care plan", "Migration", "WordPress", "WooCommerce"],
};

const BUDGET_NOTE: Partial<Record<(typeof BUDGETS)[number], string>> = {
  "Under $1,500": "A fix, a landing page or a small site",
  "$1,500–5k": "A business website or a first store",
  "$5k–15k": "A larger site, store or custom build",
  "$15k+": "An app, a platform or a big rebuild",
  "Monthly plan": "Ongoing work every month",
  "Not sure yet": "We'll suggest options in the scope",
};

const WHEN = ["As soon as possible", "Within a month", "In 1–3 months", "No fixed date"];

const tile = (on: boolean) =>
  cn(
    "group relative flex cursor-pointer flex-col rounded-xl border bg-surface p-4 text-left transition-[border-color,box-shadow,background-color] duration-150",
    on ? "border-accent bg-accent-soft shadow-[0_0_0_1px_var(--color-accent)]" : "border-line-strong hover:border-ink",
  );
const chip = (on: boolean) =>
  cn(
    "cursor-pointer rounded-full border px-3.5 py-2 text-[14px] font-medium transition-colors duration-150",
    on ? "border-accent bg-accent text-white" : "border-line-strong bg-surface text-ink hover:border-ink",
  );
const input =
  "w-full rounded-lg border border-line-strong bg-surface px-3.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] aria-[invalid=true]:border-danger";
const label = "mono mb-2 block text-[11px] uppercase tracking-[0.1em] text-muted";

function Tick({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border text-[11px] transition-colors",
        on ? "border-accent bg-accent text-white" : "border-line-strong text-transparent",
      )}
    >
      ✓
    </span>
  );
}

export function BriefForm({
  copy,
  recaptchaKey = "",
}: {
  copy: BriefFormCopy;
  /** From WordPress: empty when reCAPTCHA is off. */ recaptchaKey?: string;
}) {
  const router = useRouter();
  const steps = STEPS.map((step, i) => ({ ...step, title: copy.steps[i]?.title || step.title }));
  const [step, setStep] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const form = useForm<BriefInput>({
    resolver: zodResolver(briefSchema),
    mode: "onTouched",
    defaultValues: {
      platforms: [],
      nda: true,
      consent: false as unknown as true,
      brief: "",
      figmaUrl: "",
      liveUrl: "",
      deadline: "",
      timeZone: "",
      website: "",
    },
  });
  const { register, handleSubmit, trigger, setValue, control, formState } = form;
  const { errors } = formState;

  useEffect(() => {
    try {
      setValue("timeZone", Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {}
  }, [setValue]);

  // "I want this design" lands here as ?design=Name: start the brief for them
  useEffect(() => {
    const design = new URLSearchParams(window.location.search)
      .get("design")
      ?.replace(/[^\p{L}\p{N} &'’.,()-]/gu, "")
      .trim()
      .slice(0, 80);
    if (!design) return;
    setValue("workType", "Build");
    setValue(
      "brief",
      `I like the "${design}" design from your portfolio and would like a website based on it.\n\nWhat the site is for: \nPages or features I need: `,
    );
  }, [setValue]);

  // fetched at the visitor's first interaction, so the token costs nothing at submit time
  useEffect(() => loadRecaptchaOnInteraction(recaptchaKey), [recaptchaKey]);

  const workType = useWatch({ control, name: "workType" });
  const platforms = useWatch({ control, name: "platforms" }) ?? [];
  const budget = useWatch({ control, name: "budget" });
  const deadline = useWatch({ control, name: "deadline" });
  const name = useWatch({ control, name: "name" });

  const suggested = workType ? SUGGESTED[workType] : [];
  const rest = PLATFORMS.filter((p) => !suggested.includes(p));
  // a platform already ticked stays visible even when it is not a suggestion
  const visible = showAll || !workType ? PLATFORMS : [...suggested, ...rest.filter((p) => platforms.includes(p)), "Other" as Platform].filter((p, i, a) => a.indexOf(p) === i);

  const next = async () => {
    const ok = await trigger(STEPS[step].fields, { shouldFocus: true });
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = handleSubmit(async (data) => {
    setStatus("sending");
    setServerError("");
    try {
      const recaptcha = await recaptchaToken(recaptchaKey, "brief");
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptcha }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      setStatus("sent");
      // its own address, so an ads or analytics tool can count a sent brief as a conversion
      router.push("/thank-you/brief");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  });

  if (status === "sent") {
    return (
      <div className="card shadow-float p-8 md:p-10" role="status">
        <span className="eyebrow">{copy.sent_eyebrow}</span>
        <h3 className="display display-md mt-4">{copy.sent_heading}</h3>
        <p className="mt-4 max-w-[56ch] text-muted">{copy.sent_lede}</p>
        {site.calUrl ? (
          <a href={site.calUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-ink underline underline-offset-4">
            {copy.sent_call}
          </a>
        ) : null}
      </div>
    );
  }

  const summary = [workType, platforms.slice(0, 3).join(", ") + (platforms.length > 3 ? ` +${platforms.length - 3}` : ""), deadline, budget].filter(Boolean);

  return (
    <form onSubmit={onSubmit} noValidate className="card shadow-float overflow-hidden p-0" aria-labelledby="brief-form-title">
      {/* the steps, numbered: done ones ticked, the current one highlighted */}
      <ol className="grid grid-cols-4 border-b border-line bg-paper" aria-label="Steps">
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className={cn("flex w-full items-center gap-2.5 px-3 py-3.5 text-left md:px-5", i < step ? "cursor-pointer" : "cursor-default")}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-bold transition-colors",
                  i < step ? "bg-accent text-white" : i === step ? "bg-ink text-paper" : "border border-line-strong text-muted",
                )}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className={cn("hidden text-[13px] font-semibold leading-tight lg:block", i === step ? "text-ink" : "text-muted")}>{s.title}</span>
            </button>
            <span className={cn("absolute inset-x-0 bottom-0 h-0.5 transition-colors", i <= step ? "bg-accent" : "bg-transparent")} aria-hidden="true" />
          </li>
        ))}
      </ol>

      <div className="p-6 md:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <h3 id="brief-form-title" className="text-xl font-semibold text-ink">
            {steps[step].title}
          </h3>
          <span className="mono text-[12px] uppercase tracking-[0.1em] text-muted">
            {copy.step_counter.replace("{step}", String(step + 1)).replace("{total}", String(steps.length))}
          </span>
        </div>

        {/* step 1 */}
        <fieldset hidden={step !== 0} className="mt-6 space-y-7">
          <div>
            <span className={label}>{copy.work_label}</span>
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Kind of work">
              {WORK_TYPES.map((w) => (
                <label key={w} className={tile(workType === w)}>
                  <input type="radio" value={w} {...register("workType")} className="sr-only" />
                  <Tick on={workType === w} />
                  <svg viewBox="0 0 24 24" className={cn("h-7 w-7 fill-none stroke-[1.7]", workType === w ? "stroke-accent" : "stroke-ink")} aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
                    {WORK[w].icon}
                  </svg>
                  <span className="mt-3 text-[16px] font-bold text-ink">{w}</span>
                  <span className="mt-0.5 text-[13.5px] leading-snug text-muted">{WORK[w].note}</span>
                </label>
              ))}
            </div>
            <FieldError msg={errors.workType?.message} />
          </div>
          <div>
            <span className={label}>
              {copy.platform_label}
              {workType ? <span className="ml-2 normal-case tracking-normal text-accent">· suggested for {workType}</span> : null}
            </span>
            <div className="flex flex-wrap gap-2">
              {visible.map((p) => (
                <label key={p} className={chip(platforms.includes(p))}>
                  <input type="checkbox" value={p} {...register("platforms")} className="sr-only" />
                  {platforms.includes(p) ? "✓ " : ""}
                  {p}
                </label>
              ))}
              {workType && !showAll ? (
                <button type="button" onClick={() => setShowAll(true)} className="rounded-full border border-dashed border-line-strong px-3.5 py-2 text-[14px] font-medium text-muted hover:border-ink hover:text-ink">
                  + More options
                </button>
              ) : null}
            </div>
            <FieldError msg={errors.platforms?.message} />
          </div>
        </fieldset>

        {/* step 2 */}
        <fieldset hidden={step !== 1} className="mt-6 space-y-5">
          <div>
            <label htmlFor="brief-text" className={label}>
              {copy.brief_label}
            </label>
            <textarea id="brief-text" rows={7} placeholder={copy.brief_placeholder} {...register("brief")} aria-invalid={!!errors.brief} className={cn(input, "resize-y leading-relaxed")} />
            <FieldError msg={errors.brief?.message} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="brief-figma" className={label}>
                {copy.figma_label}
              </label>
              <input id="brief-figma" type="url" placeholder={copy.figma_placeholder} {...register("figmaUrl")} aria-invalid={!!errors.figmaUrl} className={input} />
              <FieldError msg={errors.figmaUrl?.message} />
            </div>
            <div>
              <label htmlFor="brief-live" className={label}>
                {copy.live_label}
              </label>
              <input id="brief-live" type="url" placeholder={copy.live_placeholder} {...register("liveUrl")} aria-invalid={!!errors.liveUrl} className={input} />
              <FieldError msg={errors.liveUrl?.message} />
            </div>
          </div>
          <p className="rounded-lg bg-paper px-4 py-3 text-[13.5px] leading-relaxed text-muted">
            No design or site yet? Leave the links empty. A few lines on what the business does and what the site must do is enough to price it.
          </p>
        </fieldset>

        {/* step 3 */}
        <fieldset hidden={step !== 2} className="mt-6 space-y-7">
          <div>
            <label htmlFor="brief-deadline" className={label}>
              {copy.deadline_label}
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {WHEN.map((w) => (
                <button key={w} type="button" onClick={() => setValue("deadline", w, { shouldDirty: true })} className={chip(deadline === w)} aria-pressed={deadline === w}>
                  {w}
                </button>
              ))}
            </div>
            <input id="brief-deadline" type="text" placeholder={copy.deadline_placeholder} {...register("deadline")} className={input} />
          </div>
          <div>
            <span className={label}>{copy.budget_label}</span>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Budget range">
              {BUDGETS.map((b) => (
                <label key={b} className={tile(budget === b)}>
                  <input type="radio" value={b} {...register("budget")} className="sr-only" />
                  <Tick on={budget === b} />
                  <span className="pr-6 text-[16px] font-bold text-ink">{b}</span>
                  {BUDGET_NOTE[b] ? <span className="mt-1 text-[13px] leading-snug text-muted">{BUDGET_NOTE[b]}</span> : null}
                </label>
              ))}
            </div>
            <FieldError msg={errors.budget?.message} />
          </div>
        </fieldset>

        {/* step 4 */}
        <fieldset hidden={step !== 3} className="mt-6 space-y-5">
          {summary.length ? (
            <div className="rounded-lg border border-line bg-paper px-4 py-3">
              <span className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Your brief so far</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {summary.map((s) => (
                  <span key={s} className="rounded-full bg-accent-soft px-3 py-1 text-[13px] font-semibold text-ink">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="brief-name" className={label}>
                {copy.name_label}
              </label>
              <input id="brief-name" type="text" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} className={input} />
              <FieldError msg={errors.name?.message} />
            </div>
            <div>
              <label htmlFor="brief-agency" className={label}>
                {copy.agency_label}
              </label>
              <input id="brief-agency" type="text" autoComplete="organization" {...register("agency")} aria-invalid={!!errors.agency} className={input} />
              <FieldError msg={errors.agency?.message} />
            </div>
          </div>
          <div>
            <label htmlFor="brief-email" className={label}>
              {copy.email_label}
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
            <input id="brief-nda" type="checkbox" {...register("nda")} className="mt-1 h-4 w-4 accent-[var(--color-accent)]" />
            {copy.nda_label}
          </label>
          <label className="flex items-start gap-3 text-[15px] text-ink">
            <input id="brief-consent" type="checkbox" {...register("consent")} aria-invalid={!!errors.consent} className="mt-1 h-4 w-4 accent-[var(--color-accent)]" />
            <span>
              {copy.consent_label}
              {copy.privacy_link ? (
                <>
                  {" — "}
                  <Link href={site.privacyPath} target="_blank" className="underline decoration-line underline-offset-4 hover:decoration-accent">
                    {copy.privacy_link}
                  </Link>
                </>
              ) : null}
              .
              <FieldError msg={errors.consent?.message} />
            </span>
          </label>
        </fieldset>

        {status === "error" ? (
          <p role="alert" className="mt-5 rounded-md bg-danger-bg px-3 py-2 text-[14px] text-danger-fg">
            {serverError} — or email{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            .
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-lg border border-line-strong px-5 py-3 text-[15px] font-medium text-ink hover:border-ink">
              ← {copy.back}
            </button>
          ) : null}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="rounded-lg bg-accent px-6 py-3 text-[15px] font-semibold text-white transition-[filter] hover:brightness-110">
              {copy.next} →
            </button>
          ) : (
            <SubmitButton disabled={status === "sending"}>{status === "sending" ? copy.sending : name ? `${copy.submit}, ${name.split(" ")[0]}` : copy.submit}</SubmitButton>
          )}
          <p className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.reply_note}</p>
        </div>
        {recaptchaKey ? <RecaptchaNotice className="mt-4" /> : null}
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
