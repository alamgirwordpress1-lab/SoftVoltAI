import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { ContactForm } from "@/components/sections/ContactForm";
import { contactCopy } from "@/content/copy/contact";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";
import { getSiteChrome } from "@/lib/cms/site";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(contactCopy);
}

export default async function ContactPage() {
  const [process, chrome] = await Promise.all([cms.getProcess(), getSiteChrome()]);
  const brief = process.find((p) => p.id === "brief");
  const scope = process.find((p) => p.id === "scope");
  // the words are the WordPress page "Contact"; the turnarounds come from Process steps
  const copy = await getCopy(contactCopy, {
    brief_step: brief?.name ?? "Send the brief",
    brief_time: brief ? brief.turnaround.toLowerCase() : "reply within 1 business day",
    scope_time: scope ? scope.turnaround.toLowerCase() : "within two business days",
    location: chrome.location,
    offset: chrome.utcOffset,
  });
  const m = copy.message;

  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", href: "/contact" }]}
        {...bannerProps(copy.banner, [
          ...(brief ? [{ label: brief.name, value: brief.turnaround }] : []),
          ...(scope ? [{ label: scope.name, value: scope.turnaround }] : []),
          { label: "Before client details", value: "Mutual NDA on request" },
        ])}
      />

      <PageIntro {...introProps(copy.intro)} />

      <section id="message" className="border-t border-line bg-surface" aria-labelledby="message-title">
        <div className="container-x grid gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start" data-reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              <span className="eyebrow">{m.eyebrow}</span>
            </div>
            <h2 id="message-title" className="display display-lg mt-5 max-w-[15ch]">
              {m.heading}
            </h2>
            {m.subheading ? <p className="ui mt-5 max-w-[40ch] text-lg font-semibold leading-snug text-ink md:text-xl">{m.subheading}</p> : null}

            <dl className="mt-9 space-y-5 text-[15px]">
              <div id="call">
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{m.call_label}</dt>
                <dd className="mt-1 text-ink">
                  {chrome.calUrl ? (
                    <a href={chrome.calUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:decoration-accent">
                      {m.call_link}
                    </a>
                  ) : (
                    m.call_text
                  )}
                </dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{m.email_label}</dt>
                <dd className="mt-1">
                  <a href={`mailto:${chrome.email}`} className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
                    {chrome.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{m.hours_label}</dt>
                <dd className="mt-1 text-ink">{m.hours_text}</dd>
              </div>
              {m.nda_text ? (
                <div>
                  <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{m.nda_label}</dt>
                  <dd className="mt-1 text-ink">{m.nda_text}</dd>
                </div>
              ) : null}
              {m.brief_link.text ? (
                <div>
                  <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{m.brief_label}</dt>
                  <dd className="mt-1 text-ink">
                    <Link href={m.brief_link.url} className="underline decoration-line underline-offset-4 hover:decoration-accent">
                      {m.brief_link.text}
                    </Link>{" "}
                    {m.brief_text}
                  </dd>
                </div>
              ) : null}
              {m.next_text ? (
                <div>
                  <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{m.next_label}</dt>
                  <dd className="mt-1 text-ink">{m.next_text}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="lg:col-span-7" data-reveal style={{ ["--reveal-delay" as string]: "90ms" }}>
            <ContactForm copy={copy.form} recaptchaKey={chrome.recaptchaSiteKey} />
          </div>
        </div>
      </section>
    </>
  );
}
