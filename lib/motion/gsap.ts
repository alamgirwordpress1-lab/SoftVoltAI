import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP 3.13+ is free for commercial use, ScrollTrigger included. SplitText is not
// registered: nothing on the site splits text, and the plugin is not free weight.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

/** True when the visitor asked the OS for less motion. Checked at call time, not module load. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
