"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { Icon } from "@/components/Icon";

type AppShellProps = {
  children: React.ReactNode;
};

const chromeRoutes = new Set(["/", "/designs"]);
const themeEvent = "dd-theme-change";

function getThemeSnapshot() {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("dd-theme");

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

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => "light");
  const darkMode = theme === "dark";
  const showChrome = chromeRoutes.has(pathname);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  if (!showChrome) {
    return children;
  }

  return (
    <>
      <nav className="theme-transition sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[var(--dd-border)] bg-[var(--dd-nav)] px-5 backdrop-blur-[14px] sm:px-10">
        <Link
          aria-label="DoodleDraw home"
          className="inline-flex items-center gap-2 rounded-[var(--dd-radius-sm)] text-[15px] font-medium text-[var(--dd-text)] outline-none transition hover:text-[var(--dd-text)] focus-visible:ring-2 focus-visible:ring-[var(--dd-accent)]"
          href="/"
        >
          <Icon className="size-[22px]" showIconTitle titleClassName="font-medium" />
        </Link>
        <div className="flex items-center gap-1">
          {pathname !== "/designs" ? (
            <Link
              className="rounded-[var(--dd-radius-sm)] px-3 py-1.5 text-[13px] text-[var(--dd-text-muted)] transition hover:text-[var(--dd-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dd-accent)]"
              href="/designs"
            >
              Open Designs
            </Link>
          ) : null}
          <button
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="grid size-[34px] place-items-center rounded-[var(--dd-radius-sm)] text-[var(--dd-text-muted)] transition hover:bg-[var(--dd-bg-2)] hover:text-[var(--dd-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dd-accent)]"
            onClick={() => {
              window.localStorage.setItem("dd-theme", darkMode ? "light" : "dark");
              window.dispatchEvent(new Event(themeEvent));
            }}
            title={darkMode ? "Light mode" : "Dark mode"}
            type="button"
          >
            {darkMode ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>
      <main key={pathname} className="dd-page-enter">
        {children}
      </main>
    </>
  );
}
