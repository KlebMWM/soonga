"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Inbox,
  Info,
  LayoutDashboard,
  Plus,
  Rocket,
  ScrollText,
  ShieldAlert,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/LocaleProvider";

const STORAGE_KEY = "soon-welcome-seen-v1";

const MODULES = [
  { icon: LayoutDashboard, titleKey: "welcome.module.dashboard.title", descKey: "welcome.module.dashboard.desc" },
  { icon: SlidersHorizontal, titleKey: "welcome.module.rules.title", descKey: "welcome.module.rules.desc" },
  { icon: Inbox, titleKey: "welcome.module.approvals.title", descKey: "welcome.module.approvals.desc" },
  { icon: ScrollText, titleKey: "welcome.module.audit.title", descKey: "welcome.module.audit.desc" },
];

const SUGGESTIONS = [
  { icon: Inbox, titleKey: "welcome.s2.title", descKey: "welcome.s2.desc" },
  { icon: Plus, titleKey: "welcome.s3.title", descKey: "welcome.s3.desc" },
  { icon: ScrollText, titleKey: "welcome.s4.title", descKey: "welcome.s4.desc" },
  { icon: Wallet, titleKey: "welcome.s5.title", descKey: "welcome.s5.desc" },
];

const PHASE2_ITEMS = [
  "welcome.phase2.item1",
  "welcome.phase2.item2",
  "welcome.phase2.item3",
  "welcome.phase2.item4",
];

const LIMITS_ITEMS = ["welcome.limits.item1", "welcome.limits.item2", "welcome.limits.item3"];

export function WelcomeModal() {
  const t = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) === "1";
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!seen) {
      timer = setTimeout(() => setOpen(true), 400);
    }
    const handler = () => setOpen(true);
    window.addEventListener("soon-open-welcome", handler);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("soon-open-welcome", handler);
    };
  }, []);

  const handleClose = () => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("welcome.badge")}
            </span>
            <span className="text-[12px] text-muted-foreground">{t("welcome.timeHint")}</span>
          </div>
          <DialogTitle className="text-xl">{t("welcome.title")}</DialogTitle>
          <DialogDescription className="leading-relaxed">{t("welcome.desc")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Section 1: What is it */}
          <section>
            <SectionHeader icon={Info} title={t("welcome.what.title")} />
            <p className="text-[14px] leading-relaxed text-foreground/80">{t("welcome.what.body")}</p>
          </section>

          {/* Section 2: Four modules */}
          <section>
            <SectionHeader icon={LayoutDashboard} title={t("welcome.modules.title")} />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MODULES.map((m) => {
                const Icon = m.icon;
                return (
                  <li
                    key={m.titleKey}
                    className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/20 p-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold">{t(m.titleKey)}</div>
                      <div className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                        {t(m.descKey)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Section 3: Try these */}
          <section>
            <SectionHeader icon={CheckCircle2} title={t("welcome.tryTitle")} />
            <ul className="space-y-2">
              {SUGGESTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <li
                    key={s.titleKey}
                    className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/20 p-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium">{t(s.titleKey)}</div>
                      <div className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                        {t(s.descKey)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Section 4: Phase 2 roadmap */}
          <section>
            <SectionHeader icon={Rocket} title={t("welcome.phase2.title")} />
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-2">
              {t("welcome.phase2.desc")}
            </p>
            <ul className="space-y-1.5 rounded-lg border border-border/70 bg-muted/20 p-3">
              {PHASE2_ITEMS.map((k) => (
                <li key={k} className="flex items-start gap-2 text-[13px] leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5: Limits / about */}
          <section>
            <SectionHeader icon={ShieldAlert} title={t("welcome.limits.title")} />
            <ul className="space-y-1.5">
              {LIMITS_ITEMS.map((k) => (
                <li key={k} className="flex items-start gap-2 text-[12px] text-muted-foreground leading-relaxed">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/60 shrink-0" />
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-2 flex items-center justify-end pt-3 border-t border-border/60">
          <Button onClick={handleClose} className="gap-1.5">
            {t("welcome.cta")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: typeof Info; title: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
      <Icon className="h-3 w-3" />
      {title}
    </div>
  );
}
