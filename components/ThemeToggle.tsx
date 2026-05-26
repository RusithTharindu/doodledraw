"use client";

import { Moon, Sun } from "lucide-react";
import { useAppTheme } from "@/hooks/useAppTheme";

type ThemeToggleProps = {
  className: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { darkMode, toggleTheme } = useAppTheme();

  return (
    <button
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={className}
      onClick={toggleTheme}
      title={darkMode ? "Light mode" : "Dark mode"}
      type="button"
    >
      {darkMode ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
