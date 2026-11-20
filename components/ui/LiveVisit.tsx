"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteHost } from "@/components/ui/PrivateBuildPanel";
import { cn } from "@/lib/utils";
import "./live-viewer.css";

type Device = "desktop" | "tablet" | "phone";

/** The widths the preview takes, as the agency would check a build: full width, an iPad, a phone. */
const DEVICES: { id: Device; label: string; width: string }[] = [
  { id: "desktop", label: "Desktop", width: "100%" },
  { id: "tablet", label: "Tablet", width: "768px" },
  { id: "phone", label: "Phone", width: "390px" },
];

type Frame = "checking" | "live" | "blocked";

/**
 * "Live visit": a button that opens the client's live site inside the page, in a
 * full-screen viewer with desktop, tablet and phone widths, so a visitor can
 * check the real build without leaving the case study.
 *
 * Some sites refuse to be shown inside another page (X-Frame-Options or CSP
 * frame-ancestors). /api/embed-check reads those headers on the server first;
 * a site that refuses gets its full-page screenshot in the frame instead, with
 * the link to open it in a new tab. If the check itself cannot answer, the
 * frame is tried anyway.
 */
export function LiveVisit({
  url,
  title,
  image,
  variant = "overlay",
  label = "Live visit",
  check = true,
  siteLabel,
  className,
}: {
  url: string;
  title: string;
  /** The full-page screenshot, shown when the site cannot be framed. */
  image?: string;
  /** "overlay" sits on a screenshot (a glass button); "button" sits in a row of buttons. */
  variant?: "overlay" | "button";
  label?: string;
  /** Ask /api/embed-check first. Off for our own demos, which always frame. */
  check?: boolean;
  /** What the top bar shows instead of the host, e.g. the design's name. */
  siteLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={cn(variant === "overlay" ? "live-visit-glass" : "live-visit-button", className)}
      >
        <EyeIcon />
        {label}
      </button>
      {open ? <LiveViewer url={url} title={title} image={image} check={check} siteLabel={siteLabel} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function LiveViewer({ url, title, image, check, siteLabel, onClose }: { url: string; title: string; image?: string; check: boolean; siteLabel?: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [frame, setFrame] = useState<Frame>(check ? "checking" : "live");
  const [loaded, setLoaded] = useState(false);
  const host = siteLabel ?? siteHost(url);
  const width = DEVICES.find((d) => d.id === device)?.width ?? "100%";

  // the native modal brings the focus trap, Escape and an inert page behind it
  useEffect(() => {
    const d = dialog.current;
    const root = document.documentElement;
    if (!d) return;
    if (!d.open) d.showModal();
    root.dataset.liveOpen = "";
    return () => {
      delete root.dataset.liveOpen;
      if (d.open) d.close();
    };
  }, []);

  useEffect(() => {
    if (!check) return;
    let alive = true;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 5000);
    fetch(`/api/embed-check?url=${encodeURIComponent(url)}`, { signal: ctl.signal })
      .then((r) => (r.ok ? (r.json() as Promise<{ embeddable?: boolean | null }>) : null))
      .then((j) => {
        if (alive) setFrame(j?.embeddable === false ? "blocked" : "live");
      })
      .catch(() => {
        if (alive) setFrame("live");
      })
      .finally(() => clearTimeout(timer));
    return () => {
      alive = false;
      clearTimeout(timer);
      ctl.abort();
    };
  }, [url, check]);

  // a site that never fires load (a slow server, a blocked frame) must not keep the spinner forever
  useEffect(() => {
    if (frame !== "live" || loaded) return;
    const t = setTimeout(() => setLoaded(true), 12000);
    return () => clearTimeout(t);
  }, [frame, loaded]);

  return (
    <dialog
      ref={dialog}
      className="live-viewer"
      aria-label={`Live preview: ${title}`}
      data-lenis-prevent
      // Escape: leave through the same path as Back. There is no onClose on purpose:
      // unmounting closes the dialog, and that close event must not close it twice.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="live-bar">
          <button type="button" onClick={onClose} className="live-back justify-self-start">
            <BackIcon />
            Back
          </button>

          <div role="group" aria-label="Preview size" className="flex gap-2 max-md:hidden">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-label={d.label}
                title={d.label}
                aria-pressed={device === d.id}
                onClick={() => setDevice(d.id)}
                className="live-device"
              >
                <DeviceIcon device={d.id} />
              </button>
            ))}
          </div>

          <a href={url} target="_blank" rel="noopener noreferrer" className="live-open justify-self-end" aria-label={`Open ${host} in a new tab`}>
            <span className="mono max-sm:hidden">{host}</span>
            <ExternalIcon />
          </a>
        </div>

        <div className="min-h-0 flex-1 px-[clamp(0.75rem,3vw,3rem)] pb-4">
          <div className="live-stage" style={{ width }}>
            {frame === "live" ? (
              <iframe
                src={url}
                title={`Live site: ${title}`}
                // no allow-top-navigation: the framed site can never take over this page
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setLoaded(true)}
                className="absolute inset-0 size-full border-0 bg-white"
              />
            ) : null}

            {frame === "blocked" ? (
              <div className="absolute inset-0 flex flex-col">
                <p className="live-note">
                  {host} does not allow previews inside other websites, so this is a full-page screenshot.{" "}
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Open the live site ↗
                  </a>
                </p>
                {image ? (
                  <div className="min-h-0 flex-1 overflow-y-auto bg-white" data-lenis-prevent>
                    <Image src={image} alt={`${title}: full-page screenshot`} width={1440} height={4000} sizes="100vw" className="block h-auto w-full" />
                  </div>
                ) : (
                  <div className="grid flex-1 place-items-center bg-white p-8 text-center">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="live-visit-button">
                      Open {host} in a new tab ↗
                    </a>
                  </div>
                )}
              </div>
            ) : null}

            {frame === "checking" || (frame === "live" && !loaded) ? (
              <div className="live-loading" role="status">
                <span className="live-spinner" aria-hidden="true" />
                <span className="mono text-[12px] uppercase tracking-[0.1em]">Loading {host}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </dialog>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.42 8.1 7.36 5 12 5s8.58 3.1 9.94 6.65a1 1 0 0 1 0 .7C20.58 15.9 16.64 19 12 19s-8.58-3.1-9.94-6.65" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function DeviceIcon({ device }: { device: Device }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (device === "desktop")
    return (
      <svg {...common}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    );
  if (device === "tablet")
    return (
      <svg {...common}>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}
