import Link from "next/link";
import { BriefForm } from "@/components/sections/BriefForm";
import { site } from "@/content/site";

export function BriefCta() {
  return (
    <section id="brief" className="border-t border-line bg-surface" aria-labelledby="brief-title">
      <div className="container-x section relative grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5" data-reveal>
          <span className="eyebrow">Send us a brief</span>
          <h2 id="brief-title" className="display display-md mt-4">
            Four short steps. A scope and a fixed price within two business days.
          </h2>
          <p className="lede mt-5">
            Client names can wait until the NDA is signed. Tell us what exists, what is needed and when — a named producer
            replies within one business day.
          </p>
          <dl className="mt-8 grid gap-x-8 gap-y-5 text-[15px] sm:grid-cols-2">
            <div>
              <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Prefer to talk?</dt>
              <dd className="mt-1 text-ink">
                {site.calUrl ? (
                  <a href={site.calUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:decoration-accent">
                    Book a 20-minute scoping call ↗
                  </a>
                ) : (
                  <>A 20-minute scoping call — ask for a slot in the brief and we will send times in your time zone.</>
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
          </dl>

          {/* the page ends on this form, so the last word goes to the reader who
              is not ready to fill it in yet */}
          <div className="mt-10 border-t border-line pt-6">
            <p className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Not ready to brief?</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {[
                { label: "See what we have built", href: "/case-studies" },
                { label: "How pricing works", href: "/rates" },
                { label: "Partner programme", href: "/partner-programme" },
                { label: "Just a question? Contact us", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="ui text-[15px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent">
                    {l.label} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lg:col-span-7" data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
          <BriefForm />
        </div>
      </div>
    </section>
  );
}
