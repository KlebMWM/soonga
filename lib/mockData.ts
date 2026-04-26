import { b, type Bilingual } from "./i18n/config";

export type Agent = {
  id: string;
  /** Canonical lowercase id ("travel", "research", "shopping", "newsletter").
   *  Used as the lookup key across mock data, the simulator, AgentIcon's
   *  AGENT_MAP, and the i18n keys (`agent.${name}.name`). */
  name: string;
  /** Default display label (Chinese functional name). Most UI sites should
   *  resolve via i18n — `t(\`agent.${name}.name\`)` — for locale awareness;
   *  this field is the static fallback. */
  displayName: string;
  avatar: string;
  role: Bilingual;
  status: "active" | "paused";
  monthlySpent: number;
  monthlyBudget: number;
};

export type Category = {
  id: string;
  name: Bilingual;
  description: Bilingual;
  monthlyLimit: number;
  singleLimit: number;
  spent: number;
  /** True for the four seeded categories that ship with the prototype.
   *  System categories cannot be deleted from the UI (no trash button).
   *  User-created categories (via natural-language parser or the chooser
   *  cards) carry `isSystem: false` and surface a trash + undo flow. */
  isSystem?: boolean;
};

export type FeedItem = {
  id: string;
  time: string;
  agent: string;
  agentAvatar: string;
  merchant: Bilingual;
  amount: number;
  status: "auto-approved" | "pending" | "rejected" | "approved";
  reason: Bilingual;
  /** Human-readable relative time ("剛剛", "2 分鐘前"). Optional — simulated
      items skip it and fall back to the default "just now" label in the UI. */
  relative?: Bilingual;
};

export type MerchantTrust = "allowlisted" | "blocklisted" | "review" | "first-time";

/** Risk chip surfaced beneath the decision summary on the approval card.
 *  Severity colors are tokens not literals — see globals.css for mapping.
 *  - sage:  contextual confidence-builder (e.g. "2 週內出發")
 *  - amber: caution, requires attention but not blocking
 *  - coral: hard breach, would block under stricter rules */
export type RiskSeverity = "sage" | "amber" | "coral";
export type Risk = {
  label: Bilingual;
  severity: RiskSeverity;
};

export type PendingApproval = {
  id: string;
  agent: string;
  agentAvatar: string;
  merchant: Bilingual;
  amount: number;
  currency: string;
  timestamp: string;
  why: Bilingual;
  context: {
    taskId: Bilingual;
    spentOnTask: number;
    remainingBudget: number;
    merchantTrust: MerchantTrust;
    similarPastTransactions: number;
  };
  triggeredRule: Bilingual;
  severity: "info" | "warning" | "danger";
  /** Decision summary paragraph — three-line structure per MASTER §14.1.
   *  what = active-voice first line; why = user-language second line;
   *  context = optional third surfacing of calendar / prior-conversation
   *  signal. Optional so simulator-generated synthetic pendings stay valid;
   *  ApprovalCard falls back to `why` when this is missing. */
  reasoning?: {
    what: Bilingual;
    why: Bilingual;
    context?: Bilingual;
  };
  /** Risk chips — pre-computed array, no live computation in UI.
   *  Optional for the same reason as `reasoning`. Cap at 6 in the UI. */
  risks?: Risk[];
  /** Outcome preview lines beneath each action button per MASTER §14.3.
   *  Each list element is one fact line, 2-4 for onApprove, 2-3 for the
   *  others. Optional with the same fallback rule. */
  outcomes?: {
    onApprove: Bilingual[];
    onAdjust: Bilingual[];
    onReject: Bilingual[];
  };
  isCounterOffer?: boolean;
  counterOffer?: {
    merchant: Bilingual;
    amount: number;
    why: Bilingual;
    triggeredRule: Bilingual;
    merchantTrust: MerchantTrust;
  };
};

export type AuditEntry = {
  id: string;
  timestamp: string;
  agent: string;
  agentAvatar: string;
  merchant: Bilingual;
  amount: number;
  decision: "approved" | "rejected" | "auto-approved";
  approvedBy: "user" | "system";
  reasoning: Bilingual;
  userAction?: Bilingual;
  txHash: string;
  gasFee: number;
};

export const agents: Agent[] = [
  {
    id: "a1",
    name: "research",
    displayName: "研究助理",
    avatar: "🧠",
    role: b("學術研究助理", "Academic research assistant"),
    status: "active",
    monthlySpent: 23.4,
    monthlyBudget: 50,
  },
  {
    id: "a2",
    name: "travel",
    displayName: "旅行助理",
    avatar: "✈️",
    role: b("差旅規劃", "Travel planner"),
    status: "active",
    monthlySpent: 187.2,
    monthlyBudget: 500,
  },
  {
    id: "a3",
    name: "shopping",
    displayName: "採購助理",
    avatar: "🛒",
    role: b("日用採購", "Daily shopping"),
    status: "paused",
    monthlySpent: 8.9,
    monthlyBudget: 100,
  },
  {
    id: "a4",
    name: "newsletter",
    displayName: "內容彙整",
    avatar: "📰",
    role: b("電子報訂閱管理", "Newsletter subscriptions"),
    status: "active",
    monthlySpent: 42.0,
    monthlyBudget: 80,
  },
];

export const categories: Category[] = [
  {
    id: "api",
    name: b("AI 服務", "AI services"),
    description: b("OpenAI、Anthropic、資料查詢等 LLM 呼叫", "OpenAI, Anthropic, data queries — LLM calls"),
    monthlyLimit: 80,
    singleLimit: 5,
    spent: 34.2,
    isSystem: true,
  },
  {
    id: "subscription",
    name: b("訂閱服務", "Subscriptions"),
    description: b("SaaS、媒體、報告訂閱", "SaaS, media, research reports"),
    monthlyLimit: 200,
    singleLimit: 50,
    spent: 147.0,
    isSystem: true,
  },
  {
    id: "physical",
    name: b("實體購買", "Physical purchases"),
    description: b("旅宿、票券、電商訂單", "Lodging, tickets, e-commerce"),
    monthlyLimit: 300,
    singleLimit: 100,
    spent: 38.3,
    isSystem: true,
  },
  {
    id: "transfer",
    name: b("跨平台轉帳", "Cross-platform transfers"),
    description: b("不同 AI 助理互相交易或轉帳", "Agent-to-agent payments"),
    monthlyLimit: 100,
    singleLimit: 20,
    spent: 0,
    isSystem: true,
  },
];

export type TrustList = {
  allowlist: { merchant: string; category: string; addedAt: string }[];
  blocklist: { merchant: string; reason: Bilingual; addedAt: string }[];
  review: { merchant: string; category: string; since: string }[];
};

export const trustList: TrustList = {
  allowlist: [
    { merchant: "OpenAI API", category: "api", addedAt: "2026-03-14" },
    { merchant: "NYT", category: "subscription", addedAt: "2026-02-01" },
    { merchant: "Anthropic API", category: "api", addedAt: "2026-03-18" },
    { merchant: "Perplexity Pro", category: "subscription", addedAt: "2026-01-22" },
    { merchant: "arXiv Donation", category: "subscription", addedAt: "2026-03-02" },
  ],
  blocklist: [
    {
      merchant: "meme-nft-drop.xyz",
      reason: b("未驗證網站 + 異常高手續費", "Unverified merchant + abnormally high fees"),
      addedAt: "2026-04-11",
    },
    {
      merchant: "fast-cash-loan.io",
      reason: b("你手動封鎖的", "Manually blocked by user"),
      addedAt: "2026-04-03",
    },
  ],
  review: [
    { merchant: "Booking.com", category: "physical", since: "2026-04-20" },
    { merchant: "Amazon Gift Card", category: "physical", since: "2026-04-18" },
    { merchant: "Nature Journal", category: "subscription", since: "2026-04-22" },
  ],
};

export const liveFeed: FeedItem[] = [
  {
    id: "f1",
    time: "23:19",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("JSTOR", "JSTOR"),
    amount: 0.28,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
    relative: b("剛剛", "just now"),
  },
  {
    id: "f2",
    time: "23:19",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("OpenAI API", "OpenAI API"),
    amount: 0.09,
    status: "auto-approved",
    reason: b("低於單筆規則", "Under per-tx cap"),
    relative: b("剛剛", "just now"),
  },
  {
    id: "f3",
    time: "23:19",
    agent: "shopping",
    agentAvatar: "🛒",
    merchant: b("Uniqlo JP", "Uniqlo JP"),
    amount: 16.54,
    status: "auto-approved",
    reason: b("低於實體購買限額", "Under physical-purchase cap"),
    relative: b("剛剛", "just now"),
  },
  {
    id: "f4",
    time: "23:18",
    agent: "travel",
    agentAvatar: "✈️",
    merchant: b("Booking.com", "Booking.com"),
    amount: 132.73,
    status: "pending",
    reason: b("超過單筆 100 USDC 限額", "Exceeds $100 per-tx cap"),
    relative: b("2 分鐘前", "2 min ago"),
  },
  {
    id: "f5",
    time: "23:18",
    agent: "newsletter",
    agentAvatar: "📰",
    merchant: b("Stratechery", "Stratechery"),
    amount: 12.0,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
    relative: b("2 分鐘前", "2 min ago"),
  },
  {
    id: "f6",
    time: "07:58",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("Anthropic API", "Anthropic API"),
    amount: 0.34,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
  },
  {
    id: "f7",
    time: "07:42",
    agent: "shopping",
    agentAvatar: "🛒",
    merchant: b("Amazon Gift Card", "Amazon Gift Card"),
    amount: 30.0,
    status: "pending",
    reason: b("可儲值類型要審核", "Stored-value purchase — needs review"),
  },
  {
    id: "f8",
    time: "07:20",
    agent: "newsletter",
    agentAvatar: "📰",
    merchant: b("Stratechery", "Stratechery"),
    amount: 12.0,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
  },
  {
    id: "f9",
    time: "06:55",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("JSTOR", "JSTOR"),
    amount: 0.25,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
  },
  {
    id: "f10",
    time: "06:30",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("Nature 期刊", "Nature Journal"),
    amount: 35.0,
    status: "pending",
    reason: b("訂閱類重複扣款警示", "Subscription — recurring-charge alert"),
  },
  {
    id: "f11",
    time: "06:10",
    agent: "travel",
    agentAvatar: "✈️",
    merchant: b("Uber Japan", "Uber Japan"),
    amount: 12.3,
    status: "auto-approved",
    reason: b("低於實體購買單筆限額", "Under physical-purchase per-tx cap"),
  },
  {
    id: "f12",
    time: "05:48",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("OpenAI API", "OpenAI API"),
    amount: 0.08,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
  },
  {
    id: "f13",
    time: "05:22",
    agent: "newsletter",
    agentAvatar: "📰",
    merchant: b("Lenny's Newsletter", "Lenny's Newsletter"),
    amount: 15.0,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
  },
  {
    id: "f14",
    time: "04:55",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("Perplexity Pro", "Perplexity Pro"),
    amount: 0.2,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
  },
  {
    id: "f15",
    time: "04:30",
    agent: "travel",
    agentAvatar: "✈️",
    merchant: b("Klook Tokyo", "Klook Tokyo"),
    amount: 42.0,
    status: "auto-approved",
    reason: b("低於實體購買單筆限額", "Under physical-purchase per-tx cap"),
  },
  {
    id: "f16",
    time: "04:02",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("Anthropic API", "Anthropic API"),
    amount: 0.45,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
  },
  {
    id: "f17",
    time: "03:40",
    agent: "shopping",
    agentAvatar: "🛒",
    merchant: b("Uniqlo JP", "Uniqlo JP"),
    amount: 28.0,
    status: "auto-approved",
    reason: b("低於實體購買單筆限額", "Under physical-purchase per-tx cap"),
  },
  {
    id: "f18",
    time: "03:18",
    agent: "newsletter",
    agentAvatar: "📰",
    merchant: b("The Information", "The Information"),
    amount: 10.0,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
  },
  {
    id: "f19",
    time: "02:55",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("NYT", "NYT"),
    amount: 0.05,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
  },
  {
    id: "f20",
    time: "02:30",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("OpenAI API", "OpenAI API"),
    amount: 0.18,
    status: "auto-approved",
    reason: b("信任名單網站", "Allowlisted merchant"),
  },
];

export type BurnPoint = { date: string; amount: number; transactions: number };

export const burnRate7d: BurnPoint[] = [
  { date: "04/17", amount: 28.4, transactions: 42 },
  { date: "04/18", amount: 34.1, transactions: 51 },
  { date: "04/19", amount: 19.8, transactions: 38 },
  { date: "04/20", amount: 41.2, transactions: 47 },
  { date: "04/21", amount: 52.7, transactions: 59 },
  { date: "04/22", amount: 38.9, transactions: 45 },
  { date: "04/23", amount: 45.3, transactions: 53 },
];

export const burnRate30d: BurnPoint[] = [
  { date: "03/25", amount: 22.1, transactions: 32 },
  { date: "03/26", amount: 18.7, transactions: 28 },
  { date: "03/27", amount: 35.4, transactions: 48 },
  { date: "03/28", amount: 29.8, transactions: 41 },
  { date: "03/29", amount: 12.3, transactions: 19 },
  { date: "03/30", amount: 15.9, transactions: 24 },
  { date: "03/31", amount: 42.6, transactions: 55 },
  { date: "04/01", amount: 48.2, transactions: 61 },
  { date: "04/02", amount: 31.5, transactions: 44 },
  { date: "04/03", amount: 27.8, transactions: 39 },
  { date: "04/04", amount: 55.1, transactions: 62 },
  { date: "04/05", amount: 23.4, transactions: 33 },
  { date: "04/06", amount: 17.2, transactions: 26 },
  { date: "04/07", amount: 39.8, transactions: 50 },
  { date: "04/08", amount: 44.5, transactions: 57 },
  { date: "04/09", amount: 36.7, transactions: 46 },
  { date: "04/10", amount: 29.1, transactions: 40 },
  { date: "04/11", amount: 58.3, transactions: 67 },
  { date: "04/12", amount: 24.9, transactions: 35 },
  { date: "04/13", amount: 19.4, transactions: 29 },
  { date: "04/14", amount: 41.7, transactions: 52 },
  { date: "04/15", amount: 33.2, transactions: 45 },
  { date: "04/16", amount: 26.5, transactions: 37 },
  { date: "04/17", amount: 28.4, transactions: 42 },
  { date: "04/18", amount: 34.1, transactions: 51 },
  { date: "04/19", amount: 19.8, transactions: 38 },
  { date: "04/20", amount: 41.2, transactions: 47 },
  { date: "04/21", amount: 52.7, transactions: 59 },
  { date: "04/22", amount: 38.9, transactions: 45 },
  { date: "04/23", amount: 45.3, transactions: 53 },
];

export const burnRate1y: BurnPoint[] = [
  { date: "2025/05", amount: 612.4, transactions: 823 },
  { date: "2025/06", amount: 688.1, transactions: 912 },
  { date: "2025/07", amount: 734.6, transactions: 981 },
  { date: "2025/08", amount: 702.3, transactions: 944 },
  { date: "2025/09", amount: 655.9, transactions: 889 },
  { date: "2025/10", amount: 781.2, transactions: 1048 },
  { date: "2025/11", amount: 824.5, transactions: 1102 },
  { date: "2025/12", amount: 897.8, transactions: 1203 },
  { date: "2026/01", amount: 723.4, transactions: 965 },
  { date: "2026/02", amount: 791.6, transactions: 1062 },
  { date: "2026/03", amount: 854.2, transactions: 1137 },
  { date: "2026/04", amount: 680.9, transactions: 902 },
];

/** Backwards-compatible alias. */
export const burnRate = burnRate7d;

export const pendingApprovals: PendingApproval[] = [
  {
    id: "ap_001",
    agent: "travel",
    agentAvatar: "✈️",
    merchant: b("Booking.com", "Booking.com"),
    amount: 184.0,
    currency: "USDC",
    timestamp: "2026-04-23 09:08:12",
    why: b(
      "為了完成你交辦的「京都賞櫻 4 月 25-28 日」行程，我找到一家符合預算的和風旅館（評分 9.2），這是現在唯一剩下的空房。如果 20 分鐘內沒訂，就會輪到下一個候補的人。",
      "To complete the \"Kyoto cherry blossom, Apr 25–28\" trip you asked me to plan, I found a ryokan that fits your budget (rated 9.2). It's the last room available. If I don't book within 20 minutes, it goes to the waitlist.",
    ),
    context: {
      taskId: b("京都賞櫻 4 月 25-28 日", "Kyoto cherry blossom · Apr 25–28"),
      spentOnTask: 32.5,
      remainingBudget: 283.5,
      merchantTrust: "review",
      similarPastTransactions: 0,
    },
    triggeredRule: b(
      "超過單筆 100 USDC 限額（實體購買）",
      "Exceeds $100 per-tx cap (physical purchases)",
    ),
    severity: "warning",
    reasoning: {
      what: b(
        "旅行助理想預訂 Booking.com 的京都和風旅館，4 月 25–28 日共 3 晚 184 USDC。",
        "Travel wants to book a ryokan on Booking.com, 3 nights Apr 25–28 for 184 USDC.",
      ),
      why: b(
        "為你的「京都賞櫻」行程訂房，評分 9.2、距離花見路徑 8 分鐘步行，現在是最後一間空房，免費取消。",
        "For your Kyoto cherry-blossom trip. Rated 9.2, 8-min walk to the hanami path, last room available, free cancellation.",
      ),
      context: b(
        "你 4/23 的日曆已標記為「京都賞櫻 4 天」，4/25 出發。",
        "Your calendar on Apr 23 has \"Kyoto cherry blossom · 4 days\" — departing Apr 25.",
      ),
    },
    risks: [
      { label: b("首次跨國付款", "First cross-border payment"), severity: "amber" },
      { label: b("超出單筆限額", "Over per-tx cap"), severity: "amber" },
      { label: b("2 週內出發", "Trip in <2 weeks"), severity: "sage" },
    ],
    outcomes: {
      onApprove: [
        b("立即扣款 184 USDC", "Charge 184 USDC immediately"),
        b("Booking.com 確認信寄到你的 email", "Confirmation email sent to your inbox"),
        b("行程加入你的行事曆 4/25–28", "Added to your calendar Apr 25–28"),
        b("旅行助理會接著訂機票與接駁", "Travel will book flights and transfer next"),
      ],
      onAdjust: [
        b("暫停這筆，打開規則編輯器", "Pause this and open the rule editor"),
        b("建議規則：將實體購買單筆限額提升至 200 USDC", "Suggested rule: raise physical purchase cap to 200 USDC"),
        b("修改後可選擇對這筆套用新規則或仍進審核", "After editing, apply to this charge or keep it pending"),
      ],
      onReject: [
        b("訂房不會發生", "The booking will not happen"),
        b("旅行助理會詢問是否要看備案 APA Hotel 119 USDC", "Travel will offer the APA Hotel alternative at 119 USDC"),
        b("你的京都住宿仍待安排", "Your Kyoto stay remains unbooked"),
      ],
    },
    counterOffer: {
      merchant: b("APA Hotel 京都站前", "APA Hotel Kyoto Station"),
      amount: 119.0,
      why: b(
        "退而求其次：APA 京都站前走路 4 分鐘就到 JR 京都站，評分 8.7（比原方案低 0.5）。房價 119 USDC 在單筆限額內，還剩一間標準雙床房，接新幹線也比較順。",
        "Second-best option: APA Kyoto Station is 4 min walk to JR Kyoto, rated 8.7 (0.5 lower than the original). $119 fits under the per-tx cap, one standard twin room left. Also streamlines the Shinkansen connection.",
      ),
      triggeredRule: b("Agent 備案．比原方案便宜 35%", "Agent counter-offer · 35% cheaper"),
      merchantTrust: "first-time",
    },
  },
  {
    id: "ap_002",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("Nature 期刊", "Nature Journal"),
    amount: 35.0,
    currency: "USDC",
    timestamp: "2026-04-23 06:30:47",
    why: b(
      "你正在研究的 Cardano 擴展性主題，這本期刊剛好有 3 篇直接相關的文章。訂閱可以下載全文，比一篇一篇買省 54 USDC。",
      "For your Cardano scalability research, this journal has 3 directly relevant articles. A subscription grants full-text access — saves $54 vs. buying them individually.",
    ),
    context: {
      taskId: b("Cardano 研究（4 月份）", "Cardano research (April)"),
      spentOnTask: 18.4,
      remainingBudget: 31.6,
      merchantTrust: "review",
      similarPastTransactions: 0,
    },
    triggeredRule: b(
      "訂閱類網站首次扣款．重複扣款警示",
      "Subscription merchant · first charge · recurring-payment alert",
    ),
    severity: "info",
    reasoning: {
      what: b(
        "研究助理想訂閱 Nature 期刊一年 35 USDC，為 Cardano 擴展性研究使用。",
        "Research wants to subscribe to Nature Journal for 35 USDC/year for the Cardano scalability project.",
      ),
      why: b(
        "本期刊最新一期有 3 篇直接相關文章。整本訂閱比一篇一篇買省 54 USDC。",
        "The latest issue has 3 articles directly relevant to your topic. A subscription saves 54 USDC vs. buying them individually.",
      ),
      context: b(
        "你的 Cardano 研究任務本月已花 18.4 USDC，預算還剩 31.6。下次月費將在 5/23 自動扣款。",
        "Your Cardano task has spent 18.4 USDC this month with 31.6 left. Next monthly charge would auto-renew on May 23.",
      ),
    },
    risks: [
      { label: b("訂閱類首次扣款", "First subscription charge"), severity: "amber" },
      { label: b("重複扣款警示", "Recurring-payment alert"), severity: "amber" },
      { label: b("本月研究預算 92% 已用", "Research budget 92% spent"), severity: "amber" },
    ],
    outcomes: {
      onApprove: [
        b("立即扣款 35 USDC", "Charge 35 USDC immediately"),
        b("Nature 期刊一年訂閱開通", "Nature subscription activated for one year"),
        b("3 篇相關文章自動存到你的研究資料夾", "3 relevant articles saved to your research folder"),
        b("下次自動扣款 35 USDC 在 5/23", "Next auto-renew of 35 USDC on May 23"),
      ],
      onAdjust: [
        b("暫停這筆，打開規則編輯器", "Pause this and open the rule editor"),
        b("建議規則：訂閱類扣款前一律先通知你", "Suggested rule: always notify before subscription charges"),
        b("修改後可選擇對這筆套用新規則或仍進審核", "After editing, apply to this charge or keep it pending"),
      ],
      onReject: [
        b("訂閱不會發生", "The subscription will not happen"),
        b("研究助理會改用 JSTOR 單篇購買 18 USDC（備案已準備）", "Research will switch to JSTOR per-article at 18 USDC (alternative ready)"),
        b("本月研究預算還剩 31.6 USDC 給其他來源", "31.6 USDC of research budget left for other sources this month"),
      ],
    },
    counterOffer: {
      merchant: b("JSTOR 單篇購買 × 3", "JSTOR × 3 single-article purchases"),
      amount: 18.0,
      why: b(
        "退而求其次：不訂整本 Nature，改用 JSTOR 單獨買這 3 篇，一次付清 18 USDC。這個月用不到第 4 篇的機率是 82%（按你過去的閱讀速度推算）。",
        "Second-best option: skip the full Nature subscription and buy the 3 articles individually on JSTOR for a one-time $18. There's an 82% chance you won't need a 4th this month (based on your reading pace).",
      ),
      triggeredRule: b(
        "Agent 備案．用信任名單網站取代訂閱",
        "Agent counter-offer · allowlisted merchant instead of subscription",
      ),
      merchantTrust: "allowlisted",
    },
  },
  {
    id: "ap_003",
    agent: "shopping",
    agentAvatar: "🛒",
    merchant: b("Amazon Gift Card", "Amazon Gift Card"),
    amount: 30.0,
    currency: "USDC",
    timestamp: "2026-04-23 07:42:19",
    why: b(
      "媽媽生日是 4 月 26 日，她平常都在 Amazon 買園藝用品。30 USDC 的禮物卡跟你去年送她的是一樣的金額。",
      "Mom's birthday is April 26. She usually buys gardening supplies on Amazon. $30 matches the gift card you sent her last year.",
    ),
    context: {
      taskId: b("家人生日禮物清單", "Family birthday gift list"),
      spentOnTask: 0,
      remainingBudget: 120.0,
      merchantTrust: "review",
      similarPastTransactions: 1,
    },
    triggeredRule: b(
      "可儲值類型需人工審核（防止資金轉移濫用）",
      "Stored-value purchase requires manual review (prevents fund-transfer abuse)",
    ),
    severity: "danger",
    reasoning: {
      what: b(
        "採購助理想購買 30 USDC Amazon 禮物卡作為媽媽生日禮物。",
        "Shopping wants to buy a 30 USDC Amazon gift card as a birthday present for your mom.",
      ),
      why: b(
        "媽媽生日 4/26，她常在 Amazon 買園藝用品；金額跟你去年送的禮物卡一樣。",
        "Mom's birthday is Apr 26. She regularly shops gardening supplies on Amazon; amount matches last year's gift card.",
      ),
      context: b(
        "你的「家人生日禮物清單」任務本月還沒花過。媽媽今天還沒收到任何禮物。",
        "Your \"family birthday gift list\" task hasn't spent anything this month yet. Mom hasn't received a gift today.",
      ),
    },
    risks: [
      { label: b("可儲值類型", "Stored-value type"), severity: "coral" },
      { label: b("資金可轉移風險", "Funds can be re-transferred"), severity: "coral" },
      { label: b("首次此商家", "First purchase from this merchant"), severity: "amber" },
    ],
    outcomes: {
      onApprove: [
        b("立即扣款 30 USDC", "Charge 30 USDC immediately"),
        b("Amazon 禮物卡券碼寄到媽媽 email", "Gift card code sent to mom's email"),
        b("採購助理會把交易紀錄送到 Audit", "Shopping will record the transaction in Audit"),
      ],
      onAdjust: [
        b("暫停這筆，打開規則編輯器", "Pause this and open the rule editor"),
        b("建議規則：可儲值類別永久設為人工審核", "Suggested rule: always require manual review for stored-value purchases"),
        b("修改後可選擇對這筆套用新規則或仍進審核", "After editing, apply to this charge or keep it pending"),
      ],
      onReject: [
        b("禮物卡不會發生", "The gift card will not be purchased"),
        b("採購助理會改寄實體花束 28 USDC（備案已準備）", "Shopping will send a real bouquet for 28 USDC instead (alternative ready)"),
        b("媽媽生日禮物還待確認", "Mom's birthday gift remains unconfirmed"),
      ],
    },
    counterOffer: {
      merchant: b("Flower Shop JP", "Flower Shop JP"),
      amount: 28.0,
      why: b(
        "退而求其次：改寄一束實體花束到媽媽家（台中西屯區），28 USDC 含運費，預計 4/25 送達，剛好生日前一天。實體店家風險比禮物卡低、也比較有心意。",
        "Second-best option: send a real bouquet to mom's place (Xitun, Taichung) — $28 including delivery, ETA Apr 25, the day before her birthday. Physical merchant is lower risk than a gift card, and more personal.",
      ),
      triggeredRule: b(
        "Agent 備案．改用非儲值型",
        "Agent counter-offer · non-stored-value merchant",
      ),
      merchantTrust: "first-time",
    },
  },
];

export const auditLog: AuditEntry[] = [
  {
    id: "tx_042",
    timestamp: "2026-04-22 14:33",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("Nature 期刊", "Nature Journal"),
    amount: 12.0,
    decision: "approved",
    approvedBy: "user",
    reasoning: b(
      "你正在研究 Cardano 擴展性，這份單次購買是這個主題最新的技術報告。已比對過去 7 天的閱讀紀錄，主題高度相關。",
      "User is researching Cardano scalability — this one-time purchase covers the latest technical report on the topic. Cross-checked against the past 7 days of reading history, highly relevant.",
    ),
    userAction: b("核准（單次）", "Approved (one-time)"),
    txHash: "0xabc4f1...9e7d",
    gasFee: 0.0034,
  },
  {
    id: "tx_041",
    timestamp: "2026-04-22 11:08",
    agent: "travel",
    agentAvatar: "✈️",
    merchant: b("Booking.com", "Booking.com"),
    amount: 142.0,
    decision: "rejected",
    approvedBy: "user",
    reasoning: b(
      "飯店位於京都市外 12 公里，雖然價格低於附近選項，但通勤時間會超出你偏好的 30 分鐘上限。建議核准但你可能想看其他選項。",
      "Hotel is 12 km outside Kyoto. Cheaper than nearby alternatives but commute exceeds your 30-min preference. I'd approve, but you may want to see other options.",
    ),
    userAction: b("拒絕．要求 agent 重新提案", "Rejected · asked agent to retry"),
    txHash: "—",
    gasFee: 0,
  },
  {
    id: "tx_040",
    timestamp: "2026-04-22 09:15",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("OpenAI API", "OpenAI API"),
    amount: 0.42,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "信任名單網站、低於單筆 5 USDC 限額、本月類別用量 42% 仍在安全區間。",
      "Allowlisted merchant · under $5 per-tx cap · category usage at 42% still within safe range.",
    ),
    txHash: "0xdef2a8...3c91",
    gasFee: 0.0018,
  },
  {
    id: "tx_039",
    timestamp: "2026-04-22 08:47",
    agent: "newsletter",
    agentAvatar: "📰",
    merchant: b("Substack（Lenny's Newsletter）", "Substack (Lenny's Newsletter)"),
    amount: 15.0,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "信任名單網站、訂閱類型已有信任紀錄、本月第一筆此付款對象扣款符合月付頻率。",
      "Allowlisted merchant · trusted subscription type · first charge this month matches expected monthly cadence.",
    ),
    txHash: "0x882ef1...4b12",
    gasFee: 0.0021,
  },
  {
    id: "tx_038",
    timestamp: "2026-04-21 22:14",
    agent: "shopping",
    agentAvatar: "🛒",
    merchant: b("meme-nft-drop.xyz", "meme-nft-drop.xyz"),
    amount: 48.0,
    decision: "rejected",
    approvedBy: "system",
    reasoning: b(
      "偵測到付款對象未通過身分驗證且手續費異常（佔交易額 18%）。已自動加入封鎖名單。",
      "Detected an unverified merchant with abnormally high fees (18% of transaction). Auto-blocklisted.",
    ),
    userAction: b("系統自動拒絕", "System auto-rejected"),
    txHash: "—",
    gasFee: 0,
  },
  {
    id: "tx_037",
    timestamp: "2026-04-21 18:02",
    agent: "travel",
    agentAvatar: "✈️",
    merchant: b("JR 東日本", "JR East Japan"),
    amount: 89.4,
    decision: "approved",
    approvedBy: "user",
    reasoning: b(
      "京都賞櫻行程的新幹線票，已比對時間與你的日曆。",
      "Shinkansen ticket for the Kyoto cherry-blossom trip. Cross-checked with your calendar.",
    ),
    userAction: b("核准並加入信任名單", "Approved & allowlisted"),
    txHash: "0x553cb9...7a22",
    gasFee: 0.0029,
  },
  {
    id: "tx_036",
    timestamp: "2026-04-21 14:35",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("Anthropic API", "Anthropic API"),
    amount: 0.87,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "信任名單網站、符合本月 API 類別用量。",
      "Allowlisted merchant · within this month's API-category budget.",
    ),
    txHash: "0x7712da...8801",
    gasFee: 0.0017,
  },
  {
    id: "tx_035",
    timestamp: "2026-04-21 10:22",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("JSTOR", "JSTOR"),
    amount: 0.25,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "信任名單網站、單次論文查詢。",
      "Allowlisted merchant · one-off article lookup.",
    ),
    txHash: "0x21abb3...0055",
    gasFee: 0.0014,
  },
  {
    id: "tx_034",
    timestamp: "2026-04-21 09:00",
    agent: "newsletter",
    agentAvatar: "📰",
    merchant: b("Stratechery", "Stratechery"),
    amount: 12.0,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "信任名單網站、月付第一次扣款符合頻率。",
      "Allowlisted merchant · first monthly charge matches expected cadence.",
    ),
    txHash: "0x998ec1...2344",
    gasFee: 0.0019,
  },
  {
    id: "tx_033",
    timestamp: "2026-04-20 21:47",
    agent: "shopping",
    agentAvatar: "🛒",
    merchant: b("Uniqlo JP", "Uniqlo JP"),
    amount: 28.0,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "低於實體購買單筆 100 USDC 限額、符合你提供的賞櫻行前採購清單。",
      "Under the $100 physical-purchase per-tx cap · matches your pre-trip shopping list.",
    ),
    txHash: "0x4421fe...aa1d",
    gasFee: 0.0031,
  },
  {
    id: "tx_032",
    timestamp: "2026-04-20 15:12",
    agent: "travel",
    agentAvatar: "✈️",
    merchant: b("Klook Tokyo", "Klook Tokyo"),
    amount: 42.0,
    decision: "approved",
    approvedBy: "user",
    reasoning: b(
      "淺草寺導覽票券，符合你的行程偏好（文化 + 步行導覽 < 3 小時）。",
      "Senso-ji guided tour ticket — matches your itinerary preferences (cultural, walking tour under 3 hours).",
    ),
    userAction: b("核准（單次）", "Approved (one-time)"),
    txHash: "0x18ddca...5f02",
    gasFee: 0.0024,
  },
  {
    id: "tx_031",
    timestamp: "2026-04-20 11:33",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("Perplexity Pro", "Perplexity Pro"),
    amount: 0.2,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b("信任名單網站、使用量正常。", "Allowlisted merchant · usage within normal range."),
    txHash: "0x77aacd...9911",
    gasFee: 0.0013,
  },
  {
    id: "tx_030",
    timestamp: "2026-04-20 08:40",
    agent: "newsletter",
    agentAvatar: "📰",
    merchant: b("The Information", "The Information"),
    amount: 10.0,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b("信任名單網站、月付。", "Allowlisted merchant · monthly subscription."),
    txHash: "0x556fde...1e02",
    gasFee: 0.0022,
  },
  {
    id: "tx_029",
    timestamp: "2026-04-19 19:15",
    agent: "research",
    agentAvatar: "🧠",
    merchant: b("NYT", "NYT"),
    amount: 0.05,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "信任名單網站、單篇付費閱讀。",
      "Allowlisted merchant · single-article pay-per-read.",
    ),
    txHash: "0x99eedd...2203",
    gasFee: 0.0011,
  },
  {
    id: "tx_028",
    timestamp: "2026-04-19 14:02",
    agent: "travel",
    agentAvatar: "✈️",
    merchant: b("Uber Japan", "Uber Japan"),
    amount: 12.3,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "低於實體購買單筆限額、符合行程中機場接送規劃。",
      "Under physical-purchase per-tx cap · matches airport-transfer plan in your itinerary.",
    ),
    txHash: "0x3c0ab1...7788",
    gasFee: 0.0016,
  },
];

export const stats = {
  activeAgents: agents.filter((a) => a.status === "active").length,
  totalAgents: agents.length,
  todaySpent: 8.73,
  todayTransactions: 47,
  yesterdayDeltaPct: -28,
  /** Hours of user time reclaimed today by agent automation. Used in the
      dashboard greeting sub-copy. */
  hoursSaved: 2.4,
  monthSpent: agents.reduce((sum, a) => sum + a.monthlySpent, 0),
  monthBudget: agents.reduce((sum, a) => sum + a.monthlyBudget, 0),
  pendingCount: pendingApprovals.length,
};
