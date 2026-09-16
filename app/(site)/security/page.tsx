import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Protection } from "@/components/sections/Protection";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Security & confidentiality — how client data and credentials are handled",
  description: "How SoftVolt AI protects agency clients: mutual NDA before the brief, shared-vault credentials, least-privilege access, revocation at handover, SCCs, UK IDTA and a data processing agreement.",
  alternates: { canonical: "/security" },
};

const practices = [
  { title: "Mutual NDA before the brief", body: "Our template or yours, signed before a client's name is shared. Available on request from the contact form." },
  { title: "Credentials in a shared vault only", body: "1Password or Bitwarden shared vaults. Never in email, chat or documents. You can rotate or revoke at any time." },
  { title: "Least-privilege access", body: "A scoped WordPress role, Shopify staff permissions or GA4 property access rather than owner logins. Admin only when the work needs it, and only for as long as it needs it." },
  { title: "Revoked and confirmed at handover", body: "Our access is removed when the work is delivered, and we confirm the removal in writing with the handover document." },
  { title: "Encrypted devices, 2FA everywhere", body: "Every workstation is disk-encrypted; every account we hold has two-factor authentication turned on." },
  { title: "Lawful transfers for EU and UK data", body: "Bangladesh is not on the EU adequacy list. We work under Standard Contractual Clauses, the UK IDTA or Addendum, and an Article 28 data processing agreement." },
  { title: "Named sub-processors", body: "Hosting, email and tooling providers that could touch client data are listed in the DPA. No surprises." },
  { title: "Staging that stays private", body: "Staging sites are password-protected, set to noindex, and removed within 14 days of launch unless you ask otherwise." },
];

export default async function SecurityPage() {
  const clauses = await cms.getProtectionClauses();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Security & confidentiality", href: "/security" }]}
        eyebrow="Security & confidentiality"
        title="Your client's data, treated like it is yours. Because it is."
        lede="Agencies hand us logins, client names and campaign data. This page says exactly what happens to them — and what goes into the contract so you do not have to take our word for it."
        highlights={[
          { label: "Before the brief", value: "Mutual NDA" },
          { label: "Credentials", value: "In a shared vault only" },
          { label: "At handover", value: "Access revoked and confirmed" },
        ]}
      />
      <section className="container-x border-t border-line py-14 md:py-20" aria-labelledby="practices-title">
        <span className="eyebrow">Practices</span>
        <h2 id="practices-title" className="display display-md mt-4">
          Eight things that are true on every project.
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {practices.map((p, i) => (
            <li key={p.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 50}ms` }} className="card shadow-soft p-6">
              <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>
      <div className="border-t border-line">
        <Protection clauses={clauses} />
      </div>
      <CtaBand title="Want the NDA before you say anything else? Ask for it in the brief." lede="It arrives before any client detail is discussed." />
    </>
  );
}
