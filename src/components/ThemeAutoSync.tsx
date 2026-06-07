import { useEffect } from "react";

/**
 * Applies the `dark` class on <html> based on system preference and keeps it
 * in sync. No user toggle — auto follows system.
 */
export function ThemeAutoSync() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (matches: boolean) => {
      document.documentElement.classList.toggle("dark", matches);
    };
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return null;
}
