/**
 * Headless Contact Form 7.
 *
 * Both forms on this site post to their own route handler here; the handler
 * validates, then delivers. Delivery is CF7 when a WordPress install is
 * configured, and Resend otherwise — the forms themselves never change.
 *
 * Which form each one posts to comes from the CMS: the Headless settings
 * screen holds the two Contact Form 7 ids, so an editor can rebuild a form and
 * point the site at the new one without a deploy. The environment is the
 * fallback, for a build that has no CMS yet:
 *   CF7_BASE_URL=https://cms.example.com     (the WordPress origin, no trailing slash)
 *   CF7_BRIEF_FORM_ID=123                    (the four-step brief form)
 *   CF7_CONTACT_FORM_ID=124                  (the short message form)
 *
 * Whichever way the id arrives, the two forms in CF7 have to carry the field
 * names in CF7_FIELDS below — the tag names are what CF7 validates and what
 * the mail template reads.
 */
import { wpSettings } from "@/lib/cms/wordpress";

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

/** The WordPress origin: whatever CF7_BASE_URL says, or the REST root we already talk to. */
export function wpBase() {
  return cf7Base();
}

function cf7Base() {
  const base =
    process.env.CF7_BASE_URL || process.env.WP_REST_URL?.replace(/\/wp-json\/?$/, "") || process.env.WP_GRAPHQL_URL?.replace(/\/graphql\/?$/, "") || "";
  return base.replace(/\/$/, "");
}

/** The form id for one of our two forms, or null when CF7 is not configured. */
export async function cf7FormId(form: Cf7Form) {
  const base = cf7Base();
  if (!base) return null;

  // the CMS is asked first: the ids live on the Headless settings screen
  const settings = await wpSettings().catch(() => null);
  const fromCms = form === "brief" ? settings?.cf7BriefId : settings?.cf7ContactId;
  const id = fromCms || (form === "brief" ? process.env.CF7_BRIEF_FORM_ID : process.env.CF7_CONTACT_FORM_ID);
  return id ? { base, id } : null;
}

/**
 * Posts one submission to CF7's REST endpoint. CF7 answers 200 with a status
 * of "mail_sent" on success and with "validation_failed" or "mail_failed"
 * otherwise, so the status is what decides, not the HTTP code.
 */
export async function sendToCf7(form: Cf7Form, values: Record<string, string | string[] | boolean | undefined>) {
  const target = await cf7FormId(form);
  if (!target) return { sent: false as const, reason: "not-configured" };

  const names = CF7_FIELDS[form] as Record<string, string>;
  const body = new FormData();
  // CF7 rejects a submission that carries no unit tag ("There is no valid unit
  // tag."): on a WordPress page these are printed as hidden inputs, so a
  // headless caller has to send them itself. The tag only has to be a non-empty
  // alphanumeric string — CF7 uses it to tell two copies of one form apart.
  body.append("_wpcf7", target.id);
  body.append("_wpcf7_unit_tag", `wpcf7-f${target.id}-o1`);
  body.append("_wpcf7_version", "6.1");
  body.append("_wpcf7_locale", process.env.CF7_LOCALE || "en_GB");
  body.append("_wpcf7_container_post", "0");
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
