"use client";

import { useDesktopNotifications } from "@/lib/useDesktopNotifications";
import { useT } from "@/lib/i18n/LocaleProvider";
import { toast } from "sonner";

/**
 * Compact status strip for the redesigned sidebar bottom.
 *
 *   ┌─────────────────────────────────┐
 *   │ • 桌面通知              已開啟 │
 *   └─────────────────────────────────┘
 *
 * Three states — all share the same chrome (white bg + light border);
 * only the accent (dot color, right-side label) changes:
 *   granted → sage dot + sage bold "已開啟"
 *   default → yellow dot + deep-blue mono "待開啟" (click to enable)
 *   denied  → dim dot + muted "已封鎖"
 */
export function NotificationPermissionPill() {
  const t = useT();
  const { permission, request } = useDesktopNotifications();

  if (permission === "unsupported") return null;

  const handleEnable = async () => {
    const result = await request();
    if (result === "granted") {
      toast.success(t("notify.enabledToast.title"), {
        description: t("notify.enabledToast.desc"),
      });
      try {
        new Notification(t("notify.sample.title"), {
          body: t("notify.sample.body"),
          icon: "/favicon.ico",
          tag: "soon-ga-sample",
        });
      } catch {
        /* ignore */
      }
    } else if (result === "denied") {
      toast.error(t("notify.denied.title"), {
        description: t("notify.denied.desc"),
      });
    }
  };

  const isGranted = permission === "granted";
  const isDenied = permission === "denied";
  const clickable = !isGranted && !isDenied;

  // Right-side status pill config — colour + label vary by permission state.
  const statusConfig = isGranted
    ? {
        color: "var(--sage)",
        label: t("notify.granted.short"),
        withPulse: true,
      }
    : isDenied
      ? {
          color: "var(--text-dim)",
          label: t("notify.denied.short"),
          withPulse: false,
        }
      : {
          color: "var(--ikea-blue-darker)",
          label: t("notify.default.short"),
          withPulse: false,
        };

  const body = (
    <>
      <span
        className="inline-flex items-center gap-2 text-[12px]"
        style={{
          color: "var(--text)",
          fontFamily: "var(--font-noto-sans-tc), sans-serif",
        }}
      >
        <span
          className="relative flex h-1.5 w-1.5 shrink-0"
          aria-hidden
        >
          {statusConfig.withPulse && (
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ background: statusConfig.color }}
            />
          )}
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{
              background: statusConfig.color,
              boxShadow: statusConfig.withPulse
                ? `0 0 6px ${statusConfig.color}`
                : undefined,
            }}
          />
        </span>
        {t("notify.label")}
      </span>
      <span
        className="ml-auto text-[11px] font-bold"
        style={{
          color: statusConfig.color,
          fontFamily: "var(--font-jetbrains-mono), monospace",
        }}
      >
        {statusConfig.label}
      </span>
    </>
  );

  const sharedStyle = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    padding: "8px 12px",
  };

  return clickable ? (
    <button
      type="button"
      onClick={handleEnable}
      className="flex items-center w-full text-left transition-colors hover:bg-[rgba(80,132,208,0.06)]"
      style={sharedStyle}
    >
      {body}
    </button>
  ) : (
    <div className="flex items-center w-full" style={sharedStyle}>
      {body}
    </div>
  );
}
