"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CONTACT_BUDGETS, CONTACT_TOPICS } from "@/lib/forms/contact-schema";
import { site } from "@/content/site";
import type { MessageFormCopy } from "@/lib/cms/copy-types";
import { loadRecaptchaOnInteraction, recaptchaToken } from "@/lib/forms/recaptcha";
import { cn } from "@/lib/utils";

/**
 * The short message form: one screen, plain fields, native validation. The
 * four-step brief lives above it for a project that is ready to be scoped.
 *
 * Deliberately built without a form library — it keeps the page's JavaScript
 * small, and it maps one to one onto Contact Form 7 if the same form is ever
 * rebuilt in WordPress:
 *
 *   [text* your-name]          name
 *   [email* your-email]        email
 *   [text your-company]        company
 *   [tel your-phone]           phone
 *   [select* your-topic ...]   topic     (same options as CONTACT_TOPICS)
 *   [select your-budget ...]   budget    (same options as CONTACT_BUDGETS)
 *   [textarea* your-message]   message
 *   [checkbox your-nda ...]    nda
 *   [text website class:hidden] honeypot — hide it with CSS, reject if filled
 */

const field = "w-full rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink";
const label = "mono mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-muted";

/** The mark beside a question that has to be answered; an editor hides it with a dash. */
function Required({ mark }: { mark: string }) {
  return mark ? <span className="text-accent">{mark}</span> : null;
}

export function ContactForm({ copy, recaptchaKey = "" }: { copy: MessageFormCopy; /** From WordPress: empty when reCAPTCHA is off. */ recaptchaKey?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  // Google's script is fetched at the visitor's first interaction, so the token is
  // ready by the time someone presses send rather than adding a wait to the submit
  useEffect(() => loadRecaptchaOnInteraction(recaptchaKey), [recaptchaKey]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const recaptcha = await recaptchaToken(recaptchaKey, "contact");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          company: String(data.get("company") ?? ""),
          phone: String(data.get("phone") ?? ""),
          topic: String(data.get("topic") ?? ""),
          budget: String(data.get("budget") ?? "") || undefined,
          message: String(data.get("message") ?? ""),
          nda: data.get("nda") === "on",
          recaptcha,
          website: String(data.get("website") ?? ""),
        }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || "That did not send.");
      form.reset();
      setStatus("sent");
      // the thank-you page is its own address, so an ads or analytics tool can count it as a conversion
      router.push("/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not send.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card shadow-float p-8 md:p-10" role="status">
        <span className="mono text-[11px] uppercase tracking-[0.1em] text-accent">Message sent</span>
        <h3 className="display display-md mt-4">Thank you — it is with a person, not a queue.</h3>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted">
          A named producer replies within one business day. If it is urgent, email us directly and say so in the subject line.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="ui mt-6 text-[15px] font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card shadow-float p-6 md:p-8" aria-labelledby="message-form-title">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 id="message-form-title" className="text-lg font-semibold text-ink">
          {copy.title}
        </h3>
        <span className="mono text-[12px] uppercase tracking-[0.1em] text-muted">{copy.reply_note}</span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="contact-name">
            {copy.name_label} <Required mark={copy.required_note} />
          </label>
          <input id="contact-name" name="name" type="text" required minLength={2} maxLength={80} autoComplete="name" placeholder={copy.name_placeholder} className={field} />
        </div>

        <div>
          <label className={label} htmlFor="contact-email">
            {copy.email_label} <Required mark={copy.required_note} />
          </label>
          <input id="contact-email" name="email" type="email" required maxLength={160} autoComplete="email" placeholder={copy.email_placeholder} className={field} />
        </div>

        <div>
          <label className={label} htmlFor="contact-company">
            {copy.company_label}
          </label>
          <input id="contact-company" name="company" type="text" maxLength={120} autoComplete="organization" placeholder={copy.company_placeholder} className={field} />
        </div>

        <div>
          <label className={label} htmlFor="contact-phone">
            {copy.phone_label}
          </label>
          <input id="contact-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder={copy.phone_placeholder} className={field} />
        </div>

        <div>
          <label className={label} htmlFor="contact-topic">
            {copy.topic_label} <Required mark={copy.required_note} />
          </label>
          <select id="contact-topic" name="topic" required defaultValue="" className={cn(field, "appearance-none bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-10 contact-select")}>
            <option value="" disabled>
              {copy.topic_placeholder}
            </option>
            {CONTACT_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label} htmlFor="contact-budget">
            {copy.budget_label}
          </label>
          <select id="contact-budget" name="budget" defaultValue="" className={cn(field, "appearance-none bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-10 contact-select")}>
            <option value="">{copy.budget_empty}</option>
            {CONTACT_BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="contact-message">
            {copy.message_label} <Required mark={copy.required_note} />
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            maxLength={4000}
            rows={6}
            placeholder={copy.message_placeholder}
            className={cn(field, "resize-y leading-relaxed")}
          />
        </div>
      </div>

      {/* honeypot: off-screen for people, irresistible to bots */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-ink">
        <input name="nda" type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 rounded border-line-strong accent-[var(--color-accent)]" />
        {copy.nda_label}
      </label>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="ui inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-[15px] font-semibold text-paper transition-[background-color,transform] duration-200 hover:bg-ink-hover active:translate-y-px disabled:opacity-60"
        >
          {status === "sending" ? copy.sending : copy.submit}
        </button>
        <p className="text-[13px] leading-relaxed text-muted">
          {copy.consent}
          {copy.privacy_link ? (
            <>
              {" — "}
              <Link href={site.privacyPath} target="_blank" className="underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent">
                {copy.privacy_link}
              </Link>
            </>
          ) : null}
          .
        </p>
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-4 text-[14px] text-danger">
          {error}
        </p>
      ) : null}
    </form>
  );
}
