"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  initProductAnalytics,
  trackProductEvent,
} from "@/lib/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const enteredAtRef = useRef(Date.now());
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    initProductAnalytics();
  }, []);

  useEffect(() => {
    const now = Date.now();
    const previousPath = previousPathRef.current;

    if (previousPath) {
      trackProductEvent("page_exited", {
        path: previousPath,
        duration_ms: now - enteredAtRef.current,
      });
    }

    previousPathRef.current = pathname;
    enteredAtRef.current = now;
    trackProductEvent("page_viewed", { path: pathname });
  }, [pathname]);

  useEffect(() => {
    return () => {
      const previousPath = previousPathRef.current;
      if (!previousPath) return;
      trackProductEvent("page_exited", {
        path: previousPath,
        duration_ms: Date.now() - enteredAtRef.current,
      });
    };
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
