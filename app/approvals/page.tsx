"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Clock, FileText, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ApprovalCard } from "@/components/ApprovalCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AgentIcon } from "@/components/AgentIcon";
import { type PendingApproval } from "@/lib/mockData";
import {
  approvalToAuditEntry,
  auditStore,
  pendingStore,
  usePendingApprovals,
} from "@/lib/stores";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ApprovalOutcome = "approved" | "allowed" | "rejected";

function decisionLine(
  approval: PendingApproval,
  locale: "zh" | "en",
  agentName: string,
) {
  if (approval.reasoning?.what) return approval.reasoning.what[locale];
  return locale === "zh"
    ? `${agentName}想支付 ${approval.merchant.zh}，金額 ${approval.amount.toFixed(2)} ${approval.currency}。`
    : `${agentName} wants to pay ${approval.merchant.en} for ${approval.amount.toFixed(2)} ${approval.currency}.`;
}

export default function ApprovalsPage() {
  const router = useRouter();
  const t = useT();
  const { locale } = useLocale();
  const approvals = usePendingApprovals();
  const [index, setIndex] = useState(0);
  const [bulkOpen, setBulkOpen] = useState(false);

  const total = approvals.length;
  const activeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const current = approvals[activeIndex];
  const goNext = useCallback(
    () =>
      setIndex((i) => (total > 0 ? (Math.min(i, total - 1) + 1) % total : 0)),
    [total],
  );
  const goPrev = useCallback(
    () =>
      setIndex((i) =>
        total > 0 ? (Math.min(i, total - 1) - 1 + total) % total : 0,
      ),
    [total],
  );

  const resolveApproval = useCallback((approval: PendingApproval, outcome: ApprovalOutcome) => {
    auditStore.prepend(approvalToAuditEntry(approval, outcome));
    pendingStore.remove(approval.id);
  }, []);

  const handleHandled = (id: string, outcome: ApprovalOutcome) => {
    const approval = pendingStore.getAll().find((a) => a.id === id);
    if (!approval) return;
    resolveApproval(approval, outcome);
  };

  const handleAdjustCurrent = useCallback(() => {
    if (!current) return;
    const params = new URLSearchParams({
      merchant: current.merchant.en,
      source: "approvals",
    });
    router.push(`/rules?${params.toString()}`);
  }, [current, router]);

  const handleBulkApprove = () => {
    const snapshot = pendingStore.getAll();
    snapshot.forEach((approval) => {
      auditStore.prepend(approvalToAuditEntry(approval, "approved"));
    });
    pendingStore.setAll([]);
    setBulkOpen(false);
    toast.success(t("approval.toast.bulk.title", { count: snapshot.length }), {
      description: t("approval.toast.bulk.desc"),
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest("input, textarea, select, button, [role='dialog']")
      ) {
        return;
      }
      if (event.key === "j") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "k") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "Enter" && current) {
        event.preventDefault();
        resolveApproval(current, "approved");
      }
      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        handleAdjustCurrent();
      }
      if (event.key === "Escape" && current) {
        event.preventDefault();
        resolveApproval(current, "rejected");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, goNext, goPrev, handleAdjustCurrent, resolveApproval]);

  return (
    <div className="px-5 md:px-8 py-8 max-w-[1180px] mx-auto">
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

      {total > 0 && current ? (
        <>
          <div className="mt-8 grid gap-5 lg:grid-cols-[320px_minmax(0,720px)] lg:items-start lg:justify-center">
            <aside className="rounded-lg border border-border/70 bg-card p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-[13px] font-semibold">
                  {t("approvals.list.title")}
                </h2>
                <span className="font-mono text-[12px] text-muted-foreground">
                  {activeIndex + 1} / {total}
                </span>
              </div>

              <div className="space-y-2">
                {approvals.map((approval, i) => {
                  const active = i === activeIndex;
                  const agentName = t(`agent.${approval.agent}.name`);
                  return (
                    <button
                      key={approval.id}
                      type="button"
                      aria-pressed={active}
                      onClick={(e) => {
                        setIndex(i);
                        // Release focus so subsequent j/k/Enter/Escape go to
                        // the body-level handler instead of being blocked by
                        // the "skip when focus is on a button" guard.
                        e.currentTarget.blur();
                      }}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left transition-colors",
                        active
                          ? "border-primary/45 bg-primary/10"
                          : "border-border/60 bg-background hover:bg-muted/40",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <AgentIcon agent={approval.agent} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-[13px] font-medium">
                              {approval.merchant[locale]}
                            </span>
                            <span className="font-mono text-[12px] text-muted-foreground">
                              {approval.amount.toFixed(0)} {approval.currency}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                            {decisionLine(approval, locale, agentName)}
                          </p>
                          {approval.risks?.[0] && (
                            <div className="mt-2 text-[11px] text-muted-foreground">
                              {approval.risks[0].label[locale]}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div>
              <ApprovalCard
                key={current.id}
                approval={current}
                onAdjust={handleAdjustCurrent}
                onHandled={handleHandled}
              />
            </div>
          </div>

          {total >= 3 && (
            <div className="sticky bottom-3 z-20 mt-5 flex justify-center">
              <div className="flex w-full max-w-[720px] items-center justify-between gap-3 rounded-lg border border-border bg-popover px-4 py-3 shadow-lg">
                <span className="text-[13px] text-muted-foreground">
                  {t("approvals.bulk.hint", { count: total })}
                </span>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setBulkOpen(true)}
                >
                  <Check className="h-3.5 w-3.5" />
                  {t("approvals.bulk.button", { count: total })}
                </Button>
              </div>
            </div>
          )}

          <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
            <DialogContent className="sm:max-w-[620px]">
              <DialogHeader>
                <DialogTitle>
                  {t("approvals.bulk.title", { count: total })}
                </DialogTitle>
                <DialogDescription>
                  {t("approvals.bulk.desc")}
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
                {approvals.map((approval) => {
                  const agentName = t(`agent.${approval.agent}.name`);
                  return (
                    <div
                      key={approval.id}
                      className="rounded-lg border border-border/70 bg-muted/25 p-3"
                    >
                      <div className="text-[13px] font-medium">
                        {approval.merchant[locale]} ·{" "}
                        {approval.amount.toFixed(2)} {approval.currency}
                      </div>
                      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                        {decisionLine(approval, locale, agentName)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  {t("approvals.bulk.cancel")}
                </DialogClose>
                <Button className="gap-1.5" onClick={handleBulkApprove}>
                  <Check className="h-4 w-4" />
                  {t("approvals.bulk.confirm", { count: total })}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        // Empty state — queue cleared. Brief, mirrors the dashboard's
        // "all clear" tone without the late-night editorial flourish.
        <div className="mt-10 rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-success/25 bg-success/10 text-success">
            <Check className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-foreground">
            {t("approvals.empty.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            {t("approvals.empty")}
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              render={<Link href="/audit" />}
            >
              <FileText className="h-3.5 w-3.5" />
              {t("approvals.empty.audit")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              render={<Link href="/rules" />}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t("approvals.empty.rules")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
