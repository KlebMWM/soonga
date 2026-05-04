import type { FeedItem, PendingApproval } from "./mockData";
import { b } from "./i18n/config";

type MerchantDef = {
  name: {
    zh: string;
    en: string;
  };
  agent: string;
  range: [number, number];
  whitelist: boolean;
};

// Merchant names are clean recipient labels (no embedded action verbs). The
// action verb ("pay", "withdraw to", "subscribe to") is supplied by the
// reasoning builders below so the rendered sentence reads naturally instead
// of doubling up like "Payment wants to pay Pay freelancer wallet".
const merchantsPool: MerchantDef[] = [
  { name: { zh: "Notion", en: "Notion" }, agent: "research", range: [80, 140], whitelist: false },
  { name: { zh: "Anthropic API", en: "Anthropic API" }, agent: "research", range: [0.3, 1.5], whitelist: true },
  { name: { zh: "OpenAI API", en: "OpenAI API" }, agent: "research", range: [0.2, 0.9], whitelist: true },
  { name: { zh: "TradingView Pro", en: "TradingView Pro" }, agent: "research", range: [40, 60], whitelist: true },
  { name: { zh: "Stripe", en: "Stripe" }, agent: "research", range: [20, 30], whitelist: true },
  { name: { zh: "Acme 供應商錢包", en: "Acme vendor wallet" }, agent: "travel", range: [80, 250], whitelist: true },
  { name: { zh: "Base 營運錢包", en: "Base ops wallet" }, agent: "travel", range: [25, 80], whitelist: true },
  { name: { zh: "自由工作者錢包", en: "Freelancer wallet" }, agent: "travel", range: [120, 400], whitelist: false },
  { name: { zh: "財務冷錢包", en: "Finance cold wallet" }, agent: "shopping", range: [600, 1200], whitelist: false },
  { name: { zh: "已信任冷錢包", en: "Allowlisted cold wallet" }, agent: "shopping", range: [80, 250], whitelist: true },
];

// Display names for the four agents — kept here (vs. pulling from the i18n
// dict at runtime) so the simulator can produce both zh and en strings
// without a locale context. Mirrors `agent.<name>.name` in dict.ts.
const AGENT_DISPLAY: Record<string, { zh: string; en: string }> = {
  research: { zh: "訂閱助理", en: "Subscription" },
  travel: { zh: "付款助理", en: "Payment" },
  shopping: { zh: "安全助理", en: "Security" },
  newsletter: { zh: "監控助理", en: "Monitor" },
};

const ACTION_TYPE: Record<string, { zh: string; en: string }> = {
  research: { zh: "訂閱付款", en: "Subscription" },
  travel: { zh: "付款", en: "Payment" },
  shopping: { zh: "提領", en: "Withdrawal" },
  newsletter: { zh: "監控", en: "Monitor" },
};

function randomAmount(min: number, max: number) {
  const raw = min + Math.random() * (max - min);
  return Math.round(raw * 100) / 100;
}

function nowTime() {
  const d = new Date();
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

let feedCounter = 1000;

export function simulateAgentAction(): FeedItem {
  const merchant = merchantsPool[Math.floor(Math.random() * merchantsPool.length)];
  const amount = randomAmount(merchant.range[0], merchant.range[1]);
  feedCounter += 1;

  let status: FeedItem["status"] = "auto-approved";
  let reason = b("可信目的地．低於單筆規則", "Trusted destination · under per-action cap");
  let approvalReason: FeedItem["approvalReason"];

  if (!merchant.whitelist) {
    if (merchant.agent === "shopping" || amount > 500) {
      status = "pending";
      reason = b("新地址或大額提領需要審核", "New address or large withdrawal requires review");
      approvalReason = b("新地址或大額提領需要人工核准", "Withdrawal to new address or large amount requires manual approval");
    } else if (merchant.agent === "travel") {
      status = "pending";
      reason = b("首次合作方付款需要審核", "First-time vendor payment requires review");
      approvalReason = b("首次合作方錢包付款需要人工確認", "First-time payment to vendor wallet requires manual confirmation");
    } else {
      status = "pending";
      reason = b("高於自動付款上限", "Above auto-payment cap");
      approvalReason = b("金額高於單筆自動付款上限", "Amount is above the per-payment auto cap");
    }
  }

  return {
    id: `f_sim_${feedCounter}`,
    time: nowTime(),
    agent: merchant.agent,
    merchant: merchant.name,
    amount,
    status,
    reason,
    approvalReason,
  };
}

/** One-line plain-language summary used as `reasoning.what` on a synthesized
 *  PendingApproval. ApprovalCard prefers `reasoning.what` over its generic
 *  fallback template, so providing this here keeps simulator-generated
 *  approvals from rendering the awkward "X wants to pay Pay Y wallet" string
 *  in the detail view. The verb is chosen per agent type so the sentence
 *  reads naturally for withdrawals, vendor payments, and subscriptions. */
export function buildSimulatedReasoningWhat(
  agent: string,
  amount: number,
  merchant: { zh: string; en: string },
): { zh: string; en: string } {
  const display = AGENT_DISPLAY[agent] ?? { zh: agent, en: agent };
  const amountStr = amount.toFixed(2);
  switch (agent) {
    case "shopping":
      return {
        zh: `${display.zh}想提領 ${amountStr} USDC 到 ${merchant.zh}。`,
        en: `${display.en} wants to withdraw ${amountStr} USDC to ${merchant.en}.`,
      };
    case "travel":
      return {
        zh: `${display.zh}想付 ${amountStr} USDC 給 ${merchant.zh}。`,
        en: `${display.en} wants to pay ${amountStr} USDC to ${merchant.en}.`,
      };
    case "research":
      return {
        zh: `${display.zh}想付 ${amountStr} USDC 給 ${merchant.zh}。`,
        en: `${display.en} wants to pay ${amountStr} USDC to ${merchant.en}.`,
      };
    default:
      return {
        zh: `${display.zh}想處理 ${merchant.zh}，金額 ${amountStr} USDC。`,
        en: `${display.en} wants to process ${merchant.en} for ${amountStr} USDC.`,
      };
  }
}

/** User-language explanation for `reasoning.why`. Tells the user *why* this
 *  particular request needs their attention, in plain words. */
export function buildSimulatedReasoningWhy(
  agent: string,
): { zh: string; en: string } {
  switch (agent) {
    case "shopping":
      return {
        zh: "這筆提領的目的地不在信任名單，請先確認再放行。",
        en: "This withdrawal's destination is not on your trust list. Please confirm before proceeding.",
      };
    case "travel":
      return {
        zh: "這是第一次付款給這個錢包，請確認對象正確再讓 agent 動用資產。",
        en: "This is the first payment to this wallet. Please confirm the recipient before the agent moves funds.",
      };
    case "research":
      return {
        zh: "這筆訂閱付款超過自動授權額度，請確認後放行或調整規則。",
        en: "This subscription charge exceeds your auto-pay cap. Confirm once or adjust the rule.",
      };
    default:
      return {
        zh: "這筆操作超出設定範圍，需要人工確認。",
        en: "This action is outside the configured rules. Please review.",
      };
  }
}

/** Synthesizes a riskProfile so ApprovalCard renders the 6-field grid
 *  (including Risk Level) for simulator-generated approvals. Risk level is
 *  derived from agent type and amount: `shopping` (withdrawals) and any
 *  amount above 500 USDC counts as High; everything else that reaches the
 *  pending queue is Medium. */
export function buildSimulatedRiskProfile(
  agent: string,
  amount: number,
  merchant: { zh: string; en: string },
  triggeredRule: { zh: string; en: string },
): NonNullable<PendingApproval["riskProfile"]> {
  const riskLevel: { zh: string; en: string } =
    agent === "shopping" || amount > 500
      ? { zh: "高", en: "High" }
      : { zh: "中", en: "Medium" };
  return {
    actionType: ACTION_TYPE[agent] ?? { zh: "操作", en: "Action" },
    asset: "USDC",
    amount: `${amount.toFixed(2)} USDC`,
    destination: merchant,
    triggeredRule,
    riskLevel,
    userDecision: { zh: "等待使用者核准", en: "Awaiting user decision" },
  };
}
