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
  /** Mock source platform. This is product-facing provider awareness only:
   *  the prototype does not connect to these APIs. */
  platform: string;
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
  sampleMerchants?: Bilingual[];
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
  approvalReason?: Bilingual;
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
  approvalReason: Bilingual;
  severity: "info" | "warning" | "danger";
  riskProfile?: {
    actionType: Bilingual;
    asset: string;
    amount: string;
    destination: Bilingual;
    triggeredRule: Bilingual;
    riskLevel: Bilingual;
    userDecision: Bilingual;
  };
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
  /** Set only on system auto-approved entries; drives the audit
   *  reverse-link to the governing CategoryRuleCard. */
  sourceCategoryId?: string;
};

export const agents: Agent[] = [
  {
    id: "a1",
    name: "research",
    displayName: "訂閱助理",
    avatar: "📰",
    platform: "Subscription AI",
    role: b("SaaS 訂閱與服務費", "SaaS subscriptions and service fees"),
    status: "active",
    monthlySpent: 640,
    monthlyBudget: 2000,
  },
  {
    id: "a2",
    name: "travel",
    displayName: "付款助理",
    avatar: "💸",
    platform: "Payment AI",
    role: b("合作方錢包付款", "Vendor and contractor wallet payments"),
    status: "active",
    monthlySpent: 200,
    monthlyBudget: 3000,
  },
  {
    id: "a3",
    name: "shopping",
    displayName: "安全助理",
    avatar: "🛡️",
    platform: "Risk Agent",
    role: b("提領與新地址檢查", "Withdrawals and new-address checks"),
    status: "paused",
    monthlySpent: 1000,
    monthlyBudget: 2500,
  },
  {
    id: "a4",
    name: "newsletter",
    displayName: "監控助理",
    avatar: "📊",
    platform: "Monitor Agent",
    role: b("預算監控與異常告警", "Budget monitoring and anomaly alerts"),
    status: "active",
    monthlySpent: 0,
    monthlyBudget: 0,
  },
];

export function getAgentPlatform(agentName: string): string {
  return agents.find((agent) => agent.name === agentName)?.platform ?? "Custom agent";
}

const agentPlatformLabels: Record<string, Bilingual> = {
  research: b("訂閱模組", "Subscription AI"),
  travel: b("付款模組", "Payment AI"),
  shopping: b("風控模組", "Risk Agent"),
  newsletter: b("監控模組", "Monitor Agent"),
};

export function getAgentPlatformLabel(agentName: string, locale: keyof Bilingual): string {
  return agentPlatformLabels[agentName]?.[locale] ?? getAgentPlatform(agentName);
}

export const categories: Category[] = [
  {
    id: "subscription",
    name: b("訂閱與服務費", "Subscriptions & service fees"),
    description: b("SaaS 訂閱、API 服務費、交易工具月費", "SaaS subscriptions, API service fees, and trading tool monthly fees"),
    monthlyLimit: 2000,
    singleLimit: 300,
    spent: 640,
    isSystem: true,
    sampleMerchants: [b("Notion", "Notion"), b("TradingView Pro", "TradingView Pro"), b("Anthropic API", "Anthropic API")],
  },
  {
    id: "vendor",
    name: b("合作方付款", "Vendor payments"),
    description: b("供應商錢包、自由工作者、外包服務的付款", "Vendor wallets, freelancer wallets, and contracted services"),
    monthlyLimit: 3000,
    singleLimit: 500,
    spent: 200,
    isSystem: true,
    sampleMerchants: [b("Acme 供應商錢包", "Acme vendor wallet"), b("Base 營運錢包", "Base ops wallet"), b("自由工作者錢包", "Freelancer wallet")],
  },
  {
    id: "physical",
    name: b("提領到新地址", "Withdrawals to new addresses"),
    description: b("外部錢包地址、白名單地址與大額提領", "External wallets, allowlisted addresses, and large withdrawals"),
    monthlyLimit: 2500,
    singleLimit: 500,
    spent: 1000,
    isSystem: true,
    sampleMerchants: [b("財務冷錢包", "Finance cold wallet"), b("已信任冷錢包", "Allowlisted cold wallet"), b("新外部地址", "New external address")],
  },
];

export type TrustList = {
  allowlist: { merchant: string; category: string; addedAt: string }[];
  blocklist: { merchant: string; reason: Bilingual; addedAt: string }[];
  review: { merchant: string; category: string; since: string }[];
};

export const trustList: TrustList = {
  allowlist: [
    { merchant: "Notion", category: "subscription", addedAt: "2026-03-14" },
    { merchant: "TradingView Pro", category: "subscription", addedAt: "2026-02-01" },
    { merchant: "Anthropic API", category: "subscription", addedAt: "2026-03-18" },
    { merchant: "OpenAI API", category: "subscription", addedAt: "2026-01-22" },
    { merchant: "Stripe", category: "subscription", addedAt: "2026-03-02" },
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
    { merchant: "Acme 供應商錢包", category: "vendor", since: "2026-04-22" },
    { merchant: "Base 營運錢包", category: "vendor", since: "2026-04-20" },
    { merchant: "財務冷錢包", category: "physical", since: "2026-04-18" },
  ],
};

export const liveFeed: FeedItem[] = [
  {
    id: "f1",
    time: "23:19",
    agent: "shopping",
    agentAvatar: "🛡️",
    merchant: b("提領到財務冷錢包", "Withdraw to finance cold wallet"),
    amount: 1000.0,
    status: "pending",
    reason: b("新地址大額提領", "Large withdrawal to new address"),
    approvalReason: b("新地址大額提領需要人工審核", "Large withdrawal to a new address requires manual review"),
    relative: b("剛剛", "just now"),
  },
  {
    id: "f2",
    time: "23:17",
    agent: "travel",
    agentAvatar: "💸",
    merchant: b("付款給 Acme 供應商錢包", "Pay Acme vendor wallet"),
    amount: 200.0,
    status: "pending",
    reason: b("首次合作方付款", "First-time vendor payment"),
    approvalReason: b("新合作方錢包首次付款需要審核", "First-time payment to new vendor wallet requires review"),
    relative: b("2 分鐘前", "2 min ago"),
  },
  {
    id: "f3",
    time: "23:14",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("Notion 訂閱續費（漲價）", "Notion subscription renewal (price up)"),
    amount: 120.0,
    status: "pending",
    reason: b("高於單筆自動付款上限", "Above per-payment auto cap"),
    approvalReason: b("Notion 漲價後超出單筆自動付款上限", "Notion price increase exceeds the auto-payment cap"),
    relative: b("5 分鐘前", "5 min ago"),
  },
  {
    id: "f4",
    time: "23:12",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("TradingView Pro 年費", "TradingView Pro annual"),
    amount: 468.0,
    status: "pending",
    reason: b("一次性扣款超出月限額", "One-off charge exceeds monthly cap"),
    approvalReason: b("年費超出訂閱類別月限額", "Annual fee exceeds subscription monthly cap"),
    relative: b("7 分鐘前", "7 min ago"),
  },
  {
    id: "f5",
    time: "23:10",
    agent: "shopping",
    agentAvatar: "🛡️",
    merchant: b("Base 營運錢包加入信任名單", "Add Base ops wallet to allowlist"),
    amount: 0,
    status: "pending",
    reason: b("過去 30 天出現 4 次", "Appeared 4× in past 30 days"),
    approvalReason: b("頻繁出現的合作方錢包建議加入信任名單", "Frequent vendor wallet suggested for allowlist"),
    relative: b("9 分鐘前", "9 min ago"),
  },
  {
    id: "f6",
    time: "23:05",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("Anthropic API 服務費", "Anthropic API service fee"),
    amount: 0.87,
    status: "auto-approved",
    reason: b("已信任 + 低於單筆上限", "Allowlisted · under cap"),
    relative: b("14 分鐘前", "14 min ago"),
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
    agent: "shopping",
    agentAvatar: "🛡️",
    merchant: b("提領 1,000 USDC 到財務冷錢包", "Withdraw 1,000 USDC · Finance cold wallet"),
    amount: 1000,
    currency: "USDC",
    timestamp: "2026-04-23 09:08:12",
    why: b(
      "安全助理收到提領請求，要把 1,000 USDC 送到你標記的「財務冷錢包」。",
      "The security agent received a withdrawal request to send 1,000 USDC to a new external address marked as your finance cold wallet.",
    ),
    context: {
      taskId: b("新地址提領檢查", "New-address withdrawal review"),
      spentOnTask: 0,
      remainingBudget: 1500,
      merchantTrust: "first-time",
      similarPastTransactions: 0,
    },
    triggeredRule: b("新地址 + 提領金額超過 500 USDC", "New address + withdrawal exceeds 500 USDC"),
    approvalReason: b("新地址大額提領需要人工審核", "Large withdrawal to a new address requires manual review"),
    severity: "danger",
    riskProfile: {
      actionType: b("提領", "Withdrawal"),
      asset: "USDC",
      amount: "1,000 USDC",
      destination: b("財務冷錢包（0x9A...21F）", "Finance cold wallet (0x9A...21F)"),
      triggeredRule: b("新地址提領 > 500 USDC", "New-address withdrawal > 500 USDC"),
      riskLevel: b("高", "High"),
      userDecision: b("等待使用者核准", "Awaiting user decision"),
    },
    reasoning: {
      what: b(
        "安全助理收到一筆提領到「財務冷錢包」的請求。",
        "Agent wants to withdraw 1,000 USDC to a new address marked as your finance cold wallet.",
      ),
      why: b(
        "這是資金離開帳戶的高風險操作，目的地地址沒有歷史紀錄。",
        "This is a high-risk action because funds leave the account and the destination has no history.",
      ),
      context: b(
        "地址尚未在白名單中，過去 30 天沒有類似提領。",
        "The address is not allowlisted and there were no similar withdrawals in the past 30 days.",
      ),
    },
    risks: [
      { label: b("新地址", "New address"), severity: "coral" },
      { label: b("資金離開帳戶", "Funds leave account"), severity: "coral" },
      { label: b("大額提領", "Large withdrawal"), severity: "coral" },
    ],
    outcomes: {
      onApprove: [
        b("送出 1,000 USDC 提領", "Submit the 1,000 USDC withdrawal"),
        b("新地址會被記錄為本次審核通過", "New address is recorded as reviewed for this action"),
        b("提領結果寫入 Audit Trail", "Withdrawal result is written to Audit Trail"),
      ],
      onAdjust: [
        b("暫停這筆，檢查地址白名單", "Pause this and review address allowlisting"),
        b("可改成先小額測試 10 USDC", "You can require a 10 USDC test withdrawal first"),
      ],
      onReject: [
        b("提領不會發生", "The withdrawal will not happen"),
        b("安全助理會標記此地址需要重新驗證", "Security agent flags the address for re-verification"),
      ],
    },
  },
  {
    id: "ap_002",
    agent: "travel",
    agentAvatar: "💸",
    merchant: b("付款 200 USDC 給 Acme 供應商錢包", "Pay 200 USDC to Acme vendor wallet"),
    amount: 200,
    currency: "USDC",
    timestamp: "2026-04-23 08:44:03",
    why: b(
      "付款助理想用 USDC 支付 Acme 供應商這個月的服務費。這是首次付款給這個錢包，需要你確認。",
      "The payment agent wants to pay Acme vendor's monthly service fee in USDC. First-time payment to this wallet, needs your confirmation.",
    ),
    context: {
      taskId: b("合作方付款", "Vendor payment"),
      spentOnTask: 0,
      remainingBudget: 2800,
      merchantTrust: "first-time",
      similarPastTransactions: 0,
    },
    triggeredRule: b("首次合作方錢包付款需要審核", "First-time vendor wallet payment requires review"),
    approvalReason: b("新合作方錢包首次付款需要審核", "First-time payment to a new vendor wallet requires review"),
    severity: "warning",
    riskProfile: {
      actionType: b("付款", "Payment"),
      asset: "USDC",
      amount: "200 USDC",
      destination: b("Acme 供應商錢包（0x4f...c2a）", "Acme vendor wallet (0x4f...c2a)"),
      triggeredRule: b("首次合作方付款", "First-time vendor payment"),
      riskLevel: b("中", "Medium"),
      userDecision: b("等待使用者核准", "Awaiting user decision"),
    },
    reasoning: {
      what: b(
        "付款助理想付 200 USDC 給 Acme 供應商錢包。",
        "Agent wants to pay 200 USDC to Acme vendor wallet.",
      ),
      why: b(
        "這是首次付款給這個錢包地址，需要你確認對象正確才會放行。",
        "This is the first payment to this wallet address. Needs your confirmation before agent can proceed.",
      ),
      context: b(
        "Acme 是你 3 月新增的合作方，但付款用的錢包地址還沒在信任名單裡。",
        "Acme was added as a vendor in March, but the payment wallet address is not yet on your allowlist.",
      ),
    },
    risks: [
      { label: b("首次付款對象", "First-time payee"), severity: "amber" },
      { label: b("合作方已知", "Known vendor"), severity: "sage" },
      { label: b("低於單筆上限", "Under per-payment cap"), severity: "sage" },
    ],
    outcomes: {
      onApprove: [
        b("立即支付 200 USDC", "Pay 200 USDC immediately"),
        b("Acme 供應商錢包收到資金", "Acme vendor wallet receives the funds"),
        b("付款紀錄寫入 Audit Trail", "Payment is written to Audit Trail"),
      ],
      onAdjust: [
        b("暫停這筆，把 Acme 加入信任名單", "Pause this and add Acme to allowlist"),
        b("加入後同類付款可自動處理", "Future payments to Acme can be auto-processed"),
      ],
      onReject: [
        b("付款不會發生", "The payment will not happen"),
        b("付款助理會標記此錢包需要重新驗證", "Payment agent flags this wallet for re-verification"),
      ],
    },
  },
  {
    id: "ap_003",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("Notion 訂閱續費（漲價）", "Notion subscription renewal (price up)"),
    amount: 120,
    currency: "USDC",
    timestamp: "2026-04-23 08:12:19",
    why: b(
      "Notion 從這個月起漲價，本期帳單從 100 USDC 變成 120 USDC，超過你設定的單筆自動付款上限。",
      "Notion's price went up this month from 100 USDC to 120 USDC, which now exceeds your per-payment auto cap.",
    ),
    context: {
      taskId: b("Notion 訂閱付款", "Notion subscription payment"),
      spentOnTask: 100,
      remainingBudget: 1880,
      merchantTrust: "allowlisted",
      similarPastTransactions: 6,
    },
    triggeredRule: b("單筆訂閱付款超過 100 USDC 需審核", "Single subscription payment over 100 USDC requires review"),
    approvalReason: b("訂閱漲價超出單筆自動付款上限", "Subscription price increase exceeds the auto-payment cap"),
    severity: "info",
    riskProfile: {
      actionType: b("訂閱付款", "Subscription payment"),
      asset: "USDC",
      amount: "120 USDC",
      destination: b("Notion", "Notion"),
      triggeredRule: b("單筆訂閱付款上限 100 USDC", "Subscription per-payment cap: 100 USDC"),
      riskLevel: b("低", "Low"),
      userDecision: b("等待使用者核准", "Awaiting user decision"),
    },
    reasoning: {
      what: b(
        "訂閱助理想支付 Notion 本期 120 USDC 訂閱費。",
        "Agent wants to pay Notion's 120 USDC subscription this period.",
      ),
      why: b(
        "Notion 漲價後超過自動付款上限，需要你確認新的金額。",
        "Notion's price increase exceeds the auto-payment cap. Needs your confirmation on the new amount.",
      ),
      context: b(
        "Notion 在你的信任名單，過去 6 期都自動付款成功。",
        "Notion is on your allowlist and the past 6 payments were auto-approved successfully.",
      ),
    },
    risks: [
      { label: b("已信任付款對象", "Allowlisted payee"), severity: "sage" },
      { label: b("略高於單筆上限", "Slightly over per-payment cap"), severity: "amber" },
      { label: b("月限額仍充足", "Monthly cap still has room"), severity: "sage" },
    ],
    outcomes: {
      onApprove: [
        b("立即支付 120 USDC 給 Notion", "Pay 120 USDC to Notion immediately"),
        b("Notion 服務維持啟用", "Notion service remains active"),
        b("付款紀錄寫入 Audit Trail", "Payment is written to Audit Trail"),
      ],
      onAdjust: [
        b("暫停這筆，調高訂閱單筆上限", "Pause this and raise the subscription per-payment cap"),
        b("可把上限從 100 USDC 改成 125 USDC", "You can raise the cap from 100 to 125 USDC"),
      ],
      onReject: [
        b("這期不會付款", "This payment will not be made"),
        b("Notion 服務會在下個結帳日停用", "Notion service may be deactivated at next billing"),
      ],
    },
  },
  {
    id: "ap_004",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("TradingView Pro 年費", "TradingView Pro annual"),
    amount: 468,
    currency: "USDC",
    timestamp: "2026-04-23 07:58:41",
    why: b(
      "TradingView Pro 改成年付方案，一次性扣 468 USDC，超過訂閱類別月限額（2,000）的單筆比例。",
      "TradingView Pro switched to annual billing, charging 468 USDC at once. Exceeds the typical proportion of monthly subscription cap.",
    ),
    context: {
      taskId: b("年費訂閱付款", "Annual subscription payment"),
      spentOnTask: 0,
      remainingBudget: 1532,
      merchantTrust: "allowlisted",
      similarPastTransactions: 1,
    },
    triggeredRule: b("年費單筆扣款超過月限額 20%", "Annual one-off charge exceeds 20% of monthly cap"),
    approvalReason: b("一次性年費扣款超過單期上限", "One-off annual charge exceeds per-period cap"),
    severity: "warning",
    riskProfile: {
      actionType: b("訂閱付款", "Subscription payment"),
      asset: "USDC",
      amount: "468 USDC",
      destination: b("TradingView Pro", "TradingView Pro"),
      triggeredRule: b("年費 > 月限額 20%", "Annual fee > 20% of monthly cap"),
      riskLevel: b("中", "Medium"),
      userDecision: b("等待使用者核准", "Awaiting user decision"),
    },
    reasoning: {
      what: b(
        "訂閱助理想一次支付 TradingView Pro 一年的訂閱費 468 USDC。",
        "Agent wants to pay TradingView Pro 468 USDC for one year of subscription.",
      ),
      why: b(
        "年付方案比月付便宜 20%，但一次性扣款超過你設定的單期付款上限。",
        "Annual billing is 20% cheaper than monthly, but the one-off charge exceeds your per-period cap.",
      ),
      context: b(
        "TradingView 在你的信任名單，過去都是月付。年付會省下約 92 USDC。",
        "TradingView is allowlisted and was paid monthly before. Annual saves roughly 92 USDC.",
      ),
    },
    risks: [
      { label: b("已信任付款對象", "Allowlisted payee"), severity: "sage" },
      { label: b("一次性大額扣款", "Large one-off charge"), severity: "amber" },
      { label: b("年付省 92 USDC", "Annual saves 92 USDC"), severity: "sage" },
    ],
    outcomes: {
      onApprove: [
        b("立即支付 468 USDC 年費", "Pay 468 USDC for annual subscription"),
        b("TradingView Pro 服務維持一年", "TradingView Pro stays active for a year"),
        b("付款紀錄寫入 Audit Trail", "Payment is written to Audit Trail"),
      ],
      onAdjust: [
        b("暫停這筆，改回月付方案", "Pause this and switch back to monthly billing"),
        b("月付每月 49 USDC，會在訂閱類別內", "Monthly 49 USDC fits within the subscription cap"),
      ],
      onReject: [
        b("年費不會付款", "The annual fee will not be paid"),
        b("訂閱助理會提醒月付到期日", "Subscription agent will keep monthly billing on track"),
      ],
    },
  },
  {
    id: "ap_005",
    agent: "travel",
    agentAvatar: "💸",
    merchant: b("付款 350 USDC 給自由工作者錢包", "Pay 350 USDC to freelancer wallet"),
    amount: 350,
    currency: "USDC",
    timestamp: "2026-04-23 07:31:22",
    why: b(
      "付款助理想付 350 USDC 給接案的自由工作者，但這個錢包地址第一次出現，需要你確認對象正確。",
      "The payment agent wants to pay 350 USDC to a freelancer for this month's work. The wallet address appears for the first time and needs your confirmation.",
    ),
    context: {
      taskId: b("自由工作者月費", "Freelancer monthly fee"),
      spentOnTask: 0,
      remainingBudget: 2650,
      merchantTrust: "first-time",
      similarPastTransactions: 0,
    },
    triggeredRule: b("首次付款 + 金額超過 250 USDC", "First-time payment + amount exceeds 250 USDC"),
    approvalReason: b("首次合作對象付款金額較大需要審核", "Larger first-time payment requires review"),
    severity: "warning",
    riskProfile: {
      actionType: b("付款", "Payment"),
      asset: "USDC",
      amount: "350 USDC",
      destination: b("自由工作者錢包（0xa3...b4f）", "Freelancer wallet (0xa3...b4f)"),
      triggeredRule: b("首次付款且金額 > 250 USDC", "First-time payment > 250 USDC"),
      riskLevel: b("中", "Medium"),
      userDecision: b("等待使用者核准", "Awaiting user decision"),
    },
    reasoning: {
      what: b(
        "付款助理想付 350 USDC 給自由工作者錢包。",
        "Agent wants to pay 350 USDC to a freelancer wallet.",
      ),
      why: b(
        "錢包地址過去 30 天沒有歷史紀錄，金額也高於首次付款的自動處理上限。",
        "The wallet has no history in the past 30 days and the amount exceeds the auto-process threshold for first-time payments.",
      ),
      context: b(
        "付款記錄是「4 月接案費用」，跟你 4 月初批准的工作項目相符。",
        "Payment memo says \"April project fee\" which matches the work item you approved in early April.",
      ),
    },
    risks: [
      { label: b("首次付款對象", "First-time payee"), severity: "amber" },
      { label: b("金額較大", "Larger amount"), severity: "amber" },
      { label: b("付款記錄相符", "Memo matches"), severity: "sage" },
    ],
    outcomes: {
      onApprove: [
        b("立即支付 350 USDC", "Pay 350 USDC immediately"),
        b("自由工作者錢包收到資金", "Freelancer wallet receives the funds"),
        b("付款紀錄寫入 Audit Trail", "Payment is written to Audit Trail"),
      ],
      onAdjust: [
        b("暫停這筆，要求 agent 拆成兩次付款", "Pause this and ask agent to split into two payments"),
        b("拆成 175 + 175 USDC 可以走自動處理", "175 + 175 USDC each falls within auto-process"),
      ],
      onReject: [
        b("付款不會發生", "The payment will not happen"),
        b("付款助理會請你重新確認對象", "Payment agent will ask you to re-verify the payee"),
      ],
    },
  },
];

export const auditLog: AuditEntry[] = [
  {
    id: "tx_042",
    timestamp: "2026-04-22 14:33",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("Notion 訂閱續費", "Notion subscription renewal"),
    amount: 12.0,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "已信任付款對象、本月第一筆 Notion 扣款符合月付頻率、低於訂閱類別單筆上限。",
      "Allowlisted payee · first monthly Notion charge matches expected cadence · under subscription per-payment cap.",
    ),
    txHash: "0xabc4f1...9e7d",
    gasFee: 0.0034,
    sourceCategoryId: "subscription",
  },
  {
    id: "tx_041",
    timestamp: "2026-04-22 11:08",
    agent: "shopping",
    agentAvatar: "🛡️",
    merchant: b("提領 142 USDC 到 0x4f...c2a", "Withdraw 142 USDC to 0x4f...c2a"),
    amount: 142.0,
    decision: "rejected",
    approvedBy: "user",
    reasoning: b(
      "金額在限額內，但目的地是新地址且過去 30 天沒有歷史紀錄。建議先加入信任名單再放行。",
      "Amount within cap, but destination is a new address with no history in the past 30 days. Suggested allowlisting first.",
    ),
    userAction: b("拒絕．要求重新驗證地址", "Rejected · asked to re-verify address"),
    txHash: "—",
    gasFee: 0,
  },
  {
    id: "tx_040",
    timestamp: "2026-04-22 09:15",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("Anthropic API 服務費", "Anthropic API service fee"),
    amount: 0.42,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "已信任 + 低於單筆 5 USDC 上限 + 本月訂閱類別用量 32% 仍在安全範圍。",
      "Allowlisted · under 5 USDC per-payment cap · subscription category at 32%, within safe range.",
    ),
    txHash: "0xdef2a8...3c91",
    gasFee: 0.0018,
    sourceCategoryId: "subscription",
  },
  {
    id: "tx_039",
    timestamp: "2026-04-22 08:47",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("TradingView Pro 月費", "TradingView Pro monthly"),
    amount: 49.0,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "已信任付款對象、月付第一次扣款符合頻率、低於訂閱類別單筆上限。",
      "Allowlisted · first monthly charge matches expected cadence · under subscription per-payment cap.",
    ),
    txHash: "0x882ef1...4b12",
    gasFee: 0.0021,
    sourceCategoryId: "subscription",
  },
  {
    id: "tx_038",
    timestamp: "2026-04-21 22:14",
    agent: "shopping",
    agentAvatar: "🛡️",
    merchant: b("封鎖 fast-cash-loan.io", "Block fast-cash-loan.io"),
    amount: 48.0,
    decision: "rejected",
    approvedBy: "system",
    reasoning: b(
      "偵測到付款對象未驗證且手續費異常（佔交易額 18%），自動加入封鎖名單。",
      "Detected an unverified payee with abnormally high fees (18% of transaction). Auto-blocklisted.",
    ),
    userAction: b("系統自動拒絕", "System auto-rejected"),
    txHash: "—",
    gasFee: 0,
  },
  {
    id: "tx_037",
    timestamp: "2026-04-21 18:02",
    agent: "travel",
    agentAvatar: "💸",
    merchant: b("付款給 Acme 供應商錢包", "Pay Acme vendor wallet"),
    amount: 89.4,
    decision: "approved",
    approvedBy: "user",
    reasoning: b(
      "首次付款給 Acme 對接窗口提供的錢包地址，已驗證金額和對象與工單相符。",
      "First-time payment to the wallet address Acme provided. Verified amount and payee against the work order.",
    ),
    userAction: b("核准並加入信任名單", "Approved & allowlisted"),
    txHash: "0x553cb9...7a22",
    gasFee: 0.0029,
    sourceCategoryId: "vendor",
  },
  {
    id: "tx_036",
    timestamp: "2026-04-21 14:35",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("OpenAI API 服務費", "OpenAI API service fee"),
    amount: 0.87,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "已信任、本月訂閱類別用量正常。",
      "Allowlisted · subscription category usage normal this month.",
    ),
    txHash: "0x7712da...8801",
    gasFee: 0.0017,
    sourceCategoryId: "subscription",
  },
  {
    id: "tx_035",
    timestamp: "2026-04-21 10:22",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("Stripe 月費", "Stripe monthly"),
    amount: 25.0,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "已信任金流服務、月付符合頻率。",
      "Allowlisted payment service · monthly charge matches cadence.",
    ),
    txHash: "0x21abb3...0055",
    gasFee: 0.0014,
    sourceCategoryId: "subscription",
  },
  {
    id: "tx_034",
    timestamp: "2026-04-21 09:00",
    agent: "shopping",
    agentAvatar: "🛡️",
    merchant: b("提領 10 USDC 到財務冷錢包（測試）", "Test withdraw 10 USDC to finance cold wallet"),
    amount: 10.0,
    decision: "approved",
    approvedBy: "user",
    reasoning: b(
      "首次新地址提領前的小額測試，金額符合測試規則，準備驗證地址後再放行大額。",
      "Small test withdrawal to a new address before larger payments. Matches the test-first rule for new addresses.",
    ),
    userAction: b("核准（測試用途）", "Approved (test)"),
    txHash: "0x998ec1...2344",
    gasFee: 0.0019,
    sourceCategoryId: "physical",
  },
  {
    id: "tx_033",
    timestamp: "2026-04-20 21:47",
    agent: "travel",
    agentAvatar: "💸",
    merchant: b("付款給 Base 營運錢包", "Pay Base ops wallet"),
    amount: 28.0,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "已信任合作方錢包、低於合作方付款單筆 50 USDC 自動處理上限。",
      "Allowlisted vendor wallet · under the 50 USDC auto-process cap for vendor payments.",
    ),
    txHash: "0x4421fe...aa1d",
    gasFee: 0.0031,
    sourceCategoryId: "vendor",
  },
  {
    id: "tx_032",
    timestamp: "2026-04-20 15:12",
    agent: "shopping",
    agentAvatar: "🛡️",
    merchant: b("加 Base 營運錢包到信任名單", "Allowlist Base ops wallet"),
    amount: 0,
    decision: "approved",
    approvedBy: "user",
    reasoning: b(
      "過去 30 天出現 5 次合作方付款，建議加入信任名單以加速後續處理。",
      "Vendor wallet appeared 5× in past 30 days. Suggested allowlisting to speed up future payments.",
    ),
    userAction: b("核准．加入信任名單", "Approved · allowlisted"),
    txHash: "—",
    gasFee: 0,
  },
  {
    id: "tx_031",
    timestamp: "2026-04-20 11:33",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("OpenAI API 小額查詢", "OpenAI API small query"),
    amount: 0.2,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b("已信任、使用量正常。", "Allowlisted · usage within normal range."),
    txHash: "0x77aacd...9911",
    gasFee: 0.0013,
    sourceCategoryId: "subscription",
  },
  {
    id: "tx_030",
    timestamp: "2026-04-20 08:40",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("GitHub Copilot 月費", "GitHub Copilot monthly"),
    amount: 10.0,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b("已信任、月付符合頻率。", "Allowlisted · monthly charge matches cadence."),
    txHash: "0x556fde...1e02",
    gasFee: 0.0022,
    sourceCategoryId: "subscription",
  },
  {
    id: "tx_029",
    timestamp: "2026-04-19 19:15",
    agent: "research",
    agentAvatar: "📰",
    merchant: b("Anthropic API 服務費", "Anthropic API service fee"),
    amount: 0.05,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "已信任、單次小額查詢、低於 5 USDC 自動處理上限。",
      "Allowlisted · small one-off query · under 5 USDC auto-process cap.",
    ),
    txHash: "0x99eedd...2203",
    gasFee: 0.0011,
    sourceCategoryId: "subscription",
  },
  {
    id: "tx_028",
    timestamp: "2026-04-19 14:02",
    agent: "travel",
    agentAvatar: "💸",
    merchant: b("付款給自由工作者錢包 0xa3...b4f", "Pay freelancer wallet 0xa3...b4f"),
    amount: 175.0,
    decision: "auto-approved",
    approvedBy: "system",
    reasoning: b(
      "已加入信任名單、低於合作方付款單筆 250 USDC 自動處理上限。",
      "Allowlisted freelancer · under the 250 USDC auto-process cap for vendor payments.",
    ),
    txHash: "0x3c0ab1...7788",
    gasFee: 0.0016,
    sourceCategoryId: "vendor",
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
