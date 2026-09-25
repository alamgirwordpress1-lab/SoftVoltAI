import gsap from "gsap";

// GSAP 3.13+ is free for commercial use. No plugin is registered: nothing on the
// site is scroll-driven (reveals use an IntersectionObserver, see MotionRoot), and
// ScrollTrigger measured the page on load and on every scroll for no one.
if (typeof window !== "undefined") {
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

/** True when the visitor asked the OS for less motion. Checked at call time, not module load. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap };
