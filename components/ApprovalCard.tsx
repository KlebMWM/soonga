"use client";

import { useState } from "react";
import { AlertTriangle, Check, Info, ShieldAlert, Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AgentIcon } from "@/components/AgentIcon";
import type { PendingApproval } from "@/lib/mockData";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SEVERITY_META = {
  info: { icon: Info, labelKey: "approval.severity.info", tone: "text-primary bg-primary/10 border-primary/20" },
  warning: {
    icon: AlertTriangle,
    labelKey: "approval.severity.warning",
    tone: "text-accent bg-accent/10 border-accent/30",
  },
  danger: {
    icon: ShieldAlert,
    labelKey: "approval.severity.danger",
    tone: "text-destructive bg-destructive/10 border-destructive/25",
  },
} as const;

const TRUST_KEY: Record<PendingApproval["context"]["merchantTrust"], string> = {
  allowlisted: "approval.trust.allowlisted",
  blocklisted: "approval.trust.blocklisted",
  review: "approval.trust.review",
  "first-time": "approval.trust.firstTime",
};

export function ApprovalCard({
  approval,
  onCounter,
}: {
  approval: PendingApproval;
  onCounter?: (approval: PendingApproval) => void;
}) {
  const t = useT();
  const { locale } = useLocale();
  const [handled, setHandled] = useState<null | "approved" | "allowed" | "rejected" | "counter">(null);
  const meta = SEVERITY_META[approval.severity];
  const Icon = meta.icon;
  const canCounter = Boolean(approval.counterOffer);

  const merchant = approval.merchant[locale];
  const why = approval.why[locale];
  const taskId = approval.context.taskId[locale];
  const triggeredRule = approval.triggeredRule[locale];

  const act = (outcome: NonNullable<typeof handled>) => {
    setHandled(outcome);
    const toastParams = {
      agent: approval.agent,
      merchant,
      amount: approval.amount.toFixed(2),
    };
    const messages = {
      approved: {
        title: t("approval.toast.approved.title", toastParams),
        desc: t("approval.toast.approved.desc", toastParams),
        isDenied: false,
      },
      allowed: {
        title: t("approval.toast.allowed.title"),
        desc: t("approval.toast.allowed.desc", toastParams),
        isDenied: false,
      },
      rejected: {
        title: t("approval.toast.rejected.title"),
        desc: t("approval.toast.rejected.desc", toastParams),
        isDenied: true,
      },
      counter: {
        title: t("approval.toast.counter.title", toastParams),
        desc: t("approval.toast.counter.desc"),
        isDenied: false,
      },
    } as const;
    const m = messages[outcome];
    (m.isDenied ? toast.error : toast.success)(m.title, { description: m.desc });
    if (outcome === "counter" && canCounter && onCounter) {
      onCounter(approval);
    }
  };

  if (handled) {
    return (
      <Card className="p-6 border-dashed bg-muted/40">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted-foreground">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <div className="font-medium text-foreground">
              {t("approval.handled.title", { merchant })}
            </div>
            <div className="text-[12px]">{t("approval.handled.hint")}</div>
          </div>
          <Button size="sm" variant="outline" className="ml-auto" onClick={() => setHandled(null)}>
            {t("approval.handled.undo")}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className={cn("flex items-center gap-2 border-b px-5 py-3 text-[13px] font-medium", meta.tone)}>
        <Icon className="h-4 w-4" />
        {t(meta.labelKey)}
        {approval.isCounterOffer && (
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-[12px] font-medium">
            <Sparkles className="h-3 w-3" />
            {t("approval.counterBadge")}
          </span>
        )}
        <span className="ml-auto text-[12px] font-normal opacity-80">{approval.timestamp}</span>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <AgentIcon agent={approval.agent} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-semibold">{approval.agent}</span>
              <span className="text-sm text-muted-foreground">{t("approval.requestedPay")}</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl font-semibold tabular-nums tracking-tight">
                {approval.amount.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">{approval.currency}</span>
              <span className="text-sm text-muted-foreground">→</span>
              <span className="text-sm font-medium">{merchant}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-primary/15 bg-primary/5 p-4">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-primary uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            {t("approval.why")}
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground">{why}</p>
        </div>

        <div>
          <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
            {t("approval.context")}
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-[12px] text-muted-foreground">{t("approval.context.taskId")}</dt>
              <dd className="mt-0.5 text-sm font-medium">{taskId}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-muted-foreground">{t("approval.context.spentOnTask")}</dt>
              <dd className="mt-0.5 text-sm font-medium tabular-nums">
                ${approval.context.spentOnTask.toFixed(2)} USDC
              </dd>
            </div>
            <div>
              <dt className="text-[12px] text-muted-foreground">{t("approval.context.remaining")}</dt>
              <dd className="mt-0.5 text-sm font-medium tabular-nums">
                ${approval.context.remainingBudget.toFixed(2)} USDC
              </dd>
            </div>
            <div>
              <dt className="text-[12px] text-muted-foreground">{t("approval.context.trust")}</dt>
              <dd className="mt-0.5 text-sm font-medium">{t(TRUST_KEY[approval.context.merchantTrust])}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[12px] text-muted-foreground">{t("approval.context.similar")}</dt>
              <dd className="mt-0.5 text-sm font-medium tabular-nums">
                {approval.context.similarPastTransactions} {t("approval.context.similarUnit")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-[13px] text-muted-foreground border border-border/70">
          <span className="font-medium text-foreground">{t("approval.triggered")}</span>
          {triggeredRule}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button size="lg" className="gap-1.5" onClick={() => act("approved")}>
              <Check className="h-4 w-4" />
              {t("approval.action.approve")}
            </Button>
            <Button size="lg" variant="outline" className="gap-1.5" onClick={() => act("allowed")}>
              <Sparkles className="h-4 w-4" />
              {t("approval.action.allow")}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button
              size="lg"
              variant="ghost"
              className="gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
              onClick={() => act("counter")}
              disabled={!canCounter}
              title={canCounter ? undefined : t("approval.action.counterDisabled")}
            >
              {t("approval.action.counter")}
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => act("rejected")}
            >
              <X className="h-4 w-4" />
              {t("approval.action.reject")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
