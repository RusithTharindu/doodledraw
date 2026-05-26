"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type AppTheme = "light" | "dark";

const themeEvent = "dd-theme-change";
const themeStorageKey = "dd-theme";

function getPreferredTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(themeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(themeEvent, callback);
  };
}

export function setAppTheme(theme: AppTheme) {
  window.localStorage.setItem(themeStorageKey, theme);
  window.dispatchEvent(new Event(themeEvent));
}

export function useAppTheme() {
  const theme = useSyncExternalStore<AppTheme>(
    subscribeTheme,
    getPreferredTheme,
    () => "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((nextTheme: AppTheme) => {
    setAppTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setAppTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  return {
    theme,
    darkMode: theme === "dark",
    setTheme,
    toggleTheme,
  };
}
