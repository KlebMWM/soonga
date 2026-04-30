"use client";

import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { trackProductEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "soon-theme";
const SYNC_EVENT = "soon-theme-change";

/**
 * Shared hook for reading + toggling the dark/light theme. Reads the current
 * state from <html>'s `dark` class on mount, persists changes to localStorage,
 * and emits a `soon-theme-change` window event so multiple consumers
 * (ThemeToggle, DemoControls) stay in sync without lifting state.
 */
export function useTheme() {
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

  // Listen for changes from other useTheme consumers in the same page.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<"light" | "dark">).detail;
      if (detail === "light" || detail === "dark") setTheme(detail);
    };
    window.addEventListener(SYNC_EVENT, handler);
    return () => window.removeEventListener(SYNC_EVENT, handler);
  }, []);

  const toggle = useCallback(() => {
    // Use the actual DOM classlist as the source of truth — the no-flash
    // <head> script can add the `dark` class before React hydrates, leaving
    // React state out of sync. Reading from the DOM avoids the dead-click
    // case where state thinks it's "light" but the page is already dark.
    const isDark = document.documentElement.classList.contains("dark");
    const next: "light" | "dark" = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage unavailable */
    }
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }));
    trackProductEvent("theme_changed", { theme: next });
    setTheme(next);
  }, []);

  return { theme, toggle, mounted };
}

/** Top-bar / sidebar toggle button. Lights up moon icon for "switch to dark"
 *  and sun icon for "switch to light". */
export function ThemeToggle({
  variant = "sidebar",
}: {
  variant?: "sidebar" | "mobile";
}) {
  const { theme, toggle, mounted } = useTheme();

  // Stable placeholder until mounted, so SSR + first paint don't disagree.
  const Icon = mounted ? (theme === "light" ? Moon : Sun) : Moon;
  const aria =
    theme === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={aria}
      title={aria}
      className={cn(
        "inline-flex items-center justify-center transition-colors h-7 w-7 border border-sidebar-border/60 bg-sidebar-accent/30 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
        variant === "sidebar" ? "rounded-lg" : "rounded-full",
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}
