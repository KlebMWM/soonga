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
import { usePendingApprovals } from "@/lib/stores";
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
  { href: "/approvals", labelKey: "nav.approvals.label", icon: Inbox },
  { href: "/audit", labelKey: "nav.audit.label", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useT();
  // Live badge — reflects current pending queue, not the static stats blob.
  const pendingCount = usePendingApprovals().length;

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
          className="text-[14px] font-bold leading-none whitespace-nowrap"
          style={{
            color: "var(--ikea-blue-darker)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          soon-ga.agent
        </span>
        <span
          className="ml-auto px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none"
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

      {/* Section label — sans (per-locale), no forced mono so Chinese and
          English both render in their script's native sans face. */}
      <div
        className="flex items-center gap-2"
        style={{ padding: "8px 20px 12px" }}
      >
        <span
          aria-hidden
          className="h-1 w-1 rounded-full shrink-0"
          style={{ background: "var(--ikea-blue)" }}
        />
        <span
          className="text-[12px] font-semibold uppercase"
          style={{
            color: "var(--text)",
            letterSpacing: "0.16em",
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
              <Icon className="h-[20px] w-[20px] shrink-0" strokeWidth={1.75} />
              <span className="flex-1 truncate">{t(item.labelKey)}</span>
              {item.href === "/approvals" && pendingCount > 0 && (
                <span className="sidebar-nav-badge">{pendingCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Wallet CTA — pulled up from the bottom stack to sit right below the
          nav items. The yellow raised button is the product's most deliberate
          action on this page; keeping it adjacent to nav surfaces it at eye
          level instead of buried under ambient status. */}
      <div style={{ padding: "14px 10px 0" }}>
        <WalletPill variant="sidebar" />
      </div>

      {/* Bottom — ambient status + identity */}
      <div
        className="mt-auto flex flex-col"
        style={{
          padding: 16,
          borderTop: "1px dashed var(--sidebar-border)",
          gap: 10,
        }}
      >
        <NotificationPermissionPill />
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
          className="text-[14px] font-semibold truncate"
          style={{ color: "var(--headline)" }}
        >
          {t("workspace.shortName")}
        </div>
        <div
          className="text-[12px] truncate mt-0.5"
          style={{
            color: "var(--paragraph)",
            letterSpacing: "0.04em",
          }}
        >
          {t("workspace.plan")}
        </div>
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0"
        style={{ color: "var(--text-mid)" }}
      />
    </button>
  );
}
