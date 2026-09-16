"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, aboutLinks, headerCta, cta, site } from "@/content/site";
import { pillars } from "@/content/pillars";
import { agencyTypes } from "@/content/agency-types";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const agencyItems = agencyTypes.map((a) => ({ label: a.name, href: `/for/${a.slug}` }));
const menuPillars = pillars.filter((p) => p.id === "build" || p.id === "automate");

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="faq group border-b border-line">
      <summary className="flex items-center justify-between py-3.5 text-lg text-ink">
        {title}
        <span className="faq-icon text-accent" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 18 18">
            <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-line bg-surface transition-shadow duration-300",
        scrolled && "shadow-[0_12px_30px_-26px_rgba(18,22,20,0.4)]",
      )}
    >
      {/* not `relative`: the mega menu panel positions against the full-width header */}
      <div className="wide-x flex h-16 items-center gap-6 md:h-20">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — home`} onClick={close}>
          <Logo id="logo-header" />
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-8">
            <li>
              <MegaMenu pillars={menuPillars} active={isActive(nav.services.href)} />
            </li>
            <li>
              <NavDropdown
                label={nav.agencies.label}
                items={agencyItems}
                footer={{ label: "All agency solutions", href: nav.agencies.href }}
                active={isActive(nav.agencies.href)}
                width={300}
              />
            </li>
            <li>
              <Link
                href={nav.caseStudies.href}
                aria-current={isActive(nav.caseStudies.href) ? "page" : undefined}
                className={cn(
                  "relative text-[15px] transition-colors duration-150 hover:text-ink",
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-300",
                  isActive(nav.caseStudies.href) ? "text-ink after:scale-x-100" : "text-muted after:scale-x-0 hover:after:scale-x-100",
                )}
              >
                {nav.caseStudies.label}
              </Link>
            </li>
            <li>
              <NavDropdown label={nav.about.label} items={aboutLinks} active={isActive(nav.about.href)} />
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-6">
          <div className="hidden sm:block">
            <Button href={headerCta.href}>{headerCta.label}</Button>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span className={cn("absolute left-0 top-0 h-px w-4 bg-ink transition-transform duration-200", open && "translate-y-[6px] rotate-45")} />
              <span className={cn("absolute left-0 top-[6px] h-px w-4 bg-ink transition-opacity duration-200", open && "opacity-0")} />
              <span className={cn("absolute left-0 top-3 h-px w-4 bg-ink transition-transform duration-200", open && "-translate-y-[6px] -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-line bg-surface lg:hidden">
        <nav aria-label="Mobile" className="wide-x py-4">
          <MobileGroup title={nav.services.label}>
            <div className="grid gap-5 sm:grid-cols-2">
              {menuPillars.map((p) => (
                <div key={p.id}>
                  <span className="eyebrow">{p.name}</span>
                  <ul className="mt-2 space-y-1.5">
                    {p.services.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} onClick={close} className="text-[15px] text-ink">
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link href={nav.services.href} onClick={close} className="mono mt-4 inline-block text-[12px] uppercase tracking-[0.1em] text-accent">
              All services →
            </Link>
          </MobileGroup>

          <MobileGroup title={nav.agencies.label}>
            <ul className="space-y-2">
              {agencyItems.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} onClick={close} className="text-[15px] text-ink">
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={nav.agencies.href} onClick={close} className="mono mt-4 inline-block text-[12px] uppercase tracking-[0.1em] text-accent">
              All agency solutions →
            </Link>
          </MobileGroup>

          <Link href={nav.caseStudies.href} onClick={close} className="block border-b border-line py-3.5 text-lg text-ink">
            {nav.caseStudies.label}
          </Link>

          <MobileGroup title={nav.about.label}>
            <ul className="space-y-3">
              {aboutLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={close} className="block">
                    <span className="ui block text-[15px] font-semibold text-ink">{l.label}</span>
                    <span className="block text-[13px] text-muted">{l.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </MobileGroup>

          <div className="mt-4 flex flex-col gap-2">
            <Button href={headerCta.href} onClick={close}>
              {headerCta.label}
            </Button>
            <Button href={cta.primary.href} variant="secondary" onClick={close}>
              {cta.primary.label}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
