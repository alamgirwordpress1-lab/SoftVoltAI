"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { briefSchema, WORK_TYPES, PLATFORMS, BUDGETS, type BriefInput } from "@/lib/forms/brief-schema";
import { SubmitButton } from "@/components/ui/Button";
import { site } from "@/content/site";
import type { BriefFormCopy } from "@/lib/cms/copy-types";
import { loadRecaptcha, recaptchaToken } from "@/lib/forms/recaptcha";
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

export function BriefForm({ copy, recaptchaKey = "" }: { copy: BriefFormCopy; /** From WordPress: empty when reCAPTCHA is off. */ recaptchaKey?: string }) {
  const router = useRouter();
  const steps = STEPS.map((step, i) => ({ ...step, title: copy.steps[i]?.title || step.title }));
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

  // fetched as the form appears, so the token costs nothing at submit time
  useEffect(() => {
    if (recaptchaKey) loadRecaptcha(recaptchaKey).catch(() => {});
  }, [recaptchaKey]);

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
      const recaptcha = await recaptchaToken(recaptchaKey, "brief");
      const res = await fetch("/api/brief", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, recaptcha }) });
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
      <div className="card p-8 md:p-10" role="status">
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

  return (
    <form onSubmit={onSubmit} noValidate className="card shadow-float p-6 md:p-8" aria-labelledby="brief-form-title">
      <div className="flex items-center justify-between gap-4">
        <h3 id="brief-form-title" className="text-lg font-semibold text-ink">
          {steps[step].title}
        </h3>
        <span className="mono text-[12px] uppercase tracking-[0.1em] text-muted">
          {copy.step_counter.replace("{step}", String(step + 1)).replace("{total}", String(steps.length))}
        </span>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {steps.map((s, i) => (
          <span key={s.title} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i <= step ? "bg-accent" : "bg-raised")} />
        ))}
      </div>

      {/* step 1 */}
      <fieldset hidden={step !== 0} className="mt-7 space-y-6">
        <div>
          <span className={label}>{copy.work_label}</span>
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
          <span className={label}>{copy.platform_label}</span>
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
        <div>
          <label htmlFor="brief-text" className={label}>
            {copy.brief_label}
          </label>
          <textarea
            id="brief-text"
            rows={6}
            placeholder={copy.brief_placeholder}
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
            {copy.deadline_label}
          </label>
          <input id="brief-deadline" type="text" placeholder={copy.deadline_placeholder} {...register("deadline")} className={input} />
        </div>
        <div>
          <span className={label}>{copy.budget_label}</span>
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
          <input id="brief-nda" type="checkbox" {...register("nda")} className="mt-1 h-4 w-4 accent-accent" />
          {copy.nda_label}
        </label>
        <label className="flex items-start gap-3 text-[15px] text-ink">
          <input id="brief-consent" type="checkbox" {...register("consent")} aria-invalid={!!errors.consent} className="mt-1 h-4 w-4 accent-accent" />
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
          {serverError} — or email <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-md border border-line-strong px-5 py-3 text-[15px] font-medium text-ink hover:border-ink">
            {copy.back}
          </button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-paper hover:bg-ink-hover">
            {copy.next}
          </button>
        ) : (
          <SubmitButton disabled={status === "sending"}>{status === "sending" ? copy.sending : copy.submit}</SubmitButton>
        )}
        <p className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.reply_note}</p>
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
