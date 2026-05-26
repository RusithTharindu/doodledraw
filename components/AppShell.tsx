"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAppTheme } from "@/hooks/useAppTheme";

type AppShellProps = {
  children: React.ReactNode;
};

const chromeRoutes = new Set(["/", "/designs"]);

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  useAppTheme();
  const showChrome = chromeRoutes.has(pathname);

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
          <ThemeToggle className="grid size-[34px] place-items-center rounded-[var(--dd-radius-sm)] text-[var(--dd-text-muted)] transition hover:bg-[var(--dd-bg-2)] hover:text-[var(--dd-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dd-accent)]" />
        </div>
      </nav>
      <main key={pathname} className="dd-page-enter">
        {children}
      </main>
    </>
  );
}
