"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Clock, ShieldOff } from "lucide-react";
import { AgentIcon } from "@/components/AgentIcon";
import { liveFeed, type FeedItem } from "@/lib/mockData";
import { simulateAgentAction } from "@/lib/simulateAgent";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { useDesktopNotifications } from "@/lib/useDesktopNotifications";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FilterKind = "all" | "pending" | "auto";

function ruleTone(reason: string): "pass" | "warn" | "neutral" {
  // Warning keywords (ZH + EN)
  if (/超過|可儲值|警示|重複扣款|exceeds|stored-value|alert|recurring/i.test(reason)) {
    return "warn";
  }
  // Pass keywords (ZH + EN)
  if (/白名單|allowlisted/i.test(reason)) {
    return "pass";
  }
  return "neutral";
}

const RULE_TONE_CLASS: Record<"pass" | "warn" | "neutral", string> = {
  pass: "bg-success/15 text-success",
  warn: "bg-accent/15 text-accent",
  neutral: "bg-muted text-muted-foreground",
};

type StatusMeta = {
  labelKey: string;
  icon: typeof CheckCircle2;
  tone: string;
  dotColor: string;
  /** var(--*) reference so the dot glow matches its fill across theme changes. */
  dotGlowVar: string;
};

const STATUS_META: Record<FeedItem["status"], StatusMeta> = {
  "auto-approved": {
    labelKey: "feed.status.autoApproved",
    icon: CheckCircle2,
    tone: "text-muted-foreground",
    dotColor: "bg-success",
    dotGlowVar: "var(--success)",
  },
  pending: {
    labelKey: "feed.status.pending",
    icon: Clock,
    // Coral for "waiting on you" — accent is now mint (primary), not a warning hue
    tone: "text-warning font-medium",
    dotColor: "bg-warning",
    dotGlowVar: "var(--warning)",
  },
  approved: {
    labelKey: "feed.status.approved",
    icon: CheckCircle2,
    tone: "text-success",
    dotColor: "bg-success",
    dotGlowVar: "var(--success)",
  },
  rejected: {
    labelKey: "feed.status.rejected",
    icon: ShieldOff,
    tone: "text-destructive",
    dotColor: "bg-destructive",
    dotGlowVar: "var(--destructive)",
  },
};

export function AgentFeed({
  limit = 5,
  viewAllHref = "/audit",
}: {
  limit?: number;
  viewAllHref?: string;
} = {}) {
  const t = useT();
  const { locale } = useLocale();
  const { notify } = useDesktopNotifications();
  const [items, setItems] = useState<FeedItem[]>(() => liveFeed.slice(0, limit));
  const [filter, setFilter] = useState<FilterKind>("all");
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const tick = () => {
      const next = simulateAgentAction();
      setItems((prev) => [next, ...prev].slice(0, limit));
      if (next.status === "pending") {
        const title = t("feed.toast.pending.title", { agent: next.agent });
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
  }, [limit, locale, t, notify]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "pending") return items.filter((i) => i.status === "pending");
    return items.filter((i) => i.status === "auto-approved");
  }, [items, filter]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 pb-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">{t("feed.title")}</h2>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success"
                style={{ boxShadow: "0 0 8px var(--success)" }}
              />
            </span>
            {t("feed.live")}
          </span>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("feed.viewAll")}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 mb-2">
        {(["all", "pending", "auto"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
              filter === f
                ? "bg-foreground text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {t(`feed.filter.${f}`)}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <ul className="divide-y divide-border">
          {filtered.length === 0 && (
            <li className="p-6 text-center text-[13px] text-muted-foreground">—</li>
          )}
          {filtered.map((item) => {
            const meta = STATUS_META[item.status];
            const row = (
              <li
                className={cn(
                  "grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_minmax(140px,auto)_auto_auto] gap-3 items-center px-4 py-3 text-sm transition-colors",
                  item.status === "pending" ? "hover:bg-accent/5 cursor-pointer" : "hover:bg-muted/40",
                )}
              >
                <AgentIcon agent={item.agent} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-foreground">{item.agent}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground truncate">{item.merchant[locale]}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{item.time}</div>
                </div>
                <span
                  className={cn(
                    "hidden md:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] truncate max-w-[180px]",
                    RULE_TONE_CLASS[ruleTone(item.reason[locale])],
                  )}
                >
                  {item.reason[locale]}
                </span>
                <span className="text-[13px] font-medium tabular-nums text-foreground text-right whitespace-nowrap">
                  {item.amount.toFixed(2)}
                  <span className="ml-1 text-[11px] text-muted-foreground">USDC</span>
                </span>
                <span className={cn("inline-flex items-center gap-1.5 text-[11px] whitespace-nowrap", meta.tone)}>
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", meta.dotColor, item.status === "pending" && "animate-pulse")}
                    style={{ boxShadow: `0 0 6px ${meta.dotGlowVar}` }}
                  />
                  {t(meta.labelKey)}
                </span>
              </li>
            );

            return item.status === "pending" ? (
              <Link key={item.id} href="/approvals" className="block">
                {row}
              </Link>
            ) : (
              <div key={item.id}>{row}</div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
