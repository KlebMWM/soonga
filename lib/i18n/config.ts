export type Locale = "zh" | "en";

export const LOCALES: Locale[] = ["zh", "en"];
export const DEFAULT_LOCALE: Locale = "zh";
export const STORAGE_KEY = "soon-locale";

/** Bilingual string helper — both variants always defined. */
export type Bilingual = { zh: string; en: string };

export const b = (zh: string, en: string): Bilingual => ({ zh, en });
