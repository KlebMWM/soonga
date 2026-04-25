import type { Category } from "./mockData";

/**
 * Mock natural-language rule parser.
 *
 * Stands in for a real LLM call. Does a best-effort keyword extraction on the
 * user's free-form description and returns a draft rule (either a category
 * budget or an allowlist entry) with a confidence signal + human-readable
 * rationale. When it can't find enough signal, returns `unknown` so the UI
 * can fall back to the manual form.
 *
 * Deliberately simple: the point is to make the *UX* of "describe it in
 * Chinese, get a structured rule back" feel correct. Swap in a real Claude
 * call (`@anthropic-ai/sdk`) at the one seam below when wiring up the API.
 */

type Confidence = "high" | "medium" | "low";

export type ParsedAllow = {
  merchant: string;
  category: string;
  addedAt: string;
};

export type ParsedBlock = {
  merchant: string;
  reason: { zh: string; en: string };
  addedAt: string;
};

export type ParsedRule =
  | {
      kind: "category";
      category: Category;
      confidence: Confidence;
      rationale: { zh: string; en: string };
    }
  | {
      kind: "allow";
      allow: ParsedAllow;
      confidence: Confidence;
      rationale: { zh: string; en: string };
    }
  | {
      kind: "block";
      block: ParsedBlock;
      confidence: Confidence;
      rationale: { zh: string; en: string };
    }
  | {
      kind: "unknown";
      rationale: { zh: string; en: string };
    };

// Merchants the parser recognises by name match. Sourced from the simulator's
// merchant pool so any merchant the Dashboard already shows in activity will
// parse correctly here.
const KNOWN_MERCHANTS = [
  "NYT",
  "JSTOR",
  "OpenAI API",
  "Anthropic API",
  "Perplexity Pro",
  "Substack",
  "Stratechery",
  "Uber Japan",
  "Klook Tokyo",
  "Booking.com",
  "Amazon Gift Card",
  "Uniqlo JP",
];

// Topic → category name, checked in order (first match wins). Keeps category
// names short so they fit in the rule card's title row.
const TOPIC_MAP: Array<{ regex: RegExp; zh: string; en: string }> = [
  {
    regex: /學術|論文|期刊|paper|academic|journal|research/i,
    zh: "學術資料",
    en: "Academic papers",
  },
  {
    regex: /訂閱|subscription|monthly service/i,
    zh: "訂閱服務",
    en: "Subscriptions",
  },
  {
    regex: /旅行|機票|住宿|差旅|travel|flight|hotel|trip/i,
    zh: "差旅",
    en: "Travel",
  },
  {
    regex: /購物|商品|衣服|服飾|shopping|clothing|physical|apparel/i,
    zh: "實體購買",
    en: "Physical purchases",
  },
  {
    regex: /API|api key|api 呼叫/i,
    zh: "API 呼叫",
    en: "API calls",
  },
  {
    regex: /禮物卡|gift card|儲值|prepaid/i,
    zh: "可儲值商品",
    en: "Stored-value goods",
  },
];

export function parseRuleRequest(
  input: string,
  availableCategoryIds: string[],
): ParsedRule {
  const text = input.trim();
  if (!text) {
    return {
      kind: "unknown",
      rationale: { zh: "請先輸入描述", en: "Enter a description first" },
    };
  }

  // 1) Merchant name + intent. Block intent first — defaulting an unqualified
  //    merchant to allowlist is unsafe for a payment-control product, since a
  //    user typing "封鎖 Booking.com" should never end up creating an
  //    allowlist entry.
  const matchedMerchant = KNOWN_MERCHANTS.find((m) =>
    text.toLowerCase().includes(m.toLowerCase()),
  );
  const blockIntent =
    /封鎖|拒絕|不要|禁止|擋下|阻擋|block|deny|reject|disallow/i.test(text);
  const allowIntent =
    /白名單|信任|允許|放行|加入名單|allow|trust|whitelist/i.test(text);
  const today = new Date().toISOString().slice(0, 10);

  if (matchedMerchant && blockIntent) {
    return {
      kind: "block",
      block: {
        merchant: matchedMerchant,
        reason: {
          zh: "使用者要求封鎖此付款對象",
          en: "User requested to block this merchant",
        },
        addedAt: today,
      },
      confidence: "high",
      rationale: {
        zh: `偵測到你想封鎖「${matchedMerchant}」，建議加入封鎖名單。`,
        en: `Detected intent to block "${matchedMerchant}". Suggesting blocklist entry.`,
      },
    };
  }

  if (matchedMerchant) {
    // No explicit intent → default to allow only when allow intent OR no
    // signal in either direction. The explicit allowIntent boosts confidence;
    // a bare merchant mention falls back to medium.
    return {
      kind: "allow",
      allow: {
        merchant: matchedMerchant,
        category: availableCategoryIds[0] ?? "api",
        addedAt: today,
      },
      confidence: allowIntent ? "high" : "medium",
      rationale: {
        zh: allowIntent
          ? `偵測到你想將「${matchedMerchant}」加入白名單。`
          : `偵測到網站「${matchedMerchant}」，預設建議加入白名單；如果其實想封鎖，請補上「封鎖」之類的字眼再試。`,
        en: allowIntent
          ? `Detected intent to allowlist "${matchedMerchant}".`
          : `Detected merchant "${matchedMerchant}". Defaulting to allowlist; add words like "block" if you meant the opposite.`,
      },
    };
  }

  // 2) Numeric budget + optional topic → category rule
  const amountMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:USDC|美元|元|\$)?/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

  if (amount !== null && amount > 0) {
    const topic = TOPIC_MAP.find((t) => t.regex.test(text));
    const confidence: Confidence = topic ? "high" : "medium";
    const isSingle = /單筆|per transaction|per-tx|each time/i.test(text);
    const isMonthly = /每月|每個月|monthly|per month|a month/i.test(text);

    // Default bias: when ambiguous, treat the amount as a monthly cap (the
    // more common mental model). Single-tx framing requires explicit cue.
    const monthlyLimit = isSingle && !isMonthly ? amount * 10 : amount;
    const singleLimit = isSingle
      ? amount
      : Math.max(5, Math.round(monthlyLimit / 4));

    const name = topic ?? { zh: "自訂規則", en: "Custom rule" };

    return {
      kind: "category",
      category: {
        id: `ai_${Date.now()}`,
        name: { zh: name.zh, en: name.en },
        description: {
          zh: text.length > 40 ? text.slice(0, 40) + "…" : text,
          en: text.length > 40 ? text.slice(0, 40) + "…" : text,
        },
        monthlyLimit,
        singleLimit,
        spent: 0,
      },
      confidence,
      rationale: {
        zh: `偵測到預算 ${amount} USDC${topic ? `、主題「${topic.zh}」` : ""}。建立類別規則：月 ${monthlyLimit}、單筆 ${singleLimit}。`,
        en: `Detected $${amount}${topic ? `, topic "${topic.en}"` : ""}. Category rule: $${monthlyLimit}/mo, $${singleLimit}/tx.`,
      },
    };
  }

  return {
    kind: "unknown",
    rationale: {
      zh: "無法推斷出具體規則。試試描述金額（例：「每月 50 USDC」）或指定網站名稱（例：「加 Booking.com 到白名單」）。",
      en: 'Couldn\'t infer a specific rule. Try describing an amount ("$50/month") or a specific merchant ("allowlist Booking.com").',
    },
  };
}
