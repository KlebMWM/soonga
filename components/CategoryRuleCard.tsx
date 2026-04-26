"use client";

import { useState } from "react";
import { Pencil, Check, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { Category } from "@/lib/mockData";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";
import { toast } from "sonner";

type CategoryRuleCardProps = {
  category: Category;
  /** Persist the slider edits back to the parent's categories array.
   *  Card display always reads from prop; internal state is only the
   *  dialog's slider staging. */
  onUpdate: (
    id: string,
    patch: { monthlyLimit: number; singleLimit: number },
  ) => void;
  /** Remove a custom (non-system) category. Trash button is hidden when
   *  category.isSystem is true, so this is only invoked for user-created
   *  categories. Toast undo lives in the parent. */
  onDelete: (id: string) => void;
};

export function CategoryRuleCard({
  category,
  onUpdate,
  onDelete,
}: CategoryRuleCardProps) {
  const t = useT();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  // Internal state is dialog-only staging — initial values are arbitrary
  // because we re-sync from prop every time the dialog opens.
  const [monthly, setMonthly] = useState(category.monthlyLimit);
  const [single, setSingle] = useState(category.singleLimit);

  const name = category.name[locale];
  const desc = category.description[locale];
  // Display always reads from prop (source of truth). Internal state only
  // exists to drive the slider while the dialog is open.
  const displayMonthly = category.monthlyLimit;
  const displaySingle = category.singleLimit;
  const pct = Math.min(100, Math.round((category.spent / displayMonthly) * 100));
  const remaining = Math.max(0, displayMonthly - category.spent);

  const handleOpenChange = (next: boolean) => {
    // Re-sync staging from prop on each open so the user always sees the
    // current persisted values, never stale state from a previous edit.
    if (next) {
      setMonthly(category.monthlyLimit);
      setSingle(category.singleLimit);
    }
    setOpen(next);
  };

  const handleSave = () => {
    onUpdate(category.id, { monthlyLimit: monthly, singleLimit: single });
    toast.success(t("rules.dialog.savedTitle", { name }), {
      description: t("rules.dialog.savedDesc", { monthly, single }),
    });
    setOpen(false);
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">{desc}</div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger
            render={
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-1 text-muted-foreground hover:text-foreground"
              />
            }
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("rules.card.adjust")}
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("rules.dialog.edit.title", { name })}</DialogTitle>
              <DialogDescription>{t("rules.dialog.edit.desc")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-2">
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
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t("rules.dialog.cancel")}
              </Button>
              <Button onClick={handleSave} className="gap-1.5">
                <Check className="h-4 w-4" />
                {t("rules.dialog.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {!category.isSystem && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(category.id)}
            className="h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
            title={t("rules.card.delete")}
            aria-label={t("rules.card.delete")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        </div>
      </div>

      <div className="mt-5 space-y-1.5">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-semibold tabular-nums">${category.spent.toFixed(2)}</span>
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {t("rules.card.monthTotal")} ${displayMonthly}
          </span>
        </div>
        <Progress value={pct} className="h-1.5" />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-border/70">
        <div>
          <dt className="text-[12px] text-muted-foreground">{t("rules.card.singleLimit")}</dt>
          <dd className="text-sm font-medium tabular-nums mt-0.5">${displaySingle}</dd>
        </div>
        <div>
          <dt className="text-[12px] text-muted-foreground">{t("rules.card.remaining")}</dt>
          <dd className="text-sm font-medium tabular-nums mt-0.5">${remaining.toFixed(2)}</dd>
        </div>
      </dl>
    </Card>
  );
}
