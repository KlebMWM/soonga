import type { Locale } from "./config";

type Dict = Record<string, { zh: string; en: string }>;

export const dict: Dict = {
  // ==================== Nav ====================
  "nav.dashboard.label": { zh: "指揮中心", en: "Command Center" },
  "nav.dashboard.sub": { zh: "即時總覽", en: "Live overview" },
  "nav.rules.label": { zh: "規則引擎", en: "Rule Engine" },
  "nav.rules.sub": { zh: "額度與信任名單", en: "Budgets & trust lists" },
  "nav.approvals.label": { zh: "審核佇列", en: "Approvals" },
  "nav.approvals.sub": { zh: "等候審核", en: "Waiting on you" },
  "nav.audit.label": { zh: "審計軌跡", en: "Audit Trail" },
  "nav.audit.sub": { zh: "決策日誌", en: "Decision log" },
  "nav.guide.label": { zh: "使用說明", en: "Guide" },
  "nav.guide.sub": { zh: "3 分鐘快速上手", en: "3-minute walkthrough" },

  "nav.mobile.dashboard": { zh: "總覽", en: "Home" },
  "nav.mobile.rules": { zh: "規則", en: "Rules" },
  "nav.mobile.approvals": { zh: "審核", en: "Approvals" },
  "nav.mobile.audit": { zh: "日誌", en: "Audit" },
  "nav.mobile.guide": { zh: "說明", en: "Guide" },

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
  "wallet.connect": { zh: "連接錢包", en: "Connect wallet" },
  "wallet.connectSub": { zh: "啟用 agent 自動支付", en: "Enable agent payments" },
  "wallet.balance": { zh: "USDC 餘額", en: "USDC balance" },
  "wallet.copyAddress": { zh: "複製地址", en: "Copy address" },
  "wallet.disconnect": { zh: "斷開", en: "Disconnect" },
  "wallet.authorized": { zh: "已授權 4 個 agent 使用此錢包", en: "4 agents authorized on this wallet" },
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
    zh: "今天 agent 已幫你處理 ",
    en: "Agents handled ",
  },
  "dashboard.greeting.sub.txnsBridge": {
    zh: " 筆交易，省下 ",
    en: " transactions today, saving you ",
  },
  "dashboard.greeting.sub.suffix": { zh: " 小時。", en: " hours." },
  /* Mini-status rows on the right of the greeting block. */
  "dashboard.status.budget": { zh: "預算使用", en: "Budget Used" },
  "dashboard.status.auto": { zh: "自動化率", en: "Auto Rate" },
  "dashboard.status.pending": { zh: "待辦", en: "Pending" },
  "dashboard.hero.eyebrow": { zh: "需要你核准", en: "Needs your approval" },
  "dashboard.hero.clean.title": { zh: "今天很乾淨", en: "All clear today" },
  "dashboard.hero.clean.desc": {
    zh: "所有 agent 都在規則內做事，沒事找你。",
    en: "Every agent is operating within its rules. Nothing needs you.",
  },
  "dashboard.hero.pending.title": {
    zh: "筆需要由你核准的待辦事項",
    en: "to-do items awaiting your approval",
  },
  "dashboard.hero.pending.title.singular": {
    zh: "筆需要由你核准的待辦事項",
    en: "to-do item awaiting your approval",
  },
  "dashboard.hero.pending.line1": { zh: "筆待辦", en: "to-do" },
  "dashboard.hero.pending.line2": {
    zh: "等候你的決定",
    en: "awaiting your approval",
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
  "dashboard.hero.stats.oldest": { zh: "最早待辦", en: "Oldest pending" },
  "dashboard.hero.stats.oldestValue": { zh: "2 分鐘前", en: "2 min ago" },
  "dashboard.hero.stats.agents": { zh: "跨 agent 數", en: "Unique agents" },
  "dashboard.ambient": {
    zh: "今天 agent 幫你處理了 {tx} 筆交易、總共花 {spent} USDC．支出比昨天{dir} {pct}%。",
    en: "Agents handled {tx} transactions today, spending {spent} USDC total — spending is {dir} {pct}% vs. yesterday.",
  },
  "dashboard.ambient.more": { zh: "多", en: "up" },
  "dashboard.ambient.less": { zh: "省", en: "down" },

  "dashboard.details.title": { zh: "詳細數據", en: "Detailed analytics" },
  "dashboard.details.sub": {
    zh: "累積支出追蹤、每個 agent 的預算使用率",
    en: "Cumulative spending and per-agent budget usage",
  },
  "dashboard.burn.title": { zh: "累積支出追蹤", en: "Cumulative spending tracker" },
  "dashboard.burn.sub": { zh: "切換不同期間查看", en: "Switch between time ranges" },
  "dashboard.burn.monthUsage": { zh: "本月", en: "This month" },
  "dashboard.metric.today.label": { zh: "今日交易", en: "Today" },
  "dashboard.metric.today.unit": { zh: "筆", en: "txns" },
  "dashboard.metric.today.range": { zh: "近 7 天", en: "7D" },
  "dashboard.metric.today.sub": {
    zh: "由 {agents} 個 agent 代為執行",
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
  "dashboard.agents.title": { zh: "Agent 本月使用率", en: "Agent budget usage" },
  "dashboard.agent.paused": { zh: "已暫停", en: "Paused" },
  "dashboard.agents.usedThisMonth": { zh: "本月已用", en: "Used this month" },
  "dashboard.agents.monthlyBudget": { zh: "月度預算", en: "Monthly budget" },

  // ==================== Feed ====================
  "feed.title": { zh: "最近動態", en: "Recent activity" },
  "feed.viewAll": { zh: "看完整日誌", en: "See full audit log" },
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

  "fab.simulate": { zh: "模擬 agent 行為", en: "Simulate agent" },

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
  "approvals.eyebrow": { zh: "Approvals", en: "Approvals" },
  "approvals.title": { zh: "等候審核", en: "Waiting on you" },
  "approvals.desc": {
    zh: "這裡是所有超出規則邊界的 agent 請求。每張卡都把 agent 的推理翻成人話，幫你 30 秒內決定放行或終止。",
    en: "Agent requests that fell outside your rules. Each card translates the agent's reasoning into plain language so you can decide in under 30 seconds.",
  },
  "approvals.badge": { zh: "筆待你決定", en: "need your decision" },
  "approvals.next": { zh: "下一筆待審核", en: "Next approval" },
  "approvals.empty": {
    zh: "所有待審處理完，這裡就會乾淨．agent 會自己在規則內做事．你什麼都不用做。",
    en: "When everything's handled, this page goes calm. Agents work within the rules. You don't have to do anything.",
  },

  "approval.severity.info": { zh: "資訊提示", en: "Heads-up" },
  "approval.severity.warning": { zh: "建議審核", en: "Worth a review" },
  "approval.severity.danger": { zh: "高風險．請詳閱", en: "High risk — read carefully" },

  "approval.counterBadge": { zh: "Agent 備案", en: "Agent's counter-offer" },
  "approval.requestedPay": { zh: "請求支付", en: "is requesting" },
  "approval.why": { zh: "Agent 為什麼要花這筆錢", en: "Why the agent wants to spend this" },
  "approval.context": { zh: "脈絡", en: "Context" },
  "approval.context.taskId": { zh: "目前任務", en: "Current task" },
  "approval.context.spentOnTask": { zh: "任務已花", en: "Spent on task" },
  "approval.context.remaining": { zh: "任務剩餘預算", en: "Remaining budget" },
  "approval.context.trust": { zh: "商戶信任度", en: "Merchant trust" },
  "approval.context.similar": { zh: "過去類似交易", en: "Similar past transactions" },
  "approval.context.similarUnit": { zh: "筆", en: "" },
  "approval.triggered": { zh: "觸發規則：", en: "Triggered rule: " },

  "approval.trust.allowlisted": { zh: "白名單商戶", en: "Allowlisted merchant" },
  "approval.trust.blocklisted": { zh: "黑名單商戶", en: "Blocklisted merchant" },
  "approval.trust.review": { zh: "審核中．首次交易", en: "Under review — first transaction" },
  "approval.trust.firstTime": { zh: "首次交易", en: "First transaction" },

  "approval.action.approve": { zh: "單次核准", en: "Approve once" },
  "approval.action.allow": { zh: "核准並加入白名單", en: "Approve & allowlist" },
  "approval.action.counter": { zh: "要求 agent 提備案", en: "Ask for an alternative" },
  "approval.action.counterDisabled": {
    zh: "這筆沒有備案可提",
    en: "No alternative is available for this request",
  },
  "approval.action.reject": { zh: "終止這筆", en: "Reject" },

  "approval.handled.title": { zh: "已處理 · {merchant}", en: "Handled · {merchant}" },
  "approval.handled.hint": { zh: "下一筆審核會自動遞補到這裡", en: "Next approval will take this spot" },
  "approval.handled.undo": { zh: "還原", en: "Undo" },

  "approval.toast.approved.title": { zh: "已核准 {agent} 的支付", en: "Approved {agent}'s payment" },
  "approval.toast.approved.desc": {
    zh: "{merchant}．{amount} USDC．單次生效",
    en: "{merchant}．{amount} USDC．One-time",
  },
  "approval.toast.allowed.title": { zh: "已核准並加入白名單", en: "Approved & allowlisted" },
  "approval.toast.allowed.desc": {
    zh: "{merchant} 未來將自動放行",
    en: "{merchant} will pass automatically from now on",
  },
  "approval.toast.rejected.title": { zh: "已終止這筆交易", en: "Transaction rejected" },
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
    zh: "三層管 agent：類別額度、單筆上限、信任名單。超出邊界就會自動進 Approvals 排隊等你決定。",
    en: "Three layers define agent autonomy: category budgets, per-transaction caps, and merchant trust lists. Anything over the line joins your approval queue.",
  },
  "rules.newRule": { zh: "新增規則", en: "New rule" },
  "rules.categories.title": { zh: "類別額度", en: "Category budgets" },
  "rules.categories.desc": {
    zh: "四種預設類別大部分用得到，也可以自己加。每一類的月度額度和單筆上限都能獨立調整。",
    en: "Four presets cover most agent use cases. You can add your own. Monthly budget and per-transaction cap are independent per category.",
  },
  "rules.trust.title": { zh: "商戶信任名單", en: "Merchant trust lists" },
  "rules.trust.desc": {
    zh: "白名單自動放行、黑名單直接拒絕、審核中的商戶每一筆都要過你的眼。",
    en: "Allowlisted merchants pass automatically, blocklisted ones get denied, merchants under review need your approval each time.",
  },
  "rules.trust.tab.allow": { zh: "白名單", en: "Allowlist" },
  "rules.trust.tab.block": { zh: "黑名單", en: "Blocklist" },
  "rules.trust.tab.review": { zh: "審核中", en: "Under review" },
  "rules.trust.manage": { zh: "管理", en: "Manage" },
  "rules.trust.remove": { zh: "移除", en: "Remove" },
  "rules.trust.removed.title": { zh: "已移除 {merchant}", en: "Removed {merchant}" },
  "rules.trust.removed.desc.allow": {
    zh: "未來 agent 碰到這個商戶不再自動放行",
    en: "Agents will no longer auto-approve this merchant",
  },
  "rules.trust.removed.desc.block": {
    zh: "這個商戶解除封鎖",
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

  "rules.card.monthTotal": { zh: "/ 月", en: "/ mo" },
  "rules.card.singleLimit": { zh: "單筆上限", en: "Per-transaction cap" },
  "rules.card.remaining": { zh: "剩餘額度", en: "Remaining" },
  "rules.card.adjust": { zh: "調整", en: "Edit" },

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
  "audit.eyebrow": { zh: "Audit Trail", en: "Audit Trail" },
  "audit.title": { zh: "決策日誌", en: "Decision log" },
  "audit.desc": {
    zh: "每一筆 agent 支付、你的決定、agent 的推理都在這裡。可以依 agent 或決策類型篩選，展開看完整脈絡，一鍵匯出 CSV 給會計或合規用。",
    en: "Every agent payment, your decision, and the reasoning behind it. Filter by agent or decision type, expand for full context, and export CSV for finance or compliance.",
  },
  "audit.export": { zh: "匯出完整日誌", en: "Export full log" },
  "audit.exported.title": { zh: "已匯出完整日誌", en: "Full audit log exported" },
  "audit.exported.desc": {
    zh: "{n} 筆紀錄已下載為 CSV",
    en: "{n} rows saved as CSV",
  },
  "audit.filter.all": { zh: "全部", en: "All" },
  "audit.filter.approved": { zh: "核准", en: "Approved" },
  "audit.filter.rejected": { zh: "拒絕", en: "Rejected" },
  "audit.filter.auto": { zh: "自動放行", en: "Auto" },
  "audit.filter.allAgents": { zh: "所有 Agent", en: "All agents" },
  "audit.copyCsv": { zh: "複製 CSV", en: "Copy CSV" },
  "audit.copied.title": { zh: "已複製 CSV", en: "CSV copied" },
  "audit.copied.desc": { zh: "共 {n} 筆資料", en: "{n} rows" },
  "audit.empty": { zh: "沒有符合條件的紀錄", en: "No records match those filters" },

  "audit.decision.approved": { zh: "核准", en: "Approved" },
  "audit.decision.rejected": { zh: "拒絕", en: "Rejected" },
  "audit.decision.auto": { zh: "自動放行", en: "Auto" },
  "audit.expand.reasoning": { zh: "Agent Reasoning", en: "Agent reasoning" },
  "audit.expand.userAction": { zh: "你的決定", en: "Your decision" },
  "audit.field.tx": { zh: "鏈上回執", en: "On-chain receipt" },
  "audit.field.gas": { zh: "Gas 費用", en: "Gas fee" },
  "audit.field.approvedBy": { zh: "審核者", en: "Decided by" },
  "audit.field.time": { zh: "時間戳", en: "Timestamp" },
  "audit.approvedBy.user": { zh: "Megan（你）", en: "Megan (you)" },
  "audit.approvedBy.system": { zh: "系統規則引擎", en: "System rule engine" },
  "audit.eu": { zh: "EU AI Act · Art. 14 合規可追溯", en: "EU AI Act · Art. 14 traceable" },

  // ==================== Welcome modal ====================
  "welcome.badge": { zh: "Interactive Prototype", en: "Interactive Prototype" },
  "welcome.timeHint": { zh: "閱讀時間約 3 分鐘", en: "~3 min read" },
  "welcome.title": { zh: "歡迎來到 soon-ga.agent control hub", en: "Welcome to soon-ga.agent control hub" },
  "welcome.desc": {
    zh: "這是 AI agent 支付控制層的互動原型。所有資料都是模擬的，不會真的付錢、不會上鏈、你的操作也不會離開這個瀏覽器。",
    en: "An interactive prototype of an AI agent payment control layer. All data is simulated — no real payments, no on-chain transactions, nothing leaves your browser.",
  },
  "welcome.tryTitle": { zh: "試試看這幾個", en: "Suggested things to try" },
  "welcome.s1.title": { zh: "用右下橘色按鈕", en: "Use the orange button (bottom-right)" },
  "welcome.s1.desc": {
    zh: "模擬一筆新的 agent 支付．每 3 秒也會自動產生",
    en: "Triggers a simulated agent transaction. A new one also appears every 3 seconds",
  },
  "welcome.s2.title": {
    zh: "去 /approvals 按「要求 agent 提備案」",
    en: "Hit \"Ask for an alternative\" on /approvals",
  },
  "welcome.s2.desc": {
    zh: "10 秒後 agent 會丟回新方案，走一遍完整的決策迴圈",
    en: "The agent sends a counter-offer in 10 seconds — watch the full decision loop",
  },
  "welcome.s3.title": { zh: "去 /rules 新增自訂類別", en: "Add a custom category on /rules" },
  "welcome.s3.desc": {
    zh: "把你的 agent 支付場景分類、設月額度與單筆上限",
    en: "Group your agent spending into buckets with monthly and per-transaction caps",
  },
  "welcome.s4.title": { zh: "去 /audit 篩選後匯出", en: "Filter & export on /audit" },
  "welcome.s4.desc": {
    zh: "按 agent 或決策類型篩選，一鍵複製 CSV",
    en: "Filter by agent or decision type, then copy a CSV in one click",
  },
  "welcome.s5.title": { zh: "側邊連接假錢包", en: "Connect the mock wallet" },
  "welcome.s5.desc": {
    zh: "示範錢包狀態、餘額、授權 agent 的 UX，不上鏈",
    en: "Showcases the wallet UX — balance, authorized agents, disconnect — no blockchain",
  },
  "welcome.footer": {
    zh: "PM 作品集的產品 demo．不是要上線的產品．不會收集任何資料．",
    en: "A PM portfolio product demo · not a production product · no data is collected.",
  },
  "welcome.cta": { zh: "開始試玩", en: "Start exploring" },

  // Guide — what is it
  "welcome.what.title": { zh: "這個產品在做什麼？", en: "What does this do?" },
  "welcome.what.body": {
    zh: "soon-ga.agent 是你 AI agent 的支付控制層。你制訂規則、行使最終決策，AI 在規則內自主運作，超出邊界時才需要你介入。",
    en: "soon-ga.agent is the payment control layer for your AI agents. You set the rules and make the final calls; agents work autonomously within them. You only step in when something goes out of bounds.",
  },

  // Guide — four modules
  "welcome.modules.title": { zh: "四個模組", en: "Four modules" },
  "welcome.module.dashboard.title": { zh: "總覽（Command Center）", en: "Dashboard (Command Center)" },
  "welcome.module.dashboard.desc": {
    zh: "一頁看此刻有沒有事要決定．沒事就安靜、有事亮橘色。",
    en: "A single page answering: do I need to decide anything right now? Calm when no, alerts when yes.",
  },
  "welcome.module.rules.title": { zh: "規則引擎（Rule Engine）", en: "Rule Engine" },
  "welcome.module.rules.desc": {
    zh: "類別預算、單筆上限、商戶信任名單三層決定 agent 的自主邊界。",
    en: "Three layers: category budgets, per-transaction caps, and merchant trust lists.",
  },
  "welcome.module.approvals.title": { zh: "等候審核（Approvals）", en: "Approvals" },
  "welcome.module.approvals.desc": {
    zh: "Agent 推理翻成人話．30 秒內決定放行、拒絕、或請它提備案。",
    en: "Agent reasoning in plain language. Decide in 30 seconds: approve, reject, or ask for a counter-offer.",
  },
  "welcome.module.audit.title": { zh: "決策日誌（Audit Trail）", en: "Audit Trail" },
  "welcome.module.audit.desc": {
    zh: "每一筆 agent 決定都可追溯．一鍵匯出 CSV 給會計或合規。",
    en: "Every agent decision is traceable. Export CSV for finance or compliance in one click.",
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
    zh: "規則引擎上鏈 enforce（ERC-4337 Session Keys 或鏈下 relayer）",
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
    zh: "通知開好了．有 agent 要你決定的時候會跳到這裡",
    en: "Alerts are on. You'll see one here when an agent needs you.",
  },

  // ==================== Trust list add ====================
  "trust.add.allow": { zh: "加入白名單", en: "Add to allowlist" },
  "trust.add.block": { zh: "加入黑名單", en: "Add to blocklist" },
  "trust.add.title.allow": { zh: "新增白名單商戶", en: "Add merchant to allowlist" },
  "trust.add.title.block": { zh: "新增黑名單商戶", en: "Add merchant to blocklist" },
  "trust.add.desc.allow": {
    zh: "白名單商戶以後 agent 碰到都自動放行，不用每次找你審核。加入前會先做線上安全偵測。",
    en: "Allowlisted merchants will auto-approve without asking you each time. We run a safety check before adding.",
  },
  "trust.add.desc.block": {
    zh: "黑名單商戶 agent 碰到會直接拒絕。加入前會先做線上安全偵測確認原因。",
    en: "Blocklisted merchants are rejected outright. We run a safety check first to confirm the reason.",
  },
  "trust.add.merchantLabel": { zh: "商戶名稱或網址", en: "Merchant name or URL" },
  "trust.add.merchantPlaceholder": {
    zh: "例：openai.com、Booking.com",
    en: "e.g., openai.com, Booking.com",
  },
  "trust.add.categoryLabel": { zh: "類別", en: "Category" },
  "trust.add.reasonLabel": { zh: "拒絕原因", en: "Reason" },
  "trust.add.reasonPlaceholder": {
    zh: "為什麼要擋這家商戶？（一句話描述）",
    en: "Why are you blocking this merchant? (one line)",
  },
  "trust.add.submit.allow": { zh: "加入白名單", en: "Add to allowlist" },
  "trust.add.submit.block": { zh: "加入黑名單", en: "Add to blocklist" },
  "trust.add.confirm.risky": {
    zh: "⚠ 偵測到這家商戶有高風險．還是要加白名單嗎？",
    en: "⚠ Warning: risk indicators detected. Are you sure you want to allowlist this?",
  },
  "trust.add.confirm.safe": {
    zh: "這家商戶看起來沒有風險訊號．還是要加黑名單嗎？",
    en: "Note: no risk signals detected. Are you sure you want to blocklist this?",
  },
  "trust.add.missing": { zh: "先填商戶名稱", en: "Please enter a merchant name first" },
  "trust.add.toast.allow.title": {
    zh: "已加入白名單：{merchant}",
    en: "Added {merchant} to allowlist",
  },
  "trust.add.toast.allow.desc": {
    zh: "以後 agent 碰到它就自動放行",
    en: "Agents will auto-approve this merchant from now on",
  },
  "trust.add.toast.block.title": {
    zh: "已加入黑名單：{merchant}",
    en: "Added {merchant} to blocklist",
  },
  "trust.add.toast.block.desc": {
    zh: "以後 agent 碰到它會被直接擋掉",
    en: "Agents will be rejected when hitting this merchant",
  },

  // Safety check UI
  "safety.title": { zh: "線上安全偵測", en: "Online safety check" },
  "safety.checking": { zh: "檢查中⋯", en: "Checking⋯" },
  "safety.score": { zh: "安全分數", en: "Safety score" },
  "safety.level.safe": { zh: "安全", en: "Safe" },
  "safety.level.caution": { zh: "注意", en: "Caution" },
  "safety.level.risky": { zh: "高風險", en: "High risk" },
  "safety.signalsTitle": { zh: "偵測到的訊號", en: "Signals detected" },
  "safety.emptyInput": { zh: "輸入商戶後會自動檢查", en: "Safety check runs as you type" },

  // ==================== Unified New Rule Dialog ====================
  "rules.unified.chooser.title": { zh: "要新增哪一種規則？", en: "What kind of rule?" },
  "rules.unified.chooser.desc": {
    zh: "先選類型．類別管預算邊界，名單管個別商戶的信任度",
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
    zh: "例：「每月 50 USDC 買學術論文」、「Booking.com 加入白名單」",
    en: 'e.g. "$50/mo for academic papers", "allowlist Booking.com"',
  },
  "rules.ai.inputLabel": { zh: "用自己的話描述規則", en: "Describe the rule" },
  "rules.ai.placeholder": {
    zh: "例：讓 ResearchBot 每月最多花 50 USDC 在學術論文上",
    en: "e.g. Let ResearchBot spend up to $50/month on academic papers",
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
    zh: "AI 建議加入白名單",
    en: "AI suggests an allowlist entry",
  },
  "rules.ai.result.categoryName": { zh: "類別名稱", en: "Category name" },
  "rules.ai.result.description": { zh: "描述", en: "Description" },
  "rules.ai.result.monthly": { zh: "每月上限", en: "Monthly cap" },
  "rules.ai.result.single": { zh: "單筆上限", en: "Per-transaction cap" },
  "rules.ai.result.merchant": { zh: "商家", en: "Merchant" },
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
    zh: "切換到放行商戶",
    en: "Switch to allowlist",
  },
  "rules.unified.chooser.category.title": { zh: "類別預算", en: "Category budget" },
  "rules.unified.chooser.category.desc": {
    zh: "給某類支出設月度上限與單筆限額",
    en: "Set monthly cap and per-transaction limit for a spending category",
  },
  "rules.unified.chooser.category.example": {
    zh: "例：AI 服務每月 $80、單筆上限 $5",
    en: "e.g. AI services — $80/mo, $5 max per transaction",
  },
  "rules.unified.chooser.allow.title": { zh: "放行商戶（白名單）", en: "Allowlist merchant" },
  "rules.unified.chooser.allow.desc": {
    zh: "這家商戶我信任．agent 碰到它就自動放行",
    en: "Trust this merchant — agents auto-approve every time",
  },
  "rules.unified.chooser.allow.example": {
    zh: "例：OpenAI API、NYT",
    en: "e.g. OpenAI API, NYT",
  },
  "rules.unified.chooser.block.title": { zh: "封鎖商戶（黑名單）", en: "Blocklist merchant" },
  "rules.unified.chooser.block.desc": {
    zh: "這家商戶一律不能付錢．agent 碰到會被直接擋掉",
    en: "Never allow payments here — agents get rejected outright",
  },
  "rules.unified.chooser.block.example": {
    zh: "例：meme-nft-drop.xyz",
    en: "e.g. meme-nft-drop.xyz",
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
