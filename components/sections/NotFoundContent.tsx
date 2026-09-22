import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { DocumentTitle } from "@/components/ui/DocumentTitle";
import { notFoundCopy } from "@/content/copy/not-found";
import { getCopy } from "@/lib/cms/copy";
import { getSiteChrome } from "@/lib/cms/site";

/**
 * What a wrong or old link shows: the banner and the popular pages. The words
 * are the "Page not found" page in WordPress; Next marks the page noindex on
 * its own. The header and footer come from whichever layout wraps it.
 */
export async function NotFoundContent() {
  const [chrome, { seo, banner, links }] = await Promise.all([getSiteChrome(), getCopy(notFoundCopy)]);
  const cards = links.items.filter((l) => l.title && l.url);

  return (
    <>
      <DocumentTitle title={`${seo.title} · ${chrome.name}`} />
      <PageHero eyebrow={banner.eyebrow} title={banner.heading} lede={banner.lede} highlights={banner.facts}>
        <div className="flex flex-wrap items-center gap-3">
          <Button href={banner.button.url}>{banner.button.text}</Button>
          {banner.button_secondary.text ? (
            <Button href={banner.button_secondary.url} variant="secondary">
              {banner.button_secondary.text}
            </Button>
          ) : null}
        </div>
      </PageHero>

      {cards.length ? (
        <section className="container-x py-14 md:py-20" aria-labelledby="popular-title">
          <span className="eyebrow">{links.eyebrow}</span>
          <h2 id="popular-title" className="display display-md mt-4">
            {links.heading}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <li key={card.url}>
                <Link href={card.url} prefetch={false} className="card card-lift shadow-soft flex h-full flex-col p-6">
                  <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{card.text}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
