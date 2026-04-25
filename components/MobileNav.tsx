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
import { WalletPill } from "@/components/WalletPill";
import { LocaleToggle } from "@/components/LocaleToggle";
import { usePendingApprovals } from "@/lib/stores";
import { useT } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type MobileNavItem = {
  labelKey: string;
  icon: typeof LayoutDashboard;
  href?: string;
  onClick?: () => void;
  badge?: number;
};

const items: MobileNavItem[] = [
  { href: "/dashboard", labelKey: "nav.mobile.dashboard", icon: LayoutDashboard },
  { href: "/rules", labelKey: "nav.mobile.rules", icon: SlidersHorizontal },
  { href: "/approvals", labelKey: "nav.mobile.approvals", icon: Inbox },
  { href: "/audit", labelKey: "nav.mobile.audit", icon: ScrollText },
  {
    labelKey: "nav.mobile.guide",
    icon: HelpCircle,
    onClick: () => window.dispatchEvent(new CustomEvent("soon-open-welcome")),
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const t = useT();
  const pendingCount = usePendingApprovals().length;
  return (
    <header className="md:hidden sticky top-0 z-30 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
      <div className="flex items-center gap-2 px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label={t("nav.dashboard.label")}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-sm font-semibold tracking-wide">soon-ga.agent</div>
          <span
            className="rounded-full border border-sidebar-border/70 bg-sidebar-accent/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/70"
            title={t("brand.prototypeTitle")}
          >
            {t("brand.prototype")}
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <LocaleToggle variant="mobile" />
          <WalletPill variant="mobile" />
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
        {items.map((item) => {
          const active =
            Boolean(item.href) &&
            (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href!)));
          const Icon = item.icon;

          const cls = cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors",
            active
              ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
              : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60",
          );

          const inner = (
            <>
              <Icon className="h-3.5 w-3.5" />
              {t(item.labelKey)}
              {item.href === "/approvals" && pendingCount > 0 && (
                <Badge className="h-4 px-1 text-[11px] font-semibold tabular-nums bg-sidebar-primary text-sidebar-primary-foreground">
                  {pendingCount}
                </Badge>
              )}
            </>
          );

          return item.href ? (
            <Link key={item.labelKey} href={item.href} className={cls}>
              {inner}
            </Link>
          ) : (
            <button key={item.labelKey} type="button" onClick={item.onClick} className={cls}>
              {inner}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
