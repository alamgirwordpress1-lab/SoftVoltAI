import * as z from "./zod";

/**
 * The plain contact form: a question, support, a partnership, billing. New
 * projects go to the quote form at /quote, which has its own schema.
 *
 * Every field here is a plain input on purpose: the form is meant to be
 * rebuildable in Contact Form 7 (or any other form plugin) field for field.
 */
export const CONTACT_TOPICS = [
  "A question about a service",
  "Support for an existing project",
  "Partnership or reselling",
  "Billing",
  "Press or media",
  "Something else",
] as const;

export const CONTACT_BUDGETS = ["Not sure yet", "Under £2k", "£2k–5k", "£5k–15k", "£15k+", "Monthly retainer"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Your name").max(80),
  email: z.string().trim().email("An email we can reply to").max(160),
  company: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  topic: z.enum(CONTACT_TOPICS, { message: "Pick what this is about" }),
  budget: z.enum(CONTACT_BUDGETS).optional(),
  message: z.string().trim().min(10, "A sentence or two is enough").max(4000),
  nda: z.boolean().optional().default(false),
  /** A reCAPTCHA v3 token, when WordPress has reCAPTCHA switched on. */
  recaptcha: z.string().max(4000).optional(),
  /** Honeypot: a real person never sees this field, so anything in it is a bot. */
  website: z.string().max(200).optional().default(""),
});
