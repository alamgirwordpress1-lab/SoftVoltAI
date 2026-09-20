import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { BriefForm } from "@/components/sections/BriefForm";
import { site } from "@/content/site";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Send us a brief",
  description: "Send a white-label brief: a named producer replies in one business day with a written scope and a fixed price. NDA before any client detail.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const process = await cms.getProcess();
  const brief = process.find((p) => p.id === "brief");
  const scope = process.find((p) => p.id === "scope");
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", href: "/contact" }]}
        eyebrow="Send us a brief"
        title="Four short steps. A scope and a fixed price within two business days."
        lede="Client names can wait until the NDA is signed. Tell us what exists, what is needed and when — a named producer replies within one business day."
        highlights={[
          { label: "The brief", value: "Four short steps" },
          ...(brief ? [{ label: brief.name, value: brief.turnaround }] : []),
          ...(scope ? [{ label: scope.name, value: scope.turnaround }] : []),
        ]}
      />
      <PageIntro
        eyebrow="Before you write"
        title="A brief, not a discovery call."
        subtitle="Five minutes of typing gets you a written scope with a fixed price — no meeting required to find out what something costs."
        body={[
          <>
            Tell us what exists today, what the client needs, and the date it has to be live. If there is a Figma file, a staging link or a ticket list,
            point at it. If the client cannot be named yet, describe them instead — the NDA comes before we ask for anything identifying.
          </>,
          <>
            {brief ? `${brief.name}: ${brief.turnaround.toLowerCase()}. ` : ""}A named producer reads it, asks anything missing in one message rather than
            five, and sends the scope{scope ? ` ${scope.turnaround.toLowerCase()}` : " within two business days"} — line by line, priced, with the assumptions
            written down. Nothing starts until you approve it.
          </>,
        ]}
        points={[
          { title: "NDA first", text: "Mutual, signed before client details change hands." },
          { title: "One reply, not a thread", text: "Every open question comes back in a single message." },
          { title: "Fixed price", text: "The scope carries the number. Changes are priced, not assumed." },
          { title: "Prefer to talk?", text: "A 20-minute scoping call is free and booked in your time zone." },
        ]}
        jump={[
          { label: "The brief form", href: "#brief-form" },
          { label: "Book a call", href: "#call" },
        ]}
      />

      <section id="brief-form" className="container-x relative pb-20 md:pb-28" aria-label="Brief form and contact details">
        <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7" data-reveal>
            <BriefForm />
          </div>
          <aside className="lg:col-span-5" data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
            <dl className="card shadow-soft space-y-6 p-6 text-[15px] md:p-8">
              <div id="call">
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Prefer to talk?</dt>
                <dd className="mt-1 text-ink">
                  {site.calUrl ? (
                    <a href={site.calUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:decoration-accent">
                      Book a 20-minute scoping call ↗
                    </a>
                  ) : (
                    <>A 20-minute scoping call is free — ask for a slot in the brief and we will send times in your time zone.</>
                  )}
                </dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Hours</dt>
                <dd className="mt-1 text-ink">
                  {site.location} · {site.utcOffset} · UK and US overlap, daily
                </dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">NDA first?</dt>
                <dd className="mt-1 text-ink">Tick the box in the last step. The mutual NDA arrives before any client detail is discussed.</dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">What happens next</dt>
                <dd className="mt-1 text-ink">Reply within 1 business day → scope and fixed price within 2 → work starts on your written approval.</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
