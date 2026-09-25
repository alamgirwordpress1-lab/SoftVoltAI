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
        <span className="volt-orb" aria-hidden="true" />
        <span>Talk to Voice Agent</span>
      </button>
    </>
  );
}
