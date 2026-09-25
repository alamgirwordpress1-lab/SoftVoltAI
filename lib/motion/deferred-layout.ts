/**
 * The home page lays out its sections only as they near the screen (see
 * "deferred rendering" in app/globals.css). That is only safe while the visitor
 * reads from the top: anything that lands part-way down needs the real heights
 * of everything above it. html.cv-off turns deferral off for the rest of the
 * page's life.
 */
const FULL_LAYOUT = "cv-off";

/**
 * Runs in <head> before first paint. A reload or back/forward restores a scroll
 * position measured on the full layout, and a #link lands on a section, so both
 * start with everything laid out.
 */
export const deferredLayoutScript = `(function(){try{var n=performance.getEntriesByType('navigation')[0];if(location.hash||(n&&n.type!=='navigate'))document.documentElement.classList.add('${FULL_LAYOUT}')}catch(e){}})()`;

/** Before a jump within the page, or a move to another one: lay everything out from now on. */
export function layOutFully() {
  document.documentElement.classList.add(FULL_LAYOUT);
}

/** Whether a deferred section may still be skipping its contents. */
export function layoutDeferred() {
  return !document.documentElement.classList.contains(FULL_LAYOUT) && document.getElementById("hero") !== null;
}
