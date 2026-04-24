"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DashboardHero } from "@/components/DashboardHero";
import { AgentFeed } from "@/components/AgentFeed";
import { BurnRateChart } from "@/components/BurnRateChart";
import { MetricCard, MiniBars, DeltaPill, ProgressTrack } from "@/components/MetricCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { agents, burnRate7d, stats } from "@/lib/mockData";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";

function greetingKey(hour: number): string {
  if (hour >= 5 && hour < 12) return "dashboard.greeting.morning";
  if (hour >= 12 && hour < 18) return "dashboard.greeting.afternoon";
  if (hour >= 18 && hour < 23) return "dashboard.greeting.evening";
  return "dashboard.greeting.lateNight";
}

export default function DashboardPage() {
  const t = useT();
  const { locale } = useLocale();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const burnPercent = Math.round((stats.monthSpent / stats.monthBudget) * 100);
  const remainingPct = Math.max(0, 100 - burnPercent);
  const autoCount = stats.todayTransactions - stats.pendingCount;
  const automationPct = Math.round((autoCount / stats.todayTransactions) * 100);
  const deltaDir: "up" | "down" = stats.yesterdayDeltaPct < 0 ? "down" : "up";
  const deltaAbs = Math.abs(stats.yesterdayDeltaPct);

  const title = now
    ? t(greetingKey(now.getHours()), {
        time: `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      })
    : t("dashboard.greeting.placeholder");

  // 7-day transaction counts for the mini bar chart
  const miniBars = burnRate7d.map((d) => d.transactions);

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 max-w-[1280px] mx-auto">
      <PageHeader eyebrow={t("dashboard.eyebrow")} title={title} description={t("dashboard.tagline")} />

      {/* Bento grid: pending hero (2x2) + 4 metrics (2x2) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-fr">
        <div className="md:col-span-2 md:row-span-2">
          <DashboardHero />
        </div>

        <MetricCard
          label={t("dashboard.metric.today.label")}
          value={stats.todayTransactions}
          unit={t("dashboard.metric.today.unit")}
          visual={<MiniBars values={miniBars} />}
          sub={t("dashboard.metric.today.sub", { agents: stats.activeAgents })}
        />

        <MetricCard
          label={t("dashboard.metric.spend.label")}
          value={stats.todaySpent.toFixed(2)}
          unit={t("dashboard.metric.spend.unit")}
          sub={
            <span className="flex items-center gap-2">
              <DeltaPill direction={deltaDir} value={`${deltaAbs}%`} />
              <span>{t("dashboard.metric.spend.sub")}</span>
            </span>
          }
        />

        <MetricCard
          label={t("dashboard.metric.automation.label")}
          value={automationPct}
          unit="%"
          sub={t("dashboard.metric.automation.sub", {
            auto: autoCount,
            total: stats.todayTransactions,
          })}
        />

        <MetricCard
          label={t("dashboard.metric.month.label")}
          value={stats.monthSpent.toFixed(0)}
          unit={t("dashboard.metric.month.unit")}
          visual={<ProgressTrack pct={burnPercent} />}
          sub={t("dashboard.metric.month.sub", {
            budget: stats.monthBudget.toFixed(0),
            remaining: remainingPct,
          })}
        />
      </div>

      <div className="mt-10">
        <AgentFeed limit={5} viewAllHref="/audit" />
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
                      <span className="font-medium">{agent.name}</span>
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
    </div>
  );
}
