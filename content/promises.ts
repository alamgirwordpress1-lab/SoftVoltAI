import type { Promise as SitePromise } from "@/lib/cms/types";

// TODO(owner): every line here is a public commitment — keep only what you will honour on day one.
export const promises: SitePromise[] = [
  { id: "nda", label: "Mutual NDA before the brief", detail: "Our template or yours, signed before you share a client's name." },
  { id: "no-contact", label: "We never contact your client", detail: "No emails, no LinkedIn, no portfolio use without your written permission." },
  { id: "producer", label: "A named producer on every project", detail: "One person owns your project and answers in your shared channel." },
  { id: "fixed", label: "Fixed-price scope, agreed first", detail: "The quote is the price. Scope changes are written down before they are built." },
  { id: "defects", label: "Post-launch defects fixed at our cost", detail: "If it was in the scope and it breaks, we fix it. No invoice." },
];

export const protectionClauses = [
  { title: "Your client stays yours", body: "We will not approach, market to, quote for or accept work from your client — during the project or after it." },
  { title: "No credit, no footprint", body: "No footer links, no watermarks, no 'built by' anywhere. Commit messages, staging domains and documents carry your brand." },
  { title: "Confidential by default", body: "Mutual NDA on request before the brief. Credentials live in a shared vault, never in email, and are revoked and confirmed at handover." },
  { title: "You own the relationship", body: "Strategy, communication, billing and the commercial relationship are yours. We handle production and execution." },
  { title: "Data handled lawfully", body: "Bangladesh is not on the EU adequacy list, so we work under Standard Contractual Clauses, the UK IDTA and an Article 28 data processing agreement." },
];
