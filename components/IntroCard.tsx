"use client";

import { useEffect, useState } from "react";
import { ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useT } from "@/lib/i18n/LocaleProvider";

const STORAGE_KEY = "intro_card_dismissed_v1";

export function IntroCard() {
  const t = useT();
  const { locale } = useLocale();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        setDismissed(window.localStorage.getItem(STORAGE_KEY) === "true");
      } catch {
        setDismissed(false);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
  };

  const handleScroll = () => {
    document
      .getElementById("pending-hero")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative rounded-lg border px-5 py-4 md:px-6 md:py-5"
      style={{
        background:
          "linear-gradient(135deg, var(--bg) 0%, rgba(80, 132, 208, 0.08) 100%)",
        borderColor: "var(--border)",
      }}
      aria-label={t("intro.headline")}
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={t("intro.dismiss")}
      >
        <X className="h-3 w-3" />
      </button>

      <div className="max-w-3xl pr-8">
        <h2
          className="text-[18px] leading-snug"
          style={{
            color: "var(--headline)",
            fontFamily:
              locale === "zh"
                ? "var(--font-noto-serif-tc), serif"
                : "var(--font-sans)",
            fontWeight: locale === "zh" ? 500 : 600,
          }}
        >
          {t("intro.headline")}
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
          {t("intro.body")}
        </p>
        <Button
          type="button"
          variant="hud"
          size="sm"
          className="mt-3 h-8 gap-1.5 px-3 text-[12px]"
          onClick={handleScroll}
        >
          {t("intro.cta")}
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    </section>
  );
}
