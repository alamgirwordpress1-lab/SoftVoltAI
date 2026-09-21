import Link from "next/link";
import { Fragment } from "react";

/**
 * Words from the CMS, with links. An editor writes [homepage](/#brief) and it
 * becomes a link; everything else stays plain text. No HTML is ever taken from
 * the field, so a paragraph cannot break the page it sits on.
 */
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function Rich({ text, linkClassName = "text-ink underline decoration-line underline-offset-4 hover:decoration-accent" }: { text: string; linkClassName?: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    const at = match.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    const internal = href.startsWith("/") || href.startsWith("#");
    parts.push(
      internal ? (
        <Link key={at} href={href} prefetch={false} className={linkClassName}>
          {label}
        </Link>
      ) : (
        <a key={at} href={href} className={linkClassName} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {label}
        </a>
      ),
    );
    last = at + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}
