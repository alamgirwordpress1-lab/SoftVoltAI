import type { Faq } from "@/lib/cms/types";

export const faqs: Faq[] = [
  {
    q: "Will my client ever know you exist?",
    a: "Not from us. Staging domains, commit messages, documents and reports carry your brand. We never contact your client, and we do not list your projects anywhere without your written permission.",
  },
  {
    q: "Where is the team, and what hours do you cover?",
    a: "Dhaka, Bangladesh (UTC+6, no daylight saving). That gives a full morning overlap with the UK and Europe and an early-morning overlap with the US East Coast. A brief sent at the end of your day is usually in review by your next morning.",
  },
  {
    q: "How do you price work?",
    a: "Project work is a fixed price against a written scope. Ongoing work runs on a monthly retainer sized in hours. You get a scope and quote within two business days of a brief, and nothing starts until you approve it.",
  },
  {
    q: "What do you need from us to start?",
    a: "Whatever you have: a Figma file, a live URL, a client email, an SEO audit, an ads account structure. We will ask the missing questions in the scoping call rather than guess.",
  },
  {
    q: "How are client credentials handled?",
    a: "Through a shared password-manager vault with least-privilege access — a scoped WordPress role, Shopify staff permissions or GA4 property access rather than owner logins. Access is revoked at handover and confirmed in writing.",
  },
  {
    q: "Can you sign our NDA and contractor agreement?",
    a: "Yes. We can work under your paperwork or provide a mutual NDA before you share any client details. For EU and UK client data we work under Standard Contractual Clauses or the UK IDTA and a data processing agreement.",
  },
];

// TODO(owner): every answer below is a public commitment — confirm each one, and
// keep them consistent with the plan limits set in content/stack.ts.
/** Shown under the plans on /rates. */
export const pricingFaqs: Faq[] = [
  { q: "What if a project does not fit a plan?", a: "Tell us in the brief. Anything outside a plan — a one-off build, a migration, a rescue — is scoped and quoted separately, with a written scope and a fixed price before any work starts." },
  { q: "What counts as an active project?", a: "One client website in production at a time. You can send as many briefs as you like; the plan limits how many run in parallel, not how many you queue." },
  { q: "What about rush work?", a: "Say so in the brief. If we can hit the date we will tell you what it costs; if we cannot, we will tell you that instead of taking the work and missing it." },
  { q: "Do you mark up third-party costs?", a: "No. Hosting, plugins, ad spend and tools are billed at cost or held in your accounts. We quote our work; everything else is transparent." },
];
