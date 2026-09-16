"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { slugify } from "@/lib/utils";

/**
 * Two copies of the same deliverable sit on top of each other: the client's
 * finished website (surface) and the engine room that built it (dark, masked
 * to a circular lens). When the stage scrolls into view the site assembles,
 * the lens sweeps across it, then follows the pointer — or drifts on its own,
 * so touch visitors see both layers too. Paused while off screen.
 * The stage is `keep-light`: it shows a client's website, so it stays light
 * when the visitor switches this site to the dark theme.
 */
export function HeroStage({ agency, brand }: { agency: string; brand: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const slug = slugify(agency);
  const name = agency.trim() || "Your Agency";

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const pos = { x: 0.68, y: 0.42 }; // lens centre as fractions of the stage
    const toX = gsap.quickTo(pos, "x", { duration: 0.9, ease: "power3.out" });
    const toY = gsap.quickTo(pos, "y", { duration: 0.9, ease: "power3.out" });
    const paint = () => {
      stage.style.setProperty("--lx", `${(pos.x * 100).toFixed(2)}%`);
      stage.style.setProperty("--ly", `${(pos.y * 100).toFixed(2)}%`);
    };

    if (prefersReducedMotion()) {
      stage.classList.add("stage-ready");
      paint();
      return;
    }

    let mode: "idle" | "intro" | "pointer" | "drift" = "idle";
    let visible = false;
    let t = 0;
    const tick = () => {
      if (!visible) return;
      if (mode === "drift") {
        t += 0.004; // slow figure-of-eight
        toX(0.5 + 0.3 * Math.sin(t));
        toY(0.48 + 0.26 * Math.sin(t * 2));
      }
      paint();
    };
    gsap.ticker.add(tick);

    let tl: gsap.core.Timeline | undefined;
    const startIntro = () => {
      mode = "intro";
      const pieces = stage.querySelectorAll<HTMLElement>(".mock-piece");
      tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          if (mode === "intro") mode = "drift";
        },
      });
      tl.to(pieces, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", stagger: 0.06 });
      tl.add(() => {
        stage.classList.add("stage-ready");
        gsap.set(pieces, { clearProps: "transform,opacity" });
      });
      tl.fromTo(pos, { x: -0.1, y: 0.5 }, { x: 0.32, y: 0.3, duration: 1.1, ease: "power2.inOut" }, "-=0.2");
      tl.to(pos, { x: 0.62, y: 0.6, duration: 1.2, ease: "power2.inOut" });
      tl.to(pos, { x: 0.7, y: 0.42, duration: 0.9, ease: "power2.inOut" });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && mode === "idle") startIntro();
      },
      { threshold: 0.2 },
    );
    io.observe(stage);

    let leaveTimer: number | undefined;
    const onMove = (e: PointerEvent) => {
      if (mode === "intro" || mode === "idle") return;
      const r = stage.getBoundingClientRect();
      mode = "pointer";
      window.clearTimeout(leaveTimer);
      toX((e.clientX - r.left) / r.width);
      toY((e.clientY - r.top) / r.height);
    };
    const onLeave = () => {
      if (mode !== "pointer") return;
      leaveTimer = window.setTimeout(() => {
        t = Math.asin(Math.min(1, Math.max(-1, (pos.x - 0.5) / 0.3)));
        mode = "drift";
      }, 1200);
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    return () => {
      io.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      window.clearTimeout(leaveTimer);
      gsap.ticker.remove(tick);
      tl?.kill();
    };
  }, []);

  return (
    <div ref={stageRef} className="hero-stage keep-light" style={{ ["--brand" as string]: brand }}>
      <div className="stage-chrome" aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="url">harbour-dental.co.uk</span>
        <span className="hidden whitespace-nowrap sm:inline">
          Website by <span className="mock-brand font-medium">{name}</span>
        </span>
      </div>

      {/* ---------- surface: what the client sees ---------- */}
      <div className="hero-layer hero-surface" aria-hidden="true">
        <div className="mock-piece flex items-center justify-between rounded-lg border border-line px-3 py-2 text-[12px]">
          <span className="mock-brand font-semibold">Harbour Dental</span>
          <span className="hidden gap-3 text-muted sm:flex">
            <span>Treatments</span>
            <span>Team</span>
            <span>Fees</span>
          </span>
          <span className="mock-brand-bg rounded-md px-2 py-1 text-[11px] font-medium text-white">Book online</span>
        </div>

        <div className="mock-piece mock-block flex flex-col justify-end p-4 sm:p-6">
          <p className="display text-[clamp(1.4rem,3vw,2.4rem)] leading-[1.02]">Gentle dentistry, five minutes from the harbour.</p>
          <p className="mt-2 max-w-[34ch] text-[12px] text-muted sm:text-[13px]">Same-week appointments for new patients. Emergency slots held every morning.</p>
          <span className="mock-brand-bg mt-3 inline-block w-max rounded-md px-3 py-1.5 text-[11px] font-medium text-white">Book a check-up</span>
        </div>

        <div className="mock-piece grid grid-cols-3 gap-2 text-[11px]">
          {["Check-ups", "Whitening", "Emergency"].map((t) => (
            <div key={t} className="rounded-lg border border-line p-2.5">
              <span className="mock-brand-bg mb-2 block h-1.5 w-6 rounded-full" />
              <span className="font-medium">{t}</span>
            </div>
          ))}
        </div>

        <div className="mock-piece flex items-center justify-between border-t border-line pt-2 text-[10px] text-muted">
          <span>© Harbour Dental</span>
          <span>
            Website by <span className="mock-brand font-semibold">{name}</span>
          </span>
        </div>
      </div>

      {/* ---------- engine room: what the agency's client never sees ---------- */}
      <div className="hero-layer hero-engine code" aria-hidden="true">
        <div className="mock-piece flex items-center justify-between rounded-lg border border-er-line px-3 py-2 text-[11px]">
          <span className="text-volt">staging.{slug}.co.uk</span>
          <span className="hidden text-er-muted sm:inline">branch {slug}/harbour-dental</span>
        </div>

        <div className="mock-piece mock-block overflow-hidden p-4 text-[11px] leading-[1.7] text-er-muted sm:p-6 sm:text-[12px]">
          <p>
            <span className="text-volt">{"<?php"}</span> add_action(<span className="text-er-ink">&apos;woocommerce_checkout_process&apos;</span>,
          </p>
          <p className="pl-4">
            <span className="text-er-ink">&apos;{slug.replace(/-/g, "_")}_validate_slot&apos;</span>);
          </p>
          <p className="mt-2 text-er-ink">$ pnpm build</p>
          <p>
            ✓ 48 pages · <span className="text-volt">LCP 1.6s</span> · CLS 0.00
          </p>
          <p className="mt-2">
            <span className="text-volt">feat</span>(booking): same-week slots + Klarna
          </p>
          <p>
            <span className="text-volt">perf</span>(images): AVIF, 4.1s → 1.6s
          </p>
          <p>
            <span className="text-volt">a11y</span>: WCAG 2.2 AA pass, 42/42 checks
          </p>
        </div>

        <div className="mock-piece grid grid-cols-3 gap-2 text-[10px]">
          {[
            ["QA", "42 / 42"],
            ["Devices", "9 real"],
            ["Producer", "named"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-er-line p-2.5">
              <span className="block text-er-muted">{k}</span>
              <span className="text-er-ink">{v}</span>
            </div>
          ))}
        </div>

        <div className="mock-piece flex items-center justify-between border-t border-er-line pt-2 text-[10px]">
          <span className="text-er-muted">handover → {slug}</span>
          <span className="text-volt">client never sees this</span>
        </div>
      </div>

      <div className="hero-lens" aria-hidden="true" />
    </div>
  );
}
