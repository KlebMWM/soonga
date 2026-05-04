import type { Locale } from "./config";

type Dict = Record<string, { zh: string; en: string }>;

export const dict: Dict = {
  // ==================== Agents ====================
  // Functional names (no human personas). Looked up via
  // `t(\`agent.${id}.name\`)` wherever the agent surfaces in UI text.
  "agent.travel.name": { zh: "付款助理", en: "Payment" },
  "agent.research.name": { zh: "訂閱助理", en: "Subscription" },
  "agent.shopping.name": { zh: "安全助理", en: "Security" },
  "agent.newsletter.name": { zh: "監控助理", en: "Monitor" },

  // ==================== Nav ====================
  "nav.dashboard.label": { zh: "指揮中心", en: "Command Center" },
  "nav.dashboard.sub": { zh: "即時總覽", en: "Live overview" },
  "nav.rules.label": { zh: "花費規則", en: "Rule Engine" },
  "nav.rules.sub": { zh: "額度與信任名單", en: "Budgets & trust lists" },
  "nav.approvals.label": { zh: "待審核", en: "Approvals" },
  "nav.approvals.sub": { zh: "待審核", en: "Waiting on you" },
  "nav.audit.label": { zh: "AI 助理活動紀錄", en: "Agent Activity History" },
  "nav.audit.sub": { zh: "請求與決策", en: "Requests and decisions" },
  "nav.guide.label": { zh: "使用說明", en: "Guide" },
  "nav.guide.sub": { zh: "3 分鐘快速上手", en: "3-minute walkthrough" },

  "nav.mobile.dashboard": { zh: "總覽", en: "Home" },
  "nav.mobile.rules": { zh: "規則", en: "Rules" },
  "nav.mobile.approvals": { zh: "審核", en: "Approvals" },
  "nav.mobile.audit": { zh: "紀錄", en: "History" },
  "nav.mobile.guide": { zh: "說明", en: "Guide" },
  "nav.help.label": { zh: "原型說明", en: "Prototype guide" },
  "nav.exchange.contextTitle": { zh: "Exchange Module · AI Agent", en: "Exchange Module · AI Agent" },
  "nav.exchange.contextBody": {
    zh: "可嵌在 Security Center → AI Agents",
    en: "Fits in Security Center → AI Agents",
  },

  "brand.tagline": { zh: "control hub", en: "control hub" },
  "brand.prototype": { zh: "PROTOTYPE", en: "PROTOTYPE" },
  "brand.prototypeTitle": {
    zh: "互動式產品原型．資料為模擬，不會真的付款",
    en: "Interactive prototype · Mock data — no real payments",
  },

  // ==================== Workspace footer ====================
  "workspace.name": { zh: "Megan's Workspace", en: "Megan's Workspace" },
  "workspace.handle": { zh: "MeganFeng · Pro plan", en: "MeganFeng · Pro plan" },
  /* Compact forms for the redesigned sidebar bottom (user pill) + top-bar. */
  "workspace.shortName": { zh: "Megan", en: "Megan" },
  "workspace.plan": { zh: "PRO · NT", en: "PRO · NT" },
  "nav.section.navigate": { zh: "導覽", en: "Navigate" },
  "brand.prototypeShort": { zh: "PT", en: "PT" },
  "notify.label": { zh: "桌面通知", en: "Desktop alerts" },
  "notify.granted.short": { zh: "已開啟", en: "ON" },
  "notify.denied.short": { zh: "已封鎖", en: "OFF" },
  "notify.default.short": { zh: "待開啟", en: "OFF" },
  "topbar.section.commandCenter": { zh: "指揮中心", en: "COMMAND CENTER" },

  // ==================== Wallet ====================
  "wallet.connect": { zh: "連結錢包", en: "Link wallet" },
  "wallet.connectSub": { zh: "連上鏈上錢包，agent 可以付款給合作方錢包、訂閱服務、外部地址提領", en: "Link your on-chain wallet so agents can pay vendors, subscriptions, and external addresses" },
  "wallet.row.exchange": { zh: "Exchange", en: "Exchange" },
  "wallet.row.onchain": { zh: "On-chain wallet", en: "On-chain wallet" },
  "wallet.row.onchain.notLinked": { zh: "未連結", en: "Not linked" },
  "wallet.row.linkCta": { zh: "連結錢包 ↗", en: "LINK WALLET ↗" },
  "wallet.balance": { zh: "USDC 餘額", en: "USDC balance" },
  "wallet.copyAddress": { zh: "複製地址", en: "Copy address" },
  "wallet.disconnect": { zh: "斷開", en: "Disconnect" },
  "wallet.authorized": { zh: "已授權 4 個 AI 助理使用此錢包", en: "4 agents authorized on this wallet" },
  "wallet.connected": { zh: "錢包已連接", en: "Wallet connected" },
  "wallet.disconnected": { zh: "已中斷錢包連接", en: "Wallet disconnected" },
  "wallet.addressCopied": { zh: "地址已複製", en: "Address copied" },

  // Wallet picker dialog
  "wallet.picker.title": { zh: "連接錢包", en: "Connect a wallet" },
  "wallet.picker.desc": {
    zh: "選一個錢包．你的私鑰只會留在你自己的裝置上．這個原型不會真的連上鏈。",
    en: "Pick a wallet. Your private key stays on your device. This prototype does not actually connect on-chain.",
  },
  "wallet.picker.footer": {
    zh: "🔒 原型展示．Phase 2 會接 wagmi + WalletConnect 做真實連線",
    en: "🔒 Prototype only. Phase 2 will integrate wagmi + WalletConnect for real on-chain connections.",
  },
  "wallet.picker.connecting": { zh: "連接中⋯", en: "Connecting⋯" },
  "wallet.picker.recommended": { zh: "推薦", en: "Recommended" },

  "wallet.provider.coinbase.name": { zh: "Coinbase Wallet", en: "Coinbase Wallet" },
  "wallet.provider.coinbase.desc": {
    zh: "原生支援 x402 / Base．agentic commerce 首選",
    en: "Native x402 / Base support. First choice for agentic commerce",
  },
  "wallet.provider.metamask.name": { zh: "MetaMask", en: "MetaMask" },
  "wallet.provider.metamask.desc": {
    zh: "EVM 生態系最主流的瀏覽器錢包",
    en: "The most popular browser wallet on EVM",
  },
  "wallet.provider.rainbow.name": { zh: "Rainbow", en: "Rainbow" },
  "wallet.provider.rainbow.desc": {
    zh: "行動裝置優先．UI 對消費者友善",
    en: "Mobile-first. Consumer-friendly UI",
  },
  "wallet.provider.walletconnect.name": { zh: "WalletConnect", en: "WalletConnect" },
  "wallet.provider.walletconnect.desc": {
    zh: "掃 QR code 連接任何手機錢包 app",
    en: "Scan a QR code to connect any mobile wallet app",
  },

  // ==================== Dashboard ====================
  "dashboard.eyebrow": { zh: "Command Center", en: "Command Center" },
  "dashboard.tagline": {
    zh: "你制訂規則、行使最終決策，剩下的由 AI 代勞。",
    en: "You set the rules and make the final calls. Agents handle the rest.",
  },
  "dashboard.exchange.title": {
    zh: "soon-ga.agent",
    en: "soon-ga.agent",
  },
  "dashboard.exchange.subtitle": {
    zh: "為交易所與 Web3「錢包」設計的 AI agent 規則控制台",
    en: "Rule console for AI agents on crypto exchanges and Web3 wallets",
  },
  "intro.headline": {
    zh: "Web3 場景下的 AI 助理規則控制台",
    en: "AI agent rule console for Web3 product scenarios",
  },
  "intro.body": {
    zh: "在錢包等 Web3 產品場景下，幫使用者設定 AI 助理可動用的預算和收款方，審核高風險請求，事後查看完整紀錄。",
    en: "In Web3 product scenarios like wallets, set AI agent budgets and recipients, approve risky actions, and review what happened.",
  },
  "intro.cta": { zh: "看看怎麼運作", en: "See how it works" },
  "intro.dismiss": { zh: "收起說明", en: "Dismiss" },
  "dashboard.greeting.morning": {
    zh: "早安 Megan · {time}",
    en: "Good morning, Megan · {time}",
  },
  "dashboard.greeting.afternoon": {
    zh: "午安 Megan · {time}",
    en: "Good afternoon, Megan · {time}",
  },
  "dashboard.greeting.evening": {
    zh: "晚安 Megan · {time}",
    en: "Good evening, Megan · {time}",
  },
  "dashboard.greeting.lateNight": {
    zh: "深夜了 · {time}",
    en: "Still up? · {time}",
  },
  "dashboard.greeting.placeholder": {
    zh: "指揮中心",
    en: "Command Center",
  },
  /* Yesterday's briefing — fulfills the late-night empty-state promise that
     "明早 08:00 會有一份報表". Five-finger view of yesterday's AI activity. */
  "dashboard.briefing.title": { zh: "昨日摘要", en: "Yesterday's briefing" },
  "dashboard.briefing.sub": {
    zh: "{date} · AI 處理動態 + 你的決定",
    en: "{date} · AI activity + your decisions",
  },
  "dashboard.briefing.stat.auto.label": { zh: "自動處理", en: "Auto-handled" },
  "dashboard.briefing.stat.auto.value": {
    zh: "{count} 筆 · {amount} USDC",
    en: "{count} txns · {amount} USDC",
  },
  "dashboard.briefing.stat.you.label": { zh: "你的決定", en: "Your calls" },
  "dashboard.briefing.stat.you.value": {
    zh: "{n} 筆",
    en: "{n} decisions",
  },
  "dashboard.briefing.stat.you.breakdown": {
    zh: "{approved} 核准 · {rejected} 拒絕 · {counter} 找替代",
    en: "{approved} approved · {rejected} rejected · {counter} counter",
  },
  "dashboard.briefing.stat.edge.label": { zh: "險些觸發", en: "Edge cases" },
  "dashboard.briefing.stat.edge.value": {
    zh: "{n} 次",
    en: "{n} hits",
  },
  "dashboard.briefing.stat.edge.sub": {
    zh: "都已被規則擋下",
    en: "All caught by rules",
  },
  "dashboard.briefing.stat.budget.label": { zh: "本月預算", en: "Month budget" },
  "dashboard.briefing.stat.budget.sub": {
    zh: "剩餘 {days} 天",
    en: "{days} days left",
  },
  "dashboard.briefing.highlights": { zh: "幾件值得注意", en: "Worth noting" },
  "dashboard.briefing.highlight.newMerchant": {
    zh: "新收款方「Notion 訂閱」出現過 2 次，可考慮加進信任名單",
    en: "New recipient Notion subscription appeared 2× — consider allowlisting",
  },
  "dashboard.briefing.highlight.budgetWarning": {
    zh: "訂閱助理本月已用 78% 訂閱類別額度，月底前小心預算",
    en: "Subscription agent at 78% of monthly subscription budget — watch the rest of the month",
  },
  "dashboard.briefing.highlight.agentPaused": {
    zh: "安全助理整天無提領請求（目前處於暫停狀態）",
    en: "Security agent had no withdrawal requests (currently paused)",
  },
  "dashboard.briefing.suggestion.label": { zh: "AI 建議", en: "AI suggestion" },
  "dashboard.briefing.suggestion.text": {
    zh: "訂閱助理本週付款量比上週高 28%。要不要把單筆訂閱付款上限從 100 USDC 拉到 125？",
    en: "Subscription agent's weekly payment volume is 28% above last week. Bump the per-payment cap from 100 USDC to 125?",
  },
  "dashboard.briefing.suggestion.action": {
    zh: "去調整月限額",
    en: "Adjust monthly cap",
  },
  /* Greeting phrase-only variants (without time suffix) — used in the new
     Dashboard greeting where the phrase renders in Noto Serif TC and the name
     is pulled out as a separate Instrument Serif italic element with a yellow
     highlighter background. */
  "dashboard.greeting.phrase.morning": { zh: "早安", en: "Good morning" },
  "dashboard.greeting.phrase.afternoon": { zh: "午安", en: "Good afternoon" },
  "dashboard.greeting.phrase.evening": { zh: "晚安", en: "Good evening" },
  "dashboard.greeting.phrase.lateNight": { zh: "深夜了", en: "Still up" },
  "dashboard.greeting.name": { zh: "Megan", en: "Megan" },
  "dashboard.greeting.tag.morning": { zh: "今早簡報", en: "Morning Brief" },
  "dashboard.greeting.tag.afternoon": { zh: "今午簡報", en: "Afternoon Brief" },
  "dashboard.greeting.tag.evening": { zh: "今晚簡報", en: "Evening Brief" },
  "dashboard.greeting.tag.lateNight": { zh: "今夜簡報", en: "Tonight's Brief" },
  /* Greeting sub-copy is split at <strong> boundaries so the numbers can be
     bold in JSX without a templated innerHTML pass. */
  "dashboard.greeting.sub.prefix": {
    zh: "今天 {agents} 個 AI 助理已處理 ",
    en: "Your {agents} AI agents handled ",
  },
  "dashboard.greeting.sub.txnsBridge": {
    zh: " 筆交易，省下 ",
    en: " transactions today, saving you ",
  },
  "dashboard.greeting.sub.suffix": { zh: " 小時。", en: " hours." },
  /* Mini-status rows on the right of the greeting block. */
  "dashboard.status.budget": { zh: "預算使用", en: "Budget Used" },
  "dashboard.status.auto": { zh: "自動化率", en: "Auto Rate" },
  "dashboard.status.pending": { zh: "待審核", en: "Pending" },
  "dashboard.hero.eyebrow": { zh: "需要你核准", en: "Needs your approval" },
  "dashboard.hero.clean.title": { zh: "今天很乾淨", en: "All clear today" },
  "dashboard.hero.clean.desc": {
    zh: "所有 AI 助理都在規則內做事，沒事找你。",
    en: "Every agent is operating within its rules. Nothing needs you.",
  },
  /* Editorial late-night moment — replaces the plain "all clear" check when
     pending = 0. Quote splits at the name so the locale-agnostic "Megan"
     can render in Instrument Serif italic with a yellow accent. */
  "dashboard.hero.empty.tag": { zh: "夜已深", en: "LATE NIGHT" },
  "dashboard.hero.empty.quote.before": { zh: "去睡吧，", en: "Get some sleep, " },
  "dashboard.hero.empty.quote.after": {
    zh: "，AI 助理今晚會顧好一切。",
    en: ". Agents will keep watch tonight.",
  },
  "dashboard.hero.empty.stat1.label": { zh: "今晚已處理", en: "Handled tonight" },
  "dashboard.hero.empty.stat1.value": { zh: "12 筆", en: "12 transactions" },
  "dashboard.hero.empty.stat2.label": { zh: "明早 08:00", en: "Tomorrow 08:00" },
  "dashboard.hero.empty.stat2.value": {
    zh: "會有一份報表",
    en: "Daily report ready",
  },
  "dashboard.hero.pending.title": {
    zh: "筆需要由你核准的待審核事項",
    en: "to-do items awaiting your approval",
  },
  "dashboard.hero.pending.title.singular": {
    zh: "筆需要由你核准的待審核事項",
    en: "to-do item awaiting your approval",
  },
  "dashboard.hero.pending.line1": { zh: "筆待審核", en: "to-do" },
  "dashboard.hero.pending.line2": {
    zh: "需要你確認後才會付款",
    en: "No payment goes out until you confirm.",
  },
  "dashboard.hero.pending.total": {
    zh: "總金額 {amount} USDC",
    en: "{amount} USDC total",
  },
  "dashboard.hero.pending.cta": { zh: "前往審核", en: "Go review" },
  /* Small stats bar inside the Pending hero card. oldestValue hard-coded to
     match the narrative density of the mock (real timestamp math would resolve
     to "2 days ago" against the static pending-approval dates and kill the
     urgency). */
  "dashboard.hero.stats.oldest": { zh: "最早待審核", en: "Oldest pending" },
  "dashboard.hero.stats.oldestValue": { zh: "2 分鐘前", en: "2 min ago" },
  "dashboard.hero.stats.agents": { zh: "跨 AI 助理數", en: "Unique agents" },
  "dashboard.ambient": {
    zh: "今天 AI 助理幫你處理了 {tx} 筆交易、總共花 {spent} USDC．支出比昨天{dir} {pct}%。",
    en: "Agents handled {tx} transactions today, spending {spent} USDC total — spending is {dir} {pct}% vs. yesterday.",
  },
  "dashboard.ambient.more": { zh: "多", en: "up" },
  "dashboard.ambient.less": { zh: "省", en: "down" },

  "dashboard.details.title": { zh: "詳細數據", en: "Detailed analytics" },
  "dashboard.details.sub": {
    zh: "累積支出追蹤、每個 AI 助理的預算使用率",
    en: "Cumulative spending and per-agent budget usage",
  },
  "dashboard.burn.title": { zh: "累積支出追蹤", en: "Cumulative spending tracker" },
  "dashboard.burn.sub": { zh: "切換不同期間查看", en: "Switch between time ranges" },
  "dashboard.burn.monthUsage": { zh: "本月", en: "This month" },
  "dashboard.metric.today.label": { zh: "今日交易", en: "Today" },
  "dashboard.metric.today.unit": { zh: "筆", en: "txns" },
  "dashboard.metric.today.range": { zh: "近 7 天", en: "7D" },
  "dashboard.metric.today.sub": {
    zh: "由 {agents} 個 AI 助理代為執行",
    en: "Executed by {agents} agents",
  },
  "dashboard.metric.spend.label": { zh: "今日總支出", en: "Today spend" },
  "dashboard.metric.spend.unit": { zh: "USDC", en: "USDC" },
  "dashboard.metric.spend.sub": { zh: "比昨天", en: "vs. yesterday" },
  "dashboard.metric.automation.label": { zh: "自動化率", en: "Automation" },
  "dashboard.metric.automation.sub": {
    zh: "{auto} / {total} 筆自動處理",
    en: "{auto} of {total} auto-processed",
  },
  "dashboard.metric.month.label": { zh: "本月累積", en: "Month to date" },
  "dashboard.metric.month.unit": { zh: "USDC", en: "USDC" },
  "dashboard.metric.month.sub": {
    zh: "月度預算 ${budget}．剩餘 {remaining}%",
    en: "${budget} budget · {remaining}% remaining",
  },
  "dashboard.metric.month.used": {
    zh: "已用 {pct}%",
    en: "{pct}% used",
  },
  "dashboard.metric.month.left": {
    zh: "剩餘 {pct}%",
    en: "{pct}% left",
  },
  "dashboard.agents.title": { zh: "AI 平台與助理本月使用率", en: "AI platform & agent budget usage" },
  "dashboard.agent.paused": { zh: "已暫停", en: "Paused" },
  "dashboard.agents.usedThisMonth": { zh: "本月已用", en: "Used this month" },
  "dashboard.agents.monthlyBudget": { zh: "月度預算", en: "Monthly budget" },
  "web3.title": { zh: "適用在 Web3 產品的哪些位置", en: "Where this fits in Web3 products" },
  "web3.wallet.title": { zh: "鏈上錢包", en: "Web3 Wallet" },
  "web3.wallet.badge": { zh: "主要場景", en: "Primary Use Case" },
  "web3.wallet.body": {
    zh: "作為 AI agent 權限中心，管理可互動的去中心化應用、代幣、鏈別、單筆與每日限額。",
    en: "Works as an AI agent permission center for dApps, tokens, chains, per-action limits, and daily limits.",
  },
  "web3.exchange.title": { zh: "交易所", en: "Crypto Exchange" },
  "web3.exchange.badge": { zh: "延伸場景", en: "Secondary Use Case" },
  "web3.exchange.body": {
    zh: "可嵌進交易所的安全中心或 API 管理頁面，讓 agent 在交易所帳戶下也走相同的權限與審核流程。",
    en: "Can be embedded in Security or API Management on a crypto exchange, so agents go through the same permission and review flow on exchange accounts.",
  },

  // ==================== Feed ====================
  "feed.title": { zh: "最近動態", en: "Recent activity" },
  "feed.viewAll": { zh: "看完整紀錄", en: "See full activity history" },
  "feed.status.autoApproved": { zh: "自動核准", en: "Auto-approved" },
  "feed.status.pending": { zh: "等待審核", en: "Awaiting you" },
  "feed.status.approved": { zh: "已核准", en: "Approved" },
  "feed.status.rejected": { zh: "已拒絕", en: "Rejected" },
  "feed.filter.all": { zh: "全部", en: "All" },
  "feed.filter.pending": { zh: "需審核", en: "Pending" },
  "feed.filter.auto": { zh: "自動", en: "Auto" },
  "feed.filter.recent": { zh: "過去 1 小時", en: "Past 1h" },
  "feed.live": { zh: "即時", en: "Live" },
  "feed.viewAllTransactions": {
    zh: "查看全部 {n} 筆交易 ▾",
    en: "View all {n} transactions ▾",
  },
  /* Fallback relative time for simulator-generated items that don't carry
     their own `relative` field. */
  "feed.relative.justNow": { zh: "剛剛", en: "just now" },

  "fab.simulate": { zh: "模擬 AI 助理行為", en: "Simulate agent" },

  // ==================== Chart ranges ====================
  "chart.range.7d": { zh: "7 天", en: "7d" },
  "chart.range.30d": { zh: "30 天", en: "30d" },
  "chart.range.1y": { zh: "1 年", en: "1y" },
  "chart.summary": { zh: "期間合計", en: "Period total" },
  "chart.transactions": { zh: "筆", en: "txns" },
  "chart.dailyUnit": { zh: "日花費", en: "Daily spend" },
  "chart.monthlyUnit": { zh: "月花費", en: "Monthly spend" },
  "chart.dailyLabel": { zh: "每日合計", en: "Daily total" },
  "chart.monthlyLabel": { zh: "每月彙總", en: "Monthly total" },
  "chart.tooltip.transactions": { zh: "筆交易", en: "transactions" },

  // ==================== Approvals ====================
  "approvals.eyebrow": { zh: "待審核", en: "Approvals" },
  "approvals.title": { zh: "待審核", en: "Waiting on you" },
  "approvals.desc": {
    zh: "這裡會列出超出規則的 AI 支付請求。每張卡片都會說明需要花這筆費用、風險在哪，以及每個決定接下來會發生什麼。",
    en: "Agent requests that fell outside your rules. Each card explains the approval reason, risk, and what each decision will do next.",
  },
  "approvals.badge": { zh: "筆待審核", en: "need your decision" },
  "approvals.next": { zh: "下一筆待審核", en: "Next approval" },
  "approvals.empty": {
    zh: "目前沒有待審請求。AI 會照規則處理小額支付，有需要你判斷時再提醒你。",
    en: "When everything's handled, this page goes calm. Agents work within the rules. You don't have to do anything.",
  },
  "approvals.empty.title": { zh: "待審佇列已清空", en: "Approval queue is clear" },
  "approvals.empty.audit": { zh: "查看活動紀錄", en: "View activity history" },
  "approvals.empty.rules": { zh: "調整規則", en: "Adjust rules" },
  "approvals.list.title": { zh: "待審佇列", en: "Pending queue" },
  "approvals.bulk.hint": {
    zh: "目前有 {count} 筆待審，可以一次核准。",
    en: "{count} approvals are waiting. You can approve them together.",
  },
  "approvals.bulk.button": { zh: "全部核准（{count} 筆）", en: "Approve all ({count})" },
  "approvals.bulk.title": { zh: "全部核准 {count} 筆？", en: "Approve all {count}?" },
  "approvals.bulk.desc": {
    zh: "這會把下列請求全部核准，並各自寫入活動紀錄。",
    en: "This approves every request below and writes each decision to your activity history.",
  },
  "approvals.bulk.cancel": { zh: "取消", en: "Cancel" },
  "approvals.bulk.confirm": { zh: "確認核准 {count} 筆", en: "Approve {count}" },

  "approval.severity.info": { zh: "資訊提示", en: "Heads-up" },
  "approval.severity.warning": { zh: "建議審核", en: "Worth a review" },
  "approval.severity.danger": { zh: "高風險．請詳閱", en: "High risk — read carefully" },

  "approval.counterBadge": { zh: "AI 助理備案", en: "Agent's counter-offer" },
  "approval.requestedPay": { zh: "請求支付", en: "is requesting" },
  "approval.why": { zh: "AI 助理為什麼要花這筆錢", en: "Why the agent wants to spend this" },
  "approval.suggestion.label": { zh: "AI 建議", en: "AI suggests" },
  "approval.suggestion.approve": {
    zh: "核准這一次",
    en: "Approve this one",
  },
  "approval.suggestion.reject": { zh: "拒絕這筆", en: "Reject this" },
  "approval.suggestion.counter": {
    zh: "請 AI 找替代方案",
    en: "Ask AI for an alternative",
  },
  "approval.suggestion.reason.counter": {
    zh: "首次出現的付款對象、金額超過單筆上限，建議請 AI 找更省的方案。",
    en: "First-time merchant and over the per-tx cap — ask for a cheaper alternative.",
  },
  "approval.suggestion.reason.reject": {
    zh: "付款對象風險偏高，建議直接拒絕。",
    en: "Merchant looks risky — better to reject.",
  },
  "approval.suggestion.reason.approveOnce": {
    zh: "首次出現的付款對象，建議先核准這次再決定要不要長期信任。",
    en: "First-time merchant — approve once before deciding on long-term trust.",
  },
  "approval.suggestion.reason.approveSafe": {
    zh: "符合既有規則，可以核准。",
    en: "Matches existing rules — safe to approve.",
  },
  "approval.context.expand": { zh: "詳細脈絡", en: "More context" },
  "approval.context": { zh: "脈絡", en: "Context" },
  "approval.context.taskId": { zh: "目前任務", en: "Current task" },
  "approval.context.spentOnTask": { zh: "任務已花", en: "Spent on task" },
  "approval.context.remaining": { zh: "任務剩餘預算", en: "Remaining budget" },
  "approval.context.trust": { zh: "網站信任度", en: "Merchant trust" },
  "approval.context.similar": { zh: "過去類似交易", en: "Similar past transactions" },
  "approval.context.similarUnit": { zh: "筆", en: "" },
  "approval.triggered": { zh: "觸發規則：", en: "Triggered rule: " },
  "approval.risks.more": { zh: "項", en: "more" },
  "approval.reason.label": { zh: "需要審核原因", en: "Approval reason" },
  "approval.riskProfile.title": { zh: "風險條件", en: "Risk conditions" },
  "approval.riskProfile.actionType": { zh: "操作類型", en: "Action Type" },
  "approval.riskProfile.asset": { zh: "資產", en: "Asset" },
  "approval.riskProfile.amount": { zh: "金額", en: "Amount" },
  "approval.riskProfile.destination": { zh: "目的地", en: "Destination" },
  "approval.riskProfile.triggeredRule": { zh: "觸發規則", en: "Triggered Rule" },
  "approval.riskProfile.riskLevel": { zh: "風險等級", en: "Risk Level" },
  "approval.riskProfile.userDecision": { zh: "使用者決策", en: "User Decision" },

  "approval.trust.allowlisted": { zh: "信任名單網站", en: "Allowlisted merchant" },
  "approval.trust.blocklisted": { zh: "封鎖名單網站", en: "Blocklisted merchant" },
  "approval.trust.review": { zh: "審核中．首次交易", en: "Under review — first transaction" },
  "approval.trust.firstTime": { zh: "首次交易", en: "First transaction" },

  "approval.action.approve": { zh: "單次核准", en: "Approve once" },
  "approval.action.adjust": { zh: "修改規則", en: "Adjust rule" },
  "approval.action.allow": { zh: "核准並加入信任名單", en: "Approve & allowlist" },
  "approval.action.counter": { zh: "請 AI 找替代方案", en: "Ask for an alternative" },
  "approval.counter.working": {
    zh: "AI 正在找方案…",
    en: "AI is thinking…",
  },
  "approval.action.counterDisabled": {
    zh: "這筆沒有備案可提",
    en: "No alternative is available for this request",
  },
  "approval.action.reject": { zh: "拒絕這筆", en: "Reject" },

  "approval.handled.title": { zh: "已處理 · {merchant}", en: "Handled · {merchant}" },
  "approval.handled.hint": { zh: "下一筆審核會自動遞補到這裡", en: "Next approval will take this spot" },
  "approval.handled.undo": { zh: "還原", en: "Undo" },

  "approval.toast.approved.title": { zh: "已核准 {agent} 的支付", en: "Approved {agent}'s payment" },
  "approval.toast.approved.desc": {
    zh: "{merchant}．{amount} USDC．單次生效",
    en: "{merchant}．{amount} USDC．One-time",
  },
  "approval.toast.allowed.title": { zh: "已核准並加入信任名單", en: "Approved & allowlisted" },
  "approval.toast.allowed.desc": {
    zh: "{merchant} 未來將自動放行",
    en: "{merchant} will pass automatically from now on",
  },
  "approval.toast.adjusted.title": { zh: "已保留這筆並準備修改規則", en: "Kept pending and opened rule review" },
  "approval.toast.adjusted.desc": {
    zh: "{merchant} 仍在待審核佇列中，修改後可重新判斷",
    en: "{merchant} stays in the approval queue while you adjust the rule",
  },
  "approval.toast.rejected.title": { zh: "已拒絕這筆交易", en: "Transaction rejected" },
  "approval.toast.rejected.desc": { zh: "{agent} 已被通知需重新規劃", en: "{agent} has been notified to retry" },
  "approval.toast.counter.title": { zh: "已要求 {agent} 提出備案", en: "Asked {agent} for an alternative" },
  "approval.toast.counter.desc": {
    zh: "大概 10 秒內會丟回新方案．切到「下一筆」就能看到",
    en: "A new proposal will arrive in ~10 seconds. Click \"Next approval\" to view",
  },
  "approval.toast.counterArrived.title": { zh: "{agent} 提出備案了", en: "{agent} sent an alternative" },
  "approval.toast.counterArrived.desc": {
    zh: "{merchant}．{amount} USDC．點「下一筆」查看",
    en: "{merchant}．{amount} USDC．Click \"Next\" to view",
  },
  "approval.toast.bulk.title": { zh: "已核准 {count} 筆待審", en: "Approved {count} requests" },
  "approval.toast.bulk.desc": {
    zh: "每筆決策都已寫入活動紀錄",
    en: "Each decision was written to your activity history",
  },

  // ==================== Feed toasts ====================
  "feed.toast.pending.title": { zh: "{agent} 需要你決定", en: "{agent} needs a decision" },
  "feed.toast.pending.desc": {
    zh: "{merchant}．{amount} USDC．{reason}",
    en: "{merchant}．{amount} USDC．{reason}",
  },
  "feed.toast.auto.title": { zh: "{agent} 已自動核准", en: "{agent} auto-approved" },
  "feed.toast.auto.desc": { zh: "{merchant}．{amount} USDC", en: "{merchant}．{amount} USDC" },

  // ==================== Rules ====================
  "rules.eyebrow": { zh: "Rule Engine", en: "Rule Engine" },
  "rules.title": { zh: "額度與信任名單", en: "Budgets & trust lists" },
  "rules.desc": {
    zh: "三層管 AI 助理：類別額度、單筆上限、信任名單。超出範圍就會自動進入待審核等你確認。",
    en: "Three layers define agent autonomy: category budgets, per-transaction caps, and merchant trust lists. Anything over the line joins your approval queue.",
  },
  "rules.newRule": { zh: "新增規則", en: "New rule" },
  "rules.categories.title": { zh: "類別額度", en: "Category budgets" },
  "rules.categories.desc": {
    zh: "三種預設類別涵蓋多數付款治理情境，也可以自己加。每一類的月度額度和單筆上限都能獨立調整。",
    en: "Three presets cover most payment-governance use cases. You can add your own. Monthly budget and per-transaction cap are independent per category.",
  },
  "rules.trust.title": { zh: "網站信任名單", en: "Merchant trust lists" },
  "rules.trust.desc": {
    zh: "信任名單自動放行、封鎖名單直接拒絕、審核中的付款對象每一筆都要讓你看見。",
    en: "Allowlisted merchants pass automatically, blocklisted ones get denied, merchants under review need your approval each time.",
  },
  "rules.trust.tab.allow": { zh: "信任名單", en: "Allowlist" },
  "rules.trust.tab.block": { zh: "封鎖名單", en: "Blocklist" },
  "rules.trust.tab.review": { zh: "審核中", en: "Under review" },
  "rules.trust.manage": { zh: "管理", en: "Manage" },
  "rules.trust.remove": { zh: "移除", en: "Remove" },
  "rules.trust.removed.title": { zh: "已移除 {merchant}", en: "Removed {merchant}" },
  "rules.trust.removed.desc.allow": {
    zh: "未來 AI 助理碰到這個付款對象不再自動放行",
    en: "Agents will no longer auto-approve this merchant",
  },
  "rules.trust.removed.desc.block": {
    zh: "這個付款對象解除封鎖",
    en: "This merchant is no longer blocked",
  },
  "rules.trust.removed.desc.review": {
    zh: "已從觀察名單移除",
    en: "Removed from the watchlist",
  },
  "rules.trust.removed.undo": { zh: "還原", en: "Undo" },
  "rules.trust.category": { zh: "類別", en: "Category" },
  "rules.trust.addedAt": { zh: "加入日期", en: "Added" },
  "rules.trust.since": { zh: "開始觀察", en: "First seen" },
  "rules.deeplink.missing.title": {
    zh: "無法自動帶入付款對象",
    en: "Could not prefill the merchant",
  },
  "rules.deeplink.missing.desc": {
    zh: "這個連結缺少付款對象參數。你仍然可以用「新增規則」手動建立信任網站、封鎖網站或類別預算。",
    en: "This link is missing a merchant parameter. You can still use New rule to create an allowlist, blocklist, or category budget manually.",
  },

  "rules.card.monthTotal": { zh: "/ 月", en: "/ mo" },
  "rules.recentMerchants": { zh: "最近付款對象", en: "Recent payments to" },
  "rules.noRecentMerchants": { zh: "還沒有付款紀錄", en: "No payment history yet" },
  "rules.card.singleLimit": { zh: "單筆上限", en: "Per-transaction cap" },
  "rules.card.remaining": { zh: "剩餘額度", en: "Remaining" },
  "rules.card.adjust": { zh: "調整", en: "Edit" },
  "rules.card.delete": { zh: "刪除", en: "Delete" },
  "rules.card.deleted.title": {
    zh: "已刪除「{name}」類別",
    en: "Deleted category \"{name}\"",
  },
  "rules.card.deleted.desc": { zh: "可在五秒內復原", en: "Undo within 5 seconds" },
  "rules.card.deleted.undo": { zh: "還原", en: "Undo" },

  "rules.dialog.edit.title": { zh: "調整「{name}」額度", en: "Edit \"{name}\" budget" },
  "rules.dialog.edit.desc": {
    zh: "月度額度是累積上限，單筆上限是每次交易的硬門檻。超過任一條就會來找你審核。",
    en: "Monthly budget caps cumulative spend. Per-transaction cap is a hard limit on each payment. Crossing either one triggers a manual review.",
  },
  "rules.dialog.monthly": { zh: "月度總額度", en: "Monthly budget" },
  "rules.dialog.single": { zh: "單筆上限", en: "Per-transaction cap" },
  "rules.dialog.cancel": { zh: "取消", en: "Cancel" },
  "rules.dialog.save": { zh: "儲存規則", en: "Save rule" },
  "rules.dialog.savedTitle": { zh: "已更新「{name}」規則", en: "\"{name}\" rule updated" },
  "rules.dialog.savedDesc": {
    zh: "月額度 ${monthly}．單筆上限 ${single}",
    en: "Monthly ${monthly} · Per-tx cap ${single}",
  },

  "rules.new.title": { zh: "新增類別規則", en: "Create a new category rule" },
  "rules.new.desc": {
    zh: "給新的支付場景定一組規則。月度額度、單筆上限任一踩到就會來找你審核。",
    en: "Define a rule for a new kind of spending. Hitting either limit will trigger a manual review.",
  },
  "rules.new.nameLabel": { zh: "類別名稱", en: "Category name" },
  "rules.new.namePlaceholder": {
    zh: "例如：社群打賞、雲端運算、雲端儲存",
    en: "e.g., Creator tips, Cloud compute, Storage",
  },
  "rules.new.descLabel": { zh: "描述", en: "Description" },
  "rules.new.descOptional": { zh: "（選填）", en: "(optional)" },
  "rules.new.descPlaceholder": {
    zh: "一句話讓未來的你知道這類在管什麼",
    en: "One line to remind future-you what this covers",
  },
  "rules.new.create": { zh: "建立規則", en: "Create rule" },
  "rules.new.missingName": { zh: "先填類別名稱", en: "Please name the category first" },
  "rules.new.createdTitle": { zh: "新增類別「{name}」", en: "Added category \"{name}\"" },
  "rules.new.createdDesc": {
    zh: "月額度 ${monthly}．單筆上限 ${single}",
    en: "Monthly ${monthly} · Per-tx cap ${single}",
  },
  "rules.new.defaultDesc": { zh: "自訂類別", en: "Custom category" },

  // ==================== Audit ====================
  "audit.eyebrow": { zh: "Agent Activity History", en: "Agent Activity History" },
  "audit.title": { zh: "AI 助理活動紀錄", en: "Activity history" },
  "audit.desc": {
    zh: "每一筆 AI 助理支付、來源平台、你的決定、規則說明都在這裡。可以依 AI 助理、平台或決策類型篩選，展開看完整脈絡，一鍵匯出 CSV 作為個人財務紀錄。",
    en: "Every agent payment, source platform, your decision, and the rule-based explanation behind it. Filter by agent, platform, or decision type, expand for full context, and export CSV for personal finance records.",
  },
  "audit.export": { zh: "匯出完整紀錄", en: "Export full history" },
  "audit.exported.title": { zh: "已匯出完整紀錄", en: "Activity history exported" },
  "audit.exported.desc": {
    zh: "{n} 筆紀錄已下載為 CSV",
    en: "{n} rows saved as CSV",
  },
  "audit.filter.all": { zh: "全部", en: "All" },
  "audit.filter.approved": { zh: "已核准", en: "Approved" },
  "audit.filter.rejected": { zh: "已拒絕", en: "Rejected" },
  "audit.filter.auto": { zh: "自動", en: "Auto" },
  "audit.filter.allAgents": { zh: "所有 AI 助理", en: "All agents" },
  "audit.filter.allPlatforms": { zh: "所有 AI 平台", en: "All platforms" },
  "audit.copyCsv": { zh: "複製 CSV", en: "Copy CSV" },
  "audit.copied.title": { zh: "已複製 CSV", en: "CSV copied" },
  "audit.copied.desc": { zh: "共 {n} 筆資料", en: "{n} rows" },
  "audit.empty": {
    zh: "目前還沒有活動紀錄。核准或拒絕待審請求後，決策會出現在這裡。",
    en: "No audit records yet. Approve or reject a pending request and the decision will appear here.",
  },
  "audit.empty.title": { zh: "沒有可顯示的紀錄", en: "No records to show" },
  "audit.empty.filtered": {
    zh: "目前篩選條件沒有符合的紀錄。清除篩選後可以回到完整活動紀錄。",
    en: "No records match the current filters. Reset filters to return to the full activity history.",
  },
  "audit.empty.reset": { zh: "清除篩選", en: "Reset filters" },

  "audit.decision.approved": { zh: "已核准", en: "Approved" },
  "audit.decision.rejected": { zh: "已拒絕", en: "Rejected" },
  "audit.decision.auto": { zh: "自動", en: "Auto" },
  "audit.relative.now": { zh: "剛剛", en: "just now" },
  "audit.relative.minutes": { zh: "{n} 分鐘前", en: "{n} minutes ago" },
  "audit.relative.hours": { zh: "{n} 小時前", en: "{n} hours ago" },
  "audit.relative.days": { zh: "{n} 天前", en: "{n} days ago" },
  "audit.verb.approved": { zh: "核准了", en: "approved" },
  "audit.verb.rejected": { zh: "拒絕了", en: "rejected" },
  "audit.verb.system": { zh: "由系統自動核准", en: "was auto-approved by the system" },
  "audit.verb.systemRejected": { zh: "由系統自動拒絕", en: "was rejected by the system" },
  "audit.narrative.user": {
    zh: "{name} 在 {time} {verb}這筆，因為 {reason}。",
    en: "{name} {verb} this {time}, because {reason}.",
  },
  "audit.narrative.system": {
    zh: "這筆在 {time} {verb}，因為 {reason}。",
    en: "This {verb} {time}, because {reason}.",
  },
  "audit.expand.reasoning": { zh: "規則說明", en: "Rule-based explanation" },
  "audit.expand.userAction": { zh: "你的決定", en: "Your decision" },
  "audit.field.tx": { zh: "鏈上回執", en: "On-chain receipt" },
  "audit.field.gas": { zh: "Gas 費用", en: "Gas fee" },
  "audit.field.platform": { zh: "來源平台", en: "Source platform" },
  "audit.field.approvedBy": { zh: "審核者", en: "Decided by" },
  "audit.field.time": { zh: "時間戳", en: "Timestamp" },
  "audit.approvedBy.user": { zh: "Megan（你）", en: "Megan (you)" },
  "audit.approvedBy.system": { zh: "系統花費規則", en: "System rule engine" },
  "audit.eu": { zh: "User-facing product history", en: "User-facing product history" },
  "audit.viewRule": { zh: "→ 看規則", en: "→ View rule" },

  // ==================== Welcome modal ====================
  "welcome.badge": { zh: "Interactive Prototype", en: "Interactive Prototype" },
  "welcome.timeHint": { zh: "閱讀時間約 3 分鐘", en: "~3 min read" },
  /* Trimmed welcome — three lines + three quick actions. The longer Phase 2
     / limits / module-walkthrough copy stays in the dict as legacy keys but
     is no longer rendered. */
  "welcome.summary.line1": {
    zh: "這是一個交易所 AI agent 權限與付款治理控制台。",
    en: "An AI agent permission and payment governance module for crypto exchanges.",
  },
  "welcome.summary.line2": {
    zh: "AI 可以在規則內操作資產，超出範圍時會先問你。",
    en: "AI can act within asset rules and asks first when something goes outside the lines.",
  },
  "welcome.summary.line3": {
    zh: "所有操作都是模擬資料，不會真的付款或上鏈。",
    en: "Everything here is mock data — nothing actually pays or hits a chain.",
  },
  "welcome.action.dashboard.title": { zh: "看 Dashboard", en: "Check the Dashboard" },
  "welcome.action.dashboard.desc": {
    zh: "現在有沒有事要你決定",
    en: "See what needs your decision",
  },
  "welcome.action.rules.title": { zh: "去 Rules", en: "Open Rules" },
  "welcome.action.rules.desc": {
    zh: "用一句話新增花費規則",
    en: "Add a spending rule in one sentence",
  },
  "welcome.action.approvals.title": { zh: "去 Approvals", en: "Open Approvals" },
  "welcome.action.approvals.desc": {
    zh: "核准、拒絕，或請 AI 找替代方案",
    en: "Approve, reject, or ask AI for an alternative",
  },
  "welcome.title": { zh: "歡迎來到 soon-ga.agent control hub", en: "Welcome to soon-ga.agent control hub" },
  "welcome.desc": {
    zh: "這是 AI 助理支付控制層的互動原型。所有資料都是模擬的，不會真的付錢、不會上鏈、你的操作也不會離開這個瀏覽器。",
    en: "An interactive prototype of an AI agent payment control layer. All data is simulated — no real payments, no on-chain transactions, nothing leaves your browser.",
  },
  "welcome.tryTitle": { zh: "試試看這幾個", en: "Suggested things to try" },
  "welcome.s1.title": { zh: "用右下橘色按鈕", en: "Use the orange button (bottom-right)" },
  "welcome.s1.desc": {
    zh: "模擬一筆新的 AI 助理支付．每 3 秒也會自動產生",
    en: "Triggers a simulated agent transaction. A new one also appears every 3 seconds",
  },
  "welcome.s2.title": {
    zh: "去 /approvals 按「請 AI 找替代方案」",
    en: "Hit \"Ask for an alternative\" on /approvals",
  },
  "welcome.s2.desc": {
    zh: "10 秒後 AI 助理會丟回新方案，走一遍完整的決策迴圈",
    en: "The agent sends a counter-offer in 10 seconds — watch the full decision loop",
  },
  "welcome.s3.title": { zh: "去 /rules 新增自訂類別", en: "Add a custom category on /rules" },
  "welcome.s3.desc": {
    zh: "把你的 AI 助理支付場景分類、設月額度與單筆上限",
    en: "Group your agent spending into buckets with monthly and per-transaction caps",
  },
  "welcome.s4.title": { zh: "去 /audit 篩選後匯出", en: "Filter & export on /audit" },
  "welcome.s4.desc": {
    zh: "按 AI 助理或決策類型篩選，一鍵複製 CSV",
    en: "Filter by agent or decision type, then copy a CSV in one click",
  },
  "welcome.s5.title": { zh: "側邊連接假錢包", en: "Connect the mock wallet" },
  "welcome.s5.desc": {
    zh: "示範錢包狀態、餘額、授權 AI 助理的 UX，不上鏈",
    en: "Showcases the wallet UX — balance, authorized agents, disconnect — no blockchain",
  },
  "welcome.footer": {
    zh: "PM 作品集的產品 demo．不是要上線的產品．不會收集任何資料．",
    en: "A PM portfolio product demo · not a production product · no data is collected.",
  },
  "welcome.cta": { zh: "開始試玩", en: "Start exploring" },

  // Display-name personalization (localStorage-only, no backend)
  "welcome.name.label": {
    zh: "你希望 AI 助理怎麼稱呼你？",
    en: "What would you like the AI agent to call you?",
  },
  "welcome.name.placeholder": { zh: "Megan", en: "Megan" },
  "welcome.name.privacy": {
    zh: "此原型會把顯示名稱保存在瀏覽器本機，不會上傳。",
    en: "This prototype stores your display name locally in this browser. It is not uploaded.",
  },

  // Prototype scope — desktop notification disclaimer
  "welcome.scope.notify": {
    zh: "這個原型使用瀏覽器桌面通知模擬待審核提醒。尚未包含後端推播、手機推播或真實付款事件。",
    en: "This prototype uses browser desktop notifications to simulate approval alerts. It does not include backend push, mobile push, or real payment events.",
  },
  "notify.scopeHint": {
    zh: "瀏覽器通知 Demo，只在此頁開啟時運作",
    en: "Browser notification demo. Works only while this page is open.",
  },

  // Guide — what is it
  "welcome.what.title": { zh: "這個產品在做什麼？", en: "What does this do?" },
  "welcome.what.body": {
    zh: "soon-ga.agent 是 Web3 場景下的 AI 助理規則控制台。當 agent 替使用者支付訂閱、付款給合作方、提領到外部地址時，使用者仍能設定限制、審核高風險請求、查看完整紀錄。",
    en: "soon-ga.agent is an AI agent rule console for Web3 product scenarios. When agents pay subscriptions, send to vendors, or withdraw to external addresses, users can still set limits, review risky actions, and trace decisions.",
  },

  // Guide — four modules
  "welcome.modules.title": { zh: "四個模組", en: "Four modules" },
  "welcome.module.dashboard.title": { zh: "總覽（Command Center）", en: "Dashboard (Command Center)" },
  "welcome.module.dashboard.desc": {
    zh: "一頁看此刻有沒有事要決定．沒事就安靜、有事亮橘色。",
    en: "A single page answering: do I need to decide anything right now? Calm when no, alerts when yes.",
  },
  "welcome.module.rules.title": { zh: "花費規則（Rule Engine）", en: "Rule Engine" },
  "welcome.module.rules.desc": {
    zh: "類別預算、單筆上限、付款對象信任名單三層決定 AI 助理的自主邊界。",
    en: "Three layers: category budgets, per-transaction caps, and merchant trust lists.",
  },
  "welcome.module.approvals.title": { zh: "待審核（Approvals）", en: "Approvals" },
  "welcome.module.approvals.desc": {
    zh: "規則命中與事件脈絡翻成人話．30 秒內決定核准、拒絕，或請 AI 找替代方案。",
    en: "Rule matches and event context in plain language. Decide in 30 seconds: approve, reject, or ask for a counter-offer.",
  },
  "welcome.module.audit.title": { zh: "AI 助理活動紀錄", en: "Agent Activity History" },
  "welcome.module.audit.desc": {
    zh: "每一筆 AI 助理決定都可追溯．一鍵匯出 CSV 作為個人財務紀錄。",
    en: "Every agent decision is traceable. Export CSV for personal finance records in one click.",
  },

  // Guide — Phase 2 roadmap
  "welcome.phase2.title": { zh: "Phase 2 規劃", en: "Phase 2 roadmap" },
  "welcome.phase2.desc": {
    zh: "這個原型把產品規格與 UX 講清楚．下一階段會把整合做實。",
    en: "The prototype nails the product spec and UX. Phase 2 turns the integration real.",
  },
  "welcome.phase2.item1": {
    zh: "接 Base Sepolia 真錢包（wagmi + RainbowKit）",
    en: "Real wallets on Base Sepolia (wagmi + RainbowKit)",
  },
  "welcome.phase2.item2": {
    zh: "x402 handshake 整合：真實 HTTP 402 協議 + USDC 交易",
    en: "x402 handshake: real HTTP 402 protocol + USDC transactions",
  },
  "welcome.phase2.item3": {
    zh: "花費規則上鏈 enforce（ERC-4337 Session Keys 或鏈下 relayer）",
    en: "On-chain rule enforcement (ERC-4337 Session Keys or off-chain relayer)",
  },
  "welcome.phase2.item4": {
    zh: "背景推播：關瀏覽器也收得到通知（需後端 push server）",
    en: "Background push: alerts even when the browser is closed (needs a push server)",
  },

  // Guide — limits / transparency
  "welcome.limits.title": { zh: "關於這個原型", en: "About this prototype" },
  "welcome.limits.item1": {
    zh: "所有資料都是模擬的．不會真的付錢、不會上鏈",
    en: "All data is simulated — no real payments, no on-chain transactions",
  },
  "welcome.limits.item2": {
    zh: "不收集任何資料．沒有後端．你的操作都留在這個瀏覽器",
    en: "No data collected, no backend. Everything stays in this browser.",
  },
  "welcome.limits.item3": {
    zh: "這是 Megan 的 PM 作品集作品．2026 Q2",
    en: "Megan's PM portfolio piece · Q2 2026",
  },
  "help.open": { zh: "開啟使用說明", en: "Open help" },

  // ==================== Locale toggle ====================
  "locale.toggleLabel": { zh: "語言", en: "Language" },
  "locale.zh": { zh: "中", en: "中" },
  "locale.en": { zh: "EN", en: "EN" },

  // ==================== Desktop notifications ====================
  "notify.enable": { zh: "啟用桌面通知", en: "Enable desktop alerts" },
  "notify.sub": {
    zh: "切到其他 tab 也會提醒你要決定的事",
    en: "Get alerted even when this tab isn't in focus",
  },
  "notify.enabled": { zh: "桌面通知已開啟", en: "Desktop alerts active" },
  "notify.blocked": {
    zh: "通知被瀏覽器封鎖．去瀏覽器設定放行這個網站就好",
    en: "Blocked by browser. Enable notifications for this site in browser settings.",
  },
  "notify.enabledToast.title": { zh: "桌面通知已開啟", en: "Desktop alerts enabled" },
  "notify.enabledToast.desc": {
    zh: "切到其他 tab 也會提醒你",
    en: "You'll now be alerted even when this tab isn't active",
  },
  "notify.denied.title": { zh: "通知被拒絕", en: "Notifications denied" },
  "notify.denied.desc": {
    zh: "可以在瀏覽器網址列左邊的圖示裡重新放行",
    en: "You can re-enable from the icon to the left of your address bar",
  },
  "notify.sample.title": { zh: "soon-ga.agent control hub", en: "soon-ga.agent control hub" },
  "notify.sample.body": {
    zh: "通知開好了．有 AI 助理要你決定的時候會跳到這裡",
    en: "Alerts are on. You'll see one here when an agent needs you.",
  },

  // ==================== Trust list add ====================
  "trust.add.allow": { zh: "加入信任名單", en: "Add to allowlist" },
  "trust.add.block": { zh: "加入封鎖名單", en: "Add to blocklist" },
  "trust.add.title.allow": { zh: "新增信任名單網站", en: "Add merchant to allowlist" },
  "trust.add.title.block": { zh: "新增封鎖名單網站", en: "Add merchant to blocklist" },
  "trust.add.desc.allow": {
    zh: "加入信任名單後，AI 遇到這個付款對象可以自動放行，不會每次都打擾你。加入前會先做網站安全檢查（模擬）。",
    en: "Allowlisted merchants will auto-approve without asking you each time. We run a safety check before adding.",
  },
  "trust.add.desc.block": {
    zh: "加入封鎖名單後，AI 遇到這個付款對象會直接擋下付款。加入前會先做網站安全檢查（模擬）確認原因。",
    en: "Blocklisted merchants are rejected outright. We run a safety check first to confirm the reason.",
  },
  "trust.add.merchantLabel": { zh: "網站名稱或網址", en: "Merchant name or URL" },
  "trust.add.merchantPlaceholder": {
    zh: "例：Notion、Acme 供應商錢包、Base 營運錢包",
    en: "e.g., Notion, Acme vendor wallet, Base ops wallet",
  },
  "trust.add.categoryLabel": { zh: "類別", en: "Category" },
  "trust.add.reasonLabel": { zh: "拒絕原因", en: "Reason" },
  "trust.add.reasonPlaceholder": {
    zh: "為什麼要擋這個付款對象？（一句話描述）",
    en: "Why are you blocking this merchant? (one line)",
  },
  "trust.add.submit.allow": { zh: "加入信任名單", en: "Add to allowlist" },
  "trust.add.submit.block": { zh: "加入封鎖名單", en: "Add to blocklist" },
  "trust.add.confirm.risky": {
    zh: "⚠ 偵測到這個付款對象有高風險．還是要加信任名單嗎？",
    en: "⚠ Warning: risk indicators detected. Are you sure you want to allowlist this?",
  },
  "trust.add.confirm.safe": {
    zh: "這個付款對象看起來沒有風險訊號．還是要加封鎖名單嗎？",
    en: "Note: no risk signals detected. Are you sure you want to blocklist this?",
  },
  "trust.add.missing": { zh: "先填網站名稱", en: "Please enter a merchant name first" },
  "trust.add.toast.allow.title": {
    zh: "已加入信任名單：{merchant}",
    en: "Added {merchant} to allowlist",
  },
  "trust.add.toast.allow.desc": {
    zh: "以後 AI 助理碰到它就自動放行",
    en: "Agents will auto-approve this merchant from now on",
  },
  "trust.add.toast.block.title": {
    zh: "已加入封鎖名單：{merchant}",
    en: "Added {merchant} to blocklist",
  },
  "trust.add.toast.block.desc": {
    zh: "以後 AI 助理碰到它會被直接擋掉",
    en: "Agents will be rejected when hitting this merchant",
  },

  // Safety check UI
  "safety.title": { zh: "網站安全檢查（模擬）", en: "Safety pre-check (mock)" },
  "safety.checking": { zh: "檢查中⋯", en: "Checking⋯" },
  "safety.score": { zh: "安全分數", en: "Safety score" },
  "safety.level.safe": { zh: "安全", en: "Safe" },
  "safety.level.caution": { zh: "注意", en: "Caution" },
  "safety.level.risky": { zh: "高風險", en: "High risk" },
  "safety.signalsTitle": { zh: "偵測到的訊號", en: "Signals detected" },
  "safety.emptyInput": { zh: "輸入付款對象後會自動檢查", en: "Safety check runs as you type" },

  // ==================== Unified New Rule Dialog ====================
  "rules.unified.first.title": { zh: "新增規則", en: "New rule" },
  "rules.unified.first.desc": {
    zh: "用一句話告訴 AI，或從下面三種類型直接選一個。",
    en: "Describe it to AI in one line, or pick one of the three types below.",
  },
  "rules.unified.first.or": { zh: "或", en: "OR" },
  "rules.unified.chooser.title": { zh: "要新增哪一種規則？", en: "What kind of rule?" },
  "rules.unified.chooser.desc": {
    zh: "先選類型．類別管預算邊界，名單管個別付款對象的信任度",
    en: "Pick a type first. Categories manage budgets; lists manage individual merchants.",
  },
  "rules.unified.chooser.ai.title": {
    zh: "用自然語言描述",
    en: "Describe in natural language",
  },
  "rules.unified.chooser.ai.desc": {
    zh: "用日常語言講一句，AI 會幫你轉成具體規則。",
    en: "Describe it in plain language; AI turns it into a concrete rule.",
  },
  "rules.unified.chooser.ai.example": {
    zh: "例：「每月最多 500 USDC 在訂閱費」、「新地址提領永遠要我同意」",
    en: 'e.g. "$500/mo for subscriptions", "always confirm withdrawals to new addresses"',
  },
  "rules.ai.inputLabel": { zh: "用自己的話描述規則", en: "Describe the rule" },
  "rules.ai.placeholder": {
    zh: "例：讓訂閱助理每月最多支付 500 USDC 在 SaaS 訂閱費",
    en: "e.g. Let Subscription agent spend up to $500/month on SaaS subscriptions",
  },
  "rules.ai.parseButton": { zh: "✨ 讓 AI 解析", en: "✨ Ask AI to parse" },
  "rules.ai.parsing": { zh: "解析中……", en: "Parsing…" },
  "rules.ai.result.confidence.high": { zh: "高信心", en: "High confidence" },
  "rules.ai.result.confidence.medium": { zh: "中信心", en: "Medium confidence" },
  "rules.ai.result.confidence.low": { zh: "低信心", en: "Low confidence" },
  "rules.ai.result.draftCategory": {
    zh: "AI 建議建立類別預算",
    en: "AI suggests a category budget",
  },
  "rules.ai.result.draftAllow": {
    zh: "AI 建議加入信任名單",
    en: "AI suggests an allowlist entry",
  },
  "rules.ai.result.categoryName": { zh: "類別名稱", en: "Category name" },
  "rules.ai.result.description": { zh: "描述", en: "Description" },
  "rules.ai.result.monthly": { zh: "每月上限", en: "Monthly cap" },
  "rules.ai.result.single": { zh: "單筆上限", en: "Per-transaction cap" },
  "rules.ai.result.merchant": { zh: "網站", en: "Merchant" },
  "rules.ai.result.category": { zh: "歸類至", en: "Category" },
  "rules.ai.result.rationale": { zh: "AI 推理", en: "Rationale" },
  "rules.ai.apply": { zh: "建立規則", en: "Create rule" },
  "rules.ai.tryAgain": { zh: "重新描述", en: "Try again" },
  "rules.ai.switchToManual": {
    zh: "改用表單填寫",
    en: "Switch to manual form",
  },
  "rules.ai.result.filled": {
    zh: "已填入下方欄位（{confidence}）",
    en: "Filled below ({confidence})",
  },
  "rules.ai.switchToAllow": {
    zh: "切換到信任網站",
    en: "Switch to allowlist",
  },
  "rules.ai.switchToBlock": {
    zh: "切換到封鎖網站",
    en: "Switch to blocklist",
  },
  "rules.ai.dialog.title": {
    zh: "用一句話告訴 AI",
    en: "Describe it to AI",
  },
  "rules.ai.dialog.desc": {
    zh: "AI 會把你的描述整理成一條花費規則，你可以直接建立或繼續微調。",
    en: "AI turns your description into a concrete rule. Create it directly or fine-tune the fields first.",
  },
  "rules.ai.manualAdjust": {
    zh: "手動調整",
    en: "Manual adjust",
  },
  "rules.ai.reviewAndApply": {
    zh: "檢查並套用",
    en: "Review and apply",
  },
  // Consequence preview — spelled-out outcomes the user will see once the
  // parsed rule applies. Bullets are tone-coded (auto = sage / review = amber
  // / deny = destructive). Currency-prefix uses literal $ + numeric placeholder.
  "rules.ai.consequence.heading": {
    zh: "規則生效後",
    en: "When this rule applies",
  },
  "rules.ai.consequence.category.auto": {
    zh: "單筆 ≤ ${single}、月累計 ≤ ${monthly} 自動核准",
    en: "Auto-approve within ${single}/tx and ${monthly}/mo",
  },
  "rules.ai.consequence.category.review": {
    zh: "超過上限會進入待審核",
    en: "Over cap goes to approvals",
  },
  "rules.ai.consequence.allow.auto": {
    zh: "{merchant} 在類別上限內自動核准",
    en: "{merchant} auto-approves within cap",
  },
  "rules.ai.consequence.allow.review": {
    zh: "超過類別上限仍進待審核",
    en: "Over cap still goes to approvals",
  },
  "rules.ai.consequence.block.deny": {
    zh: "{merchant} 的付款直接拒絕",
    en: "{merchant} payments are rejected",
  },
  "rules.unified.chooser.category.title": { zh: "類別預算", en: "Category budget" },
  "rules.unified.chooser.category.desc": {
    zh: "給某類支出設月度上限與單筆限額",
    en: "Set monthly cap and per-transaction limit for a spending category",
  },
  "rules.unified.chooser.category.example": {
    zh: "例：訂閱每月 500 USDC、單筆上限 125 USDC",
    en: "e.g. Subscriptions — 500 USDC/mo, 125 USDC max per payment",
  },
  "rules.unified.chooser.allow.title": { zh: "信任網站", en: "Allowlist merchant" },
  "rules.unified.chooser.allow.desc": {
    zh: "這個付款對象我信任．AI 助理碰到它就自動放行",
    en: "Trust this merchant — agents auto-approve every time",
  },
  "rules.unified.chooser.allow.example": {
    zh: "例：Notion、TradingView Pro、Acme 供應商錢包",
    en: "e.g. Notion, TradingView Pro, Acme vendor wallet",
  },
  "rules.unified.chooser.block.title": { zh: "封鎖網站", en: "Blocklist merchant" },
  "rules.unified.chooser.block.desc": {
    zh: "這個付款對象一律不能付錢．AI 助理碰到會被直接擋掉",
    en: "Never allow payments here — agents get rejected outright",
  },
  "rules.unified.chooser.block.example": {
    zh: "例：fast-cash-loan.io、meme-nft-drop.xyz",
    en: "e.g. fast-cash-loan.io, meme-nft-drop.xyz",
  },
  "rules.unified.back": { zh: "回到選擇", en: "Back" },
  "rules.unified.entryLabel": { zh: "新增規則", en: "New rule" },
};

export type DictKey = keyof typeof dict;

export function translate(key: string, locale: Locale, params?: Record<string, string | number>): string {
  const entry = dict[key];
  if (!entry) return key;
  let value = entry[locale];
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return value;
}
