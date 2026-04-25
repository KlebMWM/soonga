"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AgentIcon } from "@/components/AgentIcon";
import { DEMO_EVENTS } from "@/components/DemoControls";
import { liveFeed, stats, type FeedItem } from "@/lib/mockData";
import { simulateAgentAction } from "@/lib/simulateAgent";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { useDesktopNotifications } from "@/lib/useDesktopNotifications";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FilterKind = "all" | "pending" | "auto" | "recent";

const FILTERS: readonly FilterKind[] = ["all", "pending", "auto", "recent"];

/** Maps reason text to a visual tone for the rule pill. Binary: warn when the
 *  rule was triggered as a red flag ("exceeds", "stored-value", etc.) — every
 *  other reason reads as a pass (under cap, allowlisted, etc.). */
function ruleTone(reason: string): "ok" | "warn" {
  if (/超過|可儲值|警示|重複扣款|exceeds|stored-value|alert|recurring/i.test(reason)) {
    return "warn";
  }
  return "ok";
}

export function AgentFeed({
  limit = 5,
  viewAllHref = "/audit",
  onPendingResolve,
  onPendingCreated,
}: {
  limit?: number;
  viewAllHref?: string;
  /** Fires after a pending row finishes its resolve animation. Lets the
   *  parent decrement the dashboard's pending count so the big numeral
   *  morphs in sync with the row sliding out. */
  onPendingResolve?: () => void;
  /** Fires whenever the simulator generates a new pending item, so the
   *  parent can bump pendingCount and trigger an upward numeral morph in
   *  the hero card. Without this, "AI just asked for a decision" toasts
   *  fire but the dashboard's big number stays stale. */
  onPendingCreated?: () => void;
} = {}) {
  const t = useT();
  const { locale } = useLocale();
  const { notify } = useDesktopNotifications();
  const [items, setItems] = useState<FeedItem[]>(() => liveFeed.slice(0, limit));
  const [filter, setFilter] = useState<FilterKind>("all");
  const [resolving, setResolving] = useState<Set<string>>(new Set());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleResolve = (id: string) => {
    if (resolving.has(id)) return;
    setResolving((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setResolving((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      onPendingResolve?.();
    }, 600);
  };

  useEffect(() => {
    const tick = () => {
      const next = simulateAgentAction();
      setItems((prev) => [next, ...prev].slice(0, limit));
      if (next.status === "pending") {
        onPendingCreated?.();
        const agentName = t(`agent.${next.agent}.name`);
        const title = t("feed.toast.pending.title", { agent: agentName });
        const desc = t("feed.toast.pending.desc", {
          merchant: next.merchant[locale],
          amount: next.amount.toFixed(2),
          reason: next.reason[locale],
        });
        toast.warning(title, { description: desc });
        notify(title, desc);
      }
    };
    tickRef.current = setInterval(tick, 3000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [limit, locale, t, notify, onPendingCreated]);

  // DemoControls hooks — resolve-booking mimics a user click on the Booking
  // pending row's amber pill; reset restores the initial mock items.
  useEffect(() => {
    const onResolveBooking = () => {
      const booking = items.find(
        (i) =>
          i.merchant.en === "Booking.com" &&
          i.status === "pending" &&
          !resolving.has(i.id),
      );
      if (booking) handleResolve(booking.id);
    };
    const onReset = () => {
      setItems(liveFeed.slice(0, limit));
      setResolving(new Set());
    };
    window.addEventListener(DEMO_EVENTS.resolveBooking, onResolveBooking);
    window.addEventListener(DEMO_EVENTS.reset, onReset);
    return () => {
      window.removeEventListener(DEMO_EVENTS.resolveBooking, onResolveBooking);
      window.removeEventListener(DEMO_EVENTS.reset, onReset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, resolving, limit]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "pending") return items.filter((i) => i.status === "pending");
    if (filter === "auto") return items.filter((i) => i.status === "auto-approved");
    // "recent" — pass-through for the mock; all items are timestamped within
    // the past hour by construction. Becomes a real filter once timestamps
    // carry absolute dates.
    return items;
  }, [items, filter]);

  return (
    <div>
      {/* Header: title with blue tick mark + "即時" live pill + view-all link */}
      <div className="flex items-center justify-between gap-3 pb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h2
            className="flex items-center gap-2.5 text-[13px] font-semibold"
            style={{
              color: "var(--headline)",
              fontFamily: "var(--font-noto-sans-tc), sans-serif",
            }}
          >
            <span
              aria-hidden
              className="h-px w-[14px]"
              style={{ background: "var(--ikea-blue)" }}
            />
            {t("feed.title")}
          </h2>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium"
            style={{
              color: "var(--ikea-blue-darker)",
              background: "var(--bg-accent)",
              border: "1px solid var(--ikea-blue)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                style={{ background: "var(--ikea-blue)" }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{
                  background: "var(--ikea-blue)",
                  boxShadow: "0 0 8px var(--ikea-blue)",
                }}
              />
            </span>
            {t("feed.live")}
          </span>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1 text-[12px] transition-colors"
            style={{ color: "var(--text-mid)" }}
          >
            {t("feed.viewAll")}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn("feed-filter-pill", filter === f && "is-active")}
          >
            {t(`feed.filter.${f}`)}
          </button>
        ))}
      </div>

      {/* List + footer — single bordered box with the list above and the
          view-all button below. No rounded corners; the design language is
          edge-aligned per --radius: 0. */}
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <ul>
          {filtered.length === 0 && (
            <li
              className="p-6 text-center text-[12px]"
              style={{ color: "var(--text-mid)" }}
            >
              —
            </li>
          )}
          {filtered.map((item, i) => {
            const isPending = item.status === "pending";
            const isResolving = resolving.has(item.id);
            const tone = ruleTone(item.reason[locale]);
            const relative = item.relative?.[locale] ?? t("feed.relative.justNow");
            const isLast = i === filtered.length - 1;

            const row = (
              <li
                key={item.id}
                className={cn(
                  "activity-row",
                  isPending && "is-pending",
                  isResolving && "resolving",
                )}
                style={isLast ? { borderBottom: "none" } : undefined}
              >
                {/* Agent icon — 36x36 square tile with same-hue outer ring */}
                <AgentIcon agent={item.agent} size="md" outlined />

                {/* Main info: agent name → merchant, then time + relative */}
                <div className="min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap text-[13px]">
                    <span
                      className="font-mono"
                      style={{ color: "var(--text-mid)" }}
                    >
                      {t(`agent.${item.agent}.name`)}
                    </span>
                    <span
                      aria-hidden
                      style={{ color: "var(--ikea-blue)" }}
                    >
                      ▸
                    </span>
                    <span
                      className="truncate"
                      style={{ color: "var(--headline)" }}
                    >
                      {item.merchant[locale]}
                    </span>
                  </div>
                  <div
                    className="text-[11px] font-mono tabular-nums"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {item.time} · {relative}
                  </div>
                </div>

                {/* Rule pill */}
                <span
                  className={cn(
                    "rule-pill",
                    tone === "warn" ? "rule-pill-warn" : "rule-pill-ok",
                  )}
                >
                  <span className="rule-pill-dot" />
                  <span className="truncate">{item.reason[locale]}</span>
                </span>

                {/* Amount — mono, deep-blue digits + small gray USDC */}
                <span
                  className="text-[13px] font-mono font-semibold tabular-nums text-right whitespace-nowrap"
                  style={{ color: "var(--headline)" }}
                >
                  {item.amount.toFixed(2)}
                  <span
                    className="ml-1 text-[10px] font-normal"
                    style={{ color: "var(--text-dim)" }}
                  >
                    USDC
                  </span>
                </span>

                {/* Status — auto (gray + sage dot) or pending (amber pill).
                    Clicking the pending pill resolves the row in place
                    (sage wash → slide out 600ms) and bumps the dashboard
                    count. stopPropagation prevents the outer Link from also
                    navigating to /approvals. */}
                {isPending ? (
                  <button
                    type="button"
                    className="status-pending"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleResolve(item.id);
                    }}
                  >
                    <span className="status-pending-dot" />
                    {t("feed.status.pending")}
                  </button>
                ) : (
                  <span className="status-auto">
                    <span className="status-auto-dot" />
                    {t("feed.status.autoApproved")}
                  </span>
                )}
              </li>
            );

            // Pending rows are clickable — route to /approvals.
            return isPending ? (
              <Link key={item.id} href="/approvals" className="block">
                {row}
              </Link>
            ) : (
              row
            );
          })}
        </ul>

        {/* Footer: full-width link to the audit page. Merges into the outer
            list box and points at the same destination as the header link. */}
        <Link href={viewAllHref} className="feed-view-all">
          {t("feed.viewAllTransactions", { n: stats.todayTransactions })}
        </Link>
      </div>
    </div>
  );
}
