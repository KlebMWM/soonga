"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipContentProps } from "recharts";
import { burnRate7d, burnRate30d, burnRate1y, type BurnPoint } from "@/lib/mockData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useT } from "@/lib/i18n/LocaleProvider";

type Range = "7d" | "30d" | "1y";

const RANGES: Record<Range, { series: BurnPoint[]; tickInterval: number }> = {
  "7d": { series: burnRate7d, tickInterval: 0 },
  "30d": { series: burnRate30d, tickInterval: 4 },
  "1y": { series: burnRate1y, tickInterval: 0 },
};

function makeTooltip(txLabel: string) {
  return function ChartTooltip({ active, payload, label }: TooltipContentProps) {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload as BurnPoint;
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-sm">
        <div className="text-[12px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-1 text-sm font-semibold tabular-nums">{item.amount.toFixed(2)} USDC</div>
        <div className="text-[12px] text-muted-foreground tabular-nums">
          {item.transactions} {txLabel}
        </div>
      </div>
    );
  };
}

export function BurnRateChart() {
  const t = useT();
  const [range, setRange] = useState<Range>("7d");
  const meta = RANGES[range];
  const total = meta.series.reduce((sum, p) => sum + p.amount, 0);
  const txCount = meta.series.reduce((sum, p) => sum + p.transactions, 0);
  const Tip = makeTooltip(t("chart.tooltip.transactions"));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 pb-3">
        <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
          <TabsList>
            <TabsTrigger value="7d">{t("chart.range.7d")}</TabsTrigger>
            <TabsTrigger value="30d">{t("chart.range.30d")}</TabsTrigger>
            <TabsTrigger value="1y">{t("chart.range.1y")}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="text-[12px] text-muted-foreground tabular-nums text-right">
          {t("chart.summary")} <span className="text-foreground font-medium">${total.toFixed(0)}</span>
          <span className="mx-1.5">·</span>
          {txCount.toLocaleString()} {t("chart.transactions")}
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={meta.series} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="burnFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              dy={6}
              interval={meta.tickInterval}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              width={48}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={Tip} cursor={{ stroke: "var(--color-primary)", strokeWidth: 1, strokeDasharray: "3 3" }} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#burnFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1 text-[12px] text-muted-foreground">
        {range === "1y" ? t("chart.monthlyLabel") : t("chart.dailyLabel")}．
        {range === "1y" ? t("chart.monthlyUnit") : t("chart.dailyUnit")}（USDC）
      </div>
    </div>
  );
}
