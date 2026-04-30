# soon-ga.agent — Current Status For Claude

Date: 2026-04-30
Workspace: `/Users/M/Desktop/Vibe Coding/soon-ga-control-hub`

## How To Review This

Please evaluate the current `soon-ga.agent` PM portfolio alignment only.

Do not recommend broad product rebuilds, new real exchange/wallet integrations, or Wave 2 work unless there is a clear blocker. The current goal is low-cost repositioning and credibility polish.

Suggested first instruction:

```text
請先讀 soon-ga-claude-current-status-2026-04-30.md，幫我只評估目前 soon-ga.agent 的 PM portfolio alignment，不要大改功能，也不要碰 Wave 2 範圍。
```

## Current Product Direction

The product is now framed as:

**An AI agent permission and payment/rules console for Web3 product scenarios, with wallet as the primary scenario and exchange as a secondary extension.**

Recent direction change:

- Web3 wallet is now the main use case.
- Crypto exchange is now a secondary/extension use case.
- Crypto payment card was removed from the IntroCard use-case cards.
- Top-level IntroCard copy now avoids over-emphasizing exchanges and uses "different product scenarios" language.

This remains a PM portfolio prototype, not a production startup or real trading/wallet system.

## Latest User-Facing State

### Dashboard greeting copy

Changed in `lib/i18n/dict.ts`:

- zh prefix now reads: `今天 AI 助理已處理 `
- en prefix now reads: `AI agents handled `

Intended zh sentence:

```text
今天 AI 助理已處理 47 筆交易，省下 2.4 小時。
```

This replaced the previous `exchange agents` wording.

### IntroCard positioning copy

Changed in `lib/i18n/dict.ts`:

- `intro.headline`
  - zh: `不同場景下的 AI agent 規則控制台`
  - en: `AI agent rule console across product scenarios`
- `intro.body`
  - zh: `在不同產品場景下，幫使用者設定 agent 可動用的預算和收款方，審核高風險請求，事後查看完整紀錄。`
  - en: `Across product scenarios, set agent budgets and recipients, approve risky actions, and review what happened.`

Intent:

- Do not make this section read as exchange-first.
- Use a broader product-scenario framing.
- Keep the copy short and portfolio-readable.

### Web3 use-case cards inside IntroCard

Changed in `components/IntroCard.tsx` and `lib/i18n/dict.ts`:

- IntroCard now renders 2 use-case cards, not 3.
- Card order is:
  1. Wallet
  2. Exchange
- Grid is `md:grid-cols-2`.
- Crypto card / payment extension was removed from this surface.

Current card copy:

Wallet card:

- zh title: `鏈上錢包`
- zh badge: `主要場景`
- zh body: `作為 AI agent 權限中心，管理可互動的去中心化應用、代幣、鏈別、單筆與每日限額。`
- en title: `Web3 Wallet`
- en badge: `Primary Use Case`

Exchange card:

- zh title: `交易所`
- zh badge: `延伸場景`
- zh body: `可嵌進交易所的安全中心或 API 管理頁面，讓 agent 在交易所帳戶下也走相同的權限與審核流程。`
- en title: `Crypto Exchange`
- en badge: `Secondary Use Case`

Removed from IntroCard:

- `Crypto Card`
- `Payment Extension`
- zh `加密支付卡`

Important UI state note:

`IntroCard` can be hidden by localStorage key `intro_card_dismissed_v1`. If it does not appear during browser review, clear that key or use a fresh origin before assuming the component is broken.

## Relevant Files

Primary files for this latest pass:

- `lib/i18n/dict.ts`
  - Greeting copy.
  - IntroCard title/body.
  - Web3 wallet/exchange card copy.
  - Removed rendered crypto-card use-case keys.

- `components/IntroCard.tsx`
  - Renders the two use-case cards.
  - Wallet first, exchange second.
  - Uses `md:grid-cols-2`.
  - Uses dismiss state via `intro_card_dismissed_v1`.

Surrounding context files Claude may inspect, but should not broadly rewrite:

- `app/dashboard/page.tsx`
- `components/Sidebar.tsx`
- `components/WalletPill.tsx`
- `components/AuditTable.tsx`
- `lib/mockData.ts`
- `lib/simulateAgent.ts`

## Validation Already Run

Latest validation after the final wording change:

- `npx eslint lib/i18n/dict.ts` passed.
- `npx tsc --noEmit` passed.

Earlier validation for the Web3 wallet / exchange card pass:

- `npx tsc --noEmit` passed.
- `npx eslint components/IntroCard.tsx lib/i18n/dict.ts` passed.
- `npm run build` passed.

Browser verification already performed:

- IntroCard shows 2 cards, not 3.
- First card is `鏈上錢包` / `主要場景`.
- Second card is `交易所` / `延伸場景`.
- No `加密支付卡`, `Crypto Card`, or `Payment Extension` appears in IntroCard.
- `md:grid-cols-2` is present in `IntroCard.tsx`.
- Wallet and exchange zh body copy matched the requested text.
- EN dict values for wallet/exchange badges and titles are correct.

Known warnings from build/browser logs:

- Next workspace-root warning due to multiple lockfiles.
- Recharts SSR/static-generation warning: `width(-1)` / `height(-1)`.

These are known baseline warnings and are not part of this pass.

## Known Dirty Worktree Context

The worktree contains many modified and untracked files from prior alignment, analytics, review-packet, and prototype-polish work. Do not treat every dirty file as part of this latest wording change.

Most relevant latest changes are:

- `lib/i18n/dict.ts`
- `components/IntroCard.tsx`
- `soon-ga-claude-current-status-2026-04-30.md`

## Do Not Touch In This Review

These are explicitly out of scope for this round:

- Hero subtitle still mentioning exchange first.
- Sidebar context label:
  - `Exchange Module · AI Agent`
  - `可嵌在 Security Center → AI Agents`
- Security Center landing mockup / portfolio illustration.
- `/audit` old mock data such as Kyoto, cherry blossom, Klook, etc.
- `parseRule.ts` `KNOWN_MERCHANTS`.
- `WalletPill` component structure.
- Recharts SSR warning.
- Real wallet, real exchange, KYC, trading, bridge, withdrawal, or chain-data implementation.

## What Claude Should Evaluate

Please focus on low-cost alignment questions:

1. Does the current first-read experience clearly communicate "AI agent rules/permission control for Web3 product scenarios"?
2. Does the IntroCard now successfully make wallet primary and exchange secondary?
3. Is `不同場景下的 AI agent 規則控制台` clear enough, or should it be slightly more product-specific without returning to exchange-first wording?
4. Are there remaining high-visibility zh/en mixed-copy issues that weaken portfolio credibility?
5. Are there any small copy/data adjustments that make the prototype easier for a mentor/employer to understand in one glance?

Please avoid suggesting:

- large architecture changes,
- new flows,
- real on-chain features,
- new exchange pages,
- broad UI rebuilds,
- or Wave 2 consistency cleanup unless explicitly asked.
