# soon-ga.agent control hub

**讓你的 AI 擁有錢包，你擁有遙控器。**
**Give your AI a wallet. Keep the remote in your hand.**

AI agent 支付控制層的互動產品原型．2026 Q2 portfolio 作品．
Interactive product prototype for an AI agent payment control layer．Portfolio piece, Q2 2026.

> 🔸 **這是互動式產品原型**．所有資料都是 mock，不會真的付錢、不會上鏈．
> 🔸 **This is an interactive prototype**．All data is mocked．No real payments, no on-chain transactions.

---

## 🇹🇼 中文

### 在解什麼問題

2026 Q2，48 萬個 AI agent 已經透過 Coinbase Agentic.Market 的 x402 協議自己發起交易，累計 1.65 億美元。但**主人端的管理工具還沒跟上**——市面上的錢包只能設總額度、顯示冷冰冰的「請求支付 X 塊」，沒有類別預算、沒有時段限制、更沒有決策審計。soon-ga.agent control hub 填這個缺口。

### 四個核心模組

- **Command Center**（`/dashboard`）：一眼看完「我現在要不要決定什麼」。沒事就安靜，有事就亮橘色。
- **Rule Engine**（`/rules`）：類別額度、單筆上限、白黑灰三層信任名單。超出邊界自動進入審核佇列。
- **Contextual Approval**（`/approvals`）：把 agent 推理邏輯翻成白話．「為什麼花這筆錢」+「相關脈絡」+「觸發哪條規則」．支援「要求 agent 提備案」的完整迴圈（按下去 10 秒後會送新方案回來）。
- **Decision Audit**（`/audit`）：每一筆決策的鏈上回執、reasoning、你的覆核都可追溯．對應 EU AI Act Art. 14 的 human oversight 與 auditability 要求．可匯出 CSV。

### 為什麼用 mock data 而不接真 API

這是**產品原型**不是 MVP。mock data 的目的是在不被 infra 拖住的情況下，專注把產品規格、UX 決策、資訊密度、互動邏輯一次講清楚。Phase 2 才是接 x402 測試網 + 真實 wallet．

### 下一階段（Phase 2）

- 接 Base Sepolia 的真實錢包（wagmi + RainbowKit）
- x402 handshake 整合（mock merchant server → 實際 402 回應 → 簽 USDC 交易）
- 規則引擎做成可 enforce：Session keys（ERC-4337）或鏈下 relayer 二選一
- Approval decision 寫回鏈上作為可驗證 audit trail

### 技術選擇

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Base UI + shadcn · recharts · sonner · lucide-react

---

## 🇺🇸 English

### The problem

By Q2 2026, 480,000+ AI agents have initiated $165M in transactions through Coinbase Agentic.Market via the x402 protocol. But the **owner-side tooling has not caught up**—existing wallets only offer a single total budget and cold "Request to pay X USDC" prompts. No category budgets, no contextual reasoning, no audit trail. soon-ga.agent control hub fills that gap.

### Four core modules

- **Command Center** (`/dashboard`): At-a-glance answer to "do I need to decide anything right now?" Calm when nothing needs you; bright orange when something does.
- **Rule Engine** (`/rules`): Category budgets, per-transaction caps, and a three-tier merchant trust list (allow / block / review). Anything out of bounds joins the approval queue.
- **Contextual Approval** (`/approvals`): Translates agent reasoning into plain-spoken "why this purchase, given this task and this context, triggered this rule." Full counter-offer loop—ask the agent for an alternative and a new proposal lands in ~10 seconds.
- **Decision Audit** (`/audit`): Every decision's on-chain receipt, agent reasoning, and your verdict—aligned with EU AI Act Article 14 requirements for human oversight and auditability. CSV export included.

### Why mock data instead of real APIs

This is a **product prototype**, not an MVP. Mock data lets the prototype focus on product spec, UX decisions, information density, and interaction logic—without getting dragged into infrastructure. Phase 2 will integrate x402 testnet and real wallets.

### Phase 2

- Real wallet on Base Sepolia (wagmi + RainbowKit)
- x402 handshake integration (mock merchant server → real 402 responses → signed USDC transactions)
- Enforceable rule engine: either ERC-4337 Session Keys or an off-chain relayer
- Approval decisions written on-chain as verifiable audit trail

### Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Base UI + shadcn · recharts · sonner · lucide-react

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deployed via Vercel．`npm run build` produces static pages for all four routes—no backend, no runtime dependencies beyond Node 20+.

---

*Built by Megan · 2026 · All personas and transactions are fictional.*
