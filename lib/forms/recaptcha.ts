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

/**
 * Loads the script once the page has finished loading and the browser is idle, so
 * Google's ~800 KB never competes with the page's own first paint. Every visitor
 * still gets it and the badge still shows, a moment later; someone who sends the
 * form before then gets the script at that point instead (see recaptchaToken).
 * Returns a cancel for effect cleanup.
 */
export function loadRecaptchaWhenIdle(siteKey: string): () => void {
  if (!siteKey || typeof window === "undefined") return () => {};
  let idle: number | undefined;
  let timer: number | undefined;
  const start = () => {
    const load = () => void loadRecaptcha(siteKey).catch(() => {});
    // Safari has no requestIdleCallback
    if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(load, { timeout: 4000 });
    else timer = window.setTimeout(load, 1500);
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
  return () => {
    window.removeEventListener("load", start);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    if (timer !== undefined) window.clearTimeout(timer);
  };
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
