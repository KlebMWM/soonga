"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  Inbox,
  LayoutDashboard,
  ScrollText,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WalletPill } from "@/components/WalletPill";
import { LocaleToggle } from "@/components/LocaleToggle";
import { NotificationPermissionPill } from "@/components/NotificationPermissionPill";
import { stats } from "@/lib/mockData";
import { useT } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type NavItem = {
  labelKey: string;
  subKey: string;
  icon: typeof LayoutDashboard;
  href?: string;
  onClick?: () => void;
  badge?: number;
};

const NAV: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.dashboard.label", subKey: "nav.dashboard.sub", icon: LayoutDashboard },
  { href: "/rules", labelKey: "nav.rules.label", subKey: "nav.rules.sub", icon: SlidersHorizontal },
  { href: "/approvals", labelKey: "nav.approvals.label", subKey: "nav.approvals.sub", icon: Inbox, badge: stats.pendingCount },
  { href: "/audit", labelKey: "nav.audit.label", subKey: "nav.audit.sub", icon: ScrollText },
  {
    labelKey: "nav.guide.label",
    subKey: "nav.guide.sub",
    icon: HelpCircle,
    onClick: () => window.dispatchEvent(new CustomEvent("soon-open-welcome")),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useT();

  return (
    <aside className="hidden md:flex w-72 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <Link
        href="/dashboard"
        className="block px-6 py-7 hover:bg-sidebar-accent/40 transition-colors"
        aria-label={t("nav.dashboard.label")}
        title={t("nav.dashboard.label")}
      >
        <div className="flex items-center gap-2">
          {/* Brand logo kept in warm orange for product identity, distinct from
              mint accents used by functional UI (active nav, badges, etc.). */}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
            style={{
              background: "linear-gradient(135deg, #d97757, #b85d3f)",
              boxShadow: "0 0 12px rgba(217, 119, 87, 0.35)",
            }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold tracking-wide">soon-ga.agent</div>
            <div className="text-xs text-sidebar-foreground/60">{t("brand.tagline")}</div>
          </div>
          <span
            className="rounded-full border border-sidebar-border/70 bg-sidebar-accent/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/70"
            title={t("brand.prototypeTitle")}
          >
            {t("brand.prototype")}
          </span>
        </div>
      </Link>

      <Separator className="bg-sidebar-border" />

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active =
            Boolean(item.href) &&
            (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href!)));
          const Icon = item.icon;

          const baseClasses = cn(
            "relative group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors w-full text-left",
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
          );

          const inner = (
            <>
              {active && (
                <span
                  aria-hidden
                  className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r-full bg-sidebar-primary"
                  style={{ boxShadow: "0 0 8px var(--sidebar-primary)" }}
                />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active
                    ? "text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground",
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{t(item.labelKey)}</div>
                <div
                  className={cn(
                    "text-[12px] truncate",
                    active ? "text-sidebar-accent-foreground/70" : "text-sidebar-foreground/50",
                  )}
                >
                  {t(item.subKey)}
                </div>
              </div>
              {typeof item.badge === "number" && item.badge > 0 && (
                <Badge className="bg-sidebar-primary text-sidebar-primary-foreground h-5 px-1.5 text-[11px] font-semibold tabular-nums">
                  {item.badge}
                </Badge>
              )}
            </>
          );

          return item.href ? (
            <Link key={item.labelKey} href={item.href} className={baseClasses}>
              {inner}
            </Link>
          ) : (
            <button key={item.labelKey} type="button" onClick={item.onClick} className={baseClasses}>
              {inner}
            </button>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="px-4 py-4 space-y-3">
        <WalletPill variant="sidebar" />
        <NotificationPermissionPill />
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold shrink-0">
              M
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-medium truncate">{t("workspace.name")}</div>
              <div className="text-[11px] text-sidebar-foreground/60 truncate">{t("workspace.handle")}</div>
            </div>
          </div>
          <LocaleToggle variant="sidebar" />
        </div>
      </div>
    </aside>
  );
}
