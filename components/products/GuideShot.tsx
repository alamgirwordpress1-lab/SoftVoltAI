"use client";

import { useRef } from "react";
import Image, { getImageProps } from "next/image";

/** The full-size picture in the dialog; the same props warm it up beforehand. */
const FULL = { width: 1600, height: 1000, sizes: "94vw" } as const;

/**
 * One screenshot in a product's setup guide, framed as a browser window.
 * Pressing it opens the picture full size in a dialog — the words on a
 * settings screen are too small to read at the size the page shows it.
 */
export function GuideShot({ src, alt }: { src: string; alt: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const warmed = useRef(false);

  // Start fetching the full-size picture when the pointer or focus arrives, so
  // the dialog opens with it already there instead of an empty frame.
  const warm = () => {
    if (warmed.current) return;
    warmed.current = true;
    const { props } = getImageProps({ src, alt, ...FULL });
    const img = new window.Image();
    if (props.sizes) img.sizes = props.sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
  };

  return (
    <>
      <button
        type="button"
        onPointerEnter={warm}
        onPointerDown={warm}
        onFocus={warm}
        onClick={() => dialog.current?.showModal()}
        className="group block w-full overflow-hidden rounded-xl border border-line bg-surface text-left shadow-float transition-transform duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
        aria-label={`${alt} — open full size`}
      >
        <span className="flex items-center gap-1.5 border-b border-line bg-paper px-3.5 py-2.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="mono ml-auto text-[10px] uppercase tracking-[0.08em] text-muted transition-colors group-hover:text-ink">Click to enlarge</span>
        </span>
        <span className="relative block aspect-[16/10] bg-paper">
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 680px, 100vw" className="object-cover object-top" />
        </span>
      </button>

      <dialog
        ref={dialog}
        onClick={(e) => {
          // a press on the backdrop (the dialog itself, not the picture) closes it
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        className="m-auto max-h-[92vh] w-[min(1600px,94vw)] overflow-hidden rounded-xl border border-line bg-surface p-0 shadow-float backdrop:bg-[rgba(10,15,12,0.72)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
          <p className="ui truncate text-[14px] font-semibold text-ink">{alt}</p>
          <button type="button" onClick={() => dialog.current?.close()} className="ui shrink-0 rounded-md border border-line-strong px-3 py-1.5 text-[13px] font-semibold text-ink hover:border-ink">
            Close
          </button>
        </div>
        <div className="max-h-[calc(92vh-56px)] overflow-auto">
          <Image src={src} alt={alt} {...FULL} className="h-auto w-full bg-paper" />
        </div>
      </dialog>
    </>
  );
}
