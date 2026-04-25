import type { FeedItem } from "./mockData";
import { b } from "./i18n/config";

type MerchantDef = {
  name: string;
  agent: string;
  agentAvatar: string;
  range: [number, number];
  whitelist: boolean;
};

const merchantsPool: MerchantDef[] = [
  { name: "OpenAI API", agent: "research", agentAvatar: "🧠", range: [0.05, 0.9], whitelist: true },
  { name: "Anthropic API", agent: "research", agentAvatar: "🧠", range: [0.1, 1.2], whitelist: true },
  { name: "Perplexity Pro", agent: "research", agentAvatar: "🧠", range: [0.1, 0.4], whitelist: true },
  { name: "NYT", agent: "research", agentAvatar: "🧠", range: [0.03, 0.08], whitelist: true },
  { name: "Substack", agent: "newsletter", agentAvatar: "📰", range: [5, 20], whitelist: true },
  { name: "Stratechery", agent: "newsletter", agentAvatar: "📰", range: [12, 12], whitelist: true },
  { name: "Uber Japan", agent: "travel", agentAvatar: "✈️", range: [8, 30], whitelist: false },
  { name: "Klook Tokyo", agent: "travel", agentAvatar: "✈️", range: [22, 65], whitelist: false },
  { name: "Booking.com", agent: "travel", agentAvatar: "✈️", range: [120, 220], whitelist: false },
  { name: "Amazon Gift Card", agent: "shopping", agentAvatar: "🛒", range: [20, 50], whitelist: false },
  { name: "Uniqlo JP", agent: "shopping", agentAvatar: "🛒", range: [15, 45], whitelist: false },
  { name: "JSTOR", agent: "research", agentAvatar: "🧠", range: [0.2, 0.4], whitelist: true },
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
  let reason = b("信任名單網站．低於單筆規則", "Allowlisted merchant · under per-tx cap");

  if (!merchant.whitelist) {
    if (merchant.name === "Booking.com" || amount > 100) {
      status = "pending";
      reason = b("超過單筆 100 USDC 限額", "Exceeds $100 per-tx cap");
    } else if (merchant.name === "Amazon Gift Card") {
      status = "pending";
      reason = b("可儲值類型需人工審核", "Stored-value purchase — needs review");
    } else {
      status = "auto-approved";
      reason = b("低於實體購買單筆限額", "Under physical-purchase per-tx cap");
    }
  }

  return {
    id: `f_sim_${feedCounter}`,
    time: nowTime(),
    agent: merchant.agent,
    agentAvatar: merchant.agentAvatar,
    merchant: b(merchant.name, merchant.name),
    amount,
    status,
    reason,
  };
}
