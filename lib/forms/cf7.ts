/**
 * Headless Contact Form 7.
 *
 * Both forms on this site post to their own route handler here; the handler
 * validates, then delivers. Delivery is CF7 when a WordPress install is
 * configured, and Resend otherwise — the forms themselves never change.
 *
 * To go headless, set in the environment:
 *   CF7_BASE_URL=https://cms.example.com     (the WordPress origin, no trailing slash)
 *   CF7_BRIEF_FORM_ID=123                    (the four-step brief form)
 *   CF7_CONTACT_FORM_ID=124                  (the short message form)
 *
 * Then build the two forms in CF7 with the field names in CF7_FIELDS below —
 * the tag names have to match exactly, because that is what CF7 validates and
 * what the mail template reads.
 */

export const CF7_FIELDS = {
  brief: {
    workType: "your-work-type",
    platforms: "your-platforms[]",
    figmaUrl: "your-figma",
    liveUrl: "your-live-url",
    brief: "your-brief",
    deadline: "your-deadline",
    budget: "your-budget",
    name: "your-name",
    agency: "your-agency",
    email: "your-email",
    timeZone: "your-timezone",
    nda: "your-nda",
  },
  contact: {
    name: "your-name",
    email: "your-email",
    company: "your-company",
    phone: "your-phone",
    topic: "your-topic",
    budget: "your-budget",
    message: "your-message",
    nda: "your-nda",
  },
} as const;

export type Cf7Form = keyof typeof CF7_FIELDS;

/** The form id for one of our two forms, or null when CF7 is not configured. */
export function cf7FormId(form: Cf7Form) {
  const base = process.env.CF7_BASE_URL;
  const id = form === "brief" ? process.env.CF7_BRIEF_FORM_ID : process.env.CF7_CONTACT_FORM_ID;
  return base && id ? { base: base.replace(/\/$/, ""), id } : null;
}

/**
 * Posts one submission to CF7's REST endpoint. CF7 answers 200 with a status
 * of "mail_sent" on success and with "validation_failed" or "mail_failed"
 * otherwise, so the status is what decides, not the HTTP code.
 */
export async function sendToCf7(form: Cf7Form, values: Record<string, string | string[] | boolean | undefined>) {
  const target = cf7FormId(form);
  if (!target) return { sent: false as const, reason: "not-configured" };

  const names = CF7_FIELDS[form] as Record<string, string>;
  const body = new FormData();
  for (const [key, name] of Object.entries(names)) {
    const value = values[key];
    if (value === undefined || value === "") continue;
    if (Array.isArray(value)) for (const v of value) body.append(name, v);
    else if (typeof value === "boolean") {
      if (value) body.append(name, "1");
    } else body.append(name, value);
  }

  const res = await fetch(`${target.base}/wp-json/contact-form-7/v1/contact-forms/${target.id}/feedback`, { method: "POST", body });
  const json = (await res.json().catch(() => ({}))) as { status?: string; message?: string; invalid_fields?: { field?: string; message?: string }[] };
  if (json.status === "mail_sent") return { sent: true as const };
  return {
    sent: false as const,
    reason: json.status ?? `http_${res.status}`,
    message: json.message,
    fields: json.invalid_fields?.map((f) => `${f.field}: ${f.message}`),
  };
}
