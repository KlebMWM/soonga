"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
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

export function CategoryRuleCard({ category }: { category: Category }) {
  const t = useT();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [monthly, setMonthly] = useState(category.monthlyLimit);
  const [single, setSingle] = useState(category.singleLimit);

  const name = category.name[locale];
  const desc = category.description[locale];
  const pct = Math.min(100, Math.round((category.spent / monthly) * 100));
  const remaining = Math.max(0, monthly - category.spent);

  const handleSave = () => {
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
        <Dialog open={open} onOpenChange={setOpen}>
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
      </div>

      <div className="mt-5 space-y-1.5">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-semibold tabular-nums">${category.spent.toFixed(2)}</span>
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {t("rules.card.monthTotal")} ${monthly}
          </span>
        </div>
        <Progress value={pct} className="h-1.5" />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-border/70">
        <div>
          <dt className="text-[12px] text-muted-foreground">{t("rules.card.singleLimit")}</dt>
          <dd className="text-sm font-medium tabular-nums mt-0.5">${single}</dd>
        </div>
        <div>
          <dt className="text-[12px] text-muted-foreground">{t("rules.card.remaining")}</dt>
          <dd className="text-sm font-medium tabular-nums mt-0.5">${remaining.toFixed(2)}</dd>
        </div>
      </dl>
    </Card>
  );
}
