"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DashboardHero } from "@/components/DashboardHero";
import { AgentFeed } from "@/components/AgentFeed";
import { BurnRateChart } from "@/components/BurnRateChart";
import {
  BudgetBar,
  DeltaPill,
  MetricCard,
  MiniBars,
  MiniDonut,
} from "@/components/MetricCard";
import { DEMO_EVENTS } from "@/components/DemoControls";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { agents, pendingApprovals, stats } from "@/lib/mockData";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";

function phraseKey(hour: number): string {
  if (hour >= 5 && hour < 12) return "dashboard.greeting.phrase.morning";
  if (hour >= 12 && hour < 18) return "dashboard.greeting.phrase.afternoon";
  if (hour >= 18 && hour < 23) return "dashboard.greeting.phrase.evening";
  return "dashboard.greeting.phrase.lateNight";
}

function tagKey(hour: number): string {
  if (hour >= 5 && hour < 12) return "dashboard.greeting.tag.morning";
  if (hour >= 12 && hour < 18) return "dashboard.greeting.tag.afternoon";
  if (hour >= 18 && hour < 23) return "dashboard.greeting.tag.evening";
  return "dashboard.greeting.tag.lateNight";
}

export default function DashboardPage() {
  const t = useT();
  const { locale } = useLocale();
  const [now, setNow] = useState<Date | null>(null);
  // Lifted so that resolving a pending row in AgentFeed can drive the big
  // numeral morph in DashboardHero — both components read this single
  // source of truth for "how many things still need a decision".
  const initialPending = pendingApprovals.length;
  const [pendingCount, setPendingCount] = useState(initialPending);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // DemoControls hooks — let the floating panel poke pendingCount imperatively.
  useEffect(() => {
    const onApprove = () =>
      setPendingCount((c) => Math.max(0, c - 1));
    const onToggleEmpty = () =>
      setPendingCount((c) => (c === 0 ? initialPending : 0));
    const onReset = () => setPendingCount(initialPending);

    window.addEventListener(DEMO_EVENTS.approveOne, onApprove);
    window.addEventListener(DEMO_EVENTS.toggleEmpty, onToggleEmpty);
    window.addEventListener(DEMO_EVENTS.reset, onReset);
    return () => {
      window.removeEventListener(DEMO_EVENTS.approveOne, onApprove);
      window.removeEventListener(DEMO_EVENTS.toggleEmpty, onToggleEmpty);
      window.removeEventListener(DEMO_EVENTS.reset, onReset);
    };
  }, [initialPending]);

  const burnPercent = Math.round((stats.monthSpent / stats.monthBudget) * 100);
  const remainingPct = Math.max(0, 100 - burnPercent);
  const autoCount = stats.todayTransactions - pendingCount;
  const automationPct = Math.round((autoCount / stats.todayTransactions) * 100);
  const deltaDir: "up" | "down" = stats.yesterdayDeltaPct < 0 ? "down" : "up";
  const deltaAbs = Math.abs(stats.yesterdayDeltaPct);

  // SSR + first hydration render with hour=23 so server and client agree; the
  // effect then refreshes to the real hour once mounted.
  const hour = now?.getHours() ?? 23;

  // Outer max-width + padding is handled by the layout's main wrapper now;
  // this page just contains its own sections.
  return (
    <>
      {/* Greeting — tag + h1 (Noto Serif TC + Instrument Serif italic "Megan"
          with yellow highlighter) + sub copy on the left; mini-status 3 rows
          on the right (budget / auto / pending, colour-coded by semantics). */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10 pb-6 md:pb-8 border-b border-border">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Tag */}
          <div
            className="inline-flex items-center gap-2.5 border px-4 py-2 text-[13px] font-semibold"
            style={{
              color: "var(--ikea-blue-darker)",
              background: "var(--bg-accent)",
              borderColor: "var(--border-blue)",
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: "var(--yellow)",
                boxShadow: "0 0 10px var(--yellow)",
              }}
            />
            {t(tagKey(hour))}
          </div>

          {/* Headline */}
          <h1
            className="text-[40px] md:text-[52px] tracking-tight leading-[1.05]"
            style={{ color: "var(--headline)" }}
          >
            <span style={{ fontFamily: "var(--font-noto-serif-tc), serif" }}>
              {t(phraseKey(hour))}
              {locale === "zh" ? "，" : ", "}
            </span>
            <span
              className="italic"
              style={{
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                background:
                  "linear-gradient(transparent 65%, var(--yellow) 65%, var(--yellow) 95%, transparent 95%)",
                padding: "0 4px",
              }}
            >
              {t("dashboard.greeting.name")}
            </span>
          </h1>

          {/* Sub copy with bold numbers */}
          <p
            className="text-[16px] leading-relaxed max-w-xl"
            style={{ color: "var(--paragraph)" }}
          >
            {t("dashboard.greeting.sub.prefix")}
            <strong
              className="font-semibold"
              style={{ color: "var(--headline)" }}
            >
              {stats.todayTransactions}
            </strong>
            {t("dashboard.greeting.sub.txnsBridge")}
            <strong
              className="font-semibold"
              style={{ color: "var(--headline)" }}
            >
              {stats.hoursSaved}
            </strong>
            {t("dashboard.greeting.sub.suffix")}
          </p>
        </div>

        {/* Mini-status — 3 mono rows. Roomy padding + bigger label/value
            sizes so the three numbers read at a glance instead of squinted. */}
        <div className="flex flex-col gap-2 md:min-w-[280px] shrink-0">
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 border"
            style={{
              background: "var(--bg-soft)",
              borderColor: "var(--border)",
            }}
          >
            <span
              className="text-[13px] font-mono uppercase tracking-[0.08em]"
              style={{ color: "var(--text-mid)" }}
            >
              {t("dashboard.status.budget")}
            </span>
            <span
              className="text-[15px] font-mono font-bold tabular-nums"
              style={{ color: "var(--headline)" }}
            >
              {burnPercent}%
            </span>
          </div>
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 border"
            style={{
              background: "rgba(255, 216, 3, 0.18)",
              borderColor: "rgba(255, 216, 3, 0.5)",
            }}
          >
            <span
              className="text-[13px] font-mono uppercase tracking-[0.08em]"
              style={{ color: "var(--ikea-blue-darker)" }}
            >
              {t("dashboard.status.auto")}
            </span>
            <span
              className="text-[15px] font-mono font-bold tabular-nums"
              style={{ color: "var(--ikea-blue-darker)" }}
            >
              {automationPct}%
            </span>
          </div>
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 border"
            style={{
              background: "rgba(224, 120, 86, 0.08)",
              borderColor: "rgba(224, 120, 86, 0.3)",
            }}
          >
            <span
              className="text-[13px] font-mono uppercase tracking-[0.08em]"
              style={{ color: "var(--text-mid)" }}
            >
              {t("dashboard.status.pending")}
            </span>
            <span
              className="text-[15px] font-mono font-bold tabular-nums"
              style={{ color: "var(--coral)" }}
            >
              {pendingCount}
            </span>
          </div>
        </div>
      </div>

      {/* Bento grid: pending hero (2x2) + 4 metrics (2x2) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-fr">
        <div className="md:col-span-2 md:row-span-2">
          <DashboardHero pendingCount={pendingCount} />
        </div>

        <MetricCard
          label={t("dashboard.metric.today.label")}
          value={stats.todayTransactions}
          unit={t("dashboard.metric.today.unit")}
          footer={
            <div className="flex items-end gap-3">
              <MiniBars />
              <span
                className="text-[11px] font-mono shrink-0"
                style={{ color: "var(--text-mid)" }}
              >
                {t("dashboard.metric.today.range")}
              </span>
            </div>
          }
        />

        <MetricCard
          label={t("dashboard.metric.spend.label")}
          value={stats.todaySpent.toFixed(2)}
          unit={t("dashboard.metric.spend.unit")}
          footer={
            <div className="flex items-center gap-2">
              <DeltaPill direction={deltaDir} value={`${deltaAbs}%`} />
              <span
                className="text-[11px]"
                style={{ color: "var(--text-mid)" }}
              >
                {t("dashboard.metric.spend.sub")}
              </span>
            </div>
          }
        />

        <MetricCard
          label={t("dashboard.metric.automation.label")}
          value={automationPct}
          unit="%"
          footer={
            <div className="flex items-center gap-3">
              <MiniDonut pct={automationPct} />
              <span
                className="text-[11px] font-mono tabular-nums"
                style={{ color: "var(--text-mid)" }}
              >
                {autoCount} / {stats.todayTransactions}
              </span>
            </div>
          }
        />

        <MetricCard
          label={t("dashboard.metric.month.label")}
          value={stats.monthSpent.toFixed(0)}
          unit={t("dashboard.metric.month.unit")}
          footer={
            <div className="flex flex-col gap-1.5">
              <BudgetBar pct={burnPercent} />
              <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                <span style={{ color: "var(--text-mid)" }}>
                  {t("dashboard.metric.month.used", { pct: burnPercent })}
                </span>
                <span
                  className="font-bold"
                  style={{ color: "var(--ikea-blue-darker)" }}
                >
                  {t("dashboard.metric.month.left", { pct: remainingPct })}
                </span>
              </div>
            </div>
          }
        />
      </div>

      <div className="mt-10">
        <AgentFeed
          limit={5}
          viewAllHref="/audit"
          onPendingResolve={() =>
            setPendingCount((c) => Math.max(0, c - 1))
          }
          onPendingCreated={() => setPendingCount((c) => c + 1)}
        />
      </div>

      <details className="group mt-6 rounded-lg border border-border bg-card overflow-hidden">
        <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between gap-4 select-none hover:bg-muted/30 transition-colors">
          <div>
            <div className="text-sm font-medium">{t("dashboard.details.title")}</div>
            <div className="text-[12px] text-muted-foreground mt-0.5">{t("dashboard.details.sub")}</div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
        </summary>

        <div className="border-t border-border p-5 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-3 pb-3">
              <div>
                <div className="text-sm font-semibold">{t("dashboard.burn.title")}</div>
                <div className="text-[12px] text-muted-foreground">{t("dashboard.burn.sub")}</div>
              </div>
            </div>
            <BurnRateChart />
          </div>

          <div>
            <div className="pb-3 text-sm font-semibold">{t("dashboard.agents.title")}</div>
            <ul className="space-y-4">
              {agents.map((agent) => {
                const pct = Math.min(100, Math.round((agent.monthlySpent / agent.monthlyBudget) * 100));
                const isPaused = agent.status === "paused";
                return (
                  <li key={agent.id} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{t(`agent.${agent.name}.name`)}</span>
                      {isPaused && (
                        <Badge variant="outline" className="h-5 text-[11px] font-medium text-muted-foreground">
                          {t("dashboard.agent.paused")}
                        </Badge>
                      )}
                      <span className="text-[12px] text-muted-foreground truncate">
                        · {agent.role[locale]}
                      </span>
                      <span className="ml-auto text-sm font-semibold tabular-nums">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                    <div className="text-[12px] text-muted-foreground tabular-nums">
                      {t("dashboard.agents.usedThisMonth")} ${agent.monthlySpent.toFixed(2)} /{" "}
                      {t("dashboard.agents.monthlyBudget")} ${agent.monthlyBudget.toFixed(0)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </details>
    </>
  );
}
