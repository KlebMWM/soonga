"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Plus,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { parseRuleRequest } from "@/lib/parseRule";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Category } from "@/lib/mockData";
import { b } from "@/lib/i18n/config";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { checkMerchantSafety, type SafetyResult } from "@/lib/safetyCheck";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type AllowEntry = { merchant: string; category: string; addedAt: string };
export type BlockEntry = { merchant: string; reason: { zh: string; en: string }; addedAt: string };

// "first" is the combined entry screen — AI quick input on top, 3 chooser
// cards below, both always visible. Sub-modes are reached either by clicking
// a chooser card or by 手動調整 from the parsed preview.
type Mode = "first" | "category" | "allow" | "block";

type Props = {
  categories: { id: string; label: string }[];
  onCreateCategory: (c: Category) => void;
  onAddAllow: (entry: AllowEntry) => void;
  onAddBlock: (entry: BlockEntry) => void;
};

const LEVEL_META = {
  safe: {
    icon: ShieldCheck,
    tone: "text-success bg-success/10 border-success/25",
    labelKey: "safety.level.safe",
  },
  caution: {
    icon: AlertTriangle,
    tone: "text-accent bg-accent/10 border-accent/25",
    labelKey: "safety.level.caution",
  },
  risky: {
    icon: ShieldAlert,
    tone: "text-destructive bg-destructive/10 border-destructive/25",
    labelKey: "safety.level.risky",
  },
} as const;

export function NewRuleUnifiedDialog({ categories, onCreateCategory, onAddAllow, onAddBlock }: Props) {
  const t = useT();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("first");

  // Category form state
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catMonthly, setCatMonthly] = useState(100);
  const [catSingle, setCatSingle] = useState(20);

  // Allow / Block form shared state
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState(categories[0]?.id ?? "api");
  const [reason, setReason] = useState("");
  const [checking, setChecking] = useState(false);
  const [safety, setSafety] = useState<SafetyResult | null>(null);

  const reset = () => {
    setMode("first");
    setCatName("");
    setCatDesc("");
    setCatMonthly(100);
    setCatSingle(20);
    setMerchant("");
    setCategory(categories[0]?.id ?? "api");
    setReason("");
    setChecking(false);
    setSafety(null);
  };

  // Debounced safety check for allow/block forms
  useEffect(() => {
    if (mode !== "allow" && mode !== "block") return;
    const input = merchant.trim();
    if (!input) {
      setSafety(null);
      setChecking(false);
      return;
    }
    setChecking(true);
    const timer = setTimeout(() => {
      setSafety(checkMerchantSafety(input));
      setChecking(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [merchant, mode]);

  const warningKey = useMemo(() => {
    if (!safety) return null;
    if (mode === "allow" && safety.level === "risky") return "trust.add.confirm.risky";
    if (mode === "block" && safety.level === "safe") return "trust.add.confirm.safe";
    return null;
  }, [safety, mode]);

  const closeAndReset = () => {
    setOpen(false);
    // Delay reset so the dialog fade-out doesn't flash the first screen
    setTimeout(reset, 200);
  };

  const handleCreateCategory = () => {
    const trimmed = catName.trim();
    if (!trimmed) {
      toast.error(t("rules.new.missingName"));
      return;
    }
    const id = `custom_${Date.now()}`;
    const defaultDesc = t("rules.new.defaultDesc");
    onCreateCategory({
      id,
      name: b(trimmed, trimmed),
      description: b(catDesc.trim() || defaultDesc, catDesc.trim() || defaultDesc),
      monthlyLimit: catMonthly,
      singleLimit: catSingle,
      spent: 0,
      isSystem: false,
    });
    toast.success(t("rules.new.createdTitle", { name: trimmed }), {
      description: t("rules.new.createdDesc", { monthly: catMonthly, single: catSingle }),
    });
    closeAndReset();
  };

  const handleAddAllow = () => {
    const trimmed = merchant.trim();
    if (!trimmed) {
      toast.error(t("trust.add.missing"));
      return;
    }
    onAddAllow({
      merchant: trimmed,
      category,
      addedAt: new Date().toISOString().slice(0, 10),
    });
    toast.success(t("trust.add.toast.allow.title", { merchant: trimmed }), {
      description: t("trust.add.toast.allow.desc"),
    });
    closeAndReset();
  };

  const handleAddBlock = () => {
    const trimmed = merchant.trim();
    if (!trimmed) {
      toast.error(t("trust.add.missing"));
      return;
    }
    const r = reason.trim();
    const reasonObj = r
      ? { zh: r, en: r }
      : safety?.signals.find((s) => s.severity === "negative")?.detail ?? { zh: "", en: "" };
    onAddBlock({
      merchant: trimmed,
      reason: reasonObj,
      addedAt: new Date().toISOString().slice(0, 10),
    });
    toast.error(t("trust.add.toast.block.title", { merchant: trimmed }), {
      description: t("trust.add.toast.block.desc"),
    });
    closeAndReset();
  };

  const title = {
    first: t("rules.unified.first.title"),
    category: t("rules.new.title"),
    allow: t("trust.add.title.allow"),
    block: t("trust.add.title.block"),
  }[mode];

  const description = {
    first: t("rules.unified.first.desc"),
    category: t("rules.new.desc"),
    allow: t("trust.add.desc.allow"),
    block: t("trust.add.desc.block"),
  }[mode];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setTimeout(reset, 200);
      }}
    >
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
        <Plus className="h-4 w-4" />
        {t("rules.unified.entryLabel")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {mode !== "first" && (
              <button
                onClick={() => setMode("first")}
                className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                {t("rules.unified.back")}
              </button>
            )}
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {mode === "first" && (
          <FirstScreen
            categoryIds={categories.map((c) => c.id)}
            onPick={setMode}
            onApplyCategory={(c) => {
              onCreateCategory(c);
              toast.success(
                t("rules.new.createdTitle", { name: c.name[locale] }),
                {
                  description: t("rules.new.createdDesc", {
                    monthly: c.monthlyLimit,
                    single: c.singleLimit,
                  }),
                },
              );
              closeAndReset();
            }}
            onApplyAllow={(a) => {
              onAddAllow(a);
              toast.success(
                t("trust.add.toast.allow.title", { merchant: a.merchant }),
                { description: t("trust.add.toast.allow.desc") },
              );
              closeAndReset();
            }}
            onApplyBlock={(blk) => {
              onAddBlock(blk);
              toast.error(
                t("trust.add.toast.block.title", { merchant: blk.merchant }),
                { description: t("trust.add.toast.block.desc") },
              );
              closeAndReset();
            }}
            onAdjustCategory={(c) => {
              setCatName(c.name[locale]);
              setCatDesc(c.description[locale]);
              setCatMonthly(c.monthlyLimit);
              setCatSingle(c.singleLimit);
              setMode("category");
            }}
            onAdjustAllow={(m) => {
              setMerchant(m);
              setMode("allow");
            }}
            onAdjustBlock={(m, parsedReason) => {
              setMerchant(m);
              setReason(parsedReason);
              setMode("block");
            }}
          />
        )}

        {mode === "category" && (
          <CategoryForm
            name={catName}
            setName={setCatName}
            desc={catDesc}
            setDesc={setCatDesc}
            monthly={catMonthly}
            setMonthly={setCatMonthly}
            single={catSingle}
            setSingle={setCatSingle}
            onSubmit={handleCreateCategory}
            onCancel={() => setMode("first")}
          />
        )}

        {(mode === "allow" || mode === "block") && (
          <TrustForm
            mode={mode}
            merchant={merchant}
            setMerchant={setMerchant}
            category={category}
            setCategory={setCategory}
            categoryOptions={categories}
            reason={reason}
            setReason={setReason}
            checking={checking}
            safety={safety}
            warningKey={warningKey}
            onSubmit={mode === "allow" ? handleAddAllow : handleAddBlock}
            onCancel={() => setMode("first")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ==================== First screen — combined AI input + chooser cards ====================

function FirstScreen({
  categoryIds,
  onPick,
  onApplyCategory,
  onApplyAllow,
  onApplyBlock,
  onAdjustCategory,
  onAdjustAllow,
  onAdjustBlock,
}: {
  categoryIds: string[];
  onPick: (m: Exclude<Mode, "first">) => void;
  onApplyCategory: (c: Category) => void;
  onApplyAllow: (a: AllowEntry) => void;
  onApplyBlock: (b: BlockEntry) => void;
  /** "Manual adjust" handlers — pre-fill the corresponding manual form
   *  with the parsed values, then jump to that mode. */
  onAdjustCategory: (c: Category) => void;
  onAdjustAllow: (merchant: string) => void;
  onAdjustBlock: (merchant: string, reason: string) => void;
}) {
  const t = useT();
  const { locale } = useLocale();
  const [input, setInput] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<ReturnType<typeof parseRuleRequest> | null>(
    null,
  );

  const handleParse = () => {
    if (!input.trim() || parsing) return;
    setParsing(true);
    setParsed(null);
    // Simulate model latency. Swap the timeout body for a real Claude call
    // when the API is wired up — the ParsedRule shape stays the same.
    setTimeout(() => {
      setParsed(parseRuleRequest(input, categoryIds));
      setParsing(false);
    }, 900);
  };

  const handleReset = () => {
    setInput("");
    setParsed(null);
  };

  const handleCreate = () => {
    if (!parsed) return;
    if (parsed.kind === "category") onApplyCategory(parsed.category);
    else if (parsed.kind === "allow")
      onApplyAllow({
        merchant: parsed.allow.merchant,
        category: parsed.allow.category,
        addedAt: parsed.allow.addedAt,
      });
    else if (parsed.kind === "block")
      onApplyBlock({
        merchant: parsed.block.merchant,
        reason: parsed.block.reason,
        addedAt: parsed.block.addedAt,
      });
  };

  const handleManualAdjust = () => {
    if (!parsed) return;
    if (parsed.kind === "category") onAdjustCategory(parsed.category);
    else if (parsed.kind === "allow") onAdjustAllow(parsed.allow.merchant);
    else if (parsed.kind === "block")
      onAdjustBlock(parsed.block.merchant, parsed.block.reason[locale]);
  };

  return (
    <div className="space-y-4 py-2">
      {/* AI quick input — top section, tinted block to read as an AI capability
          rather than a regular form field. After parse, the editable textarea
          collapses into a one-line read-only summary so the chooser cards stay
          visible without scrolling. */}
      <section
        className="rounded-md border p-3 space-y-2"
        style={{
          borderColor: "var(--border-blue)",
          background: "var(--bg-soft)",
        }}
      >
        <Label className="text-[13px] flex items-center gap-1.5">
          <Sparkles
            className="h-3.5 w-3.5"
            style={{ color: "var(--ikea-blue-darker)" }}
          />
          {t("rules.ai.inputLabel")}
          <span className="text-muted-foreground text-[12px] font-normal">
            ({t("rules.new.descOptional")})
          </span>
        </Label>

        {!parsed ? (
          <>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("rules.ai.placeholder")}
              rows={2}
              maxLength={200}
              disabled={parsing}
              className="w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              onClick={handleParse}
              disabled={!input.trim() || parsing}
              variant="raised"
              size="sm"
              className="gap-1.5"
            >
              {parsing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t("rules.ai.parsing")}
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("rules.ai.parseButton")}
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div
              className="rounded-md border border-border bg-card px-3 py-1.5 text-[12px] leading-relaxed truncate"
              style={{ color: "var(--text-mid)" }}
              title={input}
            >
              <span className="opacity-70 mr-1">「</span>
              {input}
              <span className="opacity-70 ml-1">」</span>
            </div>
            <AiDraftPreview parsed={parsed} locale={locale} />
            {parsed.kind === "unknown" ? (
              <Button variant="outline" size="sm" onClick={handleReset}>
                {t("rules.ai.tryAgain")}
              </Button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleCreate} size="sm" className="gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  {t("rules.ai.apply")}
                </Button>
                <Button variant="outline" size="sm" onClick={handleManualAdjust}>
                  {t("rules.ai.manualAdjust")}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  {t("rules.ai.tryAgain")}
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Divider with eyebrow — the chooser remains visible alongside the AI
          input so users always see the manual paths. */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span
          className="text-[11px] uppercase tracking-[0.18em] font-mono"
          style={{ color: "var(--text-mid)" }}
        >
          {t("rules.unified.first.or")}
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <Chooser onPick={onPick} />
    </div>
  );
}

function AiDraftPreview({
  parsed,
  locale,
}: {
  parsed: ReturnType<typeof parseRuleRequest>;
  locale: "zh" | "en";
}) {
  const t = useT();

  if (parsed.kind === "unknown") {
    return (
      <div
        className="rounded-md border p-3 text-[13px] leading-relaxed flex items-start gap-2"
        style={{
          color: "var(--amber-deep)",
          background: "var(--amber-wash)",
          borderColor: "var(--amber)",
        }}
      >
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>{parsed.rationale[locale]}</span>
      </div>
    );
  }

  const confidenceTone =
    parsed.confidence === "high"
      ? { color: "var(--sage)", bg: "var(--sage-bg)", border: "rgba(139, 164, 114, 0.4)" }
      : parsed.confidence === "medium"
        ? { color: "var(--ikea-blue-darker)", bg: "var(--bg-accent)", border: "var(--border-blue)" }
        : { color: "var(--text-mid)", bg: "var(--bg-soft)", border: "var(--border)" };

  return (
    <div
      className="rounded-md border overflow-hidden"
      style={{ borderColor: "var(--border-blue)", background: "var(--card)" }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
      >
        <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--ikea-blue-darker)" }} />
        <span className="text-[13px] font-semibold" style={{ color: "var(--headline)" }}>
          {parsed.kind === "category"
            ? t("rules.ai.result.draftCategory")
            : parsed.kind === "allow"
              ? t("rules.ai.result.draftAllow")
              : t("rules.ai.switchToBlock")}
        </span>
        <span
          className="ml-auto text-[10px] font-bold uppercase px-1.5 py-0.5 font-mono border"
          style={{
            color: confidenceTone.color,
            background: confidenceTone.bg,
            borderColor: confidenceTone.border,
            letterSpacing: "0.08em",
          }}
        >
          {t(`rules.ai.result.confidence.${parsed.confidence}`)}
        </span>
      </div>

      <div className="px-3 py-2.5 space-y-1.5">
        {parsed.kind === "category" ? (
          <>
            <DraftRow label={t("rules.ai.result.categoryName")} value={parsed.category.name[locale]} />
            <DraftRow
              label={t("rules.ai.result.description")}
              value={parsed.category.description[locale]}
              subdued
            />
            <DraftRow label={t("rules.ai.result.monthly")} value={`$${parsed.category.monthlyLimit} USDC`} mono />
            <DraftRow label={t("rules.ai.result.single")} value={`$${parsed.category.singleLimit} USDC`} mono />
          </>
        ) : parsed.kind === "allow" ? (
          <>
            <DraftRow label={t("rules.ai.result.merchant")} value={parsed.allow.merchant} mono />
            <DraftRow label={t("rules.ai.result.category")} value={parsed.allow.category} subdued />
          </>
        ) : (
          <>
            <DraftRow label={t("rules.ai.result.merchant")} value={parsed.block.merchant} mono />
            <DraftRow
              label={t("approval.suggestion.label")}
              value={parsed.block.reason[locale]}
              subdued
            />
          </>
        )}
      </div>

      <div
        className="px-3 py-2 text-[12px] leading-relaxed border-t"
        style={{
          color: "var(--paragraph)",
          borderColor: "var(--border)",
          fontStyle: "italic",
        }}
      >
        {parsed.rationale[locale]}
      </div>
    </div>
  );
}

function DraftRow({
  label,
  value,
  mono,
  subdued,
}: {
  label: string;
  value: string;
  mono?: boolean;
  subdued?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3 text-[13px]">
      <span
        className="shrink-0 w-20 text-[11px] uppercase"
        style={{ color: "var(--text-mid)", letterSpacing: "0.05em" }}
      >
        {label}
      </span>
      <span
        className={cn("min-w-0 flex-1 truncate", mono && "font-mono tabular-nums")}
        style={{
          color: subdued ? "var(--paragraph)" : "var(--headline)",
          fontWeight: subdued ? 400 : 600,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ==================== Chooser ====================

function Chooser({ onPick }: { onPick: (m: Exclude<Mode, "first">) => void }) {
  const t = useT();

  type ChooserOption = {
    mode: Exclude<Mode, "first">;
    icon: typeof SlidersHorizontal;
    titleKey: string;
    descKey: string;
    exampleKey: string;
    toneClass: string;
  };

  const options: ChooserOption[] = [
    {
      mode: "category",
      icon: SlidersHorizontal,
      titleKey: "rules.unified.chooser.category.title",
      descKey: "rules.unified.chooser.category.desc",
      exampleKey: "rules.unified.chooser.category.example",
      toneClass: "bg-primary/10 text-primary",
    },
    {
      mode: "allow",
      icon: ShieldCheck,
      titleKey: "rules.unified.chooser.allow.title",
      descKey: "rules.unified.chooser.allow.desc",
      exampleKey: "rules.unified.chooser.allow.example",
      toneClass: "bg-success/10 text-success",
    },
    {
      mode: "block",
      icon: ShieldOff,
      titleKey: "rules.unified.chooser.block.title",
      descKey: "rules.unified.chooser.block.desc",
      exampleKey: "rules.unified.chooser.block.example",
      toneClass: "bg-destructive/10 text-destructive",
    },
  ];

  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const Icon = opt.icon;
        return (
          <button
            key={opt.mode}
            onClick={() => onPick(opt.mode)}
            className="group w-full text-left rounded-md border border-border bg-card hover:bg-muted/40 hover:border-foreground/20 p-4 flex items-start gap-3 transition-colors"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
                opt.toneClass,
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{t(opt.titleKey)}</div>
              <div className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">
                {t(opt.descKey)}
              </div>
              <div className="text-[12px] text-muted-foreground/70 mt-1.5 italic">
                {t(opt.exampleKey)}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 mt-3 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        );
      })}
    </div>
  );
}

// ==================== Category form ====================

function CategoryForm({
  name,
  setName,
  desc,
  setDesc,
  monthly,
  setMonthly,
  single,
  setSingle,
  onSubmit,
  onCancel,
}: {
  name: string;
  setName: (v: string) => void;
  desc: string;
  setDesc: (v: string) => void;
  monthly: number;
  setMonthly: (v: number) => void;
  single: number;
  setSingle: (v: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const t = useT();

  return (
    <>
      <div className="space-y-5 py-2">
        <div className="space-y-2">
          <Label className="text-sm">{t("rules.new.nameLabel")}</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("rules.new.namePlaceholder")}
            maxLength={20}
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">
            {t("rules.new.descLabel")}{" "}
            <span className="text-muted-foreground text-[12px]">{t("rules.new.descOptional")}</span>
          </Label>
          <Input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={t("rules.new.descPlaceholder")}
            maxLength={40}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">{t("rules.dialog.monthly")}</Label>
            <span className="text-sm font-semibold tabular-nums">${monthly}</span>
          </div>
          <Slider
            value={[monthly]}
            max={500}
            step={10}
            onValueChange={(v) => setMonthly(Array.isArray(v) ? v[0] : v)}
          />
          <div className="flex justify-between text-[12px] text-muted-foreground tabular-nums">
            <span>$0</span>
            <span>$500</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">{t("rules.dialog.single")}</Label>
            <span className="text-sm font-semibold tabular-nums">${single}</span>
          </div>
          <Slider
            value={[single]}
            max={150}
            step={5}
            onValueChange={(v) => setSingle(Array.isArray(v) ? v[0] : v)}
          />
          <div className="flex justify-between text-[12px] text-muted-foreground tabular-nums">
            <span>$0</span>
            <span>$150</span>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {t("rules.dialog.cancel")}
        </Button>
        <Button onClick={onSubmit} className="gap-1.5">
          <Check className="h-4 w-4" />
          {t("rules.new.create")}
        </Button>
      </DialogFooter>
    </>
  );
}

// ==================== Trust form (allow or block) ====================

function TrustForm({
  mode,
  merchant,
  setMerchant,
  category,
  setCategory,
  categoryOptions,
  reason,
  setReason,
  checking,
  safety,
  warningKey,
  onSubmit,
  onCancel,
}: {
  mode: "allow" | "block";
  merchant: string;
  setMerchant: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categoryOptions: { id: string; label: string }[];
  reason: string;
  setReason: (v: string) => void;
  checking: boolean;
  safety: SafetyResult | null;
  warningKey: string | null;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const t = useT();
  const { locale } = useLocale();
  const submitKey = mode === "allow" ? "trust.add.submit.allow" : "trust.add.submit.block";

  return (
    <>
      <div className="space-y-5 py-2">
        <div className="space-y-2">
          <Label className="text-sm">{t("trust.add.merchantLabel")}</Label>
          <Input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder={t("trust.add.merchantPlaceholder")}
            maxLength={60}
            autoFocus
          />
        </div>

        <div>
          <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {t("safety.title")}
          </div>
          {!merchant.trim() ? (
            <div className="rounded-md border border-dashed border-border bg-muted/30 p-3 text-[12px] text-muted-foreground">
              {t("safety.emptyInput")}
            </div>
          ) : checking ? (
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-3 text-[12px] text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t("safety.checking")}
            </div>
          ) : safety ? (
            <SafetyCard result={safety} locale={locale} t={t} />
          ) : null}
        </div>

        {mode === "allow" ? (
          <div className="space-y-2">
            <Label className="text-sm">{t("trust.add.categoryLabel")}</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
            >
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-sm">{t("trust.add.reasonLabel")}</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("trust.add.reasonPlaceholder")}
              maxLength={80}
            />
          </div>
        )}

        {warningKey && (
          <div className="rounded-md border border-accent/30 bg-accent/5 p-3 text-[13px] text-accent leading-relaxed flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{t(warningKey)}</span>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {t("rules.dialog.cancel")}
        </Button>
        <Button onClick={onSubmit} className="gap-1.5" disabled={!merchant.trim() || checking}>
          <Check className="h-4 w-4" />
          {t(submitKey)}
        </Button>
      </DialogFooter>
    </>
  );
}

function SafetyCard({
  result,
  locale,
  t,
}: {
  result: SafetyResult;
  locale: "zh" | "en";
  t: (key: string) => string;
}) {
  const meta = LEVEL_META[result.level];
  const Icon = meta.icon;
  return (
    <div className={cn("rounded-md border p-3", meta.tone)}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="text-[13px] font-semibold">{t(meta.labelKey)}</span>
        <span className="ml-auto text-[12px] opacity-70 tabular-nums">
          {t("safety.score")} {result.score}/100
        </span>
      </div>
      {result.signals.length > 0 && (
        <ul className="mt-2 space-y-1 text-[12px]">
          {result.signals.map((s, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span
                className={cn(
                  "mt-[5px] h-1.5 w-1.5 rounded-full shrink-0",
                  s.severity === "positive" && "bg-success",
                  s.severity === "negative" && "bg-destructive",
                  s.severity === "neutral" && "bg-muted-foreground/50",
                )}
              />
              <span className="leading-relaxed text-foreground/80">{s.detail[locale]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
