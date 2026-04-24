"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentIcon } from "@/components/AgentIcon";
import { HudCard } from "@/components/ui/hud-card";
import { pendingApprovals } from "@/lib/mockData";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export function DashboardHero() {
  const t = useT();
  const { locale } = useLocale();
  const pending = pendingApprovals;
  const count = pending.length;

  // --------------- Clean state ---------------
  if (count === 0) {
    return (
      <Card className="h-full p-6 md:p-8 bg-card border-success/25">
        <div className="flex flex-col gap-5 h-full">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-success">
            {t("dashboard.hero.clean.title")}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-10 w-10" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {t("dashboard.hero.clean.desc")}
          </div>
        </div>
      </Card>
    );
  }

  // --------------- Pending state ---------------
  const uniqueAgents = Array.from(
    pending.reduce<Map<string, string>>((acc, p) => {
      if (!acc.has(p.agent)) acc.set(p.agent, p.agent);
      return acc;
    }, new Map()).values(),
  );
  const agentLabel = uniqueAgents.join(locale === "zh" ? "、" : ", ");
  const totalAmount = pending.reduce((sum, p) => sum + p.amount, 0);

  return (
    <HudCard variant="hero" className="h-full flex flex-col gap-6 p-6 md:p-8">
      {/* Top row: eyebrow + pending total */}
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
          {t("dashboard.hero.eyebrow")}
        </div>
        <div className="text-[11px] tabular-nums text-white/55 font-mono">
          {t("dashboard.hero.pending.total", { amount: totalAmount.toFixed(2) })}
        </div>
      </div>

      {/* Hero: "3 筆待辦" — Instrument Serif italic display number + phrase */}
      <div className="flex-1 flex flex-col justify-center gap-1.5">
        <div className="flex items-baseline gap-4 leading-none">
          <span
            className="italic tabular-nums font-normal leading-[0.85] text-[90px] md:text-[130px]"
            style={{
              color: "#ffffff",
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))",
            }}
          >
            {count}
          </span>
          <span className="text-[28px] md:text-[34px] font-medium text-white leading-none">
            {t("dashboard.hero.pending.line1")}
          </span>
        </div>
        <div className="text-[14px] md:text-[15px] text-white/65">
          {t("dashboard.hero.pending.line2")}
        </div>
      </div>

      {/* Agent avatars — SVG icons, gradient bg + glow, stacked with subtle overlap.
         Border uses mint-deep so the overlap reads as layered discs on the mint bg. */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center">
          {uniqueAgents.map((agent, i) => (
            <AgentIcon
              key={agent}
              agent={agent}
              size="md"
              className={cn(
                "rounded-full border-[2.5px] border-primary",
                i > 0 && "-ml-3",
              )}
            />
          ))}
        </div>
        <span className="text-[12px] text-white/60 truncate">{agentLabel}</span>
      </div>

      {/* CTA — white pill with mint text, per v9 inverse spec */}
      <Button
        nativeButton={false}
        render={<Link href="/approvals" />}
        variant="inverse"
        className="gap-1.5 self-start h-11 px-5 text-[14px]"
      >
        {t("dashboard.hero.pending.cta")}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </HudCard>
  );
}
