"use client";

import { usePathname } from "next/navigation";
import { LocaleToggle } from "@/components/LocaleToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useT } from "@/lib/i18n/LocaleProvider";

/**
 * Desktop top bar. Breadcrumb on the left ("COMMAND CENTER / {section}"),
 * meta items on the right (currently: locale toggle). Hidden on mobile —
 * the MobileNav component handles the top-of-screen nav on small screens.
 *
 * The section label is derived from the current pathname via a mapping that
 * reuses the i18n keys already defined for each nav item's sub-label. This
 * keeps the breadcrumb in sync with the sidebar labels without a second
 * source of truth.
 */
const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "nav.dashboard.sub",
  "/rules": "nav.rules.sub",
  "/approvals": "nav.approvals.sub",
  "/audit": "nav.audit.sub",
};

export function TopBar() {
  const pathname = usePathname();
  const t = useT();

  // Find the closest matching breadcrumb entry — exact match first, then
  // prefix match so nested routes (e.g. /audit/tx/42) still resolve.
  const subKey =
    BREADCRUMB_MAP[pathname] ??
    Object.entries(BREADCRUMB_MAP).find(([path]) =>
      pathname.startsWith(path + "/"),
    )?.[1];

  return (
    <div
      className="hidden md:flex items-center justify-between"
      style={{
        padding: "14px 32px",
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="text-[11px] uppercase whitespace-nowrap"
          style={{
            color: "var(--text-mid)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            letterSpacing: "0.18em",
          }}
        >
          {t("topbar.section.commandCenter")}
        </span>
        <span
          aria-hidden
          className="text-[11px]"
          style={{ color: "var(--text-dim)" }}
        >
          /
        </span>
        {subKey && (
          <span
            className="text-[13px] font-semibold truncate"
            style={{ color: "var(--headline)" }}
          >
            {t(subKey)}
          </span>
        )}
      </div>

      {/* Right: meta toggles (theme + locale) */}
      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle variant="sidebar" />
        <LocaleToggle variant="sidebar" />
      </div>
    </div>
  );
}
