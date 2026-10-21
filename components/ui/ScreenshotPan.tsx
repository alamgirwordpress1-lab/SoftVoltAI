"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CoverImage } from "@/components/ui/CoverImage";
import { cn } from "@/lib/utils";

/**
 * A case study's screenshot in its 16:10 frame (the frame is the parent, which
 * must be positioned).
 *
 * The page shows `thumb`, the top of the site cut by app/shots: a few dozen
 * kilobytes, with width and height on the tag. With `pan`, hovering the frame
 * (or the closest element marked data-pan-root, such as the whole card) loads
 * the full-page screenshot over it and scrolls it from top to bottom, as the
 * cards always did. The full page is never in the HTML, so neither a crawler
 * nor a phone, which cannot hover, downloads its 300–550 kB.
 *
 * Without a thumb (the screenshots that ship in /public are already 16:10)
 * the picture itself is shown, through next/image as before.
 */
export function ScreenshotPan({
  thumb,
  image,
  alt,
  sizes,
  priority,
  pan = false,
  duration = 9000,
  className,
}: {
  thumb?: string;
  image: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Scroll through the whole page on hover. */
  pan?: boolean;
  /** How long the scroll from top to bottom takes, in ms. */
  duration?: number;
  className?: string;
}) {
  const frame = useRef<HTMLSpanElement>(null);
  // asked for: hovered at least once, so the full page is (being) fetched
  const [wanted, setWanted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [over, setOver] = useState(false);
  const full = pan && thumb ? image : null;

  useEffect(() => {
    const el = frame.current;
    if (!el || !full || !window.matchMedia("(hover: hover)").matches) return;
    const root = el.closest<HTMLElement>("[data-pan-root]") ?? el;
    const enter = () => {
      setWanted(true);
      setOver(true);
    };
    const leave = () => setOver(false);
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointerleave", leave);
    return () => {
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
    };
  }, [full]);

  const panning = loaded && over;

  return (
    <span ref={frame} className={cn("absolute inset-0 block overflow-hidden", className)}>
      {thumb ? (
        <Image src={thumb} alt={alt} width={1200} height={750} unoptimized priority={priority} className="absolute inset-0 h-full w-full object-cover object-top" />
      ) : (
        <CoverImage src={image} alt={alt} sizes={sizes} priority={priority} className="object-cover object-top" />
      )}
      {full && wanted ? (
        <CoverImage
          src={full}
          alt=""
          aria-hidden="true"
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          className={cn(
            "object-cover transition-[object-position,opacity]",
            loaded ? "opacity-100" : "opacity-0",
            panning ? "object-bottom ease-linear" : "object-top ease-out",
          )}
          style={{ transitionDuration: panning ? `${duration}ms, 300ms` : "1000ms, 300ms" }}
        />
      ) : null}
    </span>
  );
}
