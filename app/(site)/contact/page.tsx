import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContactForm } from "@/components/sections/ContactForm";
import { site } from "@/content/site";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact — ask us anything",
  description: "Ask SoftVolt AI a question, flag an issue on live work or introduce your agency. A named producer replies within one business day.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [process, opener] = await Promise.all([cms.getProcess(), cms.getOpener("/contact")]);
  const brief = process.find((p) => p.id === "brief");
  const scope = process.find((p) => p.id === "scope");
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", href: "/contact" }]}
        eyebrow={opener?.eyebrow || "Contact"}
        title={opener?.heading.join(" ") || "Ask us anything. A person answers, not a queue."}
        lede={
          opener?.lede ||
          "A question about how we work, an issue on something live, an introduction, or a project that is still an idea — it all comes to the same inbox, and a named producer replies within one business day."
        }
        highlights={
          opener?.highlights.length
            ? opener.highlights
            : [
                ...(brief ? [{ label: brief.name, value: brief.turnaround }] : []),
                ...(scope ? [{ label: scope.name, value: scope.turnaround }] : []),
                { label: "Before client details", value: "Mutual NDA on request" },
              ]
        }
      />

      <PageIntro
        eyebrow={opener?.intro?.eyebrow || "Before you write"}
        title={opener?.intro?.title || "No form maze, no sales sequence."}
        subtitle={
          opener?.intro?.subtitle || "One short form, read by the person who would do the work — and if it turns into a project, the scope and the price follow in writing."
        }
        body={
          opener?.intro?.body.length
            ? opener.intro.body
            : [
          <>
            Use this page for anything that is not a project brief yet: how we price, whether we cover a platform, what happens to credentials, a problem on
            work already running, or simply an introduction so the name is familiar when you do have something to send.
          </>,
          <>
            If what you have <em>is</em> a project, the four-step brief form on the <Link href="/#brief" className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent">homepage</Link>{" "}
            asks the questions we would otherwise have to ask you: the platform, the deadline and the budget.{" "}
            {brief ? `${brief.name}: ${brief.turnaround.toLowerCase()}. ` : ""}The scope follows
            {scope ? ` ${scope.turnaround.toLowerCase()}` : " within two business days"} — line by line, priced, and nothing starts until you approve it.
          </>,
              ]
        }
        points={
          opener?.intro?.points.length
            ? opener.intro.points
            : [
          { title: "NDA first", text: "Mutual, signed before client details change hands." },
          { title: "Already working with us?", text: "Say so in the message — it goes straight to your producer." },
          { title: "One reply, not a thread", text: "Every open question comes back in a single message." },
          { title: "Fixed price", text: "The scope carries the number. Changes are priced, not assumed." },
          { title: "Prefer to talk?", text: "A 20-minute scoping call is free and booked in your time zone." },
              ]
        }
        jump={
          opener?.intro?.jump.length
            ? opener.intro.jump
            : [
                { label: "Send a message", href: "#message" },
                { label: "Book a call", href: "#call" },
              ]
        }
      />

      <section id="message" className="border-t border-line bg-surface" aria-labelledby="message-title">
        <div className="container-x grid gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start" data-reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              <span className="eyebrow">Write to us</span>
            </div>
            <h2 id="message-title" className="display display-lg mt-5 max-w-[15ch]">
              One form. One person. One reply.
            </h2>
            <p className="ui mt-5 max-w-[40ch] text-lg font-semibold leading-snug text-ink md:text-xl">
              A question, an issue on live work, an introduction or an idea — the same producer answers all four.
            </p>

            <dl className="mt-9 space-y-5 text-[15px]">
              <div id="call">
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Prefer to talk?</dt>
                <dd className="mt-1 text-ink">
                  {site.calUrl ? (
                    <a href={site.calUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:decoration-accent">
                      Book a 20-minute scoping call ↗
                    </a>
                  ) : (
                    <>A 20-minute scoping call is free — ask for a slot in your message and we will send times in your time zone.</>
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
                <dd className="mt-1 text-ink">Tick the box in the form. The mutual NDA arrives before any client detail is discussed.</dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Ready to brief a project?</dt>
                <dd className="mt-1 text-ink">
                  <Link href="/#brief" className="underline decoration-line underline-offset-4 hover:decoration-accent">
                    The four-step brief form
                  </Link>{" "}
                  asks for the platform, the deadline and the budget in one pass.
                </dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">What happens next</dt>
                <dd className="mt-1 text-ink">Reply within 1 business day → scope and fixed price within 2 → work starts on your written approval.</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7" data-reveal style={{ ["--reveal-delay" as string]: "90ms" }}>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
