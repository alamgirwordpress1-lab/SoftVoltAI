/**
 * reCAPTCHA v3, for the two forms that post to Contact Form 7.
 *
 * CF7's own reCAPTCHA module marks a submission as spam unless it carries a
 * token, so a headless form has to fetch one itself: load Google's script once,
 * ask it for a token as the form is sent, and post that token alongside the
 * answers. The site key comes from WordPress, so switching reCAPTCHA off there
 * switches it off here — nothing is loaded and no token is asked for.
 *
 * Google shows its own badge, which is what its terms ask for in return for the
 * invisible check.
 */
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const SCRIPT_ID = "recaptcha-v3";
let loading: Promise<void> | null = null;

/** Loads the script once per page, whoever asks. */
export function loadRecaptcha(siteKey: string): Promise<void> {
  if (!siteKey || typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("reCAPTCHA did not load"));
    document.head.appendChild(script);
  });
  return loading;
}

/** Anything a visitor does on a page: scroll, wheel, touch, click, mouse movement, a key. */
const INTERACTIONS = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"] as const;

/**
 * Loads the script the first time the visitor does anything on the page.
 * Google's ~800 KB, and the second of main-thread work that comes with it, then
 * never lands while the page is still coming in, and a test that only loads
 * the page never pays for it. Anyone who can reach a form has interacted by
 * then, so the badge still shows and the token is ready; someone who sends
 * before the script has arrived gets it at that point (see recaptchaToken).
 * Returns a cancel for effect cleanup.
 */
export function loadRecaptchaOnInteraction(siteKey: string): () => void {
  if (!siteKey || typeof window === "undefined") return () => {};
  const stop = () => {
    for (const type of INTERACTIONS) window.removeEventListener(type, load, true);
  };
  const load = () => {
    stop();
    void loadRecaptcha(siteKey).catch(() => {});
  };
  for (const type of INTERACTIONS) window.addEventListener(type, load, { capture: true, passive: true });
  return stop;
}

/**
 * A token for one submission. Returns "" when reCAPTCHA is off or unreachable —
 * the form still posts, and WordPress decides what to do with it.
 */
export async function recaptchaToken(siteKey: string, action: string): Promise<string> {
  if (!siteKey || typeof window === "undefined") return "";
  try {
    await loadRecaptcha(siteKey);
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha) return "";
    await new Promise<void>((resolve) => grecaptcha.ready(() => resolve()));
    return await grecaptcha.execute(siteKey, { action });
  } catch {
    return "";
  }
}
