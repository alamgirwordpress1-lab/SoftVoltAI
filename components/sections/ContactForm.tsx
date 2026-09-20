"use client";

import { useState } from "react";
import { CONTACT_BUDGETS, CONTACT_TOPICS } from "@/lib/forms/contact-schema";
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

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
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
          website: String(data.get("website") ?? ""),
        }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || "That did not send.");
      form.reset();
      setStatus("sent");
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
          Send a message
        </h3>
        <span className="mono text-[12px] uppercase tracking-[0.1em] text-muted">Reply within 1 business day</span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="contact-name">
            Your name <span className="text-accent">*</span>
          </label>
          <input id="contact-name" name="name" type="text" required minLength={2} maxLength={80} autoComplete="name" placeholder="Alex Roe" className={field} />
        </div>

        <div>
          <label className={label} htmlFor="contact-email">
            Email <span className="text-accent">*</span>
          </label>
          <input id="contact-email" name="email" type="email" required maxLength={160} autoComplete="email" placeholder="alex@agency.com" className={field} />
        </div>

        <div>
          <label className={label} htmlFor="contact-company">
            Agency or company
          </label>
          <input id="contact-company" name="company" type="text" maxLength={120} autoComplete="organization" placeholder="Northwind Digital" className={field} />
        </div>

        <div>
          <label className={label} htmlFor="contact-phone">
            Phone <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id="contact-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="+44 7700 900123" className={field} />
        </div>

        <div>
          <label className={label} htmlFor="contact-topic">
            What is it about? <span className="text-accent">*</span>
          </label>
          <select id="contact-topic" name="topic" required defaultValue="" className={cn(field, "appearance-none bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-10 contact-select")}>
            <option value="" disabled>
              Pick one
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
            Budget <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <select id="contact-budget" name="budget" defaultValue="" className={cn(field, "appearance-none bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-10 contact-select")}>
            <option value="">Prefer not to say</option>
            {CONTACT_BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="contact-message">
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            maxLength={4000}
            rows={6}
            placeholder="What exists today, what the client needs, and when it has to be live. Client names can wait until the NDA is signed."
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
        Send me the mutual NDA first — before any client detail is discussed.
      </label>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="ui inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-[15px] font-semibold text-paper transition-[background-color,transform] duration-200 hover:bg-ink-hover active:translate-y-px disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-[13px] leading-relaxed text-muted">
          We reply from a person, never a sales sequence. Your details are used to answer you and nothing else.
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
