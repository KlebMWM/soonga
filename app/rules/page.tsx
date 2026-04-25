"use client";

import { useState } from "react";
import { CheckCircle2, ShieldOff, AlertCircle, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CategoryRuleCard } from "@/components/CategoryRuleCard";
import {
  NewRuleUnifiedDialog,
  type AllowEntry,
  type BlockEntry,
} from "@/components/NewRuleUnifiedDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  categories as initialCategories,
  trustList as initialTrustList,
  type Category,
  type TrustList,
} from "@/lib/mockData";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { toast } from "sonner";

type ListKind = "allow" | "block" | "review";

function TrustRow({
  name,
  meta,
  tone,
  onRemove,
  removeLabel,
}: {
  name: string;
  meta: string;
  tone: "success" | "destructive" | "accent";
  onRemove: () => void;
  removeLabel: string;
}) {
  const toneMap = {
    success: "text-success bg-success/10",
    destructive: "text-destructive bg-destructive/10",
    accent: "text-accent bg-accent/10",
  };
  const Icon = tone === "success" ? CheckCircle2 : tone === "destructive" ? ShieldOff : AlertCircle;
  return (
    <li className="group flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneMap[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-[12px] text-muted-foreground mt-0.5">{meta}</div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className="h-8 gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        title={removeLabel}
        aria-label={removeLabel}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline text-[12px]">{removeLabel}</span>
      </Button>
    </li>
  );
}

export default function RulesPage() {
  const t = useT();
  const { locale } = useLocale();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [trust, setTrust] = useState<TrustList>(initialTrustList);

  const handleCreateCategory = (c: Category) => setCategories((prev) => [...prev, c]);
  const handleAddAllow = (entry: AllowEntry) =>
    setTrust((prev) => ({ ...prev, allowlist: [entry, ...prev.allowlist] }));
  const handleAddBlock = (entry: BlockEntry) =>
    setTrust((prev) => ({ ...prev, blocklist: [entry, ...prev.blocklist] }));

  const handleRemove = (kind: ListKind, merchant: string) => {
    // Snapshot the removed entry so Undo restores its exact data
    const snapshot = {
      allow: trust.allowlist.find((i) => i.merchant === merchant),
      block: trust.blocklist.find((i) => i.merchant === merchant),
      review: trust.review.find((i) => i.merchant === merchant),
    }[kind];

    setTrust((prev) => ({
      allowlist: kind === "allow" ? prev.allowlist.filter((i) => i.merchant !== merchant) : prev.allowlist,
      blocklist: kind === "block" ? prev.blocklist.filter((i) => i.merchant !== merchant) : prev.blocklist,
      review: kind === "review" ? prev.review.filter((i) => i.merchant !== merchant) : prev.review,
    }));

    const descKey =
      kind === "allow"
        ? "rules.trust.removed.desc.allow"
        : kind === "block"
          ? "rules.trust.removed.desc.block"
          : "rules.trust.removed.desc.review";

    toast.success(t("rules.trust.removed.title", { merchant }), {
      description: t(descKey),
      action: snapshot
        ? {
            label: t("rules.trust.removed.undo"),
            onClick: () => {
              setTrust((prev) => ({
                allowlist:
                  kind === "allow" ? [snapshot as AllowEntry, ...prev.allowlist] : prev.allowlist,
                blocklist:
                  kind === "block" ? [snapshot as BlockEntry, ...prev.blocklist] : prev.blocklist,
                review:
                  kind === "review"
                    ? [snapshot as { merchant: string; category: string; since: string }, ...prev.review]
                    : prev.review,
              }));
            },
          }
        : undefined,
    });
  };

  const removeLabel = t("rules.trust.remove");
  const categoryOptions = categories.map((c) => ({ id: c.id, label: c.name[locale] }));

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow={t("rules.eyebrow")}
        title={t("rules.title")}
        description={t("rules.desc")}
        actions={
          <NewRuleUnifiedDialog
            categories={categoryOptions}
            onCreateCategory={handleCreateCategory}
            onAddAllow={handleAddAllow}
            onAddBlock={handleAddBlock}
          />
        }
      />

      <section className="mt-8">
        <div className="flex items-center justify-between pb-4">
          <div>
            <div className="text-sm font-semibold">{t("rules.categories.title")}</div>
            <div className="text-[12px] text-muted-foreground">{t("rules.categories.desc")}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((c) => (
            <CategoryRuleCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between pb-4">
          <div>
            <div className="text-sm font-semibold">{t("rules.trust.title")}</div>
            <div className="text-[12px] text-muted-foreground">{t("rules.trust.desc")}</div>
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          <Tabs defaultValue="allow" className="w-full">
            <div className="border-b border-border bg-muted/30 px-4 pt-3">
              <TabsList className="bg-transparent h-auto p-0 gap-1">
                <TabsTrigger value="allow" className="gap-1.5 data-[state=active]:bg-card">
                  {t("rules.trust.tab.allow")}
                  <Badge variant="outline" className="h-4 text-[11px] font-medium tabular-nums">
                    {trust.allowlist.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="block" className="gap-1.5 data-[state=active]:bg-card">
                  {t("rules.trust.tab.block")}
                  <Badge variant="outline" className="h-4 text-[11px] font-medium tabular-nums">
                    {trust.blocklist.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="review" className="gap-1.5 data-[state=active]:bg-card">
                  {t("rules.trust.tab.review")}
                  <Badge variant="outline" className="h-4 text-[11px] font-medium tabular-nums">
                    {trust.review.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="allow" className="m-0">
              <ul>
                {trust.allowlist.map((item) => (
                  <TrustRow
                    key={item.merchant + item.addedAt}
                    name={item.merchant}
                    meta={`${t("rules.trust.category")} · ${item.category}．${t("rules.trust.addedAt")} ${item.addedAt}`}
                    tone="success"
                    onRemove={() => handleRemove("allow", item.merchant)}
                    removeLabel={removeLabel}
                  />
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="block" className="m-0">
              <ul>
                {trust.blocklist.map((item) => (
                  <TrustRow
                    key={item.merchant + item.addedAt}
                    name={item.merchant}
                    meta={`${item.reason[locale]}．${t("rules.trust.addedAt")} ${item.addedAt}`}
                    tone="destructive"
                    onRemove={() => handleRemove("block", item.merchant)}
                    removeLabel={removeLabel}
                  />
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="review" className="m-0">
              <ul>
                {trust.review.map((item) => (
                  <TrustRow
                    key={item.merchant + item.since}
                    name={item.merchant}
                    meta={`${t("rules.trust.category")} · ${item.category}．${t("rules.trust.since")} ${item.since}`}
                    tone="accent"
                    onRemove={() => handleRemove("review", item.merchant)}
                    removeLabel={removeLabel}
                  />
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </Card>
      </section>
    </div>
  );
}
