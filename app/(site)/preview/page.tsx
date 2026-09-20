import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false },
};

// a draft is never the same twice: nothing here may be cached or prerendered
export const dynamic = "force-dynamic";

interface DraftPost {
  id: number;
  type: string;
  status: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  modified: string;
  featuredImage: string | null;
  fields: Record<string, unknown>;
  terms: { taxonomy: string; slug: string; name: string }[];
}

/**
 * What the editor is looking at in WordPress, rendered in the site's own type.
 *
 * It reads the plugin's read-only preview route rather than GraphQL: drafts
 * need an authenticated read, and a secret that can only read one post is a
 * much smaller thing to hand out than one that can write.
 */
async function loadDraft(id: string): Promise<DraftPost | null> {
  const base = process.env.WP_REST_URL || process.env.WP_GRAPHQL_URL?.replace(/\/graphql\/?$/, "/wp-json") || "";
  const secret = process.env.WP_PREVIEW_SECRET || "";
  if (!base || !secret) return null;

  try {
    const res = await fetch(`${base}/softvolt/v1/preview?id=${encodeURIComponent(id)}`, {
      headers: { "X-Softvolt-Secret": secret },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as DraftPost;
  } catch {
    return null;
  }
}

export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ id?: string; type?: string }> }) {
  const { id } = await searchParams;
  const { isEnabled } = await draftMode();
  if (!isEnabled || !id) notFound();

  const draft = await loadDraft(id);
  if (!draft) notFound();

  // a draft that has never been saved carries 0000-00-00, which is not a date
  const modified = new Date(`${draft.modified}Z`);
  const updated = Number.isNaN(modified.getTime()) ? "" : modified.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

  const lines = (value: unknown): string[] => (typeof value === "string" ? value.split(/\r?\n/).map((l) => l.trim()).filter(Boolean) : []);

  return (
    <>
      <div className="er">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-3 text-[13px]">
          <p className="ui font-semibold text-er-ink">
            Draft preview — {draft.status}
            {updated ? ` · updated ${updated}` : ""}
          </p>
          {/* a real navigation, not a client transition: the route clears the draft cookie and redirects */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/preview/exit" className="ui font-semibold text-volt underline decoration-volt/40 underline-offset-4">
            Leave preview
          </a>
        </div>
      </div>

      <PageHero
        crumbs={[{ name: "Draft preview", href: "/preview" }]}
        eyebrow={draft.type.replace(/_/g, " ")}
        title={draft.title || "Untitled draft"}
        lede={draft.excerpt ? draft.excerpt.replace(/<[^>]*>/g, "").trim() : undefined}
      />

      <section className="container-x section" aria-label="Draft content">
        <div className="grid gap-12 lg:grid-cols-12">
          <article className="prose-site lg:col-span-7" dangerouslySetInnerHTML={{ __html: draft.content }} />

          <aside className="lg:col-span-5">
            <h2 className="ui text-[15px] font-bold text-ink">Fields</h2>
            <dl className="mt-5 space-y-4 text-[14px]">
              {Object.entries(draft.fields)
                .filter(([key]) => !key.endsWith("Lines"))
                .map(([key, value]) => (
                  <div key={key} className="border-t border-line pt-3">
                    <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{key.replace(/_/g, " ")}</dt>
                    <dd className="mt-1 leading-relaxed text-ink">
                      {typeof value === "string" && value.includes("\n") ? (
                        <ul className="space-y-1">
                          {lines(value).map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      ) : typeof value === "object" && value !== null ? (
                        <span className="text-muted">{Array.isArray(value) ? `${value.length} linked item(s)` : "set"}</span>
                      ) : (
                        String(value ?? "—")
                      )}
                    </dd>
                  </div>
                ))}
            </dl>

            {draft.terms.length ? (
              <>
                <h2 className="ui mt-10 text-[15px] font-bold text-ink">Terms</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {draft.terms.map((t) => (
                    <li key={`${t.taxonomy}-${t.slug}`} className="ui rounded-full border border-line-strong px-3 py-1 text-[13px] text-ink">
                      {t.name}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <p className="mt-10 text-[13px] leading-relaxed text-muted">
              This is the draft as WordPress holds it. Publishing rebuilds the real page within seconds —{" "}
              <Link href="/" className="text-ink underline decoration-line underline-offset-4">
                back to the site
              </Link>
              .
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
