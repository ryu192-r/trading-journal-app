# Milestone v1 — Project Summary

**Generated:** 2026-04-24
**Purpose:** Team onboarding and project review for completed Phase 1
**Milestone Status:** ✅ Complete (UAT passed: 11/12 tests, 7 bugs fixed)

---

## 1. Project Overview

**Project:** Trading Journal App (TJA)

**Core Value Proposition:** Every trade logged automatically, every pattern surfaced, every mistake caught — so you become a consistently profitable trader.

**What This Is:** A comprehensive trading intelligence platform for Indian equity traders that automatically captures trades, surfaces behavioral patterns, and delivers actionable insights to systematically improve trading performance. It combines zero-friction data capture (natural language, broker API sync) with deep analytics (MAE optimization, ghost tracking, emotion correlation) and proactive guardrails (revenge trade detection, blowup calculator).

**Target User:** Indian equity trader (NSE/BSE) who already tracks some trades but wants systematic improvement. Familiar with concepts like R-multiple, setup types, market regimes. Needs behavioral guardrails (revenge trading, overtrading, FOMO). Wants actionable insights, not just P&L tracking.

**v1 Scope:** Web-first (responsive), mobile app deferred to v2. Indian equity markets only (NSE/BSE). Zero-friction data capture via manual entry, CSV import, and natural language. Basic analytics (P&L summary, equity curve). Export to CSV/JSON. Data privacy-first: secure, encrypted, self-hostable option.

**Out of Scope (v1):** Broker API sync, TradingView integration, native mobile app, AI insights, backtesting, trade replay, position size optimizer, tax automation, strategy templates.

**Current State:** Phase 1 (Foundation & Trade Logging) complete and verified. All 10 Phase 1 requirements (LOG-01..05, ANLY-01..03, UI-01..02) implemented and tested. Ready to begin Phase 2 (Core Analytics).

---

## 2. Architecture & Technical Decisions

### Technology Stack

- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend:** Next.js API routes (serverless functions), Node.js runtime
- **Database:** PostgreSQL with Prisma ORM
- **Charts:** Chart.js with react-chartjs-2
- **Auth:** JWT tokens (7-day expiry) stored in httpOnly cookies
- **Validation:** Zod schemas with runtime type checking

### Key Technical Decisions

- **Decision:** Single-page application with Next.js App Router
  - **Why:** Fast development, built-in routing, API routes co-located with frontend, excellent TypeScript support
  - **Phase:** 1 (infrastructure setup)

- **Decision:** Prisma ORM for database access
  - **Why:** Type-safe queries, automatic migration generation, excellent TypeScript integration, reduces SQL errors
  - **Phase:** 1 (data layer)

- **Decision:** Strict TypeScript typing with shared types (`src/types/trade.types.ts`)
  - **Why:** Single source of truth for TradeInput/TradeOutput across frontend, backend, validators; prevents type drift
  - **Phase:** 1 (Plan 01-01)

- **Decision:** Zod validation schemas for all input
  - **Why:** Runtime validation with structured error objects; enables field-level error display in forms; TypeScript inference
  - **Phase:** 1 (Plan 01-01)

- **Decision:** Hybrid NL parser — regex-only in Phase 1, LLM fallback deferred
  - **Why:** Regex covers 80% of common patterns ("bought HDFC at 730, stop 710, target 760"); LLM adds complexity/cost; can add in Phase 2 if needed
  - **Phase:** 1 (Plan 01-03)

- **Decision:** CSV import with predefined broker mappers (Zerodha, Dhan, AngelOne, ICICI Direct)
  - **Why:** Reliable mapping from known column layouts; auto-detection from headers; fits Phase 1 scope; easy to extend
  - **Phase:** 1 (Plan 01-02)

- **Decision:** Partial import with per-row error isolation
  - **Why:** Users don't lose all data due to one malformed row; shows row-specific errors; idempotent re-imports
  - **Phase:** 1 (Plan 01-02)

- **Decision:** Modal dialog for trade creation (shadcn/ui Dialog)
  - **Why:** Keeps user on trades page; faster workflow; mobile-friendly; extended fields accessible without navigation
  - **Phase:** 1 (Plan 01-05)

- **Decision:** Bottom tab navigation for mobile
  - **Why:** Thumb-friendly on mobile; standard mobile UX; responsive design priority
  - **Phase:** 1 (Plan 01-05)

- **Decision:** JWT auth with 7-day expiry, no refresh tokens in Phase 1
  - **Why:** Simpler implementation; user re-login acceptable for v1; refresh mechanism can be added in Phase 2
  - **Phase:** 1 (Plan 01-01)

- **Decision:** Analytics exclude open trades (only `exitPrice != null`)
  - **Why:** Realized P&L only; mark-to-market unrealized P&L requires price feed (broker API in Phase 5)
  - **Phase:** 1 (Plan 01-04)

- **Decision:** Export in Indian date format (DD/MM/YYYY)
  - **Why:** User familiarity for Indian traders; matches local conventions
  - **Phase:** 1 (Plan 01-05)

- **Decision:** Database indexes deferred to Phase 2
  - **Why:** Profile real query performance first; add composite indexes (`userId+entryDate`) and GIN on `tags` after seeing actual usage patterns
  - **Phase:** 1 (deferred, Phase 2 planned)

---

## 3. Phases Delivered

| Phase | Name | Status | One-Liner |
|-------|------|--------|-----------|
| 1 | Foundation & Trade Logging | ✅ Complete | Core data infrastructure, manual/CSV/NL entry, basic UI, export |
| 2 | Core Analytics | ⏳ Not started | MAE/MFE, setup scorecards, equity curve, R-multiple, market regime |
| 3 | Behavioral Analysis | ⏳ Not started | Emotion tagging, revenge/overtrading detection, ghost tracking, behavioral alerts |
| 4 | Dashboard & Alerts | ⏳ Not started | Daily pre-market dashboard, blowup calculator, real-time guardrails |
| 5 | Reports & Polish | ⏳ Not started | Weekly/annual reports viewing, UI polish, production optimization |

**Milestone Progress:** 1/5 phases complete (20%)

---

## 4. Requirements Coverage

### Phase 1 Requirements (All 10 Met)

**Trade Logging (LOG-01..05):**
- ✅ **LOG-01:** Manual trade logging with all required fields (entry/exit, stop/target, position size, direction, symbol, exchange, asset class)
- ✅ **LOG-02:** CSV import from Indian brokers (Zerodha, Dhan, AngelOne, ICICI Direct) with auto-detection
- ✅ **LOG-03:** Setup type tagging (EP, VCP, breakout, pullback, parabolic long) via dropdown; broker Product field added to tags
- ✅ **LOG-04:** Notes and screenshot URL support on trades
- ✅ **LOG-05:** Natural language entry ("bought HDFC at 730, stop 710, target 760") with regex parser covering long/short, @-shorthand, slash notation

**Core Analytics (ANLY-01..03):**
- ✅ **ANLY-01:** P&L summary showing win rate, profit factor, average win/loss, expectancy in R-multiple
- ✅ **ANLY-02:** Equity curve with account growth over time (Chart.js line chart)
- ✅ **ANLY-03:** Filter/sort trades by date, symbol, setup, P&L, tags

**UI & Export (UI-01..02):**
- ✅ **UI-01:** Responsive web app (mobile + desktop); bottom tab navigation; Tailwind CSS; overflow handling
- ✅ **UI-02:** Export trades to CSV/JSON with date range filtering; Indian date format (DD/MM/YYYY)

### Verification Audit

**UAT Results:** 12 tests executed, 11 passed, 1 initially blocked (PostgreSQL not running — resolved), 0 issues pending.

**Bugs Fixed During Verification:**
1. Zerodha CSV mapper: `Product` field incorrectly mapped to `setupType` enum → fixed to add to `tags` only
2. POST `/api/trades` missing required `userId` → added `getUserIdFromToken()` extraction
3. Next.js 15 route handler: `params` not awaited → updated all `[id]` routes to `await params`
4. Export endpoint: ignored query filters, used ISO dates → added filter support, Indian date format
5. TradeList `DropdownMenuTrigger`: missing `asChild` prop → added support
6. Prisma v7 config incompatibility → downgraded to v6, simplified config
7. Auth middleware lazy-load error: server started but first call failed → JWT_SECRET guard works as designed (fails fast)

**Success Criteria Validation:** All 10 Phase 1 success criteria from ROADMAP.md verified working.

---

## 5. Key Decisions Log

Aggregated from Phase 1 CONTEXT.md and execution summaries:

| ID | Decision | Phase | Rationale |
|----|----------|-------|-----------|
| D-01 | Minimal required fields: entry/exit prices, direction, symbol, date required; stop/target, position size, setup type, notes optional | 1 | Reduces friction for quick entry; optional fields don't block creation |
| D-02 | Single trades table with all fields | 1 | Simple, fast queries; no joins needed for analytics |
| D-03 | Strict typing: DECIMAL(10,2) for prices, TIMESTAMP WITH TIME ZONE for dates, ENUM for direction/setup | 1 | Data integrity; prevents invalid values; precise financial calculations |
| D-04 | Full schema now based on all 30 v1 requirements | 1 | Avoids migration complexity later; plan for growth |
| D-05 | Add `userId` FK to trades table | 1 | Future-ready for multi-user support; enables per-user analytics |
| D-06 | Hybrid NL parsing: regex first, LLM fallback deferred | 1 | Regex covers 80% of patterns; LLM adds cost/complexity; can add later |
| D-07 | Regex patterns: long/short with stop/target, quantity variations, @-sign, slash notation, relative dates | 1 | Covers casual Indian trading lingo; zero-friction goal |
| D-08 | LLM fallback NOT implemented in Phase 1 | 1 | Deferred to Phase 2; unparseable input returns structured error with examples |
| D-09 | Predefined mappers for 4 Indian brokers | 1 | Reliable, fits scope; easy to extend to other brokers |
| D-10 | Partial import: valid rows succeed, invalid rows skipped with row-specific errors | 1 | Users don't lose all data due to one bad row; idempotent re-import |
| D-11 | Duplicate detection: auto-dedupe silently (symbol + entryDate + quantity ± tolerance) | 1 | Idempotent CSV re-imports; prevents duplicates |
| D-12 | No file size limit in Phase 1 | 1 | Self-hostable, user-controlled; can add server limits later |
| D-13 | No interactive preview — direct import with error summary | 1 | Faster MVP; preview UI deferred to Phase 2 |
| D-14 | Vite + React + Tailwind + shadcn/ui | 1 | Fast development, modern stack, accessible pre-built components |
| D-15 | Route-based navigation: `/trades`, `/analytics`, `/import`, `/settings` | 1 | Clear URL structure; Next.js App Router pattern |
| D-16 | Trade form as modal dialog (opens from `/trades`) | 1 | Keeps user on same page; faster workflow; mobile-friendly |
| D-17 | Bottom tab bar (4 tabs) for mobile navigation | 1 | Thumb-friendly; standard mobile UX |
| D-18 | Client-side CSV/JSON export (Excel formatting deferred) | 1 | Fast implementation; XLSX styling in v2 |
| D-19 | Export all fields (no column subset selection) | 1 | Full fidelity export; UI for selection deferred |
| D-20 | Date range filtering via query params (`?startDate=...&endDate=...`) | 1 | Shareable URLs; simple implementation |
| D-21 | CSV date format: Indian (DD/MM/YYYY) | 1 | User familiarity for Indian traders |
| D-22 | JWT/session auth now (schema has `userId`) | 1 | Future-ready for multi-user; security foundation |
| D-23 | JWT expiry: 7 days (Phase 1); 30 days with "Remember me" in Phase 2 | 1 | Simpler v1; extended expiry planned |
| D-24 | No refresh tokens in Phase 1 | 1 | User re-login when JWT expires; simpler implementation |
| D-25 | Password hashing: base64 temporary; bcrypt deferred to Phase 2 | 1 | Fast MVP; security hardening later |
| D-26 | Analytics exclude open trades (`exitPrice != null`) | 1 | Realized P&L only; mark-to-market requires price feed (Phase 5) |
| D-27 | Equity curve plots realized P&L only | 1 | Consistent with realized-only analytics |
| D-28 | Composite indexes deferred to Phase 2 | 1 | Profile real query performance first; add `userId+entryDate`, GIN on `tags` |
| D-29 | Index migration via Prisma migrate in Phase 2 | 1 | After profiling; avoid premature optimization |
| D-30 | Adopt Zod for validation | 1 | Structured errors; TypeScript inference; field-level display |
| D-31 | Error response format: `{ errors: [{ field, message }] }` | 1 | Enables inline form errors; consistent API |

---

## 6. Tech Debt & Deferred Items

### Deferred to Phase 2

- **LLM fallback for NL parsing** — Hybrid approach planned; LLM integration for ambiguous inputs
- **Interactive CSV preview** — Show mapped trades before import; better UX
- **Refresh tokens & "Remember me"** — Extend JWT expiry to 30 days with refresh mechanism
- **bcrypt password hashing** — Proper security hardening
- **Composite database indexes** — `userId+entryDate` composite, GIN on `tags` array after profiling
- **Mark-to-market unrealized P&L** — Requires live price feed (broker API in Phase 5)
- **Excel-formatted export** — XLSX with styling (colors, formulas)
- **User-selectable export columns** — UI for column selection
- **Duplicate detection tolerance configuration** — ± price tolerance percentage as setting
- **Pagination for trades list** — Cursor or offset pagination for large trade histories
- **Analytics rounding precision** — Standardize decimal places across metrics

### Lessons Learned (from UAT)

- **Environment consistency matters:** PostgreSQL not running blocked initial UAT; ensure dev environment setup docs include DB service startup
- **Next.js version compatibility:** Next.js 15 changed `params` from destructured object to Promise; all route handlers using `[id]` needed updating to `await params`
- **Prisma major version breaking changes:** Prisma v7 introduced config incompatibilities; lock to v6 for stability or plan migration carefully
- **Broker CSV quirks:** Zerodha's `Product` field (CNC, MIS, NRML) is not a setup type; must map to tags, not enums — important for other broker mappers
- **Auth middleware pattern:** JWT_SECRET validated at module load time causes server start failure if missing — intentional "fail fast" but needs clear docs

### Anti-Patterns Identified

- None critical — all identified issues were fixed during UAT (7 bugs resolved)

---

## 7. Getting Started

### Quick Start (New Developer)

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd "Trading Journal App"
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env:
   # DATABASE_URL="postgresql://user:pass@localhost:5432/trading_journal"
   # JWT_SECRET="your-super-secret-jwt-key-here"
   ```

3. **Start PostgreSQL:**
   ```bash
   # macOS with Homebrew:
   brew services start postgresql
   createdb trading_journal
   ```

4. **Push database schema:**
   ```bash
   npx prisma db push
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 — redirects to `/trades`

### Key Directories

- `src/app/` — Next.js pages and API routes
  - `src/app/trades/page.tsx` — Trade list with filters and NL quick entry
  - `src/app/analytics/page.tsx` — P&L summary and equity curve
  - `src/app/import/page.tsx` — CSV upload page
  - `src/app/api/trades/route.ts` — CRUD for trades
  - `src/app/api/import/route.ts` — CSV import endpoint
  - `src/app/api/parse/route.ts` — Natural language parsing endpoint
  - `src/app/api/analytics/` — Analytics endpoints (pnl-summary, equity-curve)
- `src/lib/` — Business logic
  - `src/lib/parsers/` — CSV and NL parsers
  - `src/lib/validations/` — Zod schemas
  - `src/lib/db.ts` — Prisma client singleton
- `src/types/` — TypeScript type definitions (`trade.types.ts`)
- `src/components/` — Reusable UI components
- `src/middleware/` — Auth middleware (`auth.ts`)
- `prisma/` — Database schema (`schema.prisma`)

### Testing

```bash
# Run development server
npm run dev

# Run type checking
npm run typecheck

# Run linting (if configured)
npm run lint

# Database operations
npx prisma studio        # Open Prisma Studio GUI
npx prisma db push       # Push schema to DB
npx prisma migrate dev   # Create and apply migration
```

### Entry Points for New Contributors

- **Start here:** `src/app/trades/page.tsx` — see how filters, NL entry, and TradeList integrate
- **API layer:** `src/app/api/trades/route.ts` — CRUD operations; `src/app/api/import/route.ts` — CSV import flow
- **Parsers:** `src/lib/parsers/csvParser.ts` and `brokerMappers.ts` — broker CSV mapping; `src/lib/parsers/nlParser.ts` — regex patterns
- **Validation:** `src/lib/validations/zodSchemas.ts` — all input schemas in one place
- **UI components:** `src/components/trade-form.tsx` (modal), `src/components/trade-list.tsx` (table with export)

### Configuration

- **Environment variables:** `DATABASE_URL`, `JWT_SECRET` (required), `NEXTAUTH_SECRET` (if using NextAuth), `NEXTAUTH_URL`
- **Port:** `PORT` (default 3000)
- **Database:** PostgreSQL required; TimescaleDB not yet used (can add in Phase 2 for time-series optimizations)

---

## Stats

- **Timeline:** 2026-04-23 → 2026-04-24 (2 days)
- **Phases:** 1 complete / 5 total (20%)
- **Commits:** 35
- **Files changed:** 150+ (estimated from git diff)
- **Contributors:** 1 (ryu192-r)

---

*End of Milestone v1 Summary*
