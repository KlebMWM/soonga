"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  ChevronRight,
  Inbox,
  LayoutDashboard,
  SlidersHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackProductEvent } from "@/lib/analytics";
import { useT } from "@/lib/i18n/LocaleProvider";
import { useDisplayName } from "@/lib/useDisplayName";

const STORAGE_KEY = "soon-welcome-seen-v1";

const ACTIONS = [
  {
    icon: LayoutDashboard,
    href: "/dashboard",
    titleKey: "welcome.action.dashboard.title",
    descKey: "welcome.action.dashboard.desc",
  },
  {
    icon: SlidersHorizontal,
    href: "/rules",
    titleKey: "welcome.action.rules.title",
    descKey: "welcome.action.rules.desc",
  },
  {
    icon: Inbox,
    href: "/approvals",
    titleKey: "welcome.action.approvals.title",
    descKey: "welcome.action.approvals.desc",
  },
];

/**
 * Welcome modal — trimmed to a 3-line summary + 3 quick-action shortcuts.
 *
 * The longer module walkthrough / Phase-2 roadmap / limits copy that this
 * component used to render is now intentionally cut. Phase 2 belongs in
 * README / About; the welcome surface should give a new visitor enough to
 * start clicking in 30 seconds.
 */
export function WelcomeModal() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const { name: storedName, setName: persistName } = useDisplayName();
  // Local draft so typing doesn't write to localStorage on every keystroke;
  // commit happens on close. Re-syncs whenever the modal opens so a re-open
  // shows the most recently saved name (per spec).
  const [nameDraft, setNameDraft] = useState(storedName);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY) === "1";
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!seen) {
      timer = setTimeout(() => {
        trackProductEvent("welcome_modal_opened", { source: "first_visit" });
        setOpen(true);
      }, 400);
    }
    const handler = () => {
      trackProductEvent("welcome_modal_opened", { source: "manual" });
      setOpen(true);
    };
    window.addEventListener("soon-open-welcome", handler);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("soon-open-welcome", handler);
    };
  }, []);

  // Re-sync draft whenever modal opens (user may have typed but not saved
  // last time, or storedName changed via another tab).
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setNameDraft(storedName), 0);
      return () => clearTimeout(timer);
    }
  }, [open, storedName]);

  const handleClose = () => {
    trackProductEvent("welcome_modal_closed", {
      has_custom_name: Boolean(nameDraft.trim()),
    });
    persistName(nameDraft);
    window.localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("welcome.title")}</DialogTitle>
          <DialogDescription className="leading-relaxed">
            {t("welcome.summary.line1")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-[14px] leading-relaxed text-foreground/80">
          <p>{t("welcome.summary.line2")}</p>
          <p>{t("welcome.summary.line3")}</p>
        </div>

        {/* Display-name field — local-only personalization. Empty input
            means "use the default Megan"; the hook handles trim + fallback. */}
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="welcome-display-name" className="text-[13px]">
            {t("welcome.name.label")}
          </Label>
          <Input
            id="welcome-display-name"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder={t("welcome.name.placeholder")}
            maxLength={20}
            className="h-10 text-base md:h-9 md:text-sm"
          />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {t("welcome.name.privacy")}
          </p>
        </div>

        {/* Notification scope note — small Bell + paragraph explaining this
            is a Browser Notification API demo, not production push. */}
        <div
          className="mt-3 rounded-md border p-3 flex items-start gap-2"
          style={{
            background: "var(--bg-soft)",
            borderColor: "var(--border)",
          }}
        >
          <Bell
            className="h-3.5 w-3.5 shrink-0 mt-0.5"
            style={{ color: "var(--text-mid)" }}
          />
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            {t("welcome.scope.notify")}
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <li key={a.href}>
                <Link
                  href={a.href}
                  onClick={() => {
                    trackProductEvent("welcome_quick_action_clicked", {
                      destination: a.href,
                      has_custom_name: Boolean(nameDraft.trim()),
                    });
                    handleClose();
                  }}
                  className="group flex items-start gap-3 rounded-lg border border-border bg-card hover:bg-muted/40 hover:border-foreground/20 p-3 transition-colors"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold">{t(a.titleKey)}</div>
                    <div className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                      {t(a.descKey)}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 mt-1.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-2 flex items-center justify-end pt-3 border-t border-border/60">
          <Button
            onClick={() => {
              trackProductEvent("welcome_primary_cta_clicked", {
                has_custom_name: Boolean(nameDraft.trim()),
              });
              handleClose();
            }}
            className="gap-1.5"
          >
            {t("welcome.cta")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
