import { z } from "zod";

/**
 * The short contact form — the one for a question, an introduction or a job
 * that has not become a brief yet. The four-step brief form has its own schema.
 *
 * Every field here is a plain input on purpose: the form is meant to be
 * rebuildable in Contact Form 7 (or any other form plugin) field for field.
 */
export const CONTACT_TOPICS = [
  "Website build",
  "WooCommerce store",
  "Headless + Next.js",
  "AI or workflow automation",
  "SEO",
  "Paid media",
  "Maintenance & support",
  "Partnership",
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
  /** Honeypot: a real person never sees this field, so anything in it is a bot. */
  website: z.string().max(200).optional().default(""),
});
