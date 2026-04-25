"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "soon-theme";

/**
 * Manual light/dark toggle. Persists to localStorage and toggles the `dark`
 * class on <html>. The no-flash inline script in app/layout.tsx applies the
 * stored preference before hydration so first paint matches localStorage.
 *
 * Auto-switch on time-of-day (e.g. 22:00 → dark) is intentionally NOT here
 * — that's a separate sprint. This toggle is the manual baseline.
 */
export function ThemeToggle({
  variant = "sidebar",
}: {
  variant?: "sidebar" | "mobile";
}) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else if (
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
    ) {
      setTheme("dark");
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage unavailable — non-fatal, just don't persist */
    }
  };

  // Avoid hydration flash for icon: render a stable placeholder until mounted.
  // Outer chrome stays consistent so layout doesn't shift.
  const Icon = mounted ? (theme === "light" ? Moon : Sun) : Moon;
  const aria =
    theme === "light"
      ? "Switch to dark mode"
      : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={aria}
      title={aria}
      className={cn(
        "inline-flex items-center justify-center transition-colors",
        variant === "sidebar"
          ? "h-7 w-7 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
          : "h-7 w-7 rounded-full border border-sidebar-border/60 bg-sidebar-accent/30 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}
