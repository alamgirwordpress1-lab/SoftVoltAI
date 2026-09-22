"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CommentCopy {
  heading: string;
  count_one: string;
  count_many: string;
  empty: string;
  form_heading: string;
  form_lede: string;
  name_label: string;
  email_label: string;
  email_note: string;
  comment_label: string;
  comment_placeholder: string;
  submit: string;
  sending: string;
  held: string;
  published: string;
  error: string;
  closed: string;
  reply: string;
  replying_to: string;
  cancel_reply: string;
}

export interface PostComment {
  id: number;
  parent: number;
  date: string;
  html: string;
  author: string;
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const field =
  "w-full rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink";
const label = "mono mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-muted";

/** "3 comments", or "1 comment" — the words are written on the Blog page in WordPress. */
function countLabel(copy: CommentCopy, n: number) {
  return (n === 1 ? copy.count_one : copy.count_many).replace("{count}", String(n));
}

/**
 * The comments under a post, and the form that adds one.
 *
 * WordPress owns the moderation: a new comment is held until it is approved
 * there, so the form says so rather than pretending the comment is live. The
 * list itself is rendered on the server and passed in, so a reader with no
 * JavaScript still sees every approved comment.
 */
export function PostComments({ postId, open, comments, copy }: { postId: number; open: boolean; comments: PostComment[]; copy: CommentCopy }) {
  const [status, setStatus] = useState<"idle" | "sending" | "held" | "published" | "error">("idle");
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState<PostComment | null>(null);

  const threads = comments.filter((c) => !c.parent);
  const repliesOf = (id: number) => comments.filter((c) => c.parent === id);

  function reply(comment: PostComment) {
    setReplyTo(comment.parent ? { ...comment, id: comment.parent } : comment);
    document.getElementById("comment-content")?.focus({ preventScroll: false });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post: postId,
          parent: replyTo?.id ?? 0,
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          content: String(data.get("content") ?? ""),
          website: String(data.get("website") ?? ""),
        }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error || copy.error);
      form.reset();
      setReplyTo(null);
      setStatus(body.approved ? "published" : "held");
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.error);
      setStatus("error");
    }
  }

  return (
    <section id="comments" aria-labelledby="comments-title" className="mt-14 border-t border-line pt-12 md:mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="comments-title" className="display display-md">
          {copy.heading}
        </h2>
        {comments.length ? <span className="mono text-[12px] uppercase tracking-[0.1em] text-muted">{countLabel(copy, comments.length)}</span> : null}
      </div>

      {threads.length ? (
        <ol className="mt-8 space-y-5">
          {threads.map((comment) => (
            <li key={comment.id}>
              <Comment comment={comment} onReply={open ? () => reply(comment) : undefined} replyLabel={copy.reply} />
              {repliesOf(comment.id).length ? (
                <ol className="mt-5 space-y-5 border-l border-line pl-5 md:pl-8">
                  {repliesOf(comment.id).map((answer) => (
                    <li key={answer.id}>
                      <Comment comment={answer} onReply={open ? () => reply(answer) : undefined} replyLabel={copy.reply} />
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-[15px] leading-relaxed text-muted">{copy.empty}</p>
      )}

      {open ? (
        <div className="card shadow-soft mt-10 p-6 md:p-8">
          <h3 className="text-lg font-semibold text-ink">{copy.form_heading}</h3>
          {copy.form_lede ? <p className="mt-2 max-w-[60ch] text-[14px] leading-relaxed text-muted">{copy.form_lede}</p> : null}

          {replyTo ? (
            <p className="mt-4 flex flex-wrap items-center gap-3 text-[14px] text-ink">
              <span>{copy.replying_to.replace("{name}", replyTo.author)}</span>
              <button type="button" onClick={() => setReplyTo(null)} className="ui text-[13px] font-semibold text-muted underline underline-offset-4 hover:text-ink">
                {copy.cancel_reply}
              </button>
            </p>
          ) : null}

          {status === "held" || status === "published" ? (
            <p role="status" className="mt-6 rounded-md border border-accent/40 bg-accent-soft/50 px-4 py-3 text-[15px] leading-relaxed text-ink">
              {status === "held" ? copy.held : copy.published}
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="comment-name">
                  {copy.name_label}
                </label>
                <input id="comment-name" name="name" type="text" required minLength={2} maxLength={80} autoComplete="name" className={field} />
              </div>
              <div>
                <label className={label} htmlFor="comment-email">
                  {copy.email_label}
                </label>
                <input id="comment-email" name="email" type="email" required maxLength={160} autoComplete="email" className={field} />
                {copy.email_note ? <p className="mt-1.5 text-[12px] text-muted">{copy.email_note}</p> : null}
              </div>
            </div>

            <div>
              <label className={label} htmlFor="comment-content">
                {copy.comment_label}
              </label>
              <textarea
                id="comment-content"
                name="content"
                required
                minLength={2}
                maxLength={4000}
                rows={5}
                placeholder={copy.comment_placeholder}
                className={cn(field, "resize-y leading-relaxed")}
              />
            </div>

            {/* honeypot: off-screen for people, irresistible to bots */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="comment-website">Website</label>
              <input id="comment-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="ui inline-flex items-center justify-center rounded-md bg-ink px-5 py-3 text-[15px] font-semibold text-paper transition-[background-color,transform] duration-200 hover:bg-ink-hover active:translate-y-px disabled:opacity-60"
              >
                {status === "sending" ? copy.sending : copy.submit}
              </button>
              {status === "error" ? (
                <p role="alert" className="text-[14px] text-danger">
                  {error || copy.error}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      ) : (
        <p className="mt-8 text-[15px] text-muted">{copy.closed}</p>
      )}
    </section>
  );
}

function Comment({ comment, onReply, replyLabel }: { comment: PostComment; onReply?: () => void; replyLabel: string }) {
  const initial = comment.author.trim().charAt(0).toUpperCase() || "?";
  return (
    <article className="card p-6">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="ui grid h-10 w-10 shrink-0 place-items-center rounded-full bg-raised text-[15px] font-bold text-ink">
          {initial}
        </span>
        <div>
          <p className="font-semibold leading-tight text-ink">{comment.author}</p>
          {comment.date ? (
            <time dateTime={comment.date} className="mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {dateFormat.format(new Date(comment.date))}
            </time>
          ) : null}
        </div>
      </div>
      {/* WordPress has already filtered this HTML down to the tags a comment may use */}
      <div className="prose-site mt-4 text-[15px]" dangerouslySetInnerHTML={{ __html: comment.html }} />
      {onReply ? (
        <button type="button" onClick={onReply} className="ui mt-4 text-[13px] font-semibold text-muted underline underline-offset-4 transition-colors hover:text-ink">
          {replyLabel}
        </button>
      ) : null}
    </article>
  );
}
