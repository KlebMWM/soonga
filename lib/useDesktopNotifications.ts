"use client";

import { useCallback, useEffect, useState } from "react";

export type NotifPermission = NotificationPermission | "unsupported";

export function useDesktopNotifications() {
  const [permission, setPermission] = useState<NotifPermission>("default");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window === "undefined" || !("Notification" in window)) {
        setPermission("unsupported");
        return;
      }
      setPermission(Notification.permission);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const request = useCallback(async (): Promise<NotifPermission> => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    if (permission === "granted" || permission === "denied") return permission;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [permission]);

  const notify = useCallback(
    (title: string, body: string) => {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;
      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
          tag: "soon-ga-pending",
        });
      } catch {
        /* swallow — some browsers throw when page is background-throttled */
      }
    },
    [],
  );

  return { permission, request, notify };
}
