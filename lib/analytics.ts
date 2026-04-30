"use client";

type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

const anonymousIdKey = "soon-anonymous-id";
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

export function initProductAnalytics() {
  if (initialized || !posthogKey || typeof window === "undefined") return;
  getAnonymousId();
  initialized = true;
}

export function trackProductEvent(
  event: string,
  properties: AnalyticsProperties = {},
) {
  if (!posthogKey || typeof window === "undefined") return;
  initProductAnalytics();

  const body = JSON.stringify({
    api_key: posthogKey,
    event,
    properties: {
      distinct_id: getAnonymousId(),
      app: "soon-ga-control-hub",
      prototype: true,
      path: window.location.pathname,
      ...properties,
    },
  });
  const url = `${posthogHost.replace(/\/$/, "")}/capture/`;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    /* analytics must never block product UX */
  });
}

export function amountBucket(amount: number) {
  if (amount < 25) return "under_25";
  if (amount < 100) return "25_to_99";
  if (amount < 250) return "100_to_249";
  return "250_plus";
}

function getAnonymousId() {
  try {
    const existing = window.localStorage.getItem(anonymousIdKey);
    if (existing) return existing;
    const id =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(anonymousIdKey, id);
    return id;
  } catch {
    return "anonymous-local-session";
  }
}
