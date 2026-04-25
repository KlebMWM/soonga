"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Inbox,
  Moon,
  RotateCcw,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "@/components/ThemeToggle";

/**
 * Demo-only floating control panel. Five buttons that drive imperative state
 * changes in DashboardHero / AgentFeed via window CustomEvents — keeps the
 * panel decoupled from data flow and avoids lifting state into a global store
 * just for a dev surface.
 *
 * Visibility: dev mode OR `?demo=1` in the URL. Hidden on production builds
 * by default. The visibility check runs in a useEffect so the SSR markup is
 * empty and the panel pops in post-mount (no hydration mismatch).
 *
 * Listeners live in:
 *   - app/dashboard/page.tsx — approve-one, toggle-empty, reset
 *   - components/AgentFeed.tsx — resolve-booking, reset
 *   - useTheme hook — emits its own soon-theme-change event so the panel's
 *     icon stays in sync with the top-bar toggle.
 */
export const DEMO_EVENTS = {
  approveOne: "soon-demo:approve-one",
  resolveBooking: "soon-demo:resolve-booking",
  toggleEmpty: "soon-demo:toggle-empty",
  reset: "soon-demo:reset",
} as const;

function dispatchDemo(name: string) {
  window.dispatchEvent(new CustomEvent(name));
}

export function DemoControls() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggle: toggleTheme, mounted } = useTheme();

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const hasQuery =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("demo");
    setVisible(isDev || hasQuery);
  }, []);

  if (!visible) return null;

  const ThemeIcon = mounted ? (theme === "light" ? Moon : Sun) : Moon;
  const themeLabel =
    !mounted || theme === "light" ? "切換深淺模式" : "切換深淺模式";

  return (
    <aside
      role="region"
      aria-label="Demo controls"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 60,
        background: "var(--bg-soft)",
        border: "1px solid var(--border-strong)",
        boxShadow: "0 8px 24px rgba(10, 37, 68, 0.08)",
        minWidth: collapsed ? 0 : 220,
      }}
    >
      <header
        className="flex items-center justify-between px-2.5 py-1.5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <span
          className="uppercase font-bold"
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "var(--text-dim)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          {collapsed ? "DEMO" : "DEMO CONTROLS"}
        </span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "展開" : "收合"}
          className="inline-flex h-5 w-5 items-center justify-center transition-colors hover:bg-[rgba(80,132,208,0.08)]"
          style={{ color: "var(--text-mid)" }}
        >
          <X
            className="h-3 w-3 transition-transform"
            style={{ transform: collapsed ? "rotate(45deg)" : "rotate(0deg)" }}
          />
        </button>
      </header>

      {!collapsed && (
        <div className="flex flex-col py-1">
          <DemoButton icon={ThemeIcon} label={themeLabel} onClick={toggleTheme} />
          <DemoButton
            icon={Check}
            label="核准一筆"
            onClick={() => dispatchDemo(DEMO_EVENTS.approveOne)}
          />
          <DemoButton
            icon={Check}
            label="解決 Booking 那筆"
            onClick={() => dispatchDemo(DEMO_EVENTS.resolveBooking)}
          />
          <DemoButton
            icon={Inbox}
            label="切換空態 / 待辦態"
            onClick={() => dispatchDemo(DEMO_EVENTS.toggleEmpty)}
          />
          <DemoButton
            icon={RotateCcw}
            label="重置全部"
            onClick={() => dispatchDemo(DEMO_EVENTS.reset)}
          />
        </div>
      )}
    </aside>
  );
}

function DemoButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Check;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-2.5 py-2 text-[12px] text-left transition-colors hover:bg-[rgba(80,132,208,0.08)]"
      style={{ color: "var(--text)" }}
    >
      <Icon
        className="h-3.5 w-3.5 shrink-0"
        strokeWidth={2}
        style={{ color: "var(--text-mid)" }}
      />
      <span>{label}</span>
    </button>
  );
}
