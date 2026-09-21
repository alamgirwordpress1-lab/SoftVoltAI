import { items, page, section, text } from "@/content/copy/schema";
import { POINT_FIELDS, banner, ctaBand, intro, protectionSection, seo } from "@/content/copy/sections";

/** /security — how client data is handled. The contract clauses come from Protection clauses. */
export const securityCopy = page("security", "/security", "Security & confidentiality", {
  seo: seo(
    "Security & client confidentiality",
    "How agency and client data is handled: mutual NDA, shared-vault credentials, least-privilege access, and access revoked and confirmed at handover.",
  ),

  banner: banner({
    eyebrow: "Security & confidentiality",
    heading: "Your client's data, treated like it is yours. Because it is.",
    lede: "Agencies hand us logins, client names and campaign data. This page says exactly what happens to them — and what goes into the contract so you do not have to take our word for it.",
    facts: [
      { label: "Before the brief", value: "Mutual NDA" },
      { label: "Credentials", value: "In a shared vault only" },
      { label: "At handover", value: "Access revoked and confirmed" },
    ],
  }),

  intro: intro({
    eyebrow: "What this page is",
    heading: "The rules we work to, written down.",
    subheading: "Everything below is either already in the contract or can be, before a single credential changes hands.",
    paragraphs: [
      "Handing production to another company means handing over logins, client names, analytics and sometimes payment data. That is a real risk, and “trust us” is not an answer to it. So this page lists what actually happens: where credentials live, who can see them, what we keep after a project ends, and what we sign before it begins.",
      "None of it is aspirational. If a practice is on this page, it is how the work runs today — and the clauses that back it are in the agency protection terms you sign once, not buried in a policy nobody reads.",
    ],
    points: [
      { title: "Mutual NDA first", text: "Signed before client names or systems are discussed." },
      { title: "Vault, never email", text: "Credentials live in a shared vault with access we can revoke." },
      { title: "Least access", text: "The role we need, on the systems we need, for as long as the work runs." },
      { title: "Clean exit", text: "Access revoked and confirmed in writing at handover." },
    ],
    links: [
      { text: "Our practices", url: "#practices" },
      { text: "Contract terms", url: "#protection" },
    ],
  }),

  practices: section(
    "Practices",
    {
      eyebrow: text("Small line above the heading", "Practices"),
      heading: text("Heading", "{Count} things that are true on every project.", "{Count} becomes the number of practices below, as a word."),
      list: items(
        "The practices",
        "Practice",
        POINT_FIELDS,
        [
          { title: "Mutual NDA before the brief", text: "Our template or yours, signed before a client's name is shared. Available on request from the contact form." },
          { title: "Credentials in a shared vault only", text: "1Password or Bitwarden shared vaults. Never in email, chat or documents. You can rotate or revoke at any time." },
          {
            title: "Least-privilege access",
            text: "A scoped WordPress role, Shopify staff permissions or GA4 property access rather than owner logins. Admin only when the work needs it, and only for as long as it needs it.",
          },
          { title: "Revoked and confirmed at handover", text: "Our access is removed when the work is delivered, and we confirm the removal in writing with the handover document." },
          { title: "Encrypted devices, 2FA everywhere", text: "Every workstation is disk-encrypted; every account we hold has two-factor authentication turned on." },
          {
            title: "Lawful transfers for EU and UK data",
            text: "Bangladesh is not on the EU adequacy list. We work under Standard Contractual Clauses, the UK IDTA or Addendum, and an Article 28 data processing agreement.",
          },
          { title: "Named sub-processors", text: "Hosting, email and tooling providers that could touch client data are listed in the DPA. No surprises." },
          { title: "Staging that stays private", text: "Staging sites are password-protected, set to noindex, and removed within 14 days of launch unless you ask otherwise." },
        ],
        { help: "Each one is a public commitment about client data — only what is true on every project." },
      ),
    },
  ),

  protection: protectionSection(),

  cta: ctaBand({
    heading: "Want the NDA before you say anything else? Ask for it in the brief.",
    accent: "",
    lede: "It arrives before any client detail is discussed.",
  }),
});
