import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "For agencies — who we work with",
  description: "White-label production for digital marketing, SEO, PPC, branding, web design and full-service agencies: how each engagement runs and what fits.",
  alternates: { canonical: "/for" },
};

export default async function ForIndexPage() {
  const [types, promises, opener] = await Promise.all([cms.getAgencyTypes(), cms.getPromises(), cms.getOpener("/for")]);
  const short = (list: typeof types) => list.map((t) => t.name.replace(/ agencies$/i, "")).join(" · ");
  const noContact = promises.find((p) => p.id === "no-contact");
  return (
    <>
      <PageHero
        crumbs={[{ name: "For agencies", href: "/for" }]}
        eyebrow={opener?.eyebrow || "Who we help"}
        title={opener?.heading.join(" ") || "Built for agencies that have already sold the work."}
        lede={
          opener?.lede ||
          "You own the client, the strategy and the invoice. We take the part that is blocking your calendar. Pick the kind of agency you are and see how the engagement runs."
        }
        highlights={
          opener?.highlights.length
            ? opener.highlights
            : [
                { label: "Built for", value: short(types.slice(0, 3)) },
                { label: "And for", value: short(types.slice(3)) },
                ...(noContact ? [{ label: "Commitment", value: noContact.label }] : []),
              ]
        }
      />
      <PageIntro
        eyebrow={opener?.intro?.eyebrow || "How this works"}
        title={opener?.intro?.title || "Your agency stays the agency."}
        subtitle={opener?.intro?.subtitle || "We are the production team behind the name on the invoice — never a second supplier your client has to meet."}
        body={
          opener?.intro?.body.length
            ? opener.intro.body
            : [
          <>
            Most of the agencies we work with are three to thirty people. They have won a website, a migration, a store, an automation or a retainer, and the
            work is bigger than the calendar. Rather than hiring for a spike, they hand the production to us and keep everything the client sees: the
            strategy, the presentation, the relationship and the margin.
          </>,
          <>
            The {types.length} kinds of agency below each get their own page, because the brief that arrives from an SEO agency is nothing like the one that
            arrives from a branding studio. Pick the closest one and you will see the services that fit it, how a typical engagement runs, and what we need
            from you at each step.
          </>,
              ]
        }
        points={
          opener?.intro?.points.length
            ? opener.intro.points
            : [
                { title: "You own the client", text: "We never contact them, and never appear in a meeting unless you ask." },
                { title: "Under your brand", text: "Staging links, documents and handover carry your agency's name." },
                { title: "Fixed price per brief", text: "Scoped and agreed in writing before the work starts." },
                { title: "No retainer to start", text: "The first project is a project. A plan only follows if it suits you." },
              ]
        }
        jump={
          opener?.intro?.jump.length
            ? opener.intro.jump
            : [
                { label: "Kinds of agency", href: "#agency-types" },
                { label: "Send a brief", href: "/contact" },
              ]
        }
      />

      <section id="agency-types" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="agency-types-title">
        <span className="eyebrow">{opener?.sections["agency-types"]?.eyebrow || "Who we work with"}</span>
        <h2 id="agency-types-title" className="display display-md mt-4 max-w-[20ch]">
          {opener?.sections["agency-types"]?.title || "Pick the kind of agency you are."}
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {types.map((a, i) => (
            <li key={a.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <Link href={`/for/${a.slug}`} prefetch={false} className="card card-lift shadow-soft group flex h-full flex-col p-7">
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-ink">{a.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{a.problem}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink">→ {a.relief}</p>
                <span className="mono mt-auto pt-6 text-[11px] uppercase tracking-[0.1em] text-accent">How we work with you →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
