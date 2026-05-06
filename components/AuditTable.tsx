"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ChevronDown, ShieldOff, Sparkles, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AgentIcon } from "@/components/AgentIcon";
import { agents, getAgentPlatform, getAgentPlatformLabel, type AuditEntry } from "@/lib/mockData";
import { useAuditLog } from "@/lib/stores";
import { useDisplayName } from "@/lib/useDisplayName";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type Filter = "all" | "approved" | "rejected" | "auto-approved";

const DECISION_META: Record<
  AuditEntry["decision"],
  { labelKey: string; tone: string; icon: typeof CheckCircle2 }
> = {
  approved: {
    labelKey: "audit.decision.approved",
    tone: "text-success bg-success/10 border-success/20",
    icon: CheckCircle2,
  },
  rejected: {
    labelKey: "audit.decision.rejected",
    tone: "text-destructive bg-destructive/10 border-destructive/20",
    icon: ShieldOff,
  },
  "auto-approved": {
    labelKey: "audit.decision.auto",
    tone: "text-primary bg-primary/10 border-primary/15",
    icon: Sparkles,
  },
};

function parseTimestamp(timestamp: string) {
  const [date, time] = timestamp.split(" ");
  if (!date || !time) return null;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }
  return new Date(year, month - 1, day, hour, minute);
}

function formatRelative(timestamp: string, locale: "zh" | "en", t: ReturnType<typeof useT>) {
  const parsed = parseTimestamp(timestamp);
  if (!parsed) return timestamp;

  const diffMs = Math.max(0, Date.now() - parsed.getTime());
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return t("audit.relative.now");
  if (minutes < 60) {
    return t("audit.relative.minutes", { n: minutes });
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return t("audit.relative.hours", { n: hours });
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return t("audit.relative.days", { n: days });
  }

  return new Intl.DateTimeFormat(locale === "zh" ? "zh-TW" : "en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);
}

function decisionVerb(entry: AuditEntry, t: ReturnType<typeof useT>) {
  if (entry.approvedBy === "system") {
    return entry.decision === "rejected"
      ? t("audit.verb.systemRejected")
      : t("audit.verb.system");
  }
  return entry.decision === "rejected"
    ? t("audit.verb.rejected")
    : t("audit.verb.approved");
}

function trimTerminalPunctuation(value: string) {
  return value.trim().replace(/[。.!?]+$/u, "");
}

export function AuditTable() {
  const t = useT();
  const { locale } = useLocale();
  const auditLog = useAuditLog();
  const { name: displayName } = useDisplayName();
  const [filter, setFilter] = useState<Filter>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const platforms = useMemo(() => {
    const seen = new Map<string, string>();
    agents.forEach((agent) => {
      if (!seen.has(agent.platform)) {
        seen.set(agent.platform, agent.name);
      }
    });
    return Array.from(seen.entries()).map(([raw, agentName]) => ({
      raw,
      label: getAgentPlatformLabel(agentName, locale),
    }));
  }, [locale]);

  const filtered = useMemo(() => {
    return auditLog.filter((entry) => {
      if (filter !== "all" && entry.decision !== filter) return false;
      if (agentFilter !== "all" && entry.agent !== agentFilter) return false;
      if (
        platformFilter !== "all" &&
        getAgentPlatform(entry.agent) !== platformFilter
      ) {
        return false;
      }
      return true;
    });
  }, [auditLog, filter, agentFilter, platformFilter]);
  const hasActiveFilters =
    filter !== "all" || agentFilter !== "all" || platformFilter !== "all";

  const resetFilters = () => {
    setFilter("all");
    setAgentFilter("all");
    setPlatformFilter("all");
  };

  const handleCopy = () => {
    const header = "timestamp,agent,platform,merchant,amount,decision,approved_by,gas_fee,tx_hash\n";
    const rows = filtered
      .map((e) =>
        [
          e.timestamp,
          e.agent,
          getAgentPlatform(e.agent),
          e.merchant[locale],
          e.amount,
          e.decision,
          e.approvedBy,
          e.gasFee,
          e.txHash,
        ].join(","),
      )
      .join("\n");
    navigator.clipboard.writeText(header + rows).catch(() => {});
    toast.success(t("audit.copied.title"), { description: t("audit.copied.desc", { n: filtered.length }) });
  };

  return (
    <Card className="w-full max-w-full overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 md:flex-row md:items-center md:justify-between">
        <div className="-mx-1 max-w-full overflow-x-auto px-1 pb-1">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList>
              <TabsTrigger value="all">
                {t("audit.filter.all")} · {auditLog.length}
              </TabsTrigger>
              <TabsTrigger value="approved">{t("audit.filter.approved")}</TabsTrigger>
              <TabsTrigger value="rejected">{t("audit.filter.rejected")}</TabsTrigger>
              <TabsTrigger value="auto-approved">{t("audit.filter.auto")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="h-10 w-full min-w-0 rounded-md border border-border bg-card px-3 text-base sm:w-auto md:h-9 md:text-sm"
          >
            <option value="all">{t("audit.filter.allAgents")}</option>
            {agents.map((a) => (
              <option key={a.id} value={a.name}>
                {t(`agent.${a.name}.name`)}
              </option>
            ))}
          </select>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="h-10 w-full min-w-0 rounded-md border border-border bg-card px-3 text-base sm:w-auto md:h-9 md:text-sm"
          >
            <option value="all">{t("audit.filter.allPlatforms")}</option>
            {platforms.map((p) => (
              <option key={p.raw} value={p.raw}>
                {p.label}
              </option>
            ))}
          </select>
          <Button size="sm" variant="outline" className="min-h-11 w-full gap-1.5 sm:w-auto md:min-h-0" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5" />
            {t("audit.copyCsv")}
          </Button>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {filtered.length === 0 && (
          <li className="p-8 text-center">
            <div className="mx-auto max-w-sm">
              <div className="text-sm font-semibold text-foreground">
                {t("audit.empty.title")}
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                {hasActiveFilters
                  ? t("audit.empty.filtered")
                  : t("audit.empty")}
              </p>
              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={resetFilters}
                >
                  {t("audit.empty.reset")}
                </Button>
              )}
            </div>
          </li>
        )}
        {filtered.map((entry) => {
          const meta = DECISION_META[entry.decision];
          const Icon = meta.icon;
          const isOpen = expanded === entry.id;
          const merchant = entry.merchant[locale];
          const platform = getAgentPlatformLabel(entry.agent, locale);
          const relativeTime = formatRelative(entry.timestamp, locale, t);
          const verb = decisionVerb(entry, t);
          const reason = trimTerminalPunctuation(entry.reasoning[locale]);
          const narrative =
            entry.approvedBy === "system"
              ? t("audit.narrative.system", {
                  time: relativeTime,
                  verb,
                  reason,
                })
              : t("audit.narrative.user", {
                  name: displayName,
                  time: relativeTime,
                  verb,
                  reason,
                });
          // Reverse-link target by entry kind: user-decided → merchant
          // dialog (reuses round 12 path); system auto-approved → category
          // card highlight; system rejected → blocklist tab + row highlight.
          const viewRuleHref = (() => {
            if (entry.approvedBy === "user") {
              const params = new URLSearchParams({
                source: "audit",
                merchant: entry.merchant.en,
              });
              return `/rules?${params.toString()}`;
            }
            if (entry.approvedBy === "system" && entry.sourceCategoryId) {
              const params = new URLSearchParams({
                source: "audit",
                categoryId: entry.sourceCategoryId,
              });
              return `/rules?${params.toString()}`;
            }
            if (entry.approvedBy === "system" && entry.decision === "rejected") {
              const params = new URLSearchParams({
                source: "audit",
                trustTab: "block",
                merchant: entry.merchant.en,
              });
              return `/rules?${params.toString()}`;
            }
            return null;
          })();
          return (
            <li key={entry.id} className="group relative">
              <button
                onClick={() => setExpanded(isOpen ? null : entry.id)}
                className="flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/30 sm:flex-row sm:items-start sm:gap-4 sm:py-3"
              >
                <div className="flex min-w-0 items-start gap-3 sm:flex-1">
                  <AgentIcon agent={entry.agent} size="md" className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-sans text-sm font-medium">{t(`agent.${entry.agent}.name`)}</span>
                      <span className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                        {platform}
                      </span>
                      <span className="text-sm text-muted-foreground">→</span>
                      <span className="min-w-0 break-words font-sans text-sm">{merchant}</span>
                      <span className="font-mono text-sm tabular-nums text-muted-foreground">
                        ．{entry.amount.toFixed(2)} USDC
                      </span>
                    </div>
                    <div className="mt-0.5 font-mono text-[12px] text-muted-foreground">{entry.timestamp}</div>
                    <div className="pt-1.5 text-[12px] italic leading-relaxed text-muted-foreground">
                      {narrative}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-start sm:mt-0.5">
                  <div
                    className={cn(
                      "flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium",
                      meta.tone,
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {t(meta.labelKey)}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </div>
              </button>

              {viewRuleHref && (
                <Link
                  href={viewRuleHref}
                  className="absolute bottom-3 right-12 z-10 flex items-center gap-1 rounded-md border border-border/60 bg-card px-2 py-1 text-[11px] text-muted-foreground opacity-0 pointer-events-none transition-opacity duration-200 hover:text-foreground group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto"
                >
                  {t("audit.viewRule")}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}

              {isOpen && (
                <div className="px-4 pb-5 pt-1">
                  <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4">
                    <div>
                      <div className="text-[12px] font-medium text-primary uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {t("audit.expand.reasoning")}
                      </div>
                      <p className="mt-1.5 text-[14px] leading-relaxed">{entry.reasoning[locale]}</p>
                    </div>

                    {entry.userAction && (
                      <div>
                        <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
                          {t("audit.expand.userAction")}
                        </div>
                        <p className="mt-1.5 text-[14px]">{entry.userAction[locale]}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border/70">
                      <Field label={t("audit.field.tx")} value={entry.txHash} mono />
                      <Field label={t("audit.field.gas")} value={`${entry.gasFee} USDC`} />
                      <Field label={t("audit.field.platform")} value={platform} />
                      <Field
                        label={t("audit.field.approvedBy")}
                        value={entry.approvedBy === "user" ? t("audit.approvedBy.user") : t("audit.approvedBy.system")}
                      />
                      <Field label={t("audit.field.time")} value={entry.timestamp} mono />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Badge variant="outline" className="text-[12px] font-normal">
                        {t("audit.eu")}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[12px] text-muted-foreground">{label}</dt>
      <dd className={cn("mt-0.5 text-[14px] truncate", mono && "font-mono")}>{value}</dd>
    </div>
  );
}
