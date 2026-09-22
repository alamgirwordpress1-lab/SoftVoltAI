import { z } from "zod";

export const WORK_TYPES = ["Build", "Automate", "Grow", "Support"] as const;
// Every option here is something we actually build — keep it that way, and keep
// "Other" last. These render as the chips on step 1 of the brief form.
export const PLATFORMS = [
  "WordPress",
  "WooCommerce",
  "Elementor",
  "Custom WordPress theme",
  "WordPress plugin",
  "Headless + Next.js",
  "Next.js + Payload / Sanity / Prismic",
  "Next.js app + PostgreSQL",
  "Laravel",
  "Shopify",
  "Webflow",
  "AI automation",
  "SEO",
  "Google Ads",
  "Meta Ads",
  "Maintenance & care plan",
  "Migration",
  "Analytics & tracking",
  "Other",
] as const;
export const BUDGETS = ["Under £2k", "£2k–5k", "£5k–15k", "£15k+", "Monthly retainer", "Not sure yet"] as const;

// Empty string means "not given"; kept as a plain string so form input and parsed output share one type.
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), "Enter a full URL starting with http:// or https://");

export const briefSchema = z.object({
  workType: z.enum(WORK_TYPES, { message: "Pick the kind of work" }),
  platforms: z.array(z.enum(PLATFORMS)).min(1, "Pick at least one platform"),
  figmaUrl: optionalUrl,
  liveUrl: optionalUrl,
  brief: z.string().trim().min(20, "A couple of sentences helps us scope it").max(4000),
  deadline: z.string().trim().max(80),
  budget: z.enum(BUDGETS, { message: "Pick a range — 'Not sure yet' is fine" }),
  name: z.string().trim().min(2, "Your name").max(80),
  agency: z.string().trim().min(2, "Your agency").max(120),
  email: z.string().trim().email("A work email we can reply to").max(160),
  timeZone: z.string().trim().max(80),
  nda: z.boolean(),
  consent: z.literal(true, { message: "We need your permission to reply" }),
  /** A reCAPTCHA v3 token, when WordPress has reCAPTCHA switched on. */
  recaptcha: z.string().max(4000).optional(),
  // honeypot — humans never see it. A filled one is accepted here on purpose:
  // the route answers with a pretend success, so a bot never learns the name.
  website: z.string().max(200).optional(),
});

export type BriefInput = z.infer<typeof briefSchema>;
