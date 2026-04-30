# soon-ga.agent — Claude Alignment Packet

Date: 2026-04-30
Workspace: `/Users/M/Desktop/Vibe Coding/soon-ga-control-hub`

## 1. Current Direction

This round reframes soon-ga.agent from a general AI agent payment control hub into a portfolio prototype for:

**AI agent permission and payment governance inside crypto exchange products.**

The intent is a low-cost repositioning, not a feature rebuild. The prototype should read as a module that could be embedded inside exchange surfaces such as Security, API Management, AI Trading Assistant, or Asset Management.

Important scope boundary:

- Do not build real exchange pages.
- Do not add wallet connection, KYC, real trading, real bridge, real withdrawal, or real chain data.
- Do not imply Assets / Trade / Earn / Card pages exist.
- Keep current dashboard, approvals, rules, audit structure.
- Improve framing, sample data, and review fields only.

## 2. What Changed In This Round

### Product framing

Main dashboard title changed to:

**AI Agent Control Layer for Crypto Exchanges**

Subtitle changed to:

**Set limits, review risky actions, and audit what your AI agent does with user assets.**

Metadata title/description in `app/layout.tsx` now also uses the crypto exchange permission/payment governance framing.

### Sidebar context

Originally I added a full fake exchange-style sidebar with:

- Assets
- Trade
- Earn
- Card
- API Management
- Security
- AI Agent

User pushed back correctly: we do not actually have those pages, so the fake nav over-promised.

Current state is option 2:

Sidebar now only has a small context badge:

**Exchange Module · AI Agent**

Subcopy:

**Permission layer for Security or API Management**

The real nav remains the existing prototype nav:

- Command Center
- Rule Engine
- Approvals
- Audit Trail

### Demo data

Pending approvals were changed from general payment/travel/shopping examples to exchange/Web3 asset-operation examples:

1. Agent wants to swap 300 USDC to ETH
2. Agent wants to bridge 500 USDC from Arbitrum to Base
3. Agent wants to withdraw 1,000 USDC to a new address
4. Agent wants to pay a SaaS invoice with USDC
5. Agent wants to rebalance assets after ETH price movement

The activity feed and simulator were also updated so new simulated rows do not drift back into Booking.com / Amazon Gift Card / journal subscription examples.

### Approval card risk fields

`PendingApproval` now has an optional `riskProfile` object.

Approval cards render a new risk-conditions block when available:

- Action Type
- Asset
- Amount
- Destination
- Triggered Rule
- Risk Level
- User Decision

This is intended to make the UI feel closer to exchange risk review / permissions review, without changing the approval interaction model.

### Web3 fit section

Dashboard now includes:

**Where this fits in Web3 products**

Three cards:

- Crypto Exchange — Primary Use Case
- Web3 Wallet — Secondary Use Case
- Crypto Card — Payment Extension

This section is meant to support portfolio narrative and interviewer context. It is not intended to become a full product marketing page.

## 3. Files Changed By This Repositioning

Core files:

- `app/dashboard/page.tsx`
  - Added new exchange title/subtitle.
  - Added Web3 use-case cards.
  - Deferred the existing `setNow(new Date())` effect with `setTimeout` so targeted lint passes after touching the file.

- `app/layout.tsx`
  - Updated metadata title and description.
  - Note: file already had analytics-related local changes in the working tree before this round.

- `components/Sidebar.tsx`
  - Added lightweight exchange context badge.
  - Removed the fake exchange navigation after user feedback.

- `components/ApprovalCard.tsx`
  - Renders optional `riskProfile` fields.
  - Note: file already had analytics tracking local changes in the working tree before this round.

- `components/AgentFeed.tsx`
  - Expanded warning-tone matching to cover bridge, withdrawal, new address, review, etc.

- `lib/i18n/dict.ts`
  - Updated product framing copy.
  - Updated agent labels to Trading / Bridge / Security / Portfolio.
  - Added sidebar context strings, Web3 use-case strings, and risk-profile labels.

- `lib/mockData.ts`
  - Added optional `riskProfile` type.
  - Updated agents, categories, live feed, and pending approvals to exchange/Web3 scenarios.

- `lib/simulateAgent.ts`
  - Updated simulator merchant/action pool to exchange/Web3 scenarios.

## 4. Validation Run

Commands run successfully:

- `npx tsc --noEmit`
- `npx eslint components/Sidebar.tsx lib/i18n/dict.ts`
- Targeted eslint after the broader UI changes also passed for touched files.
- `npm run build`

Browser verification:

- Used headless Chrome against local dev server at `http://localhost:3000`.
- Confirmed dashboard title exists.
- Confirmed sidebar context exists.
- Confirmed Web3 fit section exists.
- Confirmed approval risk field block exists.
- Confirmed first exchange approval scenario appears.
- No browser console errors were observed during that check.

Known warnings still present:

- Next.js workspace-root warning:
  - Next inferred `/Users/M/package-lock.json` as workspace root because there are multiple lockfiles.
  - This was already known.

- Recharts SSR warning during build:
  - `width(-1)` / `height(-1)` chart container warning.
  - This was already known and should remain a separate investigation, not bundled into this repositioning pass.

## 5. Current Git / Workspace Situation

The working tree is dirty beyond this round.

There are many existing modified and untracked files, including analytics files, review packets, design-system files, PRD docs, and package changes. Do not assume every dirty file belongs to this exchange-repositioning pass.

Current relevant changed files for this round are the 8 files listed above.

Existing dirty files observed but not owned by this repositioning pass include examples such as:

- `app/rules/page.tsx`
- `components/DemoControls.tsx`
- `components/LocaleToggle.tsx`
- `components/NewRuleUnifiedDialog.tsx`
- `components/ThemeToggle.tsx`
- `components/WelcomeModal.tsx`
- `package.json`
- `package-lock.json`
- `components/AnalyticsProvider.tsx`
- `lib/analytics.ts`
- many `soon-ga-review-round*.md` files
- `origin-prd-draft.md`
- `design-system/`

Claude should evaluate this round without treating unrelated dirty files as part of the exchange repositioning unless it intentionally wants to review broader repo state.

## 6. Product Judgment So Far

The exchange repositioning is directionally reasonable because it makes the portfolio piece more legible to Web3/exchange reviewers:

- AI agents operating user assets need permission boundaries.
- High-risk asset operations need human review.
- Users need a traceable decision log.
- This maps naturally to exchange Security / API Management / Asset Management surfaces.

The user correctly rejected the fake full exchange sidebar. Current badge-only context is more honest and portfolio-safe.

## 7. Specific Questions For Claude

Please evaluate alignment, not broad feature expansion.

Questions:

1. Does the current framing now clearly read as "AI agent permission and payment governance for crypto exchanges"?
2. Does the UI overclaim anything that the prototype does not actually support?
3. Is the `Exchange Module · AI Agent` badge enough context, or should the wording be more specific?
4. Are the five sample approval scenarios the right mix for exchange reviewer interest?
5. Does the risk-profile block feel useful, or too enterprise/risk-heavy for a portfolio prototype?
6. Are there old general-payment copy fragments that now conflict with the exchange positioning?
7. Should the README / public article / PRD be updated next, or is the UI enough for now?
8. Should any change be reverted to keep the scope even smaller?

## 8. Recommended Next Step

Ask Claude for a narrow alignment review:

> Please review the current exchange repositioning of soon-ga.agent. Focus on product positioning consistency, overclaim risk, copy coherence, and whether the UI still feels like a credible portfolio prototype. Do not propose major new features unless there is a clear positioning gap.

