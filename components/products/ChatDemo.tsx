import { ProductIcon } from "@/components/products/ProductIcon";
import { cn } from "@/lib/utils";

function Mic({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <rect x="5.5" y="1.5" width="5" height="8.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7.5a5 5 0 0 0 10 0M8 12.5v2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Bubble({ from, voice = false, children }: { from: "visitor" | "agent"; voice?: boolean; children: React.ReactNode }) {
  const visitor = from === "visitor";
  return (
    <div className={cn("flex", visitor ? "justify-end" : "justify-start")}>
      <p
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-snug",
          visitor ? "rounded-br-md bg-ink text-paper" : "rounded-bl-md border border-line bg-surface text-ink",
        )}
      >
        {voice ? (
          <span className="mono mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] opacity-70">
            <Mic /> Spoken
          </span>
        ) : null}
        {children}
      </p>
    </div>
  );
}

/**
 * An example conversation, drawn in the site's own style: a visitor asks by
 * voice, the agent answers from the business's price list, books the job and
 * the lead is saved and sent. It is an illustration, and says so.
 */
export function ChatDemo({ className }: { className?: string }) {
  return (
    <figure className={cn("card shadow-float mx-auto w-full max-w-[440px] overflow-hidden", className)}>
      <div className="er flex items-center gap-3 px-5 py-4">
        <ProductIcon icon="voice-agent" size={36} />
        <div>
          <p className="ui text-[15px] font-bold leading-tight text-er-ink">QuickFix Plumbing</p>
          <p className="mono mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-volt">
            <span className="h-1.5 w-1.5 rounded-full bg-volt" aria-hidden="true" /> Online · voice on
          </p>
        </div>
        <span className="mono ml-auto rounded-full border border-er-line px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-er-muted">Example</span>
      </div>

      <div className="space-y-3 bg-paper px-4 py-5 sm:px-5">
        <Bubble from="visitor" voice>
          Hi, do you fix leaking taps? I&rsquo;m in Leeds.
        </Bubble>
        <Bubble from="agent">Yes. A tap repair starts at £65, and Leeds is in our area. Would Saturday morning suit you?</Bubble>
        <div className="flex flex-wrap gap-2" aria-hidden="true">
          {["Saturday morning", "Another day", "Talk to a person"].map((q) => (
            <span key={q} className="rounded-full border border-line-strong bg-surface px-3 py-1 text-[12px] text-ink">
              {q}
            </span>
          ))}
        </div>
        <Bubble from="visitor" voice>
          Saturday morning. My number is 07700 900123.
        </Bubble>
        <Bubble from="agent">Thanks. I&rsquo;ve booked a tap repair request for Saturday, 9 to 12. We&rsquo;ll call 07700 900123 to confirm.</Bubble>
        <div className="flex items-start gap-3 rounded-xl border border-accent/30 bg-ok-bg px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="mt-0.5 shrink-0 text-ok-fg">
            <circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="m5.5 9.2 2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-[13px] leading-snug text-ok-fg">
            <span className="ui block font-bold">Appointment request saved</span>
            Tap repair · Saturday 9–12 · Leeds. Sent to you by email and Telegram.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-line bg-surface px-4 py-3" aria-hidden="true">
        <span className="flex-1 truncate rounded-full border border-line px-4 py-2 text-[13px] text-muted">Type, or tap the mic…</span>
        <span className="relative grid h-10 w-10 place-items-center rounded-full bg-ink text-paper">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/25 motion-reduce:animate-none" />
          <Mic className="relative" />
        </span>
      </div>
      <figcaption className="sr-only">
        An example conversation: a visitor asks by voice whether a plumber fixes leaking taps in Leeds, the agent quotes the price from the business&rsquo;s list, books
        Saturday morning, and the appointment request is saved and sent to the business by email and Telegram.
      </figcaption>
    </figure>
  );
}
