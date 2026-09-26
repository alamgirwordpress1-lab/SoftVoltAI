import Link from "next/link";
import { siFacebook, siInstagram, siX } from "simple-icons";
import { Logo } from "@/components/layout/Logo";
import { companyLinks, socials } from "@/content/site";
import { pillars } from "@/content/pillars";
import type { SiteChrome } from "@/lib/cms/site";

function SocialIcon({ icon }: { icon: (typeof socials)[number]["icon"] }) {
  if (icon === "linkedin") return <span className="ui text-[15px] font-bold leading-none">in</span>;
  if (icon === "mail")
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
      </svg>
    );
  const path = { facebook: siFacebook.path, instagram: siInstagram.path, x: siX.path }[icon];
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="ui text-[15px] font-bold text-er-ink">{title}</h2>
      <ul className="mt-6 space-y-3.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} prefetch={false} className="group inline-flex items-center text-[15px] text-er-muted transition-colors duration-200 hover:text-er-ink">
              <span className="mr-0 h-px w-0 bg-volt transition-[width,margin] duration-300 ease-[var(--ease-out-quint)] group-hover:mr-2 group-hover:w-3" aria-hidden="true" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The chrome comes from the layout, which has already merged WordPress over /content. */
export function SiteFooter({ chrome }: { chrome: SiteChrome }) {
  const year = new Date().getFullYear();
  const servicePillars = pillars.filter((p) => p.id === "grow" || p.id === "support");
  const liveSocials = chrome.socials.filter((s) => s.href);

  return (
    <footer className="relative bg-[#0a0f0c] text-er-ink">
      <div className="wide-x relative pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" aria-label={`${chrome.name} — home`} className="inline-block">
              <Logo dark id="logo-footer" name={chrome.name} image={chrome.logoDark} />
            </Link>
            <p className="ui mt-7 max-w-[30ch] text-lg font-semibold leading-snug text-er-ink">{chrome.tagline}</p>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-er-muted">
              {chrome.footerBlurb ||
                `${chrome.name} helps agencies across the UK, US, Canada, Australia and the EU deliver websites, apps, automation, SEO and paid media without hiring in-house — fully white-labelled, always under your brand.`}
            </p>

            <p className="ui mt-9 text-[15px] font-bold text-er-ink">Follow us</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {liveSocials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="grid h-11 w-11 place-items-center rounded-md border border-er-line bg-er-surface text-er-ink transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-volt hover:text-volt"
                  >
                    <SocialIcon icon={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-12 sm:grid-cols-3 lg:col-span-7 lg:col-start-6 lg:gap-8">
            {chrome.footerColumns ? (
              chrome.footerColumns.map((column) => <Column key={column.title} title={column.title} links={column.links} />)
            ) : (
              <>
                {servicePillars.map((p) => (
                  <Column key={p.id} title={p.name} links={p.services.map((s) => ({ label: s.name, href: `/services/${s.slug}` }))} />
                ))}
                <Column title="Company" links={companyLinks} />
              </>
            )}
          </div>
        </div>

        {/* copyright left, where it is read first; the two legal pages on the right,
            beside the back-to-top, which is where a reader goes looking for them */}
        <div className="mt-20 grid gap-6 border-t border-er-line py-10 text-[14px] text-er-muted md:mt-28 md:grid-cols-3 md:items-center md:gap-8">
          <p>{chrome.footerNote || `© ${year} ${chrome.name}. All rights reserved.`}</p>
          {/* three equal columns, so this one sits in the middle of the row, not
              wherever the two beside it happen to end */}
          <p className="mono uppercase tracking-[0.1em] md:text-center">
            {chrome.location} · {chrome.utcOffset} · UK &amp; US overlap
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:justify-self-end">
            {chrome.legalLinks.length ? (
              <nav aria-label="Legal">
                <ul className="flex flex-wrap gap-x-5 gap-y-1">
                  {chrome.legalLinks.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} prefetch={false} className="underline decoration-er-line underline-offset-4 transition-colors hover:text-er-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
