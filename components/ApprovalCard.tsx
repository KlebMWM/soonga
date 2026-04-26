"use client";

import { Check, SlidersHorizontal, X } from "lucide-react";
import { AgentIcon } from "@/components/AgentIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import type { PendingApproval } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Locale = "zh" | "en";

const RISK_TONE = {
  sage: {
    dot: "var(--sage)",
    text: "var(--sage)",
    bg: "color-mix(in oklab, var(--sage) 12%, transparent)",
    border: "color-mix(in oklab, var(--sage) 30%, transparent)",
  },
  amber: {
    dot: "var(--amber)",
    text: "var(--amber-deep)",
    bg: "color-mix(in oklab, var(--amber) 12%, transparent)",
    border: "color-mix(in oklab, var(--amber) 30%, transparent)",
  },
  coral: {
    dot: "var(--coral)",
    text: "var(--coral)",
    bg: "color-mix(in oklab, var(--coral) 12%, transparent)",
    border: "color-mix(in oklab, var(--coral) 30%, transparent)",
  },
} as const;

const OUTCOME_META = {
  approved: {
    icon: Check,
    actionKey: "approval.action.approve",
    tone: "var(--sage)",
    buttonClass: "",
  },
  adjusted: {
    icon: SlidersHorizontal,
    actionKey: "approval.action.adjust",
    tone: "var(--ikea-blue-darker)",
    buttonClass: "text-foreground",
  },
  rejected: {
    icon: X,
    actionKey: "approval.action.reject",
    tone: "var(--coral)",
    buttonClass:
      "text-destructive hover:text-destructive hover:bg-destructive/10",
  },
} as const;

function fallbackSummary(
  approval: PendingApproval,
  locale: Locale,
  agentName: string,
) {
  const merchant = approval.merchant[locale];
  const amount = approval.amount.toFixed(2);
  const currency = approval.currency;

  return {
    what:
      locale === "zh"
        ? `${agentName}想支付 ${merchant}，金額 ${amount} ${currency}。`
        : `${agentName} wants to pay ${merchant} for ${amount} ${currency}.`,
    why: approval.why[locale],
    context:
      locale === "zh"
        ? `觸發審核：${approval.triggeredRule.zh}`
        : `Triggered: ${approval.triggeredRule.en}`,
  };
}

function fallbackOutcomes(
  approval: PendingApproval,
  locale: Locale,
  merchant: string,
) {
  const amount = approval.amount.toFixed(2);

  return {
    onApprove: [
      {
        zh: `立即扣款 ${amount} ${approval.currency}`,
        en: `Charge ${amount} ${approval.currency} immediately`,
      },
      {
        zh: `${merchant} 會收到這筆付款`,
        en: `${merchant} receives the payment`,
      },
    ],
    onAdjust: [
      {
        zh: "暫停這筆，檢查規則設定",
        en: "Pause this and review the rule settings",
      },
      {
        zh: "修改後可重新判斷這筆請求",
        en: "After editing, review this request again",
      },
    ],
    onReject: [
      {
        zh: "這筆付款不會發生",
        en: "This payment will not happen",
      },
      {
        zh: "AI 助理會被通知重新規劃",
        en: "The agent will be told to retry",
      },
    ],
  };
}

function RiskChip({
  risk,
  locale,
}: {
  risk: NonNullable<PendingApproval["risks"]>[number];
  locale: Locale;
}) {
  const tone = RISK_TONE[risk.severity];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium leading-none"
      style={{
        color: tone.text,
        background: tone.bg,
        borderColor: tone.border,
      }}
    >
      <span
        className="h-1 w-1 rounded-full"
        style={{ background: tone.dot }}
      />
      {risk.label[locale]}
    </span>
  );
}

function OutcomeBlock({
  kind,
  lines,
  active,
}: {
  kind: keyof typeof OUTCOME_META;
  lines: string[];
  active?: boolean;
}) {
  const meta = OUTCOME_META[kind];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        active
          ? "border-primary/30 bg-primary/5"
          : "border-border/70 bg-muted/25",
      )}
    >
      <div className="space-y-1.5 text-[12px] leading-relaxed text-muted-foreground">
        {lines.map((line) => (
          <div key={line} className="flex gap-2">
            <Icon
              className="mt-0.5 h-3 w-3 shrink-0"
              style={{ color: meta.tone }}
            />
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ApprovalCard({
  approval,
  onHandled,
}: {
  approval: PendingApproval;
  /** Fires after the user resolves the card via approve / reject so the
   *  parent can remove it from the queue. Adjust keeps the item pending. */
  onHandled?: (
    id: string,
    outcome: "approved" | "allowed" | "rejected",
  ) => void;
}) {
  const t = useT();
  const { locale } = useLocale();
  const agentName = t(`agent.${approval.agent}.name`);
  const merchant = approval.merchant[locale];
  const summary = approval.reasoning
    ? {
        what: approval.reasoning.what[locale],
        why: approval.reasoning.why[locale],
        context:
          approval.reasoning.context?.[locale] ??
          (locale === "zh"
            ? `觸發審核：${approval.triggeredRule.zh}`
            : `Triggered: ${approval.triggeredRule.en}`),
      }
    : fallbackSummary(approval, locale, agentName);
  const outcomes =
    approval.outcomes ?? fallbackOutcomes(approval, locale, merchant);
  const risks = (approval.risks ?? []).slice(0, 6);
  const hiddenRiskCount = Math.max(
    (approval.risks?.length ?? 0) - risks.length,
    0,
  );

  const act = (outcome: "approved" | "adjusted" | "rejected") => {
    const toastParams = {
      agent: agentName,
      merchant,
      amount: approval.amount.toFixed(2),
    };
    const messages = {
      approved: {
        title: t("approval.toast.approved.title", toastParams),
        desc: t("approval.toast.approved.desc", toastParams),
        isDenied: false,
      },
      adjusted: {
        title: t("approval.toast.adjusted.title", toastParams),
        desc: t("approval.toast.adjusted.desc", toastParams),
        isDenied: false,
      },
      rejected: {
        title: t("approval.toast.rejected.title"),
        desc: t("approval.toast.rejected.desc", toastParams),
        isDenied: true,
      },
    } as const;
    const message = messages[outcome];
    (message.isDenied ? toast.error : toast.success)(message.title, {
      description: message.desc,
    });

    if (outcome === "adjusted") return;
    onHandled?.(approval.id, outcome);
  };

  return (
    <Card className="min-h-[320px] max-w-[720px] overflow-hidden rounded-lg p-0">
      <div className="space-y-6 p-5 md:p-6">
        <div className="flex items-start gap-4">
          <AgentIcon agent={approval.agent} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-base font-semibold">{agentName}</span>
              <span className="text-sm text-muted-foreground">▸</span>
              <span className="text-sm font-medium">{merchant}</span>
              {approval.isCounterOffer && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {t("approval.counterBadge")}
                </span>
              )}
            </div>
            <div className="mt-1 text-[12px] text-muted-foreground">
              {approval.timestamp}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[18px] font-medium leading-snug text-foreground">
            {summary.what}
          </p>
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            {summary.why}
          </p>
          <p className="font-mono text-[12px] leading-relaxed text-muted-foreground">
            {summary.context}
          </p>
        </div>

        {(risks.length > 0 || hiddenRiskCount > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {risks.map((risk) => (
              <RiskChip
                key={`${risk.label.en}-${risk.severity}`}
                risk={risk}
                locale={locale}
              />
            ))}
            {hiddenRiskCount > 0 && (
              <span className="inline-flex items-center rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">
                +{hiddenRiskCount} {t("approval.risks.more")}
              </span>
            )}
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Button
              size="lg"
              className="w-full gap-1.5"
              onClick={() => act("approved")}
            >
              <Check className="h-4 w-4" />
              {t(OUTCOME_META.approved.actionKey)}
            </Button>
            <OutcomeBlock
              kind="approved"
              lines={outcomes.onApprove.map((line) => line[locale])}
              active
            />
          </div>

          <div className="space-y-2">
            <Button
              size="lg"
              variant="outline"
              className={cn(
                "w-full gap-1.5",
                OUTCOME_META.adjusted.buttonClass,
              )}
              onClick={() => act("adjusted")}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t(OUTCOME_META.adjusted.actionKey)}
            </Button>
            <OutcomeBlock
              kind="adjusted"
              lines={outcomes.onAdjust.map((line) => line[locale])}
            />
          </div>

          <div className="space-y-2">
            <Button
              size="lg"
              variant="ghost"
              className={cn(
                "w-full gap-1.5",
                OUTCOME_META.rejected.buttonClass,
              )}
              onClick={() => act("rejected")}
            >
              <X className="h-4 w-4" />
              {t(OUTCOME_META.rejected.actionKey)}
            </Button>
            <OutcomeBlock
              kind="rejected"
              lines={outcomes.onReject.map((line) => line[locale])}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
