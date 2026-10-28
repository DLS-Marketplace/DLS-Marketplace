export type Theme = "light" | "dark";

const STORAGE_KEY = "loop-theme";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

/** Theme that should be applied on first paint: stored choice, else system. */
export function initialTheme(): Theme {
  return storedTheme() ?? systemTheme();
}

/** Set the document theme and remember the choice. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode: theme still applies for this page */
  }
}

export function toggleTheme(): Theme {
  const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}

/** Keep in sync with OS changes while the user has no stored preference. */
export function watchSystemTheme(onChange: (theme: Theme) => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    if (!storedTheme()) onChange(systemTheme());
  };
  media.addEventListener("change", handler);
  return () => media.removeEventListener("change", handler);
}
