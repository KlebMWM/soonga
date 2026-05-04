"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentIcon } from "@/components/AgentIcon";
import { HudCard } from "@/components/ui/hud-card";
import { agents, pendingApprovals } from "@/lib/mockData";
import { useDisplayName } from "@/lib/useDisplayName";
import { useT } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export function DashboardHero({ pendingCount }: { pendingCount?: number } = {}) {
  const t = useT();
  const { name: displayName } = useDisplayName();
  const pending = pendingApprovals;
  // Prefer the lifted count from the page (so resolving a row in AgentFeed
  // can animate this number down). Falls back to the static mock length.
  const count = pendingCount ?? pending.length;

  // Numeral morph state: when count changes, keep the previous digit around
  // for 240ms so its exit animation can play overlapping with the new entry.
  const [displayCount, setDisplayCount] = useState(count);
  const [exitingCount, setExitingCount] = useState<number | null>(null);

  useEffect(() => {
    if (count !== displayCount) {
      const startTimer = setTimeout(() => {
        setExitingCount(displayCount);
        setDisplayCount(count);
      }, 0);
      const clearTimer = setTimeout(() => setExitingCount(null), 240);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [count, displayCount]);

  // --------------- Empty state — editorial late-night moment ---------------
  if (count === 0) {
    return (
      <HudCard
        id="pending-hero"
        variant="hero"
        className="is-empty h-full flex flex-col justify-between gap-6 p-6 md:p-8"
      >
        {/* Top — sage breathing dot + "夜已深 / LATE NIGHT" mono tag */}
        <div className="flex items-center gap-2">
          <span
            className="hud-dot"
            style={{
              color: "var(--sage)",
              width: 6,
              height: 6,
              boxShadow: "0 0 8px var(--sage)",
            }}
            aria-hidden
          />
          <span
            className="text-[11px] font-semibold uppercase"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              letterSpacing: "0.22em",
            }}
          >
            {t("dashboard.hero.empty.tag")}
          </span>
        </div>

        {/* Center — the quote. Noto Serif TC body, Instrument Serif italic
            yellow "Megan" inline. Two natural lines via flex-col. */}
        <div className="flex-1 flex flex-col justify-center">
          <p
            className="text-[28px] md:text-[34px] leading-[1.25] text-white"
            style={{ fontFamily: "var(--font-noto-serif-tc), serif" }}
          >
            {t("dashboard.hero.empty.quote.before")}
            <span
              className="italic"
              style={{
                color: "var(--yellow)",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
              }}
            >
              {displayName}
            </span>
            {t("dashboard.hero.empty.quote.after")}
          </p>
        </div>

        {/* Bottom — two-cell stats strip. Mirrors the .pending state's
            stats bar so the layout feels structurally familiar even though
            the content has shifted from "act" to "rest". */}
        <div className="grid grid-cols-2 gap-4 rounded-md border border-white/10 bg-white/[0.08] p-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-[0.12em] text-white/55 font-mono">
              {t("dashboard.hero.empty.stat1.label")}
            </span>
            <span className="text-[13px] font-semibold text-white">
              {t("dashboard.hero.empty.stat1.value")}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-[0.12em] text-white/55 font-mono">
              {t("dashboard.hero.empty.stat2.label")}
            </span>
            <span className="text-[13px] font-semibold text-white">
              {t("dashboard.hero.empty.stat2.value")}
            </span>
          </div>
        </div>
      </HudCard>
    );
  }

  // --------------- Pending state ---------------
  // Unique agents *in pending* drives the "跨 agent 數" stat. The avatar stack
  // below renders the full roster (all 4 agents) per the design spec, so the
  // count and the avatar count don't have to match.
  const uniqueAgents = Array.from(
    pending.reduce<Map<string, string>>((acc, p) => {
      if (!acc.has(p.agent)) acc.set(p.agent, p.agent);
      return acc;
    }, new Map()).values(),
  );
  const totalAmount = pending.reduce((sum, p) => sum + p.amount, 0);

  return (
    <HudCard
      id="pending-hero"
      variant="hero"
      className="h-full flex flex-col gap-5 p-6 md:p-7"
    >
      {/* Top row: "需要你核准" yellow pill + total amount mono readout */}
      <div className="flex items-start justify-between gap-3">
        <Badge
          variant="hud-amber"
          className="h-6 gap-2 px-2.5 text-[11px] font-semibold"
        >
          <span className="hud-dot" style={{ width: 6, height: 6 }} />
          {t("dashboard.hero.eyebrow")}
        </Badge>
        <div className="text-[11px] tabular-nums text-white/55 font-mono">
          {t("dashboard.hero.pending.total", { amount: totalAmount.toFixed(2) })}
        </div>
      </div>

      {/* Headline: oversized Instrument Serif italic numeral in yellow +
          Noto Serif TC phrase */}
      <div className="flex-1 flex flex-col justify-center gap-1.5">
        <div className="flex items-baseline gap-4 leading-none">
          {/* Big numeral with morph — the entering digit takes natural flow,
              the exiting digit overlays absolute on top until 240ms passes. */}
          <span className="relative inline-block leading-[0.85]">
            <span
              key={displayCount}
              className="numeral-enter italic tabular-nums font-normal leading-[0.85] text-[88px] md:text-[120px] inline-block"
              style={{
                color: "var(--yellow)",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
                filter: "drop-shadow(0 0 30px rgba(255, 216, 3, 0.4))",
              }}
            >
              {displayCount}
            </span>
            {exitingCount !== null && (
              <span
                key={`exit-${exitingCount}`}
                className="numeral-exit italic tabular-nums font-normal leading-[0.85] text-[88px] md:text-[120px] absolute left-0 top-0 pointer-events-none"
                style={{
                  color: "var(--yellow)",
                  fontFamily: "var(--font-instrument-serif), Georgia, serif",
                  filter: "drop-shadow(0 0 30px rgba(255, 216, 3, 0.4))",
                }}
                aria-hidden
              >
                {exitingCount}
              </span>
            )}
          </span>
          <span
            className="text-[22px] md:text-[26px] font-medium text-white leading-none"
            style={{ fontFamily: "var(--font-noto-serif-tc), serif" }}
          >
            {t("dashboard.hero.pending.line1")}
          </span>
        </div>
        <div className="text-[14px] text-white/65">
          {t("dashboard.hero.pending.line2")}
        </div>
      </div>

      {/* Stats strip — translucent bar with oldest-pending + unique-agent count */}
      <div className="grid grid-cols-2 gap-4 border border-white/10 bg-white/[0.08] p-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-[0.12em] text-white/55 font-mono">
            {t("dashboard.hero.stats.oldest")}
          </span>
          <span className="text-[13px] font-semibold text-white font-mono tabular-nums">
            {t("dashboard.hero.stats.oldestValue")}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-[0.12em] text-white/55 font-mono">
            {t("dashboard.hero.stats.agents")}
          </span>
          <span className="text-[13px] font-semibold text-white font-mono tabular-nums">
            {uniqueAgents.length}
          </span>
        </div>
      </div>

      {/* Bottom row: full-roster avatar stack on the left, raised yellow CTA
          on the right. Border uses --primary so each disc blends into the
          hero-card bg (same color family) and the overlap reads as layered. */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center">
          {agents.map((agent, i) => (
            <AgentIcon
              key={agent.id}
              agent={agent.name}
              size="md"
              className={cn(
                "rounded-full border-[2.5px] border-primary",
                i > 0 && "-ml-3",
              )}
            />
          ))}
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/approvals" />}
          variant="raised"
          className="h-11 px-5 text-[13px] gap-2"
        >
          {t("dashboard.hero.pending.cta")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </HudCard>
  );
}
