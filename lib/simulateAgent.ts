import type { FeedItem } from "./mockData";
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

const merchantsPool: MerchantDef[] = [
  { name: { zh: "Notion 訂閱續費", en: "Notion subscription renewal" }, agent: "research", range: [80, 140], whitelist: false },
  { name: { zh: "Anthropic API 服務費", en: "Anthropic API service fee" }, agent: "research", range: [0.3, 1.5], whitelist: true },
  { name: { zh: "OpenAI API 服務費", en: "OpenAI API service fee" }, agent: "research", range: [0.2, 0.9], whitelist: true },
  { name: { zh: "TradingView Pro 月費", en: "TradingView Pro monthly" }, agent: "research", range: [40, 60], whitelist: true },
  { name: { zh: "Stripe 月費", en: "Stripe monthly" }, agent: "research", range: [20, 30], whitelist: true },
  { name: { zh: "付款給 Acme 供應商錢包", en: "Pay Acme vendor wallet" }, agent: "travel", range: [80, 250], whitelist: true },
  { name: { zh: "付款給 Base 營運錢包", en: "Pay Base ops wallet" }, agent: "travel", range: [25, 80], whitelist: true },
  { name: { zh: "付款給自由工作者錢包", en: "Pay freelancer wallet" }, agent: "travel", range: [120, 400], whitelist: false },
  { name: { zh: "提領到財務冷錢包", en: "Withdraw to finance cold wallet" }, agent: "shopping", range: [600, 1200], whitelist: false },
  { name: { zh: "提領到已信任冷錢包", en: "Withdraw to allowlisted cold wallet" }, agent: "shopping", range: [80, 250], whitelist: true },
];

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
