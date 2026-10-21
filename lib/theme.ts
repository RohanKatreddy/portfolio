"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { MODE_KEY } from "./site";

export type Mode = "light" | "dark";

// The <html data-mode> attribute is the single source of truth. It is set
// before first paint by BOOT_SCRIPT and drives every colour through CSS.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
  return () => observer.disconnect();
}
const getSnapshot = (): Mode => (document.documentElement.dataset.mode === "dark" ? "dark" : "light");
const getServerSnapshot = (): Mode => "light";

export function setMode(mode: Mode) {
  document.documentElement.dataset.mode = mode;
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch {}
}

export function useMode() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback(() => setMode(getSnapshot() === "dark" ? "light" : "dark"), []);
  return { mode, isDark: mode === "dark", toggle };
}

/** Keeps open tabs in sync when the mode changes in another tab. */
export function useModeSync() {
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === MODE_KEY) document.documentElement.dataset.mode = e.newValue === "dark" ? "dark" : "light";
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}
