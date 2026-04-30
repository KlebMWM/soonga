# soon-ga.agent — Claude Wave 1.5 Alignment Packet

Date: 2026-04-30
Workspace: `/Users/M/Desktop/Vibe Coding/soon-ga-control-hub`

## Review Intent

Please evaluate alignment and clarity, not broad feature expansion.

The current product direction is still a PM portfolio prototype, not a production exchange build:

**AI agent permission and payment governance for crypto exchange products.**

This packet covers the latest Wave 1 / Wave 1.5 alignment pass: copy, mock scenario, risk-review language, and dashboard information architecture. Do not treat unrelated dirty files in the repo as part of this pass.

## User Feedback Addressed

The latest user feedback was:

- "安全助理想支付 0x9A...21F 地址只會讓人困惑，改回商家或是用戶給的標籤名稱"
- "不要中英文混"
- "soon-ga.agent 是交易所場景下的 AI agent 權限與付款治理控制層和 Where this fits in Web3 products 不能合併嗎？"

## What Changed

### 1. Security assistant no longer appears to "pay an address"

Problem:

The approval UI previously showed confusing copy like the security assistant wanting to pay `0x9A...21F`. This made a withdrawal review look like merchant payment.

Current state:

- The visible approval item is now `財務冷錢包提領`.
- The card explains: `安全助理收到一筆提領到「財務冷錢包」的請求。`
- The address is kept only as supporting risk metadata: `目的地：財務冷錢包（0x9A...21F）`.
- Simulator-generated security requests now use `財務冷錢包` / `已信任冷錢包` labels instead of raw addresses.

Rationale:

The user-facing object should be a merchant, destination label, or user-provided label. Raw wallet addresses can appear in risk details, but should not be the primary "payee" copy.

### 2. Chinese locale no longer mixes obvious English UI copy

Problem:

The zh UI still had lines like `Agent wants...`, `Risk Agent`, `Where this fits in Web3 products`, `Primary Use Case`, and English risk field labels.

Current state:

- Approval list/card summaries are localized:
  - `交易助理想把 300 USDC 換成 ETH。`
  - `跨鏈助理想把 500 USDC 從 Arbitrum 轉到 Base。`
  - `安全助理收到一筆提領到「財務冷錢包」的請求。`
  - `資產助理想用 USDC 支付 Notion 訂閱發票。`
  - `資產助理想在 ETH 價格異動後重新配置資產。`
- Platform badges in zh are now module labels:
  - `交易模組`
  - `跨鏈模組`
  - `風控模組`
  - `資產模組`
- Risk Profile labels in zh are now:
  - `操作類型`
  - `資產`
  - `金額`
  - `目的地`
  - `觸發規則`
  - `風險等級`
- The approvals eyebrow is now `待審核`, not `Approvals`.

Note:

Some domain nouns like `USDC`, `ETH`, `Arbitrum`, `Base`, `Notion`, and `Audit Trail` remain because they are product/chain/audit terms, not accidental mixed UI language.

### 3. Intro explanation and Web3 fit section are merged

Problem:

The dashboard had a separate intro card:

`soon-ga.agent 是交易所場景下的 AI agent 權限與付款治理控制層`

and a separate section:

`Where this fits in Web3 products`

This felt repetitive and created a zh/en split.

Current state:

- The three fit cards now live inside `IntroCard`.
- The standalone `Where this fits in Web3 products` dashboard section was removed.
- zh labels are now:
  - `交易所` / `主要場景`
  - `鏈上錢包` / `延伸場景`
  - `加密支付卡` / `付款延伸`
- zh bodies were also cleaned up:
  - `安全中心、API 管理、AI 交易助理或資產管理頁面`
  - `去中心化應用、代幣、鏈別`

Rationale:

This keeps the portfolio framing visible without creating a second marketing-like section.

## Files Touched In This Latest Pass

- `lib/mockData.ts`
  - Updated pending approval names and zh reasoning.
  - Added user-label destination copy for the security assistant.
  - Added localized platform/module labels.
  - Updated feed mock labels and avatars for security/portfolio agents.

- `lib/simulateAgent.ts`
  - Updated simulator pool to exchange-context actions.
  - Replaced raw address merchant with wallet labels.
  - Updated security/portfolio agent avatars.

- `components/AgentFeed.tsx`
  - Uses localized platform/module labels.
  - Generates zh synthetic approval text by action type instead of "pay X".

- `components/ApprovalCard.tsx`
  - Uses localized platform/module labels.

- `components/IntroCard.tsx`
  - Merged Web3 fit cards into the intro explanation.

- `app/dashboard/page.tsx`
  - Removed the separate Web3 fit section.
  - Keeps agent module badges localized in the detailed analytics section.

- `lib/i18n/dict.ts`
  - Localized Web3 fit labels and bodies.
  - Localized approval/risk labels and approval eyebrow.

## Validation

Commands passed:

- `npx eslint app/dashboard/page.tsx components/IntroCard.tsx components/AgentFeed.tsx components/ApprovalCard.tsx lib/i18n/dict.ts lib/mockData.ts lib/simulateAgent.ts`
- `npx tsc --noEmit`
- `npm run build`

Browser checks against `http://localhost:3000` passed:

- Dashboard intro card contains the merged fit cards.
- Standalone `Where this fits in Web3 products` section is gone.
- zh dashboard fit copy no longer shows the old English heading/badges.
- `/approvals` no longer says the security assistant is paying `0x9A...21F`.
- `/approvals` shows `財務冷錢包提領`.
- Security card keeps `0x9A...21F` only in destination/risk metadata.
- zh approval summaries no longer show `Agent wants...`.
- zh Risk Profile labels are localized.

Known warnings still present during build:

- Next workspace-root warning due to multiple lockfiles.
- Recharts static-generation warning: `width(-1)` / `height(-1)`.

These warnings predate this pass and should stay separate unless explicitly assigned.

## Current Scope Boundaries

Please do not recommend a broad rebuild unless there is a clear alignment blocker.

Out of scope for this review:

- Real exchange pages.
- Real wallet connection.
- KYC, real trading, real bridge, real withdrawal, or chain data.
- Rewriting `/audit` old mock data.
- Reworking `parseRule.ts` known merchants.
- Redesigning the entire layout.
- Fixing Recharts SSR warning unless reviewed as a separate technical task.

## Questions For Claude

1. Does the approvals copy now clearly distinguish merchant/payment, bridge, swap, rebalance, and withdrawal destination labels?
2. Does the zh UI still contain any accidental English that hurts credibility?
3. Is merging Web3 fit cards into the intro card clearer than a separate section?
4. Is `財務冷錢包` a reasonable user-label example, or should the label be more explicitly "用戶標記的冷錢包"?
5. Are there any remaining low-cost alignment fixes that improve portfolio credibility without expanding product scope?
