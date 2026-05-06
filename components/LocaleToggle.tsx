"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { trackProductEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function LocaleToggle({ variant = "sidebar" }: { variant?: "sidebar" | "mobile" }) {
  const { locale, setLocale } = useLocale();

  const base =
    variant === "mobile"
      ? "flex items-center rounded-full border border-sidebar-border/60 bg-sidebar-accent/30 overflow-hidden"
      : "flex items-center rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 overflow-hidden";

  const btn = (active: boolean) =>
    cn(
      "min-h-8 px-2 text-[11px] font-semibold tracking-wide transition-colors",
      active
        ? "bg-sidebar-primary text-sidebar-primary-foreground"
        : "text-sidebar-foreground/60 hover:text-sidebar-foreground",
    );

  return (
    <div className={base} role="group" aria-label="Language switcher">
      {variant === "sidebar" && (
        <div className="pl-2 pr-1 text-sidebar-foreground/40">
          <Languages className="h-3 w-3" />
        </div>
      )}
      <button
        onClick={() => {
          trackProductEvent("locale_changed", { locale: "zh" });
          setLocale("zh");
        }}
        className={btn(locale === "zh")}
        aria-pressed={locale === "zh"}
      >
        中
      </button>
      <button
        onClick={() => {
          trackProductEvent("locale_changed", { locale: "en" });
          setLocale("en");
        }}
        className={btn(locale === "en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
