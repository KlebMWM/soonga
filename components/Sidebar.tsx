"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  FileText,
  Inbox,
  LayoutGrid,
  LucideIcon,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { WalletPill } from "@/components/WalletPill";
import { NotificationPermissionPill } from "@/components/NotificationPermissionPill";
import { stats } from "@/lib/mockData";
import { useT } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type NavItem = {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

// Order defines display order; sub-labels intentionally omitted — the
// subtitle now lives in the breadcrumb in TopBar, not under each nav item.
const NAV: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.dashboard.label", icon: LayoutGrid },
  { href: "/rules", labelKey: "nav.rules.label", icon: SlidersHorizontal },
  {
    href: "/approvals",
    labelKey: "nav.approvals.label",
    icon: Inbox,
    badge: stats.pendingCount,
  },
  { href: "/audit", labelKey: "nav.audit.label", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useT();

  return (
    <aside
      className="hidden md:flex w-[220px] shrink-0 flex-col sticky top-0 h-screen"
      style={{
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        padding: "20px 0",
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5"
        style={{
          padding: "0 16px 20px",
          borderBottom: "1px dashed var(--sidebar-border)",
          marginBottom: 16,
        }}
        aria-label={t("nav.dashboard.label")}
      >
        {/* Yellow logo tile with deep-blue border + 2px hard shadow */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-[6px] shrink-0"
          style={{
            background: "linear-gradient(135deg, #ffd803, #ffb800)",
            border: "1.5px solid var(--ikea-blue-darker)",
            boxShadow: "0 2px 0 var(--ikea-blue-darker)",
          }}
        >
          <Zap
            className="h-4 w-4"
            strokeWidth={2.5}
            style={{
              color: "var(--ikea-blue-darker)",
              fill: "var(--ikea-blue-darker)",
            }}
          />
        </div>
        <span
          className="text-[13px] font-bold leading-none whitespace-nowrap"
          style={{
            color: "var(--ikea-blue-darker)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          soon-ga.agent
        </span>
        <span
          className="ml-auto px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none"
          style={{
            color: "var(--ikea-blue-darker)",
            background: "var(--bg-accent)",
            border: "1px solid var(--border-blue)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            letterSpacing: "0.08em",
          }}
          title={t("brand.prototypeTitle")}
        >
          {t("brand.prototypeShort")}
        </span>
      </Link>

      {/* Section label */}
      <div
        className="flex items-center gap-2"
        style={{ padding: "8px 20px 10px" }}
      >
        <span
          aria-hidden
          className="h-1 w-1 rounded-full shrink-0"
          style={{ background: "var(--ikea-blue)" }}
        />
        <span
          className="text-[10px] uppercase"
          style={{
            color: "var(--text-mid)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            letterSpacing: "0.2em",
          }}
        >
          {t("nav.section.navigate")}
        </span>
      </div>

      {/* Nav items */}
      <nav
        className="flex flex-col"
        style={{ padding: "0 10px", gap: 2 }}
      >
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("sidebar-nav-item", active && "is-active")}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              <span className="flex-1 truncate">{t(item.labelKey)}</span>
              {typeof item.badge === "number" && item.badge > 0 && (
                <span className="sidebar-nav-badge">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — 3 layers: notify status / wallet CTA / user pill */}
      <div
        className="mt-auto flex flex-col"
        style={{
          padding: 16,
          borderTop: "1px dashed var(--sidebar-border)",
          gap: 10,
        }}
      >
        <NotificationPermissionPill />
        <WalletPill variant="sidebar" />
        <UserPill />
      </div>
    </aside>
  );
}

function UserPill() {
  const t = useT();
  return (
    <button
      type="button"
      className="flex items-center gap-2.5 w-full text-left"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        padding: 8,
      }}
    >
      <div
        className="h-[30px] w-[30px] rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
        style={{
          background:
            "linear-gradient(135deg, var(--ikea-blue), var(--ikea-blue-darker))",
        }}
        aria-hidden
      >
        M
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <div
          className="text-[12px] font-semibold truncate"
          style={{ color: "var(--headline)" }}
        >
          {t("workspace.shortName")}
        </div>
        <div
          className="text-[10px] truncate"
          style={{
            color: "var(--text-mid)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            letterSpacing: "0.05em",
          }}
        >
          {t("workspace.plan")}
        </div>
      </div>
      <ChevronRight
        className="h-3.5 w-3.5 shrink-0"
        style={{ color: "var(--text-dim)" }}
      />
    </button>
  );
}
