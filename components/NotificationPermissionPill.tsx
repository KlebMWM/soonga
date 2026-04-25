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
        className="inline-flex items-center gap-2 text-[14px]"
        style={{ color: "var(--text)" }}
      >
        <span
          className="relative flex h-2 w-2 shrink-0"
          aria-hidden
        >
          {statusConfig.withPulse && (
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ background: statusConfig.color }}
            />
          )}
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
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
        className="ml-auto text-[13px] font-bold"
        style={{ color: statusConfig.color }}
      >
        {statusConfig.label}
      </span>
    </>
  );

  const sharedStyle = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    padding: "10px 12px",
  };

  // Scope hint — surfaced both as native title (hover) AND as a small
  // visible line beneath the pill so the disclaimer doesn't depend on
  // hover (no-op on touch / slow on desktop). Keeps the pill itself as
  // the only interactive surface.
  const scopeHint = t("notify.scopeHint");

  const pill = clickable ? (
    <button
      type="button"
      onClick={handleEnable}
      title={scopeHint}
      className="flex items-center w-full text-left transition-colors hover:bg-[rgba(80,132,208,0.06)]"
      style={sharedStyle}
    >
      {body}
    </button>
  ) : (
    <div
      className="flex items-center w-full"
      style={sharedStyle}
      title={scopeHint}
    >
      {body}
    </div>
  );

  return (
    <div className="flex flex-col gap-1.5">
      {pill}
      <p
        className="text-[11px] leading-snug px-1"
        style={{ color: "var(--text-mid)" }}
      >
        {scopeHint}
      </p>
    </div>
  );
}
