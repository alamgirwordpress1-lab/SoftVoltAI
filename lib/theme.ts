/**
 * Light / dark theme. The choice is stored per browser; the site opens in the
 * light theme until a visitor picks dark. `html[data-theme]` drives the CSS
 * tokens in app/globals.css.
 */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "softvolt-theme";

/** Browser UI colour (address bar on mobile) for each theme: the page ground. */
export const THEME_COLORS: Record<Theme, string> = { light: "#f6f7f4", dark: "#111814" };

/**
 * Runs inline in <head> before first paint, so a stored dark choice never
 * flashes light first. Keep it dependency-free and tiny.
 */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add('js');var t='light';try{if(localStorage.getItem('${THEME_STORAGE_KEY}')==='dark')t='dark'}catch(e){}d.dataset.theme=t;if(t==='dark'){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','${THEME_COLORS.dark}')}})()`;

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  // Colour transitions would animate every element at once; switch in a single frame.
  root.classList.add("theme-switching");
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // storage blocked: the theme still applies for this page view
  }
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
}

/** Notifies when the theme changes — from the toggle, or from another tab. */
export function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_STORAGE_KEY) return;
    const next: Theme = e.newValue === "dark" ? "dark" : "light";
    if (next !== getTheme()) setTheme(next);
  };
  window.addEventListener("storage", onStorage);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}
