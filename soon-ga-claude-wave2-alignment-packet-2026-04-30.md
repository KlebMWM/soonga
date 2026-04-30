# soon-ga.agent — Claude Wave 2 Alignment Packet

Date: 2026-04-30
Workspace: `/Users/M/Desktop/Vibe Coding/soon-ga-control-hub`

## Review Intent

Please evaluate the current `soon-ga.agent` PM portfolio alignment after the Wave 2 collapse.

Wave 2 was a large-scale refocusing pass: every reference to trading actions (swap, bridge, rebalance) was removed from the prototype. The product now reads as an AI agent rule console for Web3 payment governance, not a trading bot wrapper.

Do not recommend broad rebuilds, real on-chain integrations, or further architectural changes unless there is a clear blocker. The current goal is alignment review and small portfolio credibility polish.

## Current Product Direction

**An AI agent rule console for Web3 product scenarios, with wallet as the primary scenario and exchange as a secondary extension. All trading actions (swap, bridge, rebalance) have been removed; the prototype focuses on payment governance only.**

The user-facing object is now strictly:

- subscription payments (SaaS, API service fees, recurring tools)
- vendor payments (contractor wallets, freelancer wallets)
- withdrawals to new external addresses
- trust list management (allow / block / review)

This remains a PM portfolio prototype. No real wallet, no real exchange, no real chain.

## What Changed In Wave 2

### Agent renaming (4 agents)

The four agents previously named `交易助理 / 跨鏈助理 / 安全助理 / 資產助理` have been renamed to align with payment governance.

| Internal id | Old name | New name | Avatar | Lucide icon | Platform label (zh / en) |
|---|---|---|---|---|---|
| `research` | 交易助理 / Trading | 訂閱助理 / Subscription | 📰 | Newspaper | 訂閱模組 / Subscription AI |
| `travel` | 跨鏈助理 / Bridge | 付款助理 / Payment | 💸 | Send | 付款模組 / Payment AI |
| `shopping` | 安全助理 / Security | 安全助理 / Security | 🛡️ | Shield | 風控模組 / Risk Agent |
| `newsletter` | 資產助理 / Portfolio | 監控助理 / Monitor | 📊 | Activity | 監控模組 / Monitor Agent |

`shopping` is the only agent currently `paused` in mock state. `stats.activeAgents` resolves to 3.

### Categories collapsed from 4 to 3

| Old | New |
|---|---|
| 現貨換幣 (api) | removed |
| 訂閱與服務費 (subscription) | kept, with refreshed sampleMerchants (Notion / TradingView Pro / Anthropic API) |
| 提領到新地址 (physical) | kept |
| 跨鏈轉帳 (transfer) | removed |
| — | 合作方付款 (vendor) added |

The three remaining categories are all payment-governance categories. Trading-flavoured categories are gone.

### TrustList overhaul

- `allowlist` rebuilt: Notion, TradingView Pro, Anthropic API, OpenAI API, Stripe (all subscription category)
- `blocklist` kept: meme-nft-drop.xyz, fast-cash-loan.io
- `review` rebuilt: Acme 供應商錢包 (vendor), Base 營運錢包 (vendor), 財務冷錢包 (physical)

Old entries (NYT, Perplexity Pro, arXiv Donation, Booking.com, Amazon Gift Card, Nature Journal) are gone.

### LiveFeed (6 entries) rewritten

Now: 提領 / 付 Acme / Notion 漲價 / TradingView 年費 / 加 Base 信任名單 / Anthropic API auto. No swap, no bridge, no rebalance.

### PendingApprovals (5 entries) rewritten

| ID | Agent | Scenario | Risk |
|---|---|---|---|
| ap_001 | shopping | 提領 1,000 USDC 到財務冷錢包 | high |
| ap_002 | travel | 付款 200 USDC 給 Acme 供應商錢包 (首次) | medium |
| ap_003 | research | Notion 訂閱續費（漲價）120 USDC | low |
| ap_004 | research | TradingView Pro 年費 468 USDC | medium |
| ap_005 | travel | 付款 350 USDC 給自由工作者錢包 (首次) | medium |

All are payment events. No swap, bridge, or rebalance scenarios.

### AuditLog (15 entries) rewritten

All entries are zh-first with Chinese verb prefixes (付款 / 提領 / 封鎖 / 加入信任名單). All trading and travel context (京都 / 賞櫻 / Klook / Booking / JR 東日本 / Substack / Stratechery / Nature 期刊 / Uniqlo / Perplexity Pro / NYT / Uber Japan / JSTOR) has been removed.

`sourceCategoryId` values remapped to new ids: `subscription` / `vendor` / `physical`. The stale `"ai"` id is gone.

### Decision pill text aligned

| Key | Old (zh) | New (zh) |
|---|---|---|
| `audit.decision.approved` | 核准 | 已核准 |
| `audit.decision.rejected` | 拒絕 | 已拒絕 |
| `audit.decision.auto` | 自動放行 | 自動 |
| `audit.filter.approved` | 核准 | 已核准 |
| `audit.filter.rejected` | 拒絕 | 已拒絕 |
| `audit.filter.auto` | 自動放行 | 自動 |

### parseRule.ts KNOWN_MERCHANTS and TOPIC_MAP

KNOWN_MERCHANTS now: Notion, TradingView Pro, TradingView, Anthropic API, Anthropic, OpenAI API, OpenAI, Stripe, Coinbase Commerce, GitHub Copilot, Acme 供應商錢包, Acme, Base 營運錢包, 財務冷錢包, fast-cash-loan.io, meme-nft-drop.xyz.

TOPIC_MAP collapsed to 4 entries: 訂閱與服務費 (two regex variants), 合作方付款, 提領到新地址. No 換幣 / 跨鏈 / 再配置 / 學術 / 旅行 / 購物 keywords.

### WalletPill restructured

Sidebar not-connected state changed from a single yellow CTA button to a two-row card:
- Row 1: Exchange · megan@trader (sage dot, connected)
- Row 2: On-chain wallet · 未連結 (dim circle, pending)
- CTA button: 連結錢包 ↗ (deep blue background, yellow text)
- Subcopy: 連上鏈上錢包，agent 可以付款給合作方錢包、訂閱服務、外部地址提領

Connected state, mobile variant, and picker dialog are unchanged.

### IntroCard convergence

- headline: `Web3 場景下的 AI 助理規則控制台` (was: 不同場景下的 AI agent 規則控制台)
- body: `在錢包等 Web3 產品場景下，幫使用者設定 AI 助理可動用的預算和收款方，審核高風險請求，事後查看完整紀錄。`
- Three Web3 fit cards reduced to two: 鏈上錢包（主要場景）+ 交易所（延伸場景）. `加密支付卡` removed. `web3.card.*` dict keys removed.

### Greeting + briefing copy

- Greeting sub copy now templates with `{agents}` placeholder. Example zh: `今天 3 個 AI 助理已處理 47 筆交易，省下 2.4 小時。`
- Briefing budget warning: `訂閱助理本月已用 78% 訂閱類別額度`
- Briefing suggestion: `訂閱助理本週付款量比上週高 28%。要不要把單筆訂閱付款上限從 100 USDC 拉到 125？`
- Briefing newMerchant: 從 Klook Tokyo 改成 Notion 訂閱

### Misc copy fixes

- `rules.categories.desc`: 「四種預設類別」→「三種預設類別」
- `rules.desc` and `welcome.module.dashboard.body`: 「超出邊界」→「超出範圍」
- `rules.ai.placeholder`: 資產助理 → 訂閱助理
- `welcome.what.body`: framing rewritten to Web3 場景下的 AI 助理規則控制台
- `dashboard.exchange.title`: `soon-ga.agent` (brand-only)
- `dashboard.exchange.subtitle` (zh): `為交易所與 Web3 設計的 AI agent 規則控制台`
- `intro.cta`, `intro.dismiss`, etc. unchanged
- `(選填)` double-paren bug fixed: removed wrapping `( )` in `NewRuleUnifiedDialog.tsx` since the dict value already has `（選填）`
- Hardcoded `"api"` fallback in `NewRuleUnifiedDialog.tsx` (line 100, 112) and `parseRule.ts` (line 159) changed to `"subscription"` to prevent useState from initializing with a non-existent category id (this fixed the dialog-not-opening issue from the prior round)

### `rules.unified.chooser.*.example` examples refreshed

| Card | Old example | New example |
|---|---|---|
| 類別預算 | 例：AI 服務每月 $80、單筆上限 $5 | 例：訂閱每月 500 USDC、單筆上限 125 USDC |
| 信任網站 | 例：OpenAI API、NYT | 例：Notion、TradingView Pro、Acme 供應商錢包 |
| 封鎖網站 | 例：meme-nft-drop.xyz | 例：fast-cash-loan.io、meme-nft-drop.xyz |

## Files Touched

- `lib/mockData.ts` — agents, agentPlatformLabels, categories, trustList, liveFeed, pendingApprovals, auditLog
- `lib/i18n/dict.ts` — agent names, decision pill, filter pill, briefing, intro, welcome, wallet, rules, chooser examples, hardcoded "api" → "subscription"
- `lib/parseRule.ts` — KNOWN_MERCHANTS, TOPIC_MAP, fallback id, unknown rationale text
- `lib/simulateAgent.ts` — merchantsPool, branching logic
- `components/AgentIcon.tsx` — icons + displayName
- `components/WalletPill.tsx` — sidebar not-connected two-row layout
- `components/NewRuleUnifiedDialog.tsx` — double-paren fix, "api" fallback fix

## Validation Results

### Local CLI checks (passed)

- `npx tsc --noEmit`: pass
- `npm run build`: pass (only known Recharts SSR width(-1)/height(-1) warning + Next workspace-root warning, both pre-existing)

### eslint (12 pre-existing errors, not introduced by Wave 2)

All 12 errors are `react-hooks/set-state-in-effect` warnings from React 19's stricter hooks rule:

- `components/Sidebar.tsx:80`
- `components/WalletPill.tsx:80, 125`
- `components/WelcomeModal.tsx:92`
- `components/AnalyticsProvider.tsx`
- `components/DashboardHero.tsx`
- `components/DemoControls.tsx`
- `components/ThemeToggle.tsx`
- `components/NewRuleUnifiedDialog.tsx:125`
- `lib/i18n/LocaleProvider.tsx:25`
- `lib/useDesktopNotifications.ts:12`
- `lib/useDisplayName.ts:36`
- `app/rules/page.tsx`

These are pre-existing patterns from before Wave 2. Fixing them requires refactoring useEffect bodies to use lazy useState initializers or move logic to event handlers. **Out of scope for Wave 2 review.** Suggest a separate React 19 hooks compliance pass.

### Browser verification (user manual, passed)

The user clicked through the prototype on `http://localhost:3000` and confirmed:

- Dashboard greeting shows `今天 3 個 AI 助理已處理 47 筆交易`
- Yesterday briefing shows new copy with `訂閱助理`
- Detailed analytics shows 4 new agent names
- AgentIcon HUD shows new Lucide icons
- `/rules` shows 3 categories (no 現貨換幣 / 跨鏈轉帳)
- `/rules` description shows `三種預設類別`
- `/approvals` 5 pending all payment-focused (no swap / bridge / rebalance)
- `/audit` 15 entries zh-first, no Klook / Booking / Nature / Substack / etc.
- `/audit` decision pill shows `自動 / 已核准 / 已拒絕`
- `/audit` platform filter shows zh module labels (訂閱模組 / 付款模組 / 風控模組 / 監控模組)
- New rule dialog opens correctly (was failing in pre-Wave-2-cleanup state)
- AI parsing test: `每月 500 USDC 在訂閱費` correctly parses into `訂閱與服務費` category, monthly 500 / single 125, high confidence
- Three chooser cards display: 類別預算 / 信任網站 / 封鎖網站, with Wave-2-aligned examples
- IntroCard headline shows `Web3 場景下的 AI 助理規則控制台`

## Known Out-of-Scope For This Review

Please do not recommend changes in these areas unless there's a clear alignment blocker:

- 12 pre-existing react-hooks/set-state-in-effect errors (separate React 19 compliance pass)
- Recharts SSR warning (`width(-1)/height(-1)`)
- Next workspace-root warning (multiple lockfiles)
- Real wallet connection, real exchange APIs, KYC, real bridge, real withdrawal, real trading, real chain data
- `agentAvatar` field in mockData (used as data passthrough, not displayed; AgentIcon SVG carries the visual)
- Hero subtitle still mentions `為交易所與 Web3 設計` (exchange listed first) — this was previously flagged as known minor inconsistency with the wallet-primary IntroCard framing; left intentionally
- Recharts dashboard `Progress` element NaN hydration warning on `/dashboard` (unrelated to Wave 2)

## Specific Questions For Claude

Please focus on low-cost alignment polish, not feature expansion.

1. Does the Wave 2 framing (Web3 payment governance, wallet-primary, exchange-secondary) read consistently across hero, IntroCard, sidebar, /rules, /approvals, /audit?
2. Are there any remaining traces of trading framing (換幣 / 跨鏈 / 再配置 / Spot / Bridge / Rebalance / Trading / Swap) anywhere user-visible?
3. Does the three-category model (訂閱與服務費 / 合作方付款 / 提領到新地址) feel exhaustive and natural for an AI agent payment governance product, or is one missing?
4. Do the renamed agents (訂閱 / 付款 / 安全 / 監控) read as a coherent four-agent setup for a portfolio reviewer?
5. The WalletPill two-row layout (Exchange + On-chain wallet) — does it convince a reviewer that soon-ga.agent operates across both worlds without overpromising?
6. The natural-language parser examples in the rule dialog are now Web3-aligned. Is the example variety strong enough for a reviewer trying random inputs?
7. AgentFeed renders Lucide SVG icons (Newspaper / Send / Shield / Activity) instead of emoji avatars. Is this the right call for portfolio polish, or should the emojis be re-introduced?
8. Are there small copy or data adjustments that would make the prototype clearer in a one-glance reviewer pass without expanding scope?

Suggested first-instruction template:

```text
請先讀 soon-ga-claude-wave2-alignment-packet-2026-04-30.md，幫我只評估 Wave 2 之後 soon-ga.agent 的 PM portfolio alignment，不要大改功能，也不要碰 OOS 範圍（包含 12 個 pre-existing react-hooks errors）。
```
