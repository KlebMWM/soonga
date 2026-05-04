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
import { trackProductEvent } from "@/lib/analytics";
import { auditStore, pendingStore, usePendingApprovals } from "@/lib/stores";

/**
 * Demo-only floating control panel. Drives imperative state changes for
 * preview / screenshot scenarios.
 *
 * Approve-one / toggle-empty / reset hit the shared stores directly —
 * Dashboard, Approvals, Sidebar badge all read from those, so a single
 * mutation propagates everywhere. Resolve-pending dispatches a window event
 * because the visual target lives in AgentFeed's local items state (the
 * store doesn't track feed rows). The handler picks the first pending item
 * by recency, no merchant binding.
 *
 * Visibility: dev mode OR `?demo=1` in the URL. Hidden on production builds
 * by default. Visibility check runs in a useEffect so SSR markup is empty
 * and the panel pops in post-mount.
 */
export const DEMO_EVENTS = {
  /** Resolve the first pending item visible in AgentFeed (any merchant). */
  resolvePending: "soon-demo:resolve-pending",
  /** Fires after stores are reset; AgentFeed listens to also reset its
   *  local items state (which doesn't live in any shared store). */
  reset: "soon-demo:reset",
} as const;

function dispatchDemo(name: string) {
  window.dispatchEvent(new CustomEvent(name));
}

export function DemoControls() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggle: toggleTheme, mounted } = useTheme();
  const pending = usePendingApprovals();
  const hasPending = pending.length > 0;

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const hasQuery =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("demo");
    const timer = setTimeout(() => setVisible(isDev || hasQuery), 0);
    return () => clearTimeout(timer);
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
          onClick={() => {
            trackProductEvent("demo_controls_toggled", {
              next_state: collapsed ? "expanded" : "collapsed",
            });
            setCollapsed((c) => !c);
          }}
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
          <DemoButton
            icon={ThemeIcon}
            label={themeLabel}
            onClick={() => {
              trackProductEvent("demo_control_used", {
                action: "toggle_theme",
              });
              toggleTheme();
            }}
          />
          <DemoButton
            icon={Check}
            label="處理一筆待審核"
            disabled={!hasPending}
            disabledTitle="目前沒有待審核項目"
            onClick={() => {
              trackProductEvent("demo_control_used", {
                action: "resolve_pending",
                pending_count: pending.length,
              });
              dispatchDemo(DEMO_EVENTS.resolvePending);
            }}
          />
          <DemoButton
            icon={Inbox}
            label="切換空態 / 待審核態"
            onClick={() => {
              trackProductEvent("demo_control_used", {
                action: "toggle_pending_state",
                pending_count: pending.length,
              });
              if (pendingStore.getAll().length > 0) {
                pendingStore.setAll([]);
              } else {
                pendingStore.reset();
              }
            }}
          />
          <DemoButton
            icon={RotateCcw}
            label="重置 Demo"
            onClick={() => {
              trackProductEvent("demo_control_used", {
                action: "reset_demo",
                pending_count: pending.length,
              });
              pendingStore.reset();
              auditStore.reset();
              dispatchDemo(DEMO_EVENTS.reset);
            }}
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
  disabled,
  disabledTitle,
}: {
  icon: typeof Check;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** Tooltip shown only when disabled — explains why the button is greyed
   *  out without firing a toast. */
  disabledTitle?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? disabledTitle : undefined}
      className="flex items-center gap-2.5 w-full px-2.5 py-2 text-[12px] text-left transition-colors enabled:hover:bg-[rgba(80,132,208,0.08)] disabled:opacity-40 disabled:cursor-not-allowed"
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
