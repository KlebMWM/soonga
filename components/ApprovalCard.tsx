"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Info,
  Loader2,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
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

/** Picks an AI-suggested action based on severity, merchant trust, and
 *  whether a counter-offer is available. Mock heuristic — swap for a real
 *  LLM-derived recommendation when the API is wired. */
function recommend(
  approval: PendingApproval,
): {
  action: "approve" | "reject" | "counter";
  labelKey: string;
  reasonKey: string;
} {
  const trust = approval.context.merchantTrust;
  if (approval.counterOffer && approval.severity !== "info") {
    return {
      action: "counter",
      labelKey: "approval.suggestion.counter",
      reasonKey: "approval.suggestion.reason.counter",
    };
  }
  if (approval.severity === "danger" || trust === "blocklisted") {
    return {
      action: "reject",
      labelKey: "approval.suggestion.reject",
      reasonKey: "approval.suggestion.reason.reject",
    };
  }
  if (trust === "first-time") {
    return {
      action: "approve",
      labelKey: "approval.suggestion.approve",
      reasonKey: "approval.suggestion.reason.approveOnce",
    };
  }
  return {
    action: "approve",
    labelKey: "approval.suggestion.approve",
    reasonKey: "approval.suggestion.reason.approveSafe",
  };
}

export function ApprovalCard({
  approval,
  onCounter,
  onHandled,
}: {
  approval: PendingApproval;
  onCounter?: (approval: PendingApproval) => void;
  /** Fires after the user resolves the card via approve / allow / reject so
   *  the parent can remove it from the queue. Counter actions don't trigger
   *  this — the original stays in the queue while the AI works on a
   *  counter-offer. */
  onHandled?: (
    id: string,
    outcome: "approved" | "allowed" | "rejected",
  ) => void;
}) {
  const t = useT();
  const { locale } = useLocale();
  const [requestedCounter, setRequestedCounter] = useState(false);
  const meta = SEVERITY_META[approval.severity];
  const Icon = meta.icon;
  const canCounter = Boolean(approval.counterOffer);

  // Counter request takes ~10s on the parent's timer. Auto-clear the local
  // "thinking" indicator a bit after that so subsequent button clicks work
  // even if the user navigates around — the parent has already pushed the
  // counter approval to the queue by then.
  useEffect(() => {
    if (!requestedCounter) return;
    const timer = setTimeout(() => setRequestedCounter(false), 11000);
    return () => clearTimeout(timer);
  }, [requestedCounter]);

  const merchant = approval.merchant[locale];
  const why = approval.why[locale];
  const taskId = approval.context.taskId[locale];
  const triggeredRule = approval.triggeredRule[locale];
  const suggestion = recommend(approval);

  const act = (outcome: "approved" | "allowed" | "rejected" | "counter") => {
    const toastParams = {
      agent: t(`agent.${approval.agent}.name`),
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
      // Counter doesn't remove from queue — original stays visible while AI
      // works on an alternative; the local "thinking" flag disables buttons
      // and shows a spinner so the user knows progress is in flight.
      setRequestedCounter(true);
      onCounter(approval);
      return;
    }
    onHandled?.(approval.id, outcome as "approved" | "allowed" | "rejected");
  };

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
              <span className="text-base font-semibold">{t(`agent.${approval.agent}.name`)}</span>
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

        {/* AI 建議 — top-of-card recommendation. Mock heuristic; swap for
            a real model output when wiring the API. */}
        <div
          className="rounded-lg border p-3"
          style={{
            borderColor: "var(--border-blue)",
            background: "var(--bg-accent)",
          }}
        >
          <div
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--ikea-blue-darker)" }}
          >
            <Sparkles className="h-3 w-3" />
            {t("approval.suggestion.label")}
          </div>
          <div
            className="mt-1 text-[14px] font-semibold"
            style={{ color: "var(--headline)" }}
          >
            {t(suggestion.labelKey)}
          </div>
          <div
            className="mt-1 text-[13px] leading-relaxed"
            style={{ color: "var(--paragraph)" }}
          >
            {t(suggestion.reasonKey)}
          </div>
        </div>

        <div className="rounded-lg border border-primary/15 bg-primary/5 p-4">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-primary uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            {t("approval.why")}
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground">{why}</p>
        </div>

        {/* Context collapses by default — Why + AI suggestion + buttons stay
            on the first screen; users who want the full task / budget /
            trust breakdown click to expand. */}
        <details className="group">
          <summary className="cursor-pointer list-none flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            {t("approval.context.expand")}
            <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
          </summary>
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
        </details>

        <div className="rounded-lg bg-muted/50 p-3 text-[13px] text-muted-foreground border border-border/70">
          <span className="font-medium text-foreground">{t("approval.triggered")}</span>
          {triggeredRule}
        </div>

        <Separator />

        {/* Buttons re-ordered: approve / reject up top (most common decisions),
            counter + allowlist below (more deliberate actions). Allowlist
            pushed to the last slot — adding long-term trust shouldn't be
            the easy default in a payment-control product.

            While a counter request is in flight (~10s), all four buttons
            are disabled and the counter button shows a spinner. The parent
            pushes the counter approval to the queue when the timer fires;
            the user can cycle to it via the "next" button. */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button
              size="lg"
              className="gap-1.5"
              onClick={() => act("approved")}
              disabled={requestedCounter}
            >
              <Check className="h-4 w-4" />
              {t("approval.action.approve")}
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => act("rejected")}
              disabled={requestedCounter}
            >
              <X className="h-4 w-4" />
              {t("approval.action.reject")}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button
              size="lg"
              variant="ghost"
              className="gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
              onClick={() => act("counter")}
              disabled={!canCounter || requestedCounter}
              title={canCounter ? undefined : t("approval.action.counterDisabled")}
            >
              {requestedCounter ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("approval.counter.working")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t("approval.action.counter")}
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-1.5"
              onClick={() => act("allowed")}
              disabled={requestedCounter}
            >
              {t("approval.action.allow")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
