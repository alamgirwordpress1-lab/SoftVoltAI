import { cn } from "@/lib/utils";
import "./illustrations.css";

export type ArtVariant = "build" | "automate" | "grow" | "support" | "agency";

/** Maps a pillar name or id from WordPress ("Build", "grow", "Grow & Support") to a drawing. */
export function pillarArt(name: string | undefined): ArtVariant {
  const n = (name ?? "").toLowerCase();
  if (n.includes("automat")) return "automate";
  if (n.includes("grow")) return "grow";
  if (n.includes("support")) return "support";
  return "build";
}

/**
 * Our own line illustrations for the service and agency pages. Pure SVG, no
 * images and no words, so nothing here is copy. Lines draw in when the block
 * reveals (the .draw-path rule in globals.css), small parts float, and with a
 * fine pointer PageFx moves the [data-depth] layers for a parallax tilt. Under
 * reduced motion everything renders still and complete.
 */
export function ServiceArt({ variant, className }: { variant: ArtVariant; className?: string }) {
  return (
    <div className={cn("sva", `sva-${variant}`, className)} data-reveal data-parallax aria-hidden="true">
      <svg viewBox="0 0 480 360" fill="none" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        <Backdrop />
        {variant === "build" ? <Build /> : null}
        {variant === "automate" ? <Automate /> : null}
        {variant === "grow" ? <Grow /> : null}
        {variant === "support" ? <Support /> : null}
        {variant === "agency" ? <Agency /> : null}
      </svg>
    </div>
  );
}

const DOTS = Array.from({ length: 9 * 7 }, (_, i) => ({ x: 48 + (i % 9) * 48, y: 36 + Math.floor(i / 9) * 48 }));

function Backdrop() {
  return (
    <g data-depth="0.25">
      {DOTS.map((d) => (
        <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r="1.6" className="sva-dot" />
      ))}
      <circle cx="240" cy="180" r="150" className="sva-ring sva-spin" />
      <circle cx="240" cy="180" r="104" className="sva-ring2" />
      <circle cx="240" cy="180" r="120" className="sva-glow" />
    </g>
  );
}

/** Build: a site taking shape in a browser window, with a code chip and a component block. */
function Build() {
  return (
    <>
      <g data-depth="0.6">
        <rect x="90" y="70" width="300" height="214" rx="16" className="sva-card" />
        <path d="M90 98 H390" className="sva-stroke-line" />
        <circle cx="110" cy="84" r="4.5" className="sva-fill-danger" />
        <circle cx="126" cy="84" r="4.5" className="sva-fill-warn" />
        <circle cx="142" cy="84" r="4.5" className="sva-fill-volt" />
        <rect x="164" y="78" width="150" height="12" rx="6" className="sva-fill-raised" />
        <rect x="112" y="116" width="150" height="14" rx="5" className="sva-fill-ink sva-grow-x" />
        <rect x="112" y="138" width="118" height="8" rx="4" className="sva-fill-muted sva-grow-x" style={{ animationDelay: "0.15s" }} />
        <rect x="112" y="152" width="96" height="8" rx="4" className="sva-fill-muted sva-grow-x" style={{ animationDelay: "0.25s" }} />
        <rect x="112" y="170" width="62" height="20" rx="10" className="sva-fill-volt sva-pop" />
        <rect x="282" y="114" width="88" height="76" rx="10" className="sva-fill-soft sva-stroke-acc" />
        <path pathLength={1} d="M290 178 L312 152 L328 168 L342 156 L362 178" className="draw-path sva-stroke-acc sva-w2" />
        <circle cx="348" cy="132" r="7" className="sva-fill-volt sva-pop" />
        {[112, 202, 292].map((x, i) => (
          <g key={x} className="sva-rise" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
            <rect x={x} y="206" width="78" height="62" rx="9" className="sva-fill-raised sva-stroke-line" />
            <rect x={x + 10} y="218" width="22" height="22" rx="6" className={i === 1 ? "sva-fill-volt" : "sva-fill-soft"} />
            <rect x={x + 10} y="248" width="50" height="6" rx="3" className="sva-fill-muted" />
          </g>
        ))}
        <g className="sva-cursor">
          <path d="M236 176 L236 204 L244 196 L250 210 L256 207 L250 194 L261 193 Z" className="sva-fill-ink sva-stroke-surface" />
        </g>
      </g>
      <g data-depth="1.3">
        <g className="sva-bob">
          <rect x="344" y="38" width="84" height="46" rx="14" className="sva-fill-ink" />
          <path d="M370 52 L360 61 L370 70 M402 52 L412 61 L402 70 M392 50 L380 72" className="sva-stroke-volt sva-w3" />
        </g>
      </g>
      <g data-depth="1.1">
        <g className="sva-bob sva-bob-2">
          <rect x="44" y="234" width="72" height="72" rx="16" className="sva-card" />
          <rect x="60" y="250" width="17" height="17" rx="4" className="sva-fill-soft" />
          <rect x="83" y="250" width="17" height="17" rx="4" className="sva-fill-volt" />
          <rect x="60" y="273" width="17" height="17" rx="4" className="sva-fill-soft" />
          <rect x="83" y="273" width="17" height="17" rx="4" className="sva-fill-soft" />
        </g>
      </g>
    </>
  );
}

/** Automate: a bolt at the centre routing work between tools, with pulses running along the wires. */
function Automate() {
  const nodes = [
    { x: 96, y: 92, d: "M78 84 H114 V104 H78 Z M78 84 L96 96 L114 84" },
    { x: 384, y: 92, d: "M368 82 H400 V106 H368 Z M368 90 H400 M376 78 V86 M392 78 V86" },
    { x: 96, y: 268, d: "M78 258 H114 V274 H90 L82 282 V274 H78 Z" },
    { x: 384, y: 268, d: "M370 258 C370 252 398 252 398 258 V280 C398 286 370 286 370 280 Z M370 258 C370 264 398 264 398 258 M370 269 C370 275 398 275 398 269" },
  ];
  const wires = ["M206 160 C160 150 140 110 128 100", "M274 160 C320 150 340 110 352 100", "M206 200 C160 210 140 250 128 260", "M274 200 C320 210 340 250 352 260"];
  return (
    <>
      <g data-depth="0.5">
        {wires.map((w) => (
          <path key={w} pathLength={1} d={w} className="draw-path sva-stroke-line-strong sva-w2" />
        ))}
        {wires.map((w, i) => (
          <path key={`f-${w}`} d={w} className="sva-flow" style={{ animationDelay: `${i * -0.6}s` }} />
        ))}
      </g>
      <g data-depth="0.9">
        {nodes.map((n, i) => (
          <g key={n.x + "-" + n.y} className="sva-pop" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
            <rect x={n.x - 34} y={n.y - 28} width="68" height="56" rx="14" className="sva-card" />
            <path d={n.d} className="sva-stroke-ink sva-w2" />
          </g>
        ))}
      </g>
      <g data-depth="1.2">
        <circle cx="240" cy="180" r="62" className="sva-halo" />
        <circle cx="240" cy="180" r="46" className="sva-fill-er" />
        <path d="M248 150 L222 186 H240 L232 212 L260 174 H242 Z" className="sva-fill-volt" />
      </g>
      <g data-depth="1.5">
        <g className="sva-bob">
          <g className="sva-gear">
            <circle cx="410" cy="182" r="14" className="sva-stroke-acc sva-w3" />
            <path d="M410 160 V166 M410 198 V204 M388 182 H394 M426 182 H432 M394 166 L398 170 M422 194 L426 198 M394 198 L398 194 M422 170 L426 166" className="sva-stroke-acc sva-w3" />
          </g>
        </g>
      </g>
    </>
  );
}

/** Grow: a chart climbing, a search lens and a ranking chip. */
function Grow() {
  const bars = [44, 66, 58, 92, 118, 150];
  return (
    <>
      <g data-depth="0.6">
        <rect x="78" y="62" width="300" height="236" rx="16" className="sva-card" />
        <path d="M108 92 V262 H352" className="sva-stroke-line-strong sva-w2" />
        {[132, 172, 212].map((y) => (
          <path key={y} d={`M108 ${y} H352`} className="sva-stroke-line sva-dash" />
        ))}
        {bars.map((h, i) => (
          <rect
            key={i}
            x={124 + i * 38}
            y={262 - h}
            width="24"
            height={h}
            rx="6"
            className={cn("sva-bar", i === bars.length - 1 ? "sva-fill-volt" : "sva-fill-soft sva-stroke-acc")}
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          />
        ))}
        <path pathLength={1} d="M136 206 L174 184 L212 196 L250 158 L288 132 L326 96" className="draw-path sva-stroke-ink sva-w3" />
        <path d="M312 94 L328 94 L328 110" className="sva-stroke-ink sva-w3 sva-pop" style={{ animationDelay: "1.2s" }} />
      </g>
      <g data-depth="1.3">
        <g className="sva-bob">
          <circle cx="410" cy="88" r="30" className="sva-card" />
          <circle cx="406" cy="84" r="11" className="sva-stroke-acc sva-w3" />
          <path d="M414 92 L424 102" className="sva-stroke-acc sva-w3" />
        </g>
      </g>
      <g data-depth="1.1">
        <g className="sva-bob sva-bob-2">
          <rect x="30" y="226" width="84" height="76" rx="16" className="sva-card" />
          <path d="M50 270 V250 M50 250 L43 257 M50 250 L57 257" className="sva-stroke-acc sva-w3" />
          <rect x="66" y="246" width="32" height="7" rx="3.5" className="sva-fill-ink" />
          <rect x="66" y="261" width="24" height="7" rx="3.5" className="sva-fill-muted" />
          <rect x="66" y="276" width="18" height="7" rx="3.5" className="sva-fill-muted" />
        </g>
      </g>
      <g data-depth="1.6">
        <path d="M60 110 L64 100 L68 110 L78 114 L68 118 L64 128 L60 118 L50 114 Z" className="sva-fill-volt sva-twinkle" />
        <path d="M430 210 L433 203 L436 210 L443 213 L436 216 L433 223 L430 216 L423 213 Z" className="sva-fill-acc sva-twinkle sva-twinkle-2" />
      </g>
    </>
  );
}

/** Support: a shield with a check, a heartbeat and an uptime ring. */
function Support() {
  return (
    <>
      <g data-depth="0.4">
        <path pathLength={1} d="M30 300 H150 L166 270 L184 326 L200 280 L212 300 H450" className="draw-path sva-stroke-acc sva-w3" />
        <path d="M30 300 H150 L166 270 L184 326 L200 280 L212 300 H450" className="sva-flow sva-flow-slow" />
      </g>
      <g data-depth="0.8">
        <path d="M240 58 L326 90 V170 C326 228 290 262 240 284 C190 262 154 228 154 170 V90 Z" className="sva-card" />
        <path d="M240 80 L306 104 V170 C306 214 280 242 240 260 C200 242 174 214 174 170 V104 Z" className="sva-fill-soft" />
        <path pathLength={1} d="M206 168 L230 192 L276 142" className="draw-path sva-stroke-acc sva-w8" />
      </g>
      <g data-depth="1.3">
        <g className="sva-bob">
          <circle cx="398" cy="96" r="38" className="sva-card" />
          <circle cx="398" cy="96" r="24" className="sva-stroke-line sva-w5" />
          <circle pathLength={1} cx="398" cy="96" r="24" className="draw-path sva-stroke-volt sva-w5 sva-ring-arc" />
          <circle cx="398" cy="96" r="5" className="sva-fill-ink" />
        </g>
      </g>
      <g data-depth="1.1">
        <g className="sva-bob sva-bob-2">
          <rect x="40" y="88" width="76" height="70" rx="16" className="sva-card" />
          <path d="M64 136 L86 114 M92 100 C84 98 80 106 84 112 L64 132 C60 136 66 142 70 138 L90 118 C96 122 104 118 102 110 L96 114 L90 108 Z" className="sva-stroke-ink sva-w2" />
        </g>
      </g>
    </>
  );
}

/** Agency: your brand on the left, our engine on the right, the brief going one way and the work coming back unbranded. */
function Agency() {
  return (
    <>
      <g data-depth="0.7">
        <rect x="34" y="84" width="154" height="192" rx="16" className="sva-card" />
        <circle cx="74" cy="124" r="18" className="sva-fill-soft" />
        <circle cx="74" cy="119" r="6" className="sva-fill-acc" />
        <path d="M63 134 C66 127 82 127 85 134" className="sva-stroke-acc sva-w2" />
        <rect x="100" y="114" width="66" height="8" rx="4" className="sva-fill-ink" />
        <rect x="100" y="128" width="46" height="7" rx="3.5" className="sva-fill-muted" />
        <rect x="54" y="160" width="114" height="8" rx="4" className="sva-fill-raised sva-grow-x" />
        <rect x="54" y="176" width="96" height="8" rx="4" className="sva-fill-raised sva-grow-x" style={{ animationDelay: "0.15s" }} />
        <rect x="54" y="192" width="104" height="8" rx="4" className="sva-fill-raised sva-grow-x" style={{ animationDelay: "0.3s" }} />
        <rect x="54" y="222" width="70" height="26" rx="13" className="sva-fill-ink sva-pop" />
        <path d="M78 235 L86 242 L100 228" className="sva-stroke-volt sva-w3 sva-pop" />
      </g>
      <g data-depth="0.7">
        <rect x="292" y="84" width="154" height="192" rx="16" className="sva-fill-er" />
        <circle cx="369" cy="140" r="30" className="sva-halo-er" />
        <path d="M376 116 L354 146 H368 L362 166 L386 136 H372 Z" className="sva-fill-volt" />
        <rect x="316" y="194" width="106" height="7" rx="3.5" className="sva-fill-er-line sva-grow-x" />
        <rect x="316" y="210" width="80" height="7" rx="3.5" className="sva-fill-er-line sva-grow-x" style={{ animationDelay: "0.2s" }} />
        <rect x="316" y="226" width="94" height="7" rx="3.5" className="sva-fill-er-line sva-grow-x" style={{ animationDelay: "0.35s" }} />
        <rect x="316" y="246" width="40" height="7" rx="3.5" className="sva-fill-volt sva-grow-x" style={{ animationDelay: "0.5s" }} />
      </g>
      <g data-depth="1">
        <path pathLength={1} d="M196 140 C236 110 252 110 284 132" className="draw-path sva-stroke-line-strong sva-w2" />
        <path d="M196 140 C236 110 252 110 284 132" className="sva-flow" />
        <path d="M274 124 L286 133 L272 138" className="sva-stroke-acc sva-w2" />
        <path pathLength={1} d="M284 226 C246 254 230 254 196 230" className="draw-path sva-stroke-line-strong sva-w2" />
        <path d="M284 226 C246 254 230 254 196 230" className="sva-flow sva-flow-rev" />
        <path d="M206 222 L194 229 L207 236" className="sva-stroke-acc sva-w2" />
      </g>
      <g data-depth="1.5">
        <g className="sva-bob">
          <circle cx="240" cy="182" r="30" className="sva-card" />
          <path d="M222 178 C228 168 252 168 258 178 C252 190 228 190 222 178 Z" className="sva-stroke-ink sva-w2" />
          <path d="M224 196 L256 164" className="sva-stroke-acc sva-w3" />
        </g>
      </g>
    </>
  );
}
