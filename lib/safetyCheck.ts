import { b, type Bilingual } from "./i18n/config";

export type SafetyLevel = "safe" | "caution" | "risky";

export type SafetySignal = {
  severity: "positive" | "neutral" | "negative";
  detail: Bilingual;
};

export type SafetyResult = {
  level: SafetyLevel;
  score: number; // 0-100
  signals: SafetySignal[];
};

// Mock threat-intel heuristics. In Phase 2 this would call GoPlus Security,
// Google Safe Browsing, WHOIS age, and x402 on-chain reputation.
const KNOWN_SAFE = [
  "openai",
  "anthropic",
  "nytimes",
  "nyt",
  "substack",
  "stratechery",
  "booking",
  "uniqlo",
  "klook",
  "jstor",
  "perplexity",
  "uber",
  "nature.com",
  "springer",
  "arxiv",
  "wikipedia",
  "github",
  "amazon.com",
  "apple.com",
  "google.com",
  "microsoft.com",
  "stripe",
  "circle.com",
  "coinbase",
];

const SUSPICIOUS_TLDS = [".xyz", ".tk", ".ml", ".ga", ".cf", ".top", ".zip"];
const RISKY_KEYWORDS = [
  "nft-drop",
  "airdrop",
  "meme",
  "loan",
  "giveaway",
  "casino",
  "pump",
  "rug",
  "pre-sale",
  "presale",
  "mint-now",
];

export function checkMerchantSafety(raw: string): SafetyResult {
  const lower = raw.toLowerCase().trim();
  const signals: SafetySignal[] = [];
  let score = 50;

  if (lower.length === 0) {
    return { level: "caution", score: 0, signals: [] };
  }

  // Known safe pattern
  if (KNOWN_SAFE.some((s) => lower.includes(s))) {
    score += 35;
    signals.push({
      severity: "positive",
      detail: b(
        "付款對象在公開信譽資料庫中具備長期紀錄",
        "Long-standing presence in public reputation databases",
      ),
    });
  }

  // Standard TLD
  if (/\.(com|org|net|io|co|ai)(\/|$)/i.test(lower) || lower.endsWith(".com") || lower.endsWith(".io")) {
    score += 8;
    signals.push({
      severity: "positive",
      detail: b("標準商業域名（.com / .io 等）", "Standard commercial TLD (.com / .io / etc.)"),
    });
  }

  // Suspicious TLD
  for (const tld of SUSPICIOUS_TLDS) {
    if (lower.endsWith(tld)) {
      score -= 35;
      signals.push({
        severity: "negative",
        detail: b(
          `可疑 TLD（${tld}）．詐騙站常用`,
          `Suspicious TLD (${tld}) — often used by scam sites`,
        ),
      });
    }
  }

  // Risky keywords
  for (const kw of RISKY_KEYWORDS) {
    if (lower.includes(kw)) {
      score -= 30;
      signals.push({
        severity: "negative",
        detail: b(
          `包含高風險關鍵字「${kw}」`,
          `Contains high-risk keyword "${kw}"`,
        ),
      });
    }
  }

  // Typosquat pattern (multiple hyphens or long digit runs)
  if (/\d{4,}/.test(lower) || (lower.match(/-/g)?.length ?? 0) >= 2) {
    score -= 12;
    signals.push({
      severity: "negative",
      detail: b(
        "名稱包含多個連字號或數字串．可能是仿冒域名（typosquat）",
        "Multiple hyphens or long digit runs — possible typosquat",
      ),
    });
  }

  // Unicode lookalikes
  if (/[ -￿]/.test(raw) && !/[一-鿿぀-ヿ]/.test(raw)) {
    // non-ASCII that isn't CJK — possible homoglyph
    score -= 15;
    signals.push({
      severity: "negative",
      detail: b(
        "偵測到非 ASCII 字元．可能是 Unicode 仿冒攻擊",
        "Non-ASCII characters detected — possible Unicode homoglyph attack",
      ),
    });
  }

  // No positive signals → unknown, mild caution
  if (signals.length === 0) {
    score = 42;
    signals.push({
      severity: "neutral",
      detail: b(
        "首次觀察此付款對象．沒有歷史紀錄可比對",
        "First time seeing this merchant. No historical signals to compare against.",
      ),
    });
  }

  // Always add a footnote about mock nature
  signals.push({
    severity: "neutral",
    detail: b(
      "⚙ 模擬偵測．Phase 2 會接 GoPlus Security / Safe Browsing / WHOIS",
      "⚙ Simulated check. Phase 2 will integrate GoPlus Security / Safe Browsing / WHOIS",
    ),
  });

  score = Math.max(0, Math.min(100, score));
  const level: SafetyLevel = score >= 70 ? "safe" : score >= 40 ? "caution" : "risky";

  return { level, score, signals };
}
