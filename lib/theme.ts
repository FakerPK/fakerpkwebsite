export type Theme = "dark" | "light"

export const STORAGE_KEY = "fakerpk-theme"

/** window CustomEvent<Theme> dispatched by setTheme. */
export const THEME_EVENT = "fakerpk-theme-change"

/**
 * Source of truth after hydration is the DOM attribute the inline script set
 * (it may have chosen the OS preference before React mounted) — NOT storage.
 */
export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark"
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"
}

/**
 * The ONLY place the page gets painted with a theme: attribute + colorScheme
 * on documentElement. Called by setTheme (same tab) and by subscribe's
 * storage handler (cross-tab — a storage event carries state but never
 * applies it).
 */
function apply(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme)
  document.documentElement.style.colorScheme = theme
}

/**
 * Persisted toggles beat OS preference forever; first visit has no stored value.
 * localStorage write is guarded — Safari private mode throws on setItem.
 */
export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage unavailable/blocked (private mode) — theme still applies for this session.
  }
  apply(theme)
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }))
}

/**
 * Calls cb(getTheme()) synchronously ONCE at subscribe time (lets the R3F
 * scene and toggle sync without waiting for a change event), then forwards:
 * - THEME_EVENT from setTheme (same tab),
 * - "storage" events on STORAGE_KEY with a valid value (cross-tab sync).
 * Returns an unsubscribe function that removes both listeners.
 */
export function subscribe(cb: (theme: Theme) => void): () => void {
  cb(getTheme())

  const onThemeEvent = (event: Event) => {
    cb((event as CustomEvent<Theme>).detail as Theme)
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && (event.newValue === "dark" || event.newValue === "light")) {
      // Repaint this tab BEFORE notifying subscribers so the toggle icon can
      // never contradict the painted page. Do NOT also apply in onThemeEvent
      // — setTheme already applied there.
      apply(event.newValue)
      cb(event.newValue)
    }
  }

  window.addEventListener(THEME_EVENT, onThemeEvent)
  window.addEventListener("storage", onStorage)

  return () => {
    window.removeEventListener(THEME_EVENT, onThemeEvent)
    window.removeEventListener("storage", onStorage)
  }
}

/**
 * Inject ONCE in app/layout.tsx <head>, pre-paint, plain script tag:
 *   <script dangerouslySetInnerHTML={{ __html: INLINE_NO_FLASH_SCRIPT }} />
 * Also delete className="dark" from <html> (CSS keys off [data-theme];
 * attribute absent = dark defaults, so no-JS visitors keep the dark site).
 *
 * Runs synchronously BEFORE first paint (no flash either way); reads the
 * stored pref under STORAGE_KEY and accepts only exact "light"/"dark";
 * otherwise follows prefers-color-scheme (light matched -> light, anything
 * else -> dark). Writes data-theme AND inline color-scheme on
 * documentElement; fully wrapped in try/catch so private-mode or
 * blocked-storage environments silently fall back to dark.
 */
export const INLINE_NO_FLASH_SCRIPT =
  "(function(){try{var t=null;try{t=window.localStorage.getItem(\"fakerpk-theme\")}catch(e){}if(\"light\"!==t&&\"dark\"!==t){t=window.matchMedia&&window.matchMedia(\"(prefers-color-scheme: light)\").matches?\"light\":\"dark\"}var d=document.documentElement;d.setAttribute(\"data-theme\",t);d.style.colorScheme=t}catch(e){}})()"
