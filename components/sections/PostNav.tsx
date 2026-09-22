import Link from "next/link";
import Image from "next/image";
import type { WpPostCard } from "@/lib/cms/wordpress";

/**
 * The two posts either side of this one, in publishing order: older on the
 * left, newer on the right, each one a card a thumb can hit.
 */
export function PostNav({
  previous,
  next,
  labels,
}: {
  previous: WpPostCard | null;
  next: WpPostCard | null;
  labels: { previous: string; next: string; all: string };
}) {
  // the first post on a new blog has neither neighbour: send the reader back to
  // the list rather than leaving the foot of the page empty
  if (!previous && !next) {
    return (
      <nav aria-label={labels.all} className="mt-14 border-t border-line pt-10">
        <Link
          href="/blog"
          className="card card-lift shadow-soft group flex items-center justify-center gap-2 p-5 text-[15px] font-semibold text-ink transition-colors hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          {labels.all}
        </Link>
      </nav>
    );
  }

  return (
    <nav aria-label="More posts" className="mt-14 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
      {previous ? <NavCard post={previous} label={labels.previous} side="previous" /> : <span className="hidden sm:block" />}
      {next ? <NavCard post={next} label={labels.next} side="next" /> : null}
    </nav>
  );
}

function NavCard({ post, label, side }: { post: WpPostCard; label: string; side: "previous" | "next" }) {
  const next = side === "next";
  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={false}
      className={`card card-lift shadow-soft group flex h-full items-center gap-4 p-5 ${next ? "sm:flex-row-reverse sm:text-right" : ""}`}
    >
      {post.image ? (
        <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-md bg-raised">
          <Image src={post.image.src} alt="" fill sizes="64px" className="object-cover" />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="mono flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-muted">
          {next ? null : <span aria-hidden="true">←</span>}
          {label}
          {next ? <span aria-hidden="true">→</span> : null}
        </span>
        <span className="mt-1.5 block text-[16px] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">{post.title}</span>
      </span>
    </Link>
  );
}
