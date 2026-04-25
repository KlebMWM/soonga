"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ShieldOff, Sparkles, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AgentIcon } from "@/components/AgentIcon";
import { agents, type AuditEntry } from "@/lib/mockData";
import { useAuditLog } from "@/lib/stores";
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

export function AuditTable() {
  const t = useT();
  const { locale } = useLocale();
  const auditLog = useAuditLog();
  const [filter, setFilter] = useState<Filter>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return auditLog.filter((entry) => {
      if (filter !== "all" && entry.decision !== filter) return false;
      if (agentFilter !== "all" && entry.agent !== agentFilter) return false;
      return true;
    });
  }, [auditLog, filter, agentFilter]);

  const handleCopy = () => {
    const header = "timestamp,agent,merchant,amount,decision,approved_by,gas_fee,tx_hash\n";
    const rows = filtered
      .map((e) =>
        [e.timestamp, e.agent, e.merchant[locale], e.amount, e.decision, e.approvedBy, e.gasFee, e.txHash].join(","),
      )
      .join("\n");
    navigator.clipboard.writeText(header + rows).catch(() => {});
    toast.success(t("audit.copied.title"), { description: t("audit.copied.desc", { n: filtered.length }) });
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 md:flex-row md:items-center md:justify-between">
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

        <div className="flex items-center gap-2">
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm"
          >
            <option value="all">{t("audit.filter.allAgents")}</option>
            {agents.map((a) => (
              <option key={a.id} value={a.name}>
                {t(`agent.${a.name}.name`)}
              </option>
            ))}
          </select>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5" />
            {t("audit.copyCsv")}
          </Button>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {filtered.length === 0 && (
          <li className="p-8 text-center text-sm text-muted-foreground">{t("audit.empty")}</li>
        )}
        {filtered.map((entry) => {
          const meta = DECISION_META[entry.decision];
          const Icon = meta.icon;
          const isOpen = expanded === entry.id;
          const merchant = entry.merchant[locale];
          return (
            <li key={entry.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : entry.id)}
                className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
              >
                <AgentIcon agent={entry.agent} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{t(`agent.${entry.agent}.name`)}</span>
                    <span className="text-muted-foreground text-sm">→</span>
                    <span className="text-sm">{merchant}</span>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      ．{entry.amount.toFixed(2)} USDC
                    </span>
                  </div>
                  <div className="text-[12px] text-muted-foreground mt-0.5 font-mono">{entry.timestamp}</div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium",
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
              </button>

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
