"use client";

import { Bell, BellOff } from "lucide-react";
import { useDesktopNotifications } from "@/lib/useDesktopNotifications";
import { useT } from "@/lib/i18n/LocaleProvider";
import { toast } from "sonner";

export function NotificationPermissionPill() {
  const t = useT();
  const { permission, request } = useDesktopNotifications();

  if (permission === "unsupported") return null;

  if (permission === "granted") {
    // Enabled state blends into sidebar chrome; mint bell signals "live".
    // Avoids introducing sage/success as a third color on the dark mint sidebar.
    return (
      <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent px-3 py-2 text-[13px] text-sidebar-accent-foreground">
        <Bell className="h-3.5 w-3.5 text-sidebar-primary" />
        {t("notify.enabled")}
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 px-3 py-2 text-[12px] text-sidebar-foreground/60">
        <BellOff className="h-3.5 w-3.5 shrink-0" />
        <span className="leading-tight">{t("notify.blocked")}</span>
      </div>
    );
  }

  const handleEnable = async () => {
    const result = await request();
    if (result === "granted") {
      toast.success(t("notify.enabledToast.title"), {
        description: t("notify.enabledToast.desc"),
      });
      // Send a sample notification so the user sees it once
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

  // Default "click to enable" — mint-deep tones (sidebar-primary) to signal CTA
  // without leaving the sidebar's dark-mint + white-alpha palette.
  return (
    <button
      onClick={handleEnable}
      className="w-full flex items-center gap-2 rounded-lg border border-sidebar-primary/40 bg-sidebar-primary/15 px-3 py-2 text-left hover:bg-sidebar-primary/25 transition-colors"
    >
      <Bell className="h-3.5 w-3.5 shrink-0 text-sidebar-accent-foreground" />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-sidebar-accent-foreground">{t("notify.enable")}</div>
        <div className="text-[12px] text-sidebar-foreground/60 mt-0.5 leading-tight">{t("notify.sub")}</div>
      </div>
    </button>
  );
}
