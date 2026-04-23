# Phase 1: Foundation & Trade Logging - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Core data infrastructure, manual/CSV/natural language entry, basic UI, export. Users can reliably capture trades and view basic performance metrics; the data foundation for all downstream analytics is established.

This phase delivers:
- Manual trade logging with required/optional fields
- CSV import from Indian brokers (Zerodha, Dhan, AngelOne, ICICI Direct)
- Natural language trade entry (hybrid parsing)
- Basic P&L summary and equity curve
- Responsive web UI
- CSV/JSON export

Creating trades, viewing basic analytics, and exporting data. NOT: behavioral analytics, advanced visualizations, dashboards, reports — those are separate phases.
</domain>

<decisions>
## Implementation Decisions

### Data Model
- **D-01:** Minimal required fields — entry/exit prices, direction, symbol, date required; stop/target, position size, setup type, notes optional
- **D-02:** Single trades table with all fields — simple, fast queries
- **D-03:** Strict typing — DECIMAL(10,2) for prices, TIMESTAMP WITH TIME ZONE for dates, ENUM for direction/setup type
- **D-04:** Full schema now based on all 30 v1 requirements — avoids migration complexity later
- **D-05:** Yes, add user_id FK to trades table — future-ready for multi-user support

### Natural Language Parsing
- **D-06:** Hybrid approach — rule-based (regex) first for common patterns ("bought HDFC at 730, stop 710, target 760"), LLM fallback for complex/ambiguous inputs (deferred to Phase 2)
- **D-07:** Phase 1 regex pattern coverage: basic long/short with stop/target, quantity variations, @-sign shorthand, slash notation (730/710/760), relative dates ("today", "yesterday")
- **D-08:** LLM fallback NOT implemented in Phase 1; unparseable input returns structured error with example format

### CSV Import
- **D-09:** Predefined mappers for each broker (Zerodha, Dhan, AngelOne, ICICI Direct) — reliable, fits Phase 1 scope
- **D-10:** Error handling: partial import — valid rows succeed, invalid rows skipped with row-specific error messages returned in summary
- **D-11:** Duplicate detection: auto-dedupe silently based on (symbol + entryDate + quantity ± small price tolerance); re-imports idempotent
- **D-12:** No file size limit in Phase 1 (self-hostable, user-controlled)
- **D-13:** Interactive preview deferred to Phase 2; direct import with post-import error summary

### UI Framework & Layout
- **D-14:** Vite + React + Tailwind CSS + shadcn/ui — fast development, modern stack, accessible pre-built components
- **D-15:** Route-based navigation — separate pages: `/trades` (list + form), `/analytics` (charts), `/import` (CSV upload), `/settings` (profile, export)
- **D-16:** Trade form placement: modal dialog (opens from `/trades` page, stays on same page after submit)
- **D-17:** Mobile navigation: bottom tab bar with 4 tabs (Trades, Analytics, Import, Settings)

### Export
- **D-18:** Client-side generation, CSV + JSON export (Excel formatting deferred to v2)
- **D-19:** Export all trade table fields (full fidelity); no column subset selection in Phase 1
- **D-20:** Date range filtering via query params (`?startDate=...&endDate=...`) supported
- **D-21:** CSV date format: Indian format (DD/MM/YYYY) for user familiarity

### Authentication
- **D-22:** JWT/session auth now — schema has user_id, implement auth to be future-ready
- **D-23:** JWT token expiry: 7 days in Phase 1; plan to extend to 30 days with "Remember me" in Phase 2
- **D-24:** No refresh tokens in Phase 1; user re-login when JWT expires (simpler)
- **D-25:** Password hashing: base64-encoded temporary (as in plan); bcrypt implementation deferred to Phase 2 refinement

### Analytics
- **D-26:** P&L summary and equity curve exclude open trades (only `exitPrice != null`); mark-to-market unrealized P&L deferred to later phases
- **D-27:** Equity curve plots realized P&L only; historical performance based on closed trades

### Database
- **D-28:** Additional composite indexes deferred to Phase 2: `userId + entryDate` (composite DESC for timeline), GIN index on `tags` array
- **D-29:** Index migration strategy: use Prisma migrate in Phase 2 after profiling real query performance

### Input Validation
- **D-30:** Adopt Zod for schema validation in Phase 1 — define `TradeCreateSchema`, `TradeUpdateSchema`, `ParseInputSchema`
- **D-31:** Error response format: structured Zod error object `{ errors: [{ field: string, message: string }] }` to enable field-level error display in forms

### the agent's Discretion
- Exact database column ordering and naming conventions
- JWT token expiration times, refresh token strategy (already decided: 7d, no refresh)
- shadcn/ui component customization (colors, spacing)
- CSV mapper error handling details (partial imports already decided; specific error messages left to implementation)
- NL parsing regex patterns for Indian market conventions (NSE:BSE prefixes, etc.) — within coverage decided
- Export file naming conventions
- Modal vs inline form UX details (modal decided; exact fields layout discretionary)
- Route file structure under `/app/` (grouped by feature vs resource)
- Zod schema definitions structure (single vs shared file)
- Duplicate detection tolerance thresholds (± price tolerance percentage)
- Analytics rounding precision (decimal places)
- Pagination implementation for trades list (cursor vs offset) — can be added in Phase 2 if needed

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Requirements
- `.planning/REQUIREMENTS.md` § Trade Logging (LOG-01..05) — Detailed requirement specs
- `.planning/REQUIREMENTS.md` § Core Analytics (ANLY-01..03) — P&L summary requirements
- `.planning/REQUIREMENTS.md` § UI & Export (UI-01..02) — UI and export requirements

### Phase 1 Success Criteria
- `.planning/ROADMAP.md` § Phase 1: Foundation & Trade Logging — 10 success criteria to validate

### Indian Market Context
- `.planning/PROJECT.md` § Context — Indian equity focus (NSE/BSE), INR currency, broker integrations

### Research & Architecture
- `.planning/research/STACK.md` — PostgreSQL + TimescaleDB recommendation, version info
- `.planning/research/ARCHITECTURE.md` — Component boundaries, data flow, build order
- `.planning/research/FEATURES.md` § Table Stakes — Must-have UI features for v1

### Existing Plans (for reference only — decisions captured above)
- `.planning/phases/01-foundation-trade-logging/01-01-PLAN.md` — Core infrastructure plan (auth, DB, CRUD, analytics, export, UI setup)
- `.planning/phases/01-foundation-trade-logging/01-02-PLAN.md` — CSV/NL parsers plan (not yet implemented)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `prisma/schema.prisma` — User and Trade models with indexes (exists, matches D-01..D-05)
- `src/middleware/auth.ts` — JWT auth middleware with httpOnly cookies (exists, 7d expiry in register route)
- `src/lib/db.ts` — Prisma client singleton (exists)
- `src/components/TradeForm.tsx` — Basic trade entry form using shadcn/ui (exists, modal integration pending)
- `src/components/TradeList.tsx` — Trade table component (exists, needs route integration)

### Established Patterns
- Next.js App Router pattern (API routes under `src/app/api/...`)
- Prisma ORM for database access (already used in existing routes)
- shadcn/ui component library (buttons, inputs, selects, tables, badges, cards)
- Tailwind CSS utility classes for styling

### Integration Points
- Database: PostgreSQL connection via Prisma (DATABASE_URL env var)
- Broker APIs: CSV import first; API sync deferred to Phase 5
- TradingView: Chart links, screenshots — manual entry in Phase 1, integration in v2
- Frontend routing: Next.js App Router pages under `src/app/`

### Gaps to Address (from plans not yet implemented)
- `src/lib/parsers/csvParser.ts` — CSV parsing logic
- `src/lib/parsers/brokerMappers.ts` — Broker-specific column mappers (Zerodha, Dhan, AngelOne, ICICI Direct)
- `src/lib/parsers/nlParser.ts` — Natural language parser with regex patterns
- `src/app/api/import/route.ts` — CSV upload endpoint
- `src/app/api/parse/route.ts` — NL entry endpoint
- `src/types/trade.types.ts` — TypeScript type definitions
- Route pages: `src/app/trades/page.tsx`, `src/app/analytics/page.tsx`, `src/app/import/page.tsx`, `src/app/settings/page.tsx`
- Modal component for trade entry (shadcn/ui dialog)

</code_context>

<specifics>
## Specific Ideas

- "Natural language entry should feel like talking to Hermes" (from Trade Journal Ideas.md) — zero friction is key; regex patterns should cover casual Indian trading lingo
- "If logging a trade takes >60 seconds, we failed" (from PROJECT.md) — speed matters; modal dialog and NL entry support this
- Indian market conventions: NSE: prefix for symbols, INR currency, STT/GST calculations needed (deferred to Phase 2)
- Predefined setup types: EP, VCP, breakout, pullback, parabolic long (from requirements)
- Emotion tags for future phases: CALM, FOMO, REVENGE, CONFIDENT, UNCERTAIN, BORED
- CSV import should handle Zerodha "tradebook.csv", Dhan, AngelOne "Trade_Details_*.csv", ICICI Direct standard export formats
- Date format preference: Indian users expect DD/MM/YYYY in exports and UI displays

</specifics>

<deferred>
## Deferred Ideas

### Ideas from Discussion (Outside Phase 1 Scope)
- **LLM fallback for NL parsing** — Hybrid approach planned; LLM integration deferred to Phase 2
- **Interactive CSV preview** — Show mapped trades before import; deferred to Phase 2 for better UX
- **Refresh tokens & "Remember me"** — Short-term JWT only; refresh mechanism and extended expiry in Phase 2
- **bcrypt password hashing** — Proper security hardening deferred to Phase 2 refinement
- **Composite database indexes** — `userId+entryDate`, GIN on `tags` added in Phase 2 after profiling
- **Mark-to-market unrealized P&L** — Open trade valuation requires price feed (broker API in Phase 5)
- **Excel-formatted export** — XLSX formatting with styles deferred to v2
- **User-selectable export columns** — UI for column selection deferred to later phase

### Reviewed Todos (not folded)
None — no todos were cross-referenced for Phase 1.

</deferred>

---

*Phase: 01-foundation-trade-logging*
*Context gathered: 2026-04-24*
