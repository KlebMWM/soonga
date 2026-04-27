# soon-ga.agent control hub

**讓你的 AI 擁有錢包，你擁有遙控器。**
**Give your AI a wallet. Keep the remote in your hand.**

AI agent 支付控制層的互動產品原型．2026 Q2 portfolio 作品．
Interactive product prototype for an AI agent payment control layer．Portfolio piece, Q2 2026.

**🔗 Live demo → [soonga.vercel.app](https://soonga.vercel.app)**

> 🔸 **這是互動式產品原型**．核心商業邏輯都是 mock，不會真的付錢、不會上鏈．
> 🔸 **This is an interactive prototype**．Core business logic is mocked．No real payments, no on-chain transactions.

![soon-ga.agent control hub dashboard](docs/hero.png)

---

## 🇹🇼 中文

### 在解什麼問題

2026 Q2，48 萬個 AI agent 已經透過 Coinbase Agentic.Market 的 x402 協議自己發起交易，累計 1.65 億美元。但**主人端的管理工具還沒跟上**——市面上的錢包只能設總額度、顯示冷冰冰的「請求支付 X 塊」，沒有類別預算、沒有時段限制、更沒有決策審計。soon-ga.agent control hub 填這個缺口。

### 四個核心模組

- **Command Center**（`/dashboard`）：一眼看完「我現在要不要決定什麼」。沒事就安靜，有事就亮琥珀色。
- **Rule Engine**（`/rules`）：類別額度、單筆上限、信任名單三層管 AI 助理。超出邊界就會自動進入待審核等你確認。
- **Contextual Approval**（`/approvals`）：把事件 metadata 與規則命中整理成白話．「需要花這筆費用的理由」+「需要審核原因」+「觸發哪條規則」．支援「請 AI 找替代方案」的完整迴圈（按下去 10 秒後新方案會送回來）。
- **Decision Audit**（`/audit`）：每一筆決策的來源平台、模擬回執、規則說明、你的覆核都可追溯．這是 user-facing product history，不是給 regulator / auditor / enterprise control 用的合規級 audit log．可匯出 CSV。

### 跨 AI 平台定位

soon-ga.agent 是 **provider-agnostic governance layer**：不取代 ChatGPT、Claude、Gemini 或自訂 agent，也不做模型路由。原型用 mock 標籤呈現不同 AI 來源如何進同一個付款治理層，讓使用者用一套規則、審核、審計流程管理跨平台 agent 行為。

### MVP 驗證假設

這個 MVP 不假設大眾使用者今天已經在管理多個可付款 AI agent。它驗證的是：當未來 agentic payment 場景出現時，使用者是否能理解並操作一個控制層，清楚看懂付款事件、核准規則、風險說明與過往決策紀錄，並覺得整件事可控。

### 產品形態

MVP 是一個獨立 web dashboard，用來審核 agent payment events、設定花費規則、查看 user-facing audit history。Browser extension、mobile app、wallet-embedded UI、直接串接 AI platform 都是未來可能的 surface，不在 MVP 範圍。

### 視覺語言

淺暖底 + 結構性卡片的支付控制台調性．配色語意刻意分清楚：

- **黃** = CTA / 品牌記號 / Hero 大數字（要你看的）
- **琥珀** = 待審核 / 警告（需要你決定的）
- **Sage 綠** = 自動核准 / 安全（已經處理掉的）
- **IKEA 藍** = 系統訊號 / 互動 affordance（可以操作的）

### 原型範圍：什麼是 mock，什麼是真的

| 是 mock（為了講清楚產品規格） | 是真的（瀏覽器原生能力） |
|---|---|
| 待審核佇列 / 規則執行 | 瀏覽器桌面通知（Web Notification API） |
| Audit history / 模擬回執 | localStorage 顯示名稱個人化 |
| AI 助理推理 / counter-offer | zh / en 切換 |
| 錢包餘額 / x402 交易 | CSV 匯出 |
| 後端持久化 / 多裝置同步 | 規則設定在單一瀏覽器工作階段跨路由保留 |
| 真實 ChatGPT / Claude / Gemini API 串接 | 跨 AI 平台來源標籤與篩選（mock） |
| AI 規則解析（mock heuristics，非真實 LLM） | |

### 為什麼用 mock data 而不接真 API

這是**產品原型**不是 MVP。mock data 的目的是在不被 infra 拖住的情況下，專注把產品規格、UX 決策、資訊密度、互動邏輯一次講清楚。Phase 2 才是接 x402 測試網 + 真實 wallet．

### 下一階段（Phase 2）

這個原型完成的是面向使用者的探索層。Phase 2 把設計變成真產品，整合下面的 Web3 stack。每一項都選有理由，不是 buzzword 蒐集。

**wagmi + RainbowKit**
消費者錢包連線需要熟悉的 UX 模板。RainbowKit 提供業界標準的連接體驗，wagmi 處理底層 React hooks。

**ERC-4337 Account Abstraction**
spending limit 在 wallet layer 強制比 application layer 可信。Session keys 讓規則引擎的限額在鏈上強制執行，不只靠前端 UI。

**x402**
HTTP-native 的 agent payment 是這層的標準。當 AI agent 遇到付費 API 時用 x402 自動支付，不需要人類介入或預先充值帳號。

**事件來源策略**
真實付款整合不在 MVP 範圍。未來事件來源可能來自 agent-owned wallets、user-controlled proxy wallets / delegated spending accounts，或 AI 平台未來提供的 payment event API / webhook。現在先用 mock events 驗證 governance UX，再決定要押哪條 integration path。

**On-chain audit trail**
支付控制台的核心承諾就是可追溯。鏈上紀錄可能成為未來存證來源，但 MVP 只呈現 product-level history，不宣稱合規級 audit logging。

**注意：以上整合在 Phase 2 完成之前不會 demo。這段是設計探索的後續路徑，不是已實現的功能。**

### MVP 成功標準

1. 7 位測試者中至少 5 位能在看完交易卡後說明為什麼這筆付款需要核准。
2. 7 位測試者中至少 5 位能在不額外解釋下新增或修改一條花費規則。
3. 7 位測試者中至少 5 位能找到過往 agent actions 與 approval history 存在哪裡。
4. 7 位測試者中至少 4 位覺得 dashboard 讓 agent spending 更可控。
5. 測試者能區分 user-facing audit history 與 compliance-grade audit logs。

### 技術選擇

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Base UI + shadcn · recharts · sonner · lucide-react

---

## 🇺🇸 English

### The problem

By Q2 2026, 480,000+ AI agents have initiated $165M in transactions through Coinbase Agentic.Market via the x402 protocol. But the **owner-side tooling has not caught up**—existing wallets only offer a single total budget and cold "Request to pay X USDC" prompts. No category budgets, no rule-based approval explanations, no audit trail. soon-ga.agent control hub fills that gap.

### Four core modules

- **Command Center** (`/dashboard`): At-a-glance answer to "do I need to decide anything right now?" Calm when nothing needs you; amber alert when something does.
- **Rule Engine** (`/rules`): Three layers govern your AI agent—category budgets, per-transaction caps, and merchant trust lists. Anything out of bounds joins the approval queue.
- **Contextual Approval** (`/approvals`): Turns event metadata and rule matches into plain language: why this purchase is being attempted, why it needs review, and which rule it tripped. Full counter-offer loop: ask the agent for an alternative and a new proposal lands in ~10 seconds.
- **Decision Audit** (`/audit`): Every decision's source platform, mock receipt, rule-based explanation, and your verdict are traceable. This is user-facing product history, not compliance-grade audit logging for regulators, auditors, or enterprise controls. CSV export included.

### Cross-AI platform framing

soon-ga.agent is a **provider-agnostic governance layer**: it does not replace ChatGPT, Claude, Gemini, or custom agents, and it is not a model router. The prototype uses mock source labels to show how different AI origins can land in one payment-governance layer, where users manage cross-platform agent behavior through the same rules, approvals, and audit trail.

### MVP validation hypothesis

This MVP does not assume mainstream users already manage multiple payment-enabled AI agents today. It tests whether users can understand and operate a control layer for future agentic-payment scenarios: agent spending events, approval rules, risk explanations, and audit history should feel understandable and controllable.

### Product form

The MVP is a standalone web dashboard for reviewing agent payment events, configuring spending rules, and inspecting user-facing audit history. Browser extension, mobile app, wallet-embedded UI, and direct platform integrations are future surfaces, not MVP scope.

### Visual language

A warm-light surface with structural cards—a payment control hub feel rather than a dark HUD. Colors carry strict semantic roles:

- **Yellow** = CTA, brand marks, hero numerals (look here)
- **Amber** = pending / warning (needs your call)
- **Sage** = auto-approved / safe (already handled)
- **IKEA blue** = system signal, interactive affordance (act here)

### Prototype scope — what's mock vs real

| Mocked (so the product spec stays the focus) | Actually working (native browser capabilities) |
|---|---|
| Pending queue / rule enforcement | Browser desktop notifications (Web Notification API) |
| Audit history / mock receipts | localStorage display-name personalization |
| Rule-based explanations / counter-offers | zh / en locale switching |
| Wallet balance / x402 transactions | CSV export |
| Backend persistence / multi-device sync | Rule edits persist across routes in the same browser session |
| Real ChatGPT / Claude / Gemini API integrations | Cross-AI source labels and filters (mock) |
| AI rule parsing (mock heuristics, not a real LLM) | |

### Why mock data instead of real APIs

This is a **product prototype**, not an MVP. Mock data lets the prototype focus on product spec, UX decisions, information density, and interaction logic—without getting dragged into infrastructure. Phase 2 will integrate x402 testnet and real wallets.

### Phase 2

This prototype is the user-facing exploration layer. Phase 2 turns the design into a real product by integrating the Web3 stack below. Each item is chosen for a specific reason, not buzzword bingo.

**wagmi + RainbowKit**
Consumer wallet connection needs familiar UX patterns. RainbowKit provides the industry-standard connection flow, wagmi handles React hooks underneath.

**ERC-4337 Account Abstraction**
Spending limits enforced at the wallet layer are more trustworthy than at the application layer. Session keys let the rule engine enforce caps on-chain, not just in UI.

**x402**
HTTP-native agent payments are emerging as the standard for this layer. When an AI agent hits a paywalled API, x402 lets it auto-pay without human intervention or pre-funded accounts.

**Future event source strategy**
Real payment integrations are outside the MVP scope. Future event sources may include agent-owned wallets, user-controlled proxy wallets or delegated spending accounts, and platform-native payment event APIs or webhooks if AI platforms expose them later. The current prototype uses mock events to validate the governance UX before committing to a specific integration path.

**On-chain audit trail**
The core promise of a payment control hub is traceability. On-chain records may become a future evidence source, but the MVP only presents product-level history and does not claim compliance-grade audit logging.

**Note: None of the above is demo-able until Phase 2 ships. Listed as forward roadmap, not current capability.**

### MVP Success Criteria

1. 5 out of 7 testers can explain why a pending payment needs approval after viewing the transaction card.
2. 5 out of 7 testers can create or edit a spending rule without additional explanation.
3. 5 out of 7 testers can find where past agent actions and approval history are stored.
4. At least 4 out of 7 testers say the dashboard makes agent spending feel more controllable.
5. Testers can distinguish user-facing audit history from compliance-grade audit logs.

### Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Base UI + shadcn · recharts · sonner · lucide-react

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)．

第一次打開會看到 **Welcome Modal**，可以輸入希望 AI 助理怎麼稱呼你（保存在瀏覽器本機，不會上傳）．Dashboard hero 的問候會用這個名字．Sidebar 底部「原型說明」可以重新打開這個 modal．
The first visit shows a **Welcome Modal** where you can set a display name (stored locally in your browser, never uploaded). The Dashboard greeting uses it. The "Prototype guide" entry at the bottom of the sidebar reopens the modal.

訪問 [http://localhost:3000?demo=1](http://localhost:3000?demo=1) 或在 dev mode 下會看到右下角浮出 **Demo Controls** 面板：切換深淺模式、處理一筆待審核、切換空態 / 待審核態、重置 demo．
Visit `?demo=1` (or run in dev mode) to surface a floating **Demo Controls** panel: toggle theme, resolve a pending item, swap empty / pending state, reset demo.

zh / en 切換在右上角 TopBar．The locale switcher lives in the top-right TopBar.

## Deployment

可部署至 Vercel．`npm run build` 為四個路由產出靜態頁面，沒有 backend、沒有 Node 20+ 之外的 runtime 依賴．
Deployable to Vercel. `npm run build` produces static pages for all four routes—no backend, no runtime dependencies beyond Node 20+.

---

*Built by Megan · 2026 · All personas and transactions are fictional.*
