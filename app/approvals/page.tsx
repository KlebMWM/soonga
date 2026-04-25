"use client";

import { useRef, useState } from "react";
import { ChevronRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ApprovalCard } from "@/components/ApprovalCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pendingApprovals, type PendingApproval } from "@/lib/mockData";
import { b } from "@/lib/i18n/config";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { toast } from "sonner";

const COUNTER_DELAY_MS = 10000;

function buildCounterApproval(original: PendingApproval): PendingApproval | null {
  if (!original.counterOffer) return null;
  const o = original.counterOffer;
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");
  const ss = now.getSeconds().toString().padStart(2, "0");
  const saved = original.amount - o.amount;
  const savedTag =
    saved > 0
      ? b(
          `（比原方案省 ${saved.toFixed(2)} USDC）`,
          ` (saves ${saved.toFixed(2)} USDC vs. original)`,
        )
      : b("", "");
  return {
    id: `${original.id}_counter_${now.getTime()}`,
    agent: original.agent,
    agentAvatar: original.agentAvatar,
    merchant: o.merchant,
    amount: o.amount,
    currency: original.currency,
    timestamp: `${original.timestamp.slice(0, 10)} ${hh}:${mm}:${ss}`,
    why: {
      zh: o.why.zh + savedTag.zh,
      en: o.why.en + savedTag.en,
    },
    context: {
      ...original.context,
      merchantTrust: o.merchantTrust,
    },
    triggeredRule: o.triggeredRule,
    severity: "info",
    isCounterOffer: true,
  };
}

export default function ApprovalsPage() {
  const t = useT();
  const { locale } = useLocale();
  const [approvals, setApprovals] = useState<PendingApproval[]>(pendingApprovals);
  const [index, setIndex] = useState(0);
  const pendingCounters = useRef<Set<string>>(new Set());

  const total = approvals.length;
  const current = approvals[index];
  const goNext = () =>
    setIndex((i) => (total > 0 ? (i + 1) % total : 0));

  const handleHandled = (id: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    // Clamp index against the SHRUNK array so we don't fall off the end. The
    // closure here captures the pre-filter length, so length-2 is the new
    // last valid index.
    setIndex((i) => Math.max(0, Math.min(i, approvals.length - 2)));
  };

  const handleCounter = (original: PendingApproval) => {
    if (pendingCounters.current.has(original.id)) return;
    pendingCounters.current.add(original.id);

    setTimeout(() => {
      const next = buildCounterApproval(original);
      if (!next) return;
      setApprovals((prev) => [...prev, next]);
      toast.info(t("approval.toast.counterArrived.title", { agent: t(`agent.${original.agent}.name`) }), {
        description: t("approval.toast.counterArrived.desc", {
          merchant: next.merchant[locale],
          amount: next.amount.toFixed(2),
        }),
      });
      pendingCounters.current.delete(original.id);
    }, COUNTER_DELAY_MS);
  };

  return (
    <div className="px-5 md:px-8 py-8 max-w-[820px] mx-auto">
      <PageHeader
        eyebrow={t("approvals.eyebrow")}
        title={t("approvals.title")}
        description={t("approvals.desc")}
        actions={
          <Badge variant="outline" className="gap-1.5 border-accent/30 text-accent">
            <Clock className="h-3 w-3" />
            {total} {t("approvals.badge")}
          </Badge>
        }
      />

      {total > 0 ? (
        <>
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={goNext}
              disabled={total <= 1}
            >
              {t("approvals.next")}
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <div className="flex items-center gap-1.5">
              {approvals.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setIndex(i)}
                  aria-label={`${t("approvals.next")} ${i + 1}`}
                  className={
                    "h-1.5 rounded-full transition-all " +
                    (i === index
                      ? "w-6 bg-accent"
                      : "w-1.5 bg-border hover:bg-muted-foreground/40") +
                    (a.isCounterOffer ? " ring-1 ring-primary/40" : "")
                  }
                />
              ))}
              <span className="ml-2 text-[12px] text-muted-foreground tabular-nums">
                {index + 1} / {total}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <ApprovalCard
              key={current.id}
              approval={current}
              onCounter={handleCounter}
              onHandled={handleHandled}
            />
          </div>
        </>
      ) : (
        // Empty state — queue cleared. Brief, mirrors the dashboard's
        // "all clear" tone without the late-night editorial flourish.
        <div className="mt-10 rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center text-[14px] text-muted-foreground">
          {t("approvals.empty")}
        </div>
      )}
    </div>
  );
}
