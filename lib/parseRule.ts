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
  "Notion",
  "TradingView Pro",
  "TradingView",
  "Anthropic API",
  "Anthropic",
  "OpenAI API",
  "OpenAI",
  "Stripe",
  "Coinbase Commerce",
  "GitHub Copilot",
  "Acme 供應商錢包",
  "Acme",
  "Base 營運錢包",
  "財務冷錢包",
  "fast-cash-loan.io",
  "meme-nft-drop.xyz",
];

// Topic → category name, checked in order (first match wins). Keeps category
// names short so they fit in the rule card's title row.
const TOPIC_MAP: Array<{ regex: RegExp; zh: string; en: string }> = [
  {
    regex: /訂閱|月費|年費|subscription|saas|monthly|annual/i,
    zh: "訂閱與服務費",
    en: "Subscriptions & service fees",
  },
  {
    regex: /API|api 呼叫|服務費|service fee/i,
    zh: "訂閱與服務費",
    en: "Subscriptions & service fees",
  },
  {
    regex: /合作方|供應商|外包|自由工作者|vendor|contractor|freelancer/i,
    zh: "合作方付款",
    en: "Vendor payments",
  },
  {
    regex: /提領|外部地址|冷錢包|withdraw|external address|cold wallet/i,
    zh: "提領到新地址",
    en: "Withdrawals to new addresses",
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
    // Bare merchant mention without intent keyword falls to LOW confidence
    // (not medium), and the rationale explicitly asks for direction.
    // Reason: a payment-control product must not auto-suggest "trust this
    // merchant" just because the user typed the name — the user might have
    // meant the opposite or might just be looking the merchant up.
    // The UI gates LOW confidence behind "Review and apply" → manual form,
    // so even if the user clicks past the rationale they cannot one-click
    // an unintended allowlist entry.
    return {
      kind: "allow",
      allow: {
        merchant: matchedMerchant,
        category: availableCategoryIds[0] ?? "subscription",
        addedAt: today,
      },
      confidence: allowIntent ? "high" : "low",
      rationale: {
        zh: allowIntent
          ? `偵測到你想將「${matchedMerchant}」加入白名單。`
          : `偵測到網站「${matchedMerchant}」，但無法判斷你是想加入信任名單還是封鎖名單。請使用「手動調整」確認。`,
        en: allowIntent
          ? `Detected intent to allowlist "${matchedMerchant}".`
          : `Detected merchant "${matchedMerchant}", but couldn't tell if you mean trust or block. Use "Manual adjust" to confirm.`,
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
        isSystem: false,
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
      zh: "無法推斷出具體規則。試試描述金額（例：「每月 500 USDC 在訂閱費」）或指定收款方（例：「加 Notion 到信任名單」）。",
      en: 'Couldn\'t infer a specific rule. Try describing an amount ("$500/month for subscriptions") or a specific recipient ("allowlist Notion").',
    },
  };
}
