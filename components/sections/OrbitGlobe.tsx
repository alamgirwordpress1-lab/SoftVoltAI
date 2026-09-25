"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import type { GlobeCard, GlobeLocation } from "@/lib/cms/types";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { LogoMark } from "@/components/layout/Logo";
import "./orbit-globe.css";

const DEG = Math.PI / 180;
const START_TILT = 18 * DEG; // north pole leans toward the viewer: UK, US and Bangladesh all sit up top
const MAX_TILT = 80 * DEG; // stop just short of the poles so the globe never flips over
const START_ROT = -45 * DEG; // opens with London and Dhaka both on the front face
const ORBIT = 0.43; // card orbit radius, fraction of the stage
const EARTH = 0.3; // earth radius, fraction of the stage — big enough to read the world map
const LINK_FADE = 0.54; // a card reaches for its country as soon as it is this visible
const LINK_FULL = 0.76; // ...and the line is at full strength by here, well before the card is centred
const BASE_SPEED = 0.0016; // radians per 60fps frame
const HOVER_SPEED = 0.0005;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Canvas colours for each site theme; read every frame, so a theme switch shows at once. */
const PALETTES = {
  light: {
    discTop: "rgba(255,255,255,0.97)",
    discBottom: "rgba(206,223,211,0.94)",
    discEdge: "rgba(18,22,20,0.12)",
    graticule: "rgba(18,22,20,0.08)",
    land: "18,22,20",
    arc: "rgba(30,122,50,0.6)",
    hqEdge: "#121614",
    marketRing: "rgba(30,122,50,0.35)",
    marketFill: "#1e7a32",
    coverageRing: "rgba(18,22,20,0.55)",
    link: "rgba(30,122,50,0.8)",
    linkHalo: "rgba(246,247,244,0.8)",
    linkDot: "#1e7a32",
    labelHalo: "rgba(255,255,255,0.92)",
    label: "#121614",
  },
  dark: {
    discTop: "rgba(40,54,45,0.97)",
    discBottom: "rgba(17,24,20,0.96)",
    discEdge: "rgba(237,242,238,0.14)",
    graticule: "rgba(237,242,238,0.07)",
    land: "205,228,212",
    arc: "rgba(101,245,69,0.7)",
    hqEdge: "#0a0f0c",
    marketRing: "rgba(93,208,106,0.45)",
    marketFill: "#5dd06a",
    coverageRing: "rgba(237,242,238,0.55)",
    link: "rgba(101,245,69,0.82)",
    linkHalo: "rgba(17,24,20,0.8)",
    linkDot: "#65f545",
    labelHalo: "rgba(17,24,20,0.92)",
    label: "#edf2ee",
  },
};

/** Billboard placement of one card on the orbit, after spin (rot) and tilt. x/y in stage percent (cqw). */
function place(azDeg: number, latDeg: number, rot: number, tilt: number, spread: number, base = 1) {
  const lat = latDeg * DEG;
  const a = azDeg * DEG + rot;
  const r = ORBIT * spread;
  const x0 = r * Math.cos(lat) * Math.sin(a);
  const y0 = r * Math.sin(lat);
  const z0 = r * Math.cos(lat) * Math.cos(a);
  const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
  const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
  const f = 1.45 / (1.45 - z);
  const depth = clamp((z / ORBIT + 1) / 2, 0, 1); // 0 far .. 1 near
  return {
    x: 50 + x0 * f * 100,
    y: 50 - y * f * 100,
    s: base * (0.5 + 0.45 * depth) * (0.3 + 0.7 * spread),
    o: Math.min(1, 0.2 + 0.95 * depth) * Math.min(1, spread * 1.5),
    z: Math.round(depth * 90) + (z >= 0 ? 110 : 0),
  };
}

function cardStyle(card: GlobeCard): CSSProperties {
  const v = place(card.az, card.lat, START_ROT, START_TILT, 1, card.scale);
  return {
    ["--x" as string]: v.x.toFixed(2),
    ["--y" as string]: v.y.toFixed(2),
    ["--s" as string]: v.s.toFixed(3),
    opacity: Number(v.o.toFixed(3)),
    zIndex: v.z,
  };
}

export function OrbitGlobe({ cards, locations, label }: { cards: GlobeCard[]; locations: GlobeLocation[]; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;
    const reduced = prefersReducedMotion();

    // The world map is 24,000 points — a third of this page's JavaScript. It
    // loads after hydration rather than before it, so the copy is interactive
    // first and the globe draws a moment later.
    let stop = () => {};
    let cancelled = false;
    void import("@/lib/globe/land-dots").then(({ LAND_DOTS }) => {
      if (!cancelled) stop = start(LAND_DOTS, root, canvas, ctx);
    });
    return () => {
      cancelled = true;
      stop();
    };

    /** Everything the canvas needs, once the map has arrived. Returns its own teardown. */
    function start(LAND_DOTS: readonly number[], root: HTMLDivElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
      const cardEls = Array.from(root.querySelectorAll<HTMLElement>("[data-og-card]"));
      const defs = cardEls.map((el, i) => ({ el, card: cards[i] }));

      // ---- land dots into typed arrays, bucketed by depth when drawn -----------------
      const n = LAND_DOTS.length / 2;
      const lonX = new Float32Array(n);
      const lonZ = new Float32Array(n);
      const sinLat = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const lo = LAND_DOTS[2 * i] * DEG;
        const la = LAND_DOTS[2 * i + 1] * DEG;
        lonX[i] = Math.cos(la) * Math.sin(lo);
        lonZ[i] = Math.cos(la) * Math.cos(lo);
        sinLat[i] = Math.sin(la);
      }
      const BUCKETS = 6;
      const bx = Array.from({ length: BUCKETS }, () => new Float32Array(n));
      const by = Array.from({ length: BUCKETS }, () => new Float32Array(n));
      const count = new Uint16Array(BUCKETS);

      // graticule (meridians and parallels every 30°) as unit vectors
      const gratLines: Float32Array[] = [];
      const pushLine = (pts: [number, number][]) => {
        const arr = new Float32Array(pts.length * 3);
        pts.forEach(([lo, la], k) => {
          const clat = Math.cos(la * DEG);
          arr[k * 3] = clat * Math.sin(lo * DEG);
          arr[k * 3 + 1] = Math.sin(la * DEG);
          arr[k * 3 + 2] = clat * Math.cos(lo * DEG);
        });
        gratLines.push(arr);
      };
      for (let lo = -180; lo < 180; lo += 30) pushLine(Array.from({ length: 33 }, (_, k) => [lo, -80 + k * 5] as [number, number]));
      for (let la = -60; la <= 60; la += 30) pushLine(Array.from({ length: 73 }, (_, k) => [-180 + k * 5, la] as [number, number]));

      const unit = (latDeg: number, lonDeg: number) => {
        const la = latDeg * DEG;
        const lo = lonDeg * DEG;
        return { x: Math.cos(la) * Math.sin(lo), y: Math.sin(la), z: Math.cos(la) * Math.cos(lo) };
      };
      const locs = locations.map((l, i) => ({ ...l, v: unit(l.lat, l.lon), phase: i * 0.37 }));
      const hq = locs.find((l) => l.kind === "hq");
      const arcs = hq
        ? locs
            .filter((l) => l.kind === "market")
            .map((t) => {
              const d = clamp(hq.v.x * t.v.x + hq.v.y * t.v.y + hq.v.z * t.v.z, -1, 1);
              return { from: hq.v, to: t.v, omega: Math.acos(d), phase: t.phase };
            })
        : [];

      /**
       * The country each card belongs to, as a point on the map: the country code
       * on the card is a location id ("UK" -> uk, "DE" -> Germany's pin), Bangladesh
       * is home, and anything else we serve from the European marker.
       */
      const linkTargets = cards.map((card) => {
        if (!("country" in card)) return null;
        const code = card.country.toLowerCase();
        return locs.find((l) => l.id === code) ?? (code === "bd" ? hq : locs.find((l) => l.id === "eu")) ?? null;
      });

      const fontFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-roboto").trim() || "Roboto, sans-serif";

      let px = 0;
      let dpr = 1;
      // resizing a canvas resets its context, the label font with it
      let textReady = false;
      const resize = () => {
        px = root.clientWidth;
        dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.round(px * dpr);
        canvas.height = Math.round(px * dpr);
        textReady = false;
      };
      resize();

      const st = {
        rot: START_ROT,
        tilt: START_TILT,
        speed: reduced ? 0 : 0.05,
        tiltSpeed: 0,
        spread: reduced ? 1 : 0,
        earth: reduced ? 1 : 0,
        time: 0,
      };

      // rotate a unit vector by the current spin (around Y), then the current tilt (around X)
      const view = (x: number, y: number, z: number, cr: number, sr: number, cT: number, sT: number) => {
        const xr = x * cr + z * sr;
        const zr = z * cr - x * sr;
        return { x: xr, y: y * cT - zr * sT, z: y * sT + zr * cT };
      };

      const draw = () => {
        const W = px * dpr;
        ctx.clearRect(0, 0, W, W);
        if (st.earth < 0.002) return;
        const cx = W / 2;
        const cy = W / 2;
        const R = EARTH * W * (0.8 + 0.2 * st.earth);
        const P = R * 3.4;
        const cr = Math.cos(st.rot);
        const sr = Math.sin(st.rot);
        const cT = Math.cos(st.tilt);
        const sT = Math.sin(st.tilt);
        ctx.globalAlpha = st.earth;
        const c = PALETTES[document.documentElement.dataset.theme === "dark" ? "dark" : "light"];

        // disc: soft sea-glass sphere so the dots read as a planet, not noise
        const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.42, R * 0.05, cx, cy, R);
        g.addColorStop(0, c.discTop);
        g.addColorStop(1, c.discBottom);
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.lineWidth = dpr;
        ctx.strokeStyle = c.discEdge;
        ctx.stroke();

        // graticule
        ctx.strokeStyle = c.graticule;
        for (const line of gratLines) {
          ctx.beginPath();
          let pen = false;
          for (let k = 0; k < line.length; k += 3) {
            const p = view(line[k], line[k + 1], line[k + 2], cr, sr, cT, sT);
            if (p.z < 0) {
              pen = false;
              continue;
            }
            const f = P / (P - p.z * R);
            const x = cx + p.x * R * f;
            const y = cy - p.y * R * f;
            if (pen) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
            pen = true;
          }
          ctx.stroke();
        }

        // land: the world map
        count.fill(0);
        for (let i = 0; i < n; i++) {
          const p = view(lonX[i], sinLat[i], lonZ[i], cr, sr, cT, sT);
          if (p.z < -0.02) continue;
          const f = P / (P - p.z * R);
          const b = Math.min(BUCKETS - 1, Math.floor(((p.z + 0.02) / 1.02) * BUCKETS));
          const k = count[b]++;
          bx[b][k] = cx + p.x * R * f;
          by[b][k] = cy - p.y * R * f;
        }
        // square dots: at this size they read the same as circles and draw several times faster
        const dot = Math.max(1.5 * dpr, R / 120);
        for (let b = 0; b < BUCKETS; b++) {
          ctx.fillStyle = `rgba(${c.land},${0.16 + (0.62 * (b + 1)) / BUCKETS})`;
          ctx.beginPath();
          for (let k = 0; k < count[b]; k++) ctx.rect(bx[b][k] - dot / 2, by[b][k] - dot / 2, dot, dot);
          ctx.fill();
        }

        // arcs: Dhaka to each market we serve, with a pulse travelling along each
        for (const arc of arcs) {
          const so = Math.sin(arc.omega) || 1;
          const pts: { x: number; y: number; front: boolean }[] = [];
          for (let s = 0; s <= 48; s++) {
            const u = s / 48;
            const k1 = Math.sin((1 - u) * arc.omega) / so;
            const k2 = Math.sin(u * arc.omega) / so;
            const lift = 1 + 0.24 * Math.sin(Math.PI * u);
            const p = view(
              (arc.from.x * k1 + arc.to.x * k2) * lift,
              (arc.from.y * k1 + arc.to.y * k2) * lift,
              (arc.from.z * k1 + arc.to.z * k2) * lift,
              cr,
              sr,
              cT,
              sT,
            );
            const f = P / (P - p.z * R);
            pts.push({ x: cx + p.x * R * f, y: cy - p.y * R * f, front: p.z > -0.15 });
          }
          ctx.beginPath();
          let pen = false;
          for (const q of pts) {
            if (!q.front) {
              pen = false;
              continue;
            }
            if (pen) ctx.lineTo(q.x, q.y);
            else ctx.moveTo(q.x, q.y);
            pen = true;
          }
          ctx.setLineDash([4 * dpr, 5 * dpr]);
          ctx.lineDashOffset = -st.time * 24 * dpr;
          ctx.strokeStyle = c.arc;
          ctx.lineWidth = 1.5 * dpr;
          ctx.stroke();
          ctx.setLineDash([]);

          const u = (st.time * 0.22 + arc.phase) % 1;
          const q = pts[Math.round(u * 48)];
          if (q.front) {
            ctx.beginPath();
            ctx.arc(q.x, q.y, 7 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(101,245,69,0.28)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(q.x, q.y, 3 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = "#65f545";
            ctx.fill();
          }
        }

        // leader lines: every card is joined to the country it is in, in the same
        // dashed signal as the arcs. The line fades up as the card swings to the
        // front, so the nearest ones read clearly and the ones going round the back
        // thin out instead of crossing the globe.
        const linked = new Set<string>();
        const candidates: { id: string; sx: number; sy: number; x: number; y: number; o: number }[] = [];
        for (let i = 0; i < cards.length; i++) {
          const target = linkTargets[i];
          if (!target) continue;
          const card = cards[i];
          const v = place(card.az, card.lat, st.rot, st.tilt, st.spread, card.scale);
          if (v.o < LINK_FADE) continue;
          const p = view(target.v.x, target.v.y, target.v.z, cr, sr, cT, sT);
          if (p.z < 0.06) continue;
          const f = P / (P - p.z * R);
          candidates.push({
            id: target.id,
            sx: cx + p.x * R * f,
            sy: cy - p.y * R * f,
            // the card's own anchor: the line ends under the card, which hides the join
            x: (v.x / 100) * W,
            y: (v.y / 100) * W,
            o: Math.min(1, (v.o - LINK_FADE) / (LINK_FULL - LINK_FADE)) * Math.min(1, (p.z - 0.06) * 6),
          });
        }
        // faintest first, so the nearest card's line is drawn over the others
        candidates.sort((a, b) => a.o - b.o);
        for (const link of candidates) {
          const dx = link.x - link.sx;
          const dy = link.y - link.sy;
          ctx.globalAlpha = st.earth * link.o;
          const path = new Path2D();
          path.moveTo(link.sx, link.sy);
          // a gentle bow, so it reads as a signal rather than a ruler
          path.quadraticCurveTo((link.sx + link.x) / 2 - dy * 0.1, (link.sy + link.y) / 2 + dx * 0.1, link.x, link.y);
          ctx.strokeStyle = c.linkHalo;
          ctx.lineWidth = 4 * dpr;
          ctx.stroke(path);
          ctx.setLineDash([3 * dpr, 4 * dpr]);
          ctx.lineDashOffset = -st.time * 16 * dpr;
          ctx.strokeStyle = c.link;
          ctx.lineWidth = 1.6 * dpr;
          ctx.stroke(path);
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(link.sx, link.sy, 2.6 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = c.linkDot;
          ctx.fill();
          linked.add(link.id);
        }
        ctx.globalAlpha = st.earth;

        // markers + labels. The font is set once per canvas size, not every frame:
        // each assignment makes the browser recompute the whole page's styles first.
        if (!textReady) {
          ctx.font = `600 ${11 * dpr}px ${fontFamily}`;
          ctx.textBaseline = "middle";
          ctx.direction = "ltr";
          textReady = true;
        }
        const labelBoxes: number[][] = [];
        for (const l of locs) {
          const p = view(l.v.x, l.v.y, l.v.z, cr, sr, cT, sT);
          if (p.z < 0.03) continue;
          const f = P / (P - p.z * R);
          const sx = cx + p.x * R * f;
          const sy = cy - p.y * R * f;
          ctx.globalAlpha = st.earth * Math.min(1, p.z * 4);
          if (l.kind === "hq") {
            const pr = (st.time * 0.55) % 1;
            ctx.beginPath();
            ctx.arc(sx, sy, (6 + 20 * pr) * dpr, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(101,245,69,${0.8 * (1 - pr)})`;
            ctx.lineWidth = 2 * dpr;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(sx, sy, 5.5 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = "#65f545";
            ctx.fill();
            ctx.strokeStyle = c.hqEdge;
            ctx.stroke();
          } else if (l.kind === "market") {
            ctx.beginPath();
            ctx.arc(sx, sy, 9 * dpr, 0, Math.PI * 2);
            if (linked.has(l.id)) {
              ctx.fillStyle = c.link;
              ctx.globalAlpha *= 0.22;
              ctx.fill();
              ctx.globalAlpha = st.earth * Math.min(1, p.z * 4);
            }
            ctx.strokeStyle = c.marketRing;
            ctx.lineWidth = 1.5 * dpr;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(sx, sy, 4.5 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = c.marketFill;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(sx, sy, 4 * dpr, 0, Math.PI * 2);
            ctx.strokeStyle = c.coverageRing;
            ctx.lineWidth = 1.5 * dpr;
            ctx.stroke();
          }
          // HQ and markets are labelled; coverage rings are not. A label that would
          // overlap one already drawn this frame is skipped rather than stacked.
          if (p.z > 0.3 && (l.kind !== "coverage" || linked.has(l.id))) {
            const lx = sx + 13 * dpr;
            const half = 8 * dpr;
            const box = [lx - 4 * dpr, sy - half, lx + ctx.measureText(l.label).width + 4 * dpr, sy + half];
            if (!labelBoxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) {
              labelBoxes.push(box);
              ctx.lineWidth = 4 * dpr;
              ctx.strokeStyle = c.labelHalo;
              ctx.strokeText(l.label, lx, sy);
              ctx.fillStyle = c.label;
              ctx.fillText(l.label, lx, sy);
            }
          }
        }
        ctx.globalAlpha = 1;
      };

      const placeCards = () => {
        for (const d of defs) {
          const v = place(d.card.az, d.card.lat, st.rot, st.tilt, st.spread, d.card.scale);
          const s = d.el.style;
          s.setProperty("--x", v.x.toFixed(2));
          s.setProperty("--y", v.y.toFixed(2));
          s.setProperty("--s", v.s.toFixed(3));
          s.opacity = v.o.toFixed(3);
          s.zIndex = String(v.z);
        }
      };

      // ---- interaction: hover slows the orbit; drag rotates it in any direction, with inertia --
      let hover = false;
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let visible = true;
      const onEnter = (e: PointerEvent) => {
        if (e.pointerType === "mouse") hover = true;
      };
      const onLeave = () => {
        hover = false;
      };
      const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        st.speed = 0;
        st.tiltSpeed = 0;
        root.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        const yaw = (dx / Math.max(1, px)) * Math.PI;
        st.rot += yaw;
        st.speed = yaw;
        // on touch, vertical movement stays with page scrolling; mouse and pen also tilt the globe
        if (e.pointerType !== "touch") {
          const pitch = (dy / Math.max(1, px)) * Math.PI;
          st.tilt = clamp(st.tilt + pitch, -MAX_TILT, MAX_TILT);
          st.tiltSpeed = pitch;
        }
        if (reduced) {
          draw();
          placeCards();
        }
      };
      const onUp = (e: PointerEvent) => {
        dragging = false;
        if (root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId);
        if (reduced) {
          st.speed = 0;
          st.tiltSpeed = 0;
        }
      };
      root.addEventListener("pointerenter", onEnter);
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("pointerdown", onDown);
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerup", onUp);
      root.addEventListener("pointercancel", onUp);

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: "120px" },
      );
      io.observe(root);

      const ro = new ResizeObserver(() => {
        resize();
        draw();
      });
      ro.observe(root);

      const themeWatch = new MutationObserver(() => draw());
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      const detach = () => {
        io.disconnect();
        ro.disconnect();
        themeWatch.disconnect();
        root.removeEventListener("pointerenter", onEnter);
        root.removeEventListener("pointerleave", onLeave);
        root.removeEventListener("pointerdown", onDown);
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerup", onUp);
        root.removeEventListener("pointercancel", onUp);
      };

      root.classList.add("og-live");

      if (reduced) {
        draw();
        placeCards();
        return detach;
      }

      // intro: the earth fades up, then the cards burst out of it while the spin settles
      placeCards();
      gsap.to(st, { earth: 1, duration: 1.4, ease: "power2.out", delay: 0.15 });
      gsap.to(st, { spread: 1, duration: 2.4, ease: "expo.out", delay: 0.4 });

      const tick = (_time: number, deltaTime: number) => {
        if (!visible || document.hidden) return;
        const dr = gsap.ticker.deltaRatio(60);
        st.time += deltaTime / 1000;
        if (!dragging) {
          const target = hover ? HOVER_SPEED : BASE_SPEED;
          st.speed += (target - st.speed) * (1 - Math.pow(0.975, dr));
          st.rot += st.speed * dr;
          if (Math.abs(st.tiltSpeed) > 1e-5) {
            st.tilt = clamp(st.tilt + st.tiltSpeed * dr, -MAX_TILT, MAX_TILT);
            st.tiltSpeed *= Math.pow(0.9, dr);
          }
        }
        // Canvas first, cards second: both read the same state, so the frame is the
        // same, but the canvas text calls no longer find styles the cards just
        // changed and make the browser recompute them on the spot, every frame.
        draw();
        placeCards();
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        gsap.killTweensOf(st);
        detach();
      };
    }
  }, [cards, locations]);

  return (
    <div ref={rootRef} className="og" role="img" aria-label={label}>
      <canvas ref={canvasRef} className="og-canvas" aria-hidden="true" />
      {cards.map((c) => (
        <div key={c.id} data-og-card className={`og-card og-card--${c.kind}`} style={cardStyle(c)} aria-hidden="true">
          <CardBody card={c} />
        </div>
      ))}
    </div>
  );
}

/** Stands in for a client with no logo file: "The Bulk Bag Man" → "BB", "MobileDokan24" → "MD". */
function initials(name: string) {
  const words = name.split(/\s+/).filter((w) => !/^(the|and|of|in|for|an?|&)$/i.test(w));
  if (words.length > 1)
    return words
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  const word = words[0] ?? name;
  // a compound name has its own capitals to borrow: MobileDokan24
  const caps = word.match(/[A-Z]/g);
  return (caps && caps.length > 1 ? caps.slice(0, 2).join("") : word.slice(0, 2)).toUpperCase();
}

function CardBody({ card }: { card: GlobeCard }) {
  switch (card.kind) {
    case "client":
      return (
        <>
          <span className="og-avatar">
            <Image src={card.photo} alt="" fill sizes="(min-width: 1024px) 140px, 26vw" className="object-cover" draggable={false} />
            <span className="og-flag og-avatar-flag">{card.country}</span>
          </span>
          <span className="og-client">
            <span className="og-client-name">{card.name}</span>
            <span className="og-client-role">
              {card.role} · {card.company}
            </span>
          </span>
        </>
      );
    case "logo":
      return (
        <>
          <span className={card.logo ? "og-badge" : "og-badge og-badge--mono"}>
            {card.logo ? (
              <Image
                src={card.logo}
                alt=""
                fill
                sizes="(min-width: 1024px) 130px, 24vw"
                className={`og-badge-img${card.logoFill ? " og-badge-img--fill" : ""}`}
                draggable={false}
              />
            ) : (
              <span className="og-badge-initials">{initials(card.name)}</span>
            )}
            <span className="og-flag og-avatar-flag">{card.country}</span>
          </span>
          <span className="og-client">
            <span className="og-client-name">{card.name}</span>
            <span className="og-client-role">{card.work}</span>
          </span>
        </>
      );
    case "site":
      return (
        <>
          <div className="og-shot">
            <Image src={card.image} alt="" fill sizes="(min-width: 1024px) 260px, 36vw" className="object-cover object-top" draggable={false} />
          </div>
          <div className="og-meta">
            <span className="og-flag">{card.country}</span>
            <span className="og-title">{card.title}</span>
            <span className="og-work">{card.work}</span>
          </div>
        </>
      );
    case "cities":
      return (
        <>
          {card.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </>
      );
    case "brand":
      return (
        <>
          <LogoMark size={40} id={`og-${card.id}`} className="h-[4.6cqw] w-[4.6cqw]" />
          <div>
            <p className="og-brand-title">{card.title}</p>
            <p className="og-brand-sub">{card.sub}</p>
          </div>
        </>
      );
    case "stack":
      return (
        <>
          <p className="og-stack-title">{card.title}</p>
          <ul className="og-stack-list">
            {card.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </>
      );
    case "hours":
      return (
        <>
          <span className="og-hours-dot" />
          <div>
            <p className="og-hours-big">{card.big}</p>
            <p className="og-hours-sub mt-[0.8cqw]">{card.sub}</p>
          </div>
        </>
      );
  }
}
