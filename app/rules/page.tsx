"use client";

import { use, useEffect, useRef, useState } from "react";
import { CheckCircle2, ShieldOff, AlertCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
  trustList as initialTrustList,
  type Category,
  type TrustList,
} from "@/lib/mockData";
import { categoriesStore, useCategories } from "@/lib/stores";
import { trackProductEvent } from "@/lib/analytics";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { toast } from "sonner";

type ListKind = "allow" | "block" | "review";
type RulesSearchParams = Record<string, string | string[] | undefined>;

const EMPTY_SEARCH_PARAMS = Promise.resolve({} as RulesSearchParams);

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function TrustRow({
  name,
  meta,
  tone,
  onRemove,
  removeLabel,
  highlighted = false,
}: {
  name: string;
  meta: string;
  tone: "success" | "destructive" | "accent";
  onRemove: () => void;
  removeLabel: string;
  highlighted?: boolean;
}) {
  const toneMap = {
    success: "text-success bg-success/10",
    destructive: "text-destructive bg-destructive/10",
    accent: "text-accent bg-accent/10",
  };
  const Icon = tone === "success" ? CheckCircle2 : tone === "destructive" ? ShieldOff : AlertCircle;
  const rowRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (highlighted) {
      rowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlighted]);
  return (
    <li
      ref={rowRef}
      className={cn(
        "group flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-all",
        highlighted &&
          "ring-2 ring-[color-mix(in_oklab,var(--amber)_40%,transparent)] ring-inset bg-[color-mix(in_oklab,var(--amber)_8%,transparent)]",
      )}
    >
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

export default function RulesPage({
  searchParams,
}: {
  searchParams?: Promise<RulesSearchParams>;
}) {
  const t = useT();
  const { locale } = useLocale();
  const query = use(searchParams ?? EMPTY_SEARCH_PARAMS);
  const sourceParam = firstParam(query.source);
  const merchantParam = firstParam(query.merchant)?.trim().slice(0, 80) ?? "";
  const hasApprovalSource = sourceParam === "approvals";
  const fromAudit = sourceParam === "audit";
  const trustTabRaw = fromAudit ? firstParam(query.trustTab) : undefined;
  const auditTrustTab: ListKind | null =
    trustTabRaw === "allow" || trustTabRaw === "block" || trustTabRaw === "review"
      ? trustTabRaw
      : null;
  // categoryId variant only fires when the URL has neither merchant nor
  // trustTab — those branches own the navigation otherwise.
  const auditCategoryId =
    fromAudit && !auditTrustTab && merchantParam.length === 0
      ? firstParam(query.categoryId)?.trim().slice(0, 40) ?? ""
      : "";
  // Dialog opens for source=approvals with merchant, or source=audit
  // with merchant when no trustTab is specified (trustTab branch routes
  // to the trust list, not the dialog).
  const openFromDeepLink =
    (hasApprovalSource && merchantParam.length > 0) ||
    (fromAudit && merchantParam.length > 0 && !auditTrustTab);
  const missingApprovalMerchant = hasApprovalSource && !merchantParam;
  // Categories now live in a module-level store (lib/stores) so edits
  // survive route navigation. The page component subscribes; mutations
  // go through the store API.
  const categories = useCategories();
  const [trust, setTrust] = useState<TrustList>(initialTrustList);
  const [trustTab, setTrustTab] = useState<ListKind>(auditTrustTab ?? "allow");
  // Transient highlights: seed from URL once, clear after 3s. Using
  // useEffect with the URL value as dep means a fresh navigation with
  // the same id re-triggers the highlight (page re-mounts).
  const [highlightId, setHighlightId] = useState("");
  const [highlightedTrustMerchant, setHighlightedTrustMerchant] = useState("");
  useEffect(() => {
    if (auditCategoryId) {
      const startTimer = setTimeout(() => {
        setHighlightId(auditCategoryId);
      }, 0);
      const clearTimer = setTimeout(() => setHighlightId(""), 3000);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [auditCategoryId]);
  useEffect(() => {
    if (auditTrustTab && merchantParam) {
      const startTimer = setTimeout(() => {
        setTrustTab(auditTrustTab);
        setHighlightedTrustMerchant(merchantParam);
      }, 0);
      const clearTimer = setTimeout(() => setHighlightedTrustMerchant(""), 3000);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [auditTrustTab, merchantParam]);

  const handleCreateCategory = (c: Category) => categoriesStore.add(c);
  const handleUpdateCategory = (
    id: string,
    patch: { monthlyLimit: number; singleLimit: number },
  ) => categoriesStore.update(id, patch);
  const handleDeleteCategory = (id: string) => {
    // Snapshot before remove so the undo action restores the exact same
    // shape (limits, spent, isSystem, …). The store mutates in place; if
    // the snapshot ever diverges from the post-remove state it's because
    // the user mutated something between delete and undo, which is fine —
    // undo just re-adds whatever was visible at delete time.
    const snapshot = categoriesStore.getAll().find((c) => c.id === id);
    if (!snapshot) return;
    categoriesStore.remove(id);
    trackProductEvent("rule_deleted", {
      rule_type: "category",
      is_system: snapshot.isSystem,
    });
    toast.success(
      t("rules.card.deleted.title", { name: snapshot.name[locale] }),
      {
        description: t("rules.card.deleted.desc"),
        action: {
          label: t("rules.card.deleted.undo"),
          onClick: () => categoriesStore.add(snapshot),
        },
      },
    );
  };
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
    trackProductEvent("rule_deleted", {
      rule_type: kind,
      merchant_present: true,
    });

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
            initialOpen={openFromDeepLink}
            initialMerchant={merchantParam}
            initialMode="allow"
          />
        }
      />

      {missingApprovalMerchant && (
        <div className="mt-6 rounded-lg border border-accent/25 bg-accent/5 p-4">
          <div className="text-sm font-semibold text-foreground">
            {t("rules.deeplink.missing.title")}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            {t("rules.deeplink.missing.desc")}
          </p>
        </div>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between pb-4">
          <div>
            <div className="text-sm font-semibold">{t("rules.categories.title")}</div>
            <div className="text-[12px] text-muted-foreground">{t("rules.categories.desc")}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((c) => (
            <CategoryRuleCard
              key={c.id}
              category={c}
              onUpdate={handleUpdateCategory}
              onDelete={handleDeleteCategory}
              highlighted={c.id === highlightId}
            />
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
          <Tabs
            value={trustTab}
            onValueChange={(v) => {
              trackProductEvent("trust_tab_changed", { tab: v });
              setTrustTab(v as ListKind);
            }}
            className="w-full"
          >
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
                    highlighted={
                      trustTab === "allow" && item.merchant === highlightedTrustMerchant
                    }
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
                    highlighted={
                      trustTab === "block" && item.merchant === highlightedTrustMerchant
                    }
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
                    highlighted={
                      trustTab === "review" && item.merchant === highlightedTrustMerchant
                    }
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
