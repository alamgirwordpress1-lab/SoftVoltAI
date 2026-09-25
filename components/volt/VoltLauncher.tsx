"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import "./volt.css";

/**
 * The chat itself — transcript, voice, network — is a separate chunk that
 * loads on the first tap (or when a pointer or focus arrives on the button),
 * so no page pays for it up front.
 */
const VoltPanel = dynamic(() => import("./VoltPanel").then((m) => m.VoltPanel), { ssr: false });

const preload = () => void import("./VoltPanel");

/** Volt, SoftVolt AI's sales assistant: a launcher pinned to the corner of every page. */
export function VoltLauncher({ endpoint }: { endpoint: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    // the button is hidden while the panel is open; give focus back once it is drawn again
    requestAnimationFrame(() => buttonRef.current?.focus());
  }

  return (
    <>
      {/* stays mounted once opened, so closing and reopening keeps the conversation */}
      {mounted ? <VoltPanel endpoint={endpoint} open={open} onClose={close} /> : null}
      <button
        ref={buttonRef}
        type="button"
        hidden={open}
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        onPointerEnter={preload}
        onFocus={preload}
        aria-haspopup="dialog"
        aria-label="Talk to Voice Agent: Power, SoftVolt AI's assistant"
        className="volt-launcher ui"
      >
        {/* a support headset, with the live dot on its corner */}
        <span className="volt-launcher-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3.5 12v-2a6.5 6.5 0 0 1 13 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <rect x="2.5" y="11" width="3.5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="14" y="11" width="3.5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M15.75 16v.5a2 2 0 0 1-2 2H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="volt-orb" />
        </span>
        <span>Talk to Voice Agent</span>
      </button>
    </>
  );
}
