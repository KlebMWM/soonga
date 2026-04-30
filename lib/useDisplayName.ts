"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "soon-display-name";
const STORAGE_EVENT = "soon-display-name-change";
const DEFAULT_NAME = "Megan";

/**
 * Lightweight local personalization for the prototype's greeting.
 *
 * The default "Megan" remains the canonical placeholder in the i18n dict —
 * this hook only overrides it client-side when the user has saved a custom
 * name from the Welcome modal. localStorage-only; no backend, no profile
 * page, no upload.
 *
 * SSR-safe by gating the localStorage read behind `mounted` so the server
 * markup and the first client render both emit the i18n default; the
 * personalized name then swaps in after hydration.
 */
export function useDisplayName(): {
  /** Current display name. "Megan" until mounted; user value (or default
   *  fallback) after that. Always renderable. */
  name: string;
  /** Persist a new name. Empty / whitespace-only input falls back to the
   *  default and clears localStorage. */
  setName: (next: string) => void;
  /** False on server + first client render, true after mount. Useful for
   *  callers that need to defer their own animations until storage has
   *  been read. */
  mounted: boolean;
} {
  const [name, setNameState] = useState<string>(DEFAULT_NAME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && stored.trim()) setNameState(stored);
    } catch {
      /* localStorage unavailable — stick with default */
    }

    // Cross-instance live update: another useDisplayName instance
    // dispatched a name change. Sync our local state to match.
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") setNameState(detail);
    };
    window.addEventListener(STORAGE_EVENT, handler);
    return () => window.removeEventListener(STORAGE_EVENT, handler);
  }, []);

  const setName = (next: string) => {
    const trimmed = next.trim();
    if (!trimmed) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setNameState(DEFAULT_NAME);
      try {
        window.dispatchEvent(
          new CustomEvent<string>(STORAGE_EVENT, { detail: DEFAULT_NAME }),
        );
      } catch {
        /* ignore — broadcast is best-effort */
      }
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      /* ignore — still update in-memory state for this session */
    }
    setNameState(trimmed);
    try {
      window.dispatchEvent(
        new CustomEvent<string>(STORAGE_EVENT, { detail: trimmed }),
      );
    } catch {
      /* ignore — broadcast is best-effort */
    }
  };

  return { name, setName, mounted };
}

export const DISPLAY_NAME_DEFAULT = DEFAULT_NAME;
