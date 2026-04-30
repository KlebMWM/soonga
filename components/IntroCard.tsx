"use client";

import { useEffect, useState } from "react";
import { ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const useCases = [
    {
      title: t("web3.wallet.title"),
      badge: t("web3.wallet.badge"),
      body: t("web3.wallet.body"),
    },
    {
      title: t("web3.exchange.title"),
      badge: t("web3.exchange.badge"),
      body: t("web3.exchange.body"),
    },
  ];

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

      <div className="pr-8">
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
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {useCases.map((useCase) => (
            <article
              key={useCase.title}
              className="rounded-md border border-border/80 bg-card/65 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[13px] font-semibold text-foreground">
                  {useCase.title}
                </h3>
                <Badge
                  variant="outline"
                  className="shrink-0 text-[10px] font-medium"
                >
                  {useCase.badge}
                </Badge>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                {useCase.body}
              </p>
            </article>
          ))}
        </div>
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
