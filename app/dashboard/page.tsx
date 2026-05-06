"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ChevronDown, Sparkles, TrendingUp } from "lucide-react";
import { DashboardHero } from "@/components/DashboardHero";
import { AgentFeed } from "@/components/AgentFeed";
import { BurnRateChart } from "@/components/BurnRateChart";
import { IntroCard } from "@/components/IntroCard";
import {
  BudgetBar,
  DeltaPill,
  MetricCard,
  MiniBars,
  MiniDonut,
} from "@/components/MetricCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { agents, getAgentPlatformLabel, stats } from "@/lib/mockData";
import { usePendingApprovals } from "@/lib/stores";
import { useDisplayName } from "@/lib/useDisplayName";
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

function yesterdayISO(now: Date): string {
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  const m = String(y.getMonth() + 1).padStart(2, "0");
  const d = String(y.getDate()).padStart(2, "0");
  return `${y.getFullYear()}-${m}-${d}`;
}

// Deterministic PRNG seeded by a string. Same date → same numbers, so
// reloading shows stable values for the day; tomorrow shifts everything.
function seededRand(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function daysLeftInMonth(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  // new Date(year, month, 0) → last day of `month` (1-indexed input).
  const lastDay = new Date(y, m, 0).getDate();
  return Math.max(0, lastDay - d);
}

function briefingDataFor(dateISO: string) {
  const rand = seededRand(dateISO);
  const between = (lo: number, hi: number) =>
    lo + Math.floor(rand() * (hi - lo + 1));
  const autoCount = between(28, 52);
  const autoAmount = (6 + rand() * 14).toFixed(2);
  const youHandled = between(3, 8);
  const approved = Math.max(1, Math.round(youHandled * (0.55 + rand() * 0.25)));
  const rest = youHandled - approved;
  const rejected = rest === 0 ? 0 : between(0, rest);
  const counter = rest - rejected;
  const edgeCount = between(4, 10);
  const budgetDays = daysLeftInMonth(dateISO);
  return { autoCount, autoAmount, youHandled, approved, rejected, counter, edgeCount, budgetDays };
}

const BRIEFING_FALLBACK_DATE = "2026-04-24";

export default function DashboardPage() {
  const t = useT();
  const { locale } = useLocale();
  const [now, setNow] = useState<Date | null>(null);
  // pendingCount comes from the cross-page store now — same source the
  // Approvals page mutates and the Sidebar badge reads. Removes the prior
  // need for event-based syncing between pages.
  const pendingApprovals = usePendingApprovals();
  const pendingCount = pendingApprovals.length;
  const { name: displayName } = useDisplayName();

  useEffect(() => {
    const timeout = window.setTimeout(() => setNow(new Date()), 0);
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  const burnPercent = Math.round((stats.monthSpent / stats.monthBudget) * 100);
  const remainingPct = Math.max(0, 100 - burnPercent);
  const autoCount = stats.todayTransactions - pendingCount;
  const automationPct = Math.round((autoCount / stats.todayTransactions) * 100);
  const deltaDir: "up" | "down" = stats.yesterdayDeltaPct < 0 ? "down" : "up";
  const deltaAbs = Math.abs(stats.yesterdayDeltaPct);
  // SSR + first hydration render with hour=23 so server and client agree; the
  // effect then refreshes to the real hour once mounted.
  const hour = now?.getHours() ?? 23;

  // Yesterday's briefing date + numbers. Both null-fallback to a fixed seed
  // so SSR matches first hydration; the mount effect then ticks `now` and
  // the briefing rolls to the real yesterday with deterministic numbers.
  const briefingDate = now ? yesterdayISO(now) : BRIEFING_FALLBACK_DATE;
  const briefing = briefingDataFor(briefingDate);

  // Outer max-width + padding is handled by the layout's main wrapper now;
  // this page just contains its own sections.
  return (
    <>
      {/* Greeting — tag + h1 (Noto Serif TC + Instrument Serif italic "Megan"
          with yellow highlighter) + sub copy on the left; mini-status 3 rows
          on the right (budget / auto / pending, colour-coded by semantics). */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-10 pb-5 md:pb-8 border-b border-border">
        <div className="flex-1 min-w-0 space-y-3 md:space-y-4">
          <div className="max-w-3xl space-y-2">
            <h1
              className="text-[28px] md:text-[48px] font-semibold tracking-tight leading-[1.08]"
              style={{ color: "var(--headline)" }}
            >
              {t("dashboard.exchange.title")}
            </h1>
            <p
              className="text-[15px] md:text-[18px] leading-relaxed"
              style={{ color: "var(--paragraph)" }}
            >
              {t("dashboard.exchange.subtitle")}
            </p>
          </div>

          {/* Tag */}
          <div
            className="inline-flex items-center gap-2.5 border px-3 py-1.5 text-[12px] font-semibold md:px-4 md:py-2 md:text-[13px]"
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
          <div
            className="text-[32px] md:text-[52px] tracking-tight leading-[1.08]"
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
              {displayName}
            </span>
          </div>

          {/* Sub copy with bold numbers */}
          <p
            className="max-w-xl text-[15px] leading-relaxed md:text-[16px]"
            style={{ color: "var(--paragraph)" }}
          >
            {t("dashboard.greeting.sub.prefix", { agents: stats.activeAgents })}
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
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-md border"
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
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-md border"
            style={{
              background: "var(--sage-bg)",
              borderColor: "rgba(139, 164, 114, 0.4)",
            }}
          >
            <span
              className="text-[13px] font-mono uppercase tracking-[0.08em]"
              style={{ color: "var(--sage)" }}
            >
              {t("dashboard.status.auto")}
            </span>
            <span
              className="text-[15px] font-mono font-bold tabular-nums"
              style={{ color: "var(--sage)" }}
            >
              {automationPct}%
            </span>
          </div>
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-md border"
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

      <div className="mt-5 md:mt-6">
        <IntroCard />
      </div>

      {/* Bento grid: pending hero (2x2) + 4 metrics (2x2) */}
      <div className="mt-5 grid grid-cols-1 items-start gap-3 md:mt-6 md:grid-cols-4 md:grid-rows-2 md:items-stretch md:gap-4 md:auto-rows-fr">
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

      <div className="mt-8 md:mt-10">
        <AgentFeed limit={5} viewAllHref="/audit" />
      </div>

      {/* Yesterday's briefing — fulfills the empty-state hero's
          "明早 08:00 會有一份報表" promise. Date tracks `now`; the four stat
          tiles are deterministic from the date string (same date → same
          numbers, refresh-stable; rolls over at midnight). */}
      <details className="group mt-5 rounded-lg border border-border bg-card overflow-hidden md:mt-6">
        <summary className="list-none cursor-pointer px-4 py-3.5 flex items-center justify-between gap-4 select-none hover:bg-muted/30 transition-colors md:px-5 md:py-4">
          <div>
            <div className="text-sm font-medium flex items-center gap-2">
              <Sparkles
                className="h-3.5 w-3.5"
                style={{ color: "var(--ikea-blue-darker)" }}
              />
              {t("dashboard.briefing.title")}
            </div>
            <div className="text-[12px] text-muted-foreground mt-0.5">
              {t("dashboard.briefing.sub", { date: briefingDate })}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
        </summary>

        <div className="space-y-4 border-t border-border p-4 md:space-y-5 md:p-5">
          {/* Stat row — 4 numbers, the "five-finger view" of yesterday */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              className="rounded-md border p-3"
              style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
            >
              <div className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-mid)" }}>
                {t("dashboard.briefing.stat.auto.label")}
              </div>
              <div className="mt-1 text-[15px] font-semibold tabular-nums" style={{ color: "var(--headline)" }}>
                {t("dashboard.briefing.stat.auto.value", {
                  count: briefing.autoCount,
                  amount: briefing.autoAmount,
                })}
              </div>
            </div>
            <div
              className="rounded-md border p-3"
              style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
            >
              <div className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-mid)" }}>
                {t("dashboard.briefing.stat.you.label")}
              </div>
              <div className="mt-1 text-[15px] font-semibold tabular-nums" style={{ color: "var(--headline)" }}>
                {t("dashboard.briefing.stat.you.value", { n: briefing.youHandled })}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-mid)" }}>
                {t("dashboard.briefing.stat.you.breakdown", {
                  approved: briefing.approved,
                  rejected: briefing.rejected,
                  counter: briefing.counter,
                })}
              </div>
            </div>
            <div
              className="rounded-md border p-3"
              style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
            >
              <div className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-mid)" }}>
                {t("dashboard.briefing.stat.edge.label")}
              </div>
              <div className="mt-1 text-[15px] font-semibold tabular-nums" style={{ color: "var(--headline)" }}>
                {t("dashboard.briefing.stat.edge.value", { n: briefing.edgeCount })}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-mid)" }}>
                {t("dashboard.briefing.stat.edge.sub")}
              </div>
            </div>
            <div
              className="rounded-md border p-3"
              style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
            >
              <div className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-mid)" }}>
                {t("dashboard.briefing.stat.budget.label")}
              </div>
              <div className="mt-1 text-[15px] font-semibold tabular-nums" style={{ color: "var(--headline)" }}>
                {burnPercent}%
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-mid)" }}>
                {t("dashboard.briefing.stat.budget.sub", { days: briefing.budgetDays })}
              </div>
            </div>
          </div>

          {/* Highlights — 3 narrative bullets surfaced by mock heuristics */}
          <div className="space-y-2">
            <div
              className="text-[11px] uppercase tracking-wide"
              style={{ color: "var(--text-mid)" }}
            >
              {t("dashboard.briefing.highlights")}
            </div>
            <ul className="space-y-2">
              {[
                {
                  icon: TrendingUp,
                  key: "dashboard.briefing.highlight.newMerchant",
                  tone: "blue",
                },
                {
                  icon: AlertCircle,
                  key: "dashboard.briefing.highlight.budgetWarning",
                  tone: "amber",
                },
                {
                  icon: AlertCircle,
                  key: "dashboard.briefing.highlight.agentPaused",
                  tone: "muted",
                },
              ].map((h) => {
                const Icon = h.icon;
                const color =
                  h.tone === "amber"
                    ? "var(--amber-deep)"
                    : h.tone === "blue"
                      ? "var(--ikea-blue-darker)"
                      : "var(--text-mid)";
                return (
                  <li
                    key={h.key}
                    className="flex items-start gap-2 text-[13px] leading-relaxed"
                    style={{ color: "var(--paragraph)" }}
                  >
                    <Icon
                      className="h-3.5 w-3.5 shrink-0 mt-0.5"
                      style={{ color }}
                    />
                    <span>{t(h.key)}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* AI suggestion — single next-step prompt */}
          <div
            className="rounded-md border p-3 flex items-start gap-2.5"
            style={{
              borderColor: "var(--border-blue)",
              background: "var(--bg-accent)",
            }}
          >
            <Sparkles
              className="h-4 w-4 shrink-0 mt-0.5"
              style={{ color: "var(--ikea-blue-darker)" }}
            />
            <div className="min-w-0 flex-1">
              <div
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--ikea-blue-darker)" }}
              >
                {t("dashboard.briefing.suggestion.label")}
              </div>
              <div
                className="mt-1 text-[13px] leading-relaxed"
                style={{ color: "var(--headline)" }}
              >
                {t("dashboard.briefing.suggestion.text")}
              </div>
              <a
                href="/rules"
                className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--ikea-blue-darker)" }}
              >
                {t("dashboard.briefing.suggestion.action")} →
              </a>
            </div>
          </div>
        </div>
      </details>

      <details className="group mt-5 rounded-lg border border-border bg-card overflow-hidden md:mt-6">
        <summary className="list-none cursor-pointer px-4 py-3.5 flex items-center justify-between gap-4 select-none hover:bg-muted/30 transition-colors md:px-5 md:py-4">
          <div>
            <div className="text-sm font-medium">{t("dashboard.details.title")}</div>
            <div className="text-[12px] text-muted-foreground mt-0.5">{t("dashboard.details.sub")}</div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
        </summary>

        <div className="space-y-5 border-t border-border p-4 md:space-y-6 md:p-5">
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
                      <Badge variant="outline" className="h-5 text-[11px] font-mono font-medium text-muted-foreground">
                        {getAgentPlatformLabel(agent.name, locale)}
                      </Badge>
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
