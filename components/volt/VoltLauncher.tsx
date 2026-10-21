"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { SupportIcon } from "./SupportIcon";
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

  const openPanel = useCallback(() => {
    setMounted(true);
    setOpen(true);
    // the back-to-top button in this corner steps aside while the panel is open
    document.documentElement.setAttribute("data-volt-open", "");
  }, []);

  // a page can open the agent too (a product page's "Try the live demo"): it
  // checks data-volt-ready, then sends a "volt:open" event
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-volt-ready", "");
    window.addEventListener("volt:open", openPanel);
    return () => {
      root.removeAttribute("data-volt-ready");
      window.removeEventListener("volt:open", openPanel);
    };
  }, [openPanel]);

  function close() {
    setOpen(false);
    document.documentElement.removeAttribute("data-volt-open");
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
        onClick={openPanel}
        onPointerEnter={preload}
        onFocus={preload}
        aria-haspopup="dialog"
        aria-label="Talk to Voice Agent: Power, SoftVolt AI's assistant"
        className="volt-launcher ui"
      >
        <SupportIcon />
        <span>Talk to Voice Agent</span>
      </button>
    </>
  );
}
