# soon-ga.agent — Case Study

A consumer-facing control hub for AI agent payments. Concept prototype.

```
Status     Concept prototype, public live demo, no backend, no real wallet
Live       https://soonga.vercel.app
Source     https://github.com/KlebMWM/soonga
Role       Solo PM / designer / vibe coder
Built      2026 Q1 — Q2, ~7 sprints
Stack      Next.js 16, React 19, TypeScript, Tailwind, shadcn/ui
```

---

## How to read this / 閱讀路徑

If you only have 30 seconds: read the TL;DR below, then jump to section 4 What shipped.
If you have 5 minutes: add section 1 Problem and section 3 Design decisions.
If you're reading deeply: sections 2, 5, 6 carry the design narrative and reflection.

如果你只有 30 秒：讀完下面的 TL;DR，看 section 4 What shipped。
如果你有 5 分鐘：再加 section 1 Problem 跟 section 3 Design decisions。
如果你想看完：section 2、5、6 是設計脈絡與 reflection，從上到下讀。

---

## TL;DR / 一句話定位

soon-ga.agent does not try to build another agent wallet or payment rail. It explores the missing user-facing control layer for agentic payments: rules, approval queues, plain-language explanations, and audit trails that help humans stay in charge.

soon-ga.agent 不主打做另一個 agent wallet 或支付軌道。它探索的是 agentic payments 裡缺少的使用者控制層：規則設定、待審核流程、白話化付款理由、可追溯的決策紀錄，讓人類仍然保有最後控制權。

---

## 1. Problem

### Why this exists

2026 年的市場現狀。AI agent 已經可以代表使用者花錢。OpenAI 跟 Stripe 共同推出 ACP 協議並整合進 ChatGPT，Mastercard 發表 Agent Pay，Visa 推出 Intelligent Commerce，Coinbase 用 x402 串起 stablecoin 支付。主流支付網路與 AI 平台都在推進 agentic commerce 基礎建設，但問題卡在三個地方。

第一，現有方案多數是 B2B 或開發者導向的工具。Skyfire、Crossmint、Payman 都有 dashboard，但目標客群偏向工程師與開發者，不是普通人晚上 11 點看的東西。

第二，控制邏輯散在各層。卡組織給的是 spend limit，wallet infra 給的是 policy validation，AI 平台給的是 conversational checkout。沒有一個地方讓使用者在單一介面裡管理「我的四個 AI 助理今天花了什麼、哪些需要我審核、哪些是被自動規則放行」。

第三，授權的解釋層缺席。Booking.com 132 USDC 的訂房不需要解釋，使用者已經知道自己訂了什麼。但 AI 自己決定要訂的時候，使用者需要知道「為什麼」「依據什麼判斷」「萬一錯了怎麼辦」。這層解釋是可以做的，但目前產品沒人做。

### Megan 的 23:18 場景

整個產品圍繞一個情境設計。

> Megan 是一位常出差的工作者，授權了四個 AI 助理：旅行助理、研究助理、採購助理、內容彙整。她設定的規則是「白名單商戶自動核准、單筆超過 100 USDC 要問我、實體店家比禮物卡更可信」這類人類語言。
>
> 23:18，她剛結束一場會議，打開筆電，登入 soon-ga.agent。她想知道三件事：今天 agent 做了什麼、什麼需要我介入、整體花得健不健康。
>
> 在三秒內看完。然後她可以決定要回去工作、要批准三筆待審核、還是直接闔上筆電去睡覺。

這個情境鎖定了所有設計決策。資訊密度、夜間視覺強度、待審核的呈現方式、empty state 的調性，全部回應這個場景。

---

## 2. Approach

### 市場分層觀察

把 agentic commerce 拆成五層看市場。

```
Layer 1   傳統卡組織                Visa, Mastercard, Amex
Layer 2   協議標準                  ACP, UCP, KYAPay, x402, Verifiable Intent
Layer 3   加密貨幣支付基建            Skyfire, Crossmint, Payman, Coinbase x402
Layer 4   AI 平台內建支付             ChatGPT Instant Checkout, Copilot Checkout
Layer 5   使用者控制台                soon-ga.agent 的位置
```

直接競品分析後得出結論。Skyfire、Payman、Crossmint、SpendSafe、Chimoney 等 4 到 6 家在做相似方向，但全部偏向 B2B 工程師工具。沒有任何一家把 consumer-grade UX、editorial design language、多 agent 統一管理、自然語言規則這個組合做成產品核心。

這是 soon-ga.agent 的定位空間。

### 設計哲學

把 AI agent 當成新進員工，使用者是部門主管。產品是 HR 辦公室，不是 Slack DM。

這個比喻決定了三件事。

第一，介面是 dashboard 不是 chat。chat 適合探索式對話，dashboard 適合監督式管理。Megan 不是要跟 agent 聊天，是要看他們的工作記錄。

第二，規則的設定要像寫員工守則，不是寫程式。所以規則引擎用自然語言，例如「採購助理單筆超過 50 美元要問我」。

第三，待審核的呈現要像批簽公文，不是按 Yes/No 對話框。需要決策摘要、風險提示、後果預覽，這三層讓主管能在 5 秒內做決定。

---

## 3. Design decisions

### 3.1 配色語意切割

最早版本黃色同時代表 CTA、警告、待審核、強調。視覺上很搶眼，但語意混亂。使用者看到黃色搞不清楚是「該點」「該注意」「有事發生」。

最終配色把黃色保留給 CTA 跟品牌記號，琥珀色獨立負責待審核跟警告，sage 綠負責自動核准跟安全狀態，IKEA 藍負責系統訊號跟互動。每個顏色一個角色，互不重疊。

| 顏色 | 語意 | 用在哪 |
|---|---|---|
| 黃 | CTA / 品牌記號 | logo tile, primary CTA, hero 大數字, Megan highlighter |
| 琥珀 | 待審核 / 警告 | ACTION REQUIRED pill, pending row 邊框 |
| Sage 綠 | 自動核准 / 安全 | auto-approved pill, mini-status, empty hero |
| IKEA 藍 | 系統訊號 / 互動 | sidebar, CTA outline, active state |

這個切割看起來簡單，實際做了 7 輪迭代才收斂。

### 3.2 字體選擇對抗工具感

金融類後台典型用無襯線字 + monospace，效率高但氣質冷。soon-ga.agent 在 display 層加入 Instrument Serif italic（Megan 名字、hero 大數字）跟 Noto Serif TC（深夜了、去睡吧），整個產品的調性從「工具」往「有品味的工具」推一階。

這個選擇有風險。serif 在 dashboard 不常見，可能讓金融用戶覺得不夠專業。但目標族群是 Megan 這類設計感受度高的工作者，不是傳統銀行客戶。所以 editorial 字體是該族群的記憶錨點，不是噪音。

### 3.3 Agent 命名走功能名

最初考慮給四個 agent 人格化名字（Maya、Kai、Rin、Lumi），目的是建立角色記憶跟品牌情感。Apple 的 Siri、Anthropic 的 Claude 都走這條路。

但深入想過後反向。金融場景下，使用者要在 1.5 秒內掃一列就知道是哪個 agent 在做什麼。「Maya 訂了 Booking.com」需要使用者先記得 Maya 是誰，「旅行助理訂了 Booking.com」零學習成本。

最終選擇功能命名。中文版顯示「旅行助理 / 研究助理 / 採購助理 / 內容彙整」，英文版顯示「Travel / Research / Shopping / Curator」。技術 ID 仍是 travel / research / shopping / newsletter，方便程式跟設計分離。

這個決定犧牲了一些品牌情感，換得使用者的決策清晰度。對金融類產品這個取捨是對的。

### 3.4 中英雙 locale 嚴格分層

多數 i18n 產品在中文模式下混入英文，例如「打開 Approvals 頁面」「查看 Audit Trail」。這個產品堅持中文模式就全中文，英文模式就全英文，避免使用者讀到一半被切語境。

唯一的例外是專有名詞。產品名 soon-ga.agent 不翻、貨幣 USDC 不翻、商家原名 Booking.com 不翻。這些是「全球性符號」，翻譯反而造成失真。

這個原則在 7 輪迭代裡被反覆校正，包括把「Approvals」翻成「待審核」、「使用者控制台」翻成「指揮中心」這類細節。

### 3.5 黑暗模式不是顏色反轉

22:00 後使用者打開產品，深色介面是必須的。但深色模式不能只是把白底換黑底。

最終的深色設計做了三件事。背景從純黑改為 `#0b1220` 深藍夜色，避免純黑的刺眼感。IKEA 藍主色從 `#5084d0` 換成偏暖的 `#6a95db`，避免深色背景下藍色顯得冷漠。背景格線 opacity 從 4% 降到 2.5%，視覺密度減半但保留軟 HUD 質感。

黃色 CTA 維持不變，因為黃在深色背景上對比反而更好。這是少數可以「不換」的色票。

### 3.6 跨模組整合走一致性 over 精準

Approvals 頁的「修改規則 / r 鍵」按下去會跳到 Rules 頁、預填當前商家、自動開啟 NewRuleUnifiedDialog。三種觸發原因不同的 pending 都走同一條路徑。超過類別單筆上限的 Booking.com 跳 allow tab，訂閱首次扣款的 Nature 期刊跳 allow tab，可儲值類型強制審核的 Amazon Gift Card 也跳 allow tab。

精準對應該長這樣。Booking.com 應該開啟對應的 CategoryRuleCard 直接改 singleLimit。Nature 期刊跟 Gift Card 應該各自新建一種目前還不存在的規則類型，例如訂閱白名單、儲值類型黑名單。三條 path 各做一條等於三倍工程量，且要在 PendingApproval 加 metadata 描述「該編的規則類型」、page 端做 dispatch、新增還沒有的 UI。

Prototype 階段選一致性大於精準。Reviewer 看 demo 動作流暢、context 帶過去就夠，「allow 不是最佳對應」是 second-order detail。Migration 路徑也乾淨。未來在 PendingApproval 加 suggestedRuleKind 欄位（category-edit / new-subscription / new-blocklist）加 page 端一個 switch，就能升級到精準分流，沒白寫。

這個取捨本身就是 PM 工作。寫進這裡是為了讓 reviewer 看到「為什麼選一致性」的思考，不是掩飾邊界。

---

## 4. What shipped

### 已完成的功能

```
✓ Dashboard 即時總覽（4 列 bento grid）
✓ Hero pending card（大數字、決策摘要、CTA）
✓ Activity feed（自動核准 / 待審核分流、規則 pill）
✓ 4 個 stat cards（今日交易、今日支出、自動化率、本月累積）
✓ Sidebar 桌面 / mobile 兩種版本
✓ Theme toggle（深淺模式 + localStorage 持久化）
✓ Locale toggle（中英文切換）
✓ Welcome Modal（display name 個人化 + 通知 scope 說明）
✓ Rules 頁面（規則列表 + 新增規則對話框）
✓ Approvals 頁面（待審核列表）
✓ Audit 頁面（完整交易紀錄）
✓ Notification permission pill（瀏覽器通知 demo）
✓ Demo Controls 浮動面板（dev mode + ?demo=1）
✓ Editorial empty state（夜已深 / 去睡吧）
✓ Row resolve 動畫（pending → sage → 滑出）
✓ Numeral morph 動畫（pending count 變化時）
✓ Breathing 呼吸點（live indicators）
```

### 真實 vs Mock 的邊界

對自己誠實，這是 prototype 不是 production。下表標清楚哪些是模擬的。

```
Mocked   待審核佇列、Audit log、AI 推理、錢包餘額、x402 交易、AI 規則解析
Real     Web Notification API、localStorage 顯示名稱、zh-en locale、CSV 匯出
```

AI 規則解析用的是 regex 假裝 LLM。不是真的 LLM call。

把這個邊界寫進 README 是刻意決定。對資深 PM reviewer 來說，明白「我哪裡是 mock 哪裡是 real」展現的是 PM 對 MVP 跟 production 的邊界判斷，比假裝全部都 real 更有說服力。

### 設計系統文件

`design-system/MASTER.md` 是這個產品的設計憲法，目前 v1.1。涵蓋 15 個章節，從產品定位、配色、字體、間距、動畫到組件 inventory、空態、agent 識別、UX copy、anti-patterns、pre-delivery checklist。每個設計決定都有 rationale。

`design-system/pages/dashboard.md` 是 dashboard 頁面的 override，記錄 dashboard 跟 master 不一樣的地方。

`design-system/preview.html` 是設計系統的可互動預覽，包含 demo 控制面板可以切換深淺模式、approve 一筆、看空態。

---

## 5. What's next

### v17 Approvals 體驗深化

下一個 sprint 的核心是 Approvals 頁面從「列表」升級成「決策面」。MASTER.md section 15 已寫完設計規範。三個元素：

**決策摘要**。把 agent 的推理翻譯成人話三行：在做什麼、為什麼、為什麼需要審核。不展示 JSON、不展示規則代號。

**風險 chips**。小型橫排徽章，每個 chip 對應一個風險維度（新商家、首次跨國、本月第 N 筆、超出限額）。色彩分 sage / amber / coral 三級。

**決策後果預覽**。每個動作按鈕下方列出「按下去之後會發生什麼」。例如核准會看到「立即扣款 / 確認信寄出 / 行事曆加入」三行。這層讓使用者在按按鈕前知道後果，把 leap of faith 變成 informed decision。

### Phase 2 真正的 Web3 整合

目前產品只是視覺原型，沒有真錢包、沒有真鏈上。Phase 2 的整合方向：

```
wagmi + RainbowKit       消費者錢包連線，符合主流 Web3 UX 期待
ERC-4337                  account abstraction 讓 spending limit 在 wallet layer 強制
x402                      HTTP-native agent payment 是這層的標準
on-chain audit trail      支付控制台的核心承諾就是可追溯，鏈上是可信存證
```

Phase 2 之前不會 demo 上述整合。這是設計探索的後續路徑，不是已實現的功能。

### Out of scope for prototype / 留給 Phase 2 的範圍

```
Onboarding 4 到 5 步引導   現在只有 Welcome Modal，缺後面的引導
Settings 獨立頁面          顯示名稱已能改，未來個人化會更多
鍵盤 power-user 操作       Approvals 頁的 j/k navigation 還沒實作
真實後端                   無 backend、無 auth、無多裝置同步
mobile push 通知           只有瀏覽器桌面通知 demo
```

---

## 6. Reflection

### 學到的事

**設計感不是裝飾，是定位力的展現。** 同樣是 agent payment dashboard，Skyfire、Payman、Crossmint 的視覺語言都是工程師工具感。soon-ga.agent 的 editorial 字體跟夜間調性看起來只是美學選擇，實際上是把產品從「dev tool」拉到「consumer product」的策略動作。

**寫設計系統文件比寫程式更重要。** 七輪迭代裡，每輪都會回到 MASTER.md 校準。沒有這份文件，圓角、配色、字體、命名會在每次 vibe coding 後漂移。文件是 source of truth，程式碼只是它的一個實例。

**Vibe coding 需要紀律。** 這個專案幾乎全部用 Claude / GPT 寫程式。但每次只跑一個 prompt、跑完用瀏覽器驗收、commit、再跑下一個。一次想做太多的話會引入難找的 bug。「先收尾再深化」這個原則救了很多時間。

**Mock 不丟人，假裝真實才丟人。** 第一次寫 README 時想把所有功能講得像真的 production。最後決定明列哪些是 mock 哪些是 real，反而更被人尊重。誠實是 PM 的競爭優勢。

### Phase 2 learning roadmap / 下一階段的學習計畫

- 真正接 Privy / RainbowKit 把錢包連線做出來
- 真正接 OpenAI Agents SDK 或 Anthropic Computer Use 跑一個 agent
- 用 Linear / Vercel 當參考做出更精緻的 motion 系統
- 寫一份 5 分鐘 walkthrough 影片，把產品故事講透

---

## Appendix

### 相關產出

- [README](https://github.com/KlebMWM/soonga/blob/main/README.md)
- Live demo: https://soonga.vercel.app
- Internal design system notes (not publicly released)
- Internal competitive research notes (not publicly released)

### 引用

部分研究來源整理。

- [Stripe 與 OpenAI 的 Agentic Commerce Protocol](https://stripe.com/blog/developing-an-open-standard-for-agentic-commerce)
- [Coinbase x402 protocol](https://www.coinbase.com/developer-platform/discover/launches/x402)
- [Visa Intelligent Commerce](https://corporate.visa.com/en/products/intelligent-commerce.html)
- [Mastercard Agent Pay](https://www.mastercard.com/us/en/business/artificial-intelligence/mastercard-agent-pay.html)
- [Skyfire 官網](https://skyfire.xyz/)
- [Crossmint Agent Wallets 對比](https://www.crossmint.com/learn/agent-wallets-compared)
- [Smashing Magazine: Designing for Agentic AI UX](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)

### 致謝

設計系統的 sparring partner 是 Claude（Anthropic）跟 GPT（OpenAI）。所有產出都經過人類審視跟決策，AI 是合作者而不是代寫者。

---

Built by Megan · 2026
