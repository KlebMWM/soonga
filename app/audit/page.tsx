"use client";

import { Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AuditTable } from "@/components/AuditTable";
import { Button } from "@/components/ui/button";
import { getAgentPlatform } from "@/lib/mockData";
import { useAuditLog } from "@/lib/stores";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { toast } from "sonner";

function csvEscape(v: string | number | undefined): string {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export default function AuditPage() {
  const t = useT();
  const { locale } = useLocale();
  const auditLog = useAuditLog();

  const handleExport = () => {
    const headers = [
      "timestamp",
      "agent",
      "platform",
      "merchant",
      "amount",
      "decision",
      "approved_by",
      "rule_based_explanation",
      "user_action",
      "gas_fee",
      "tx_hash",
    ];
    const rows = auditLog.map((e) =>
      [
        e.timestamp,
        e.agent,
        getAgentPlatform(e.agent),
        e.merchant[locale],
        e.amount,
        e.decision,
        e.approvedBy,
        e.reasoning[locale],
        e.userAction?.[locale] ?? "",
        e.gasFee,
        e.txHash,
      ]
        .map(csvEscape)
        .join(","),
    );
    const csv = "﻿" + headers.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `soon-ga-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(t("audit.exported.title"), {
      description: t("audit.exported.desc", { n: auditLog.length }),
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <PageHeader
        eyebrow={t("audit.eyebrow")}
        title={t("audit.title")}
        description={t("audit.desc")}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            {t("audit.export")}
          </Button>
        }
      />

      <div className="mt-6 md:mt-8">
        <AuditTable />
      </div>
    </div>
  );
}
