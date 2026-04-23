# Phase 1: Foundation & Trade Logging - Context

**Gathered:** 2026-04-23
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
- **D-06:** Hybrid approach — rule-based (regex) first for common patterns ("bought HDFC at 730, stop 710, target 760"), LLM fallback for complex/ambiguous inputs

### CSV Import
- **D-07:** Predefined mappers for each broker (Zerodha, Dhan, AngelOne, ICICI Direct) — reliable, fits Phase 1 scope

### UI Framework
- **D-08:** Vite + React + Tailwind CSS + shadcn/ui — fast development, modern stack, accessible pre-built components

### Export Method
- **D-09:** Client-side generation, CSV + JSON export (Excel formatting deferred to v2)

### Authentication
- **D-10:** JWT/session auth now — schema has user_id, implement auth to be future-ready

### the agent's Discretion
- Exact database column ordering and naming conventions
- JWT token expiration times, refresh token strategy
- shadcn/ui component customization (colors, spacing)
- CSV mapper error handling (partial imports, malformed rows)
- NL parsing regex patterns for Indian market conventions (NSE:BSE prefixes, etc.)
- Export file naming conventions

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Database Schema
- `.planning/RESEARCH/STACK.md` — PostgreSQL + TimescaleDB recommendation, version info
- `.planning/RESEARCH/ARCHITECTURE.md` — Component boundaries, data flow, build order

### Trade Logging Requirements
- `.planning/REQUIREMENTS.md` § Trade Logging (LOG-01..05) — Detailed requirement specs
- `.planning/REQUIREMENTS.md` § Core Analytics (ANLY-01..03) — P&L summary requirements
- `.planning/REQUIREMENTS.md` § UI & Export (UI-01..02) — UI and export requirements

### Phase 1 Success Criteria
- `.planning/ROADMAP.md` § Phase 1: Foundation & Trade Logging — 10 success criteria to validate

### Indian Market Context
- `.planning/PROJECT.md` § Context — Indian equity focus (NSE/BSE), INR currency, broker integrations
- `Trade Journal Ideas.md` — Existing brainstorm (20 ideas) for reference, NOT implementation

### UI/UX References
- `.planning/research/FEATURES.md` § Table Stakes — Must-have UI features for v1
- `.planning/research/FEATURES.md` § Differentiators — Advanced features deferred to v2+

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing codebase

### Established Patterns
- None — greenfield project, establishing patterns in Phase 1

### Integration Points
- Database: PostgreSQL connection via chosen backend (Node.js or Python TBD in planning)
- Broker APIs: Dhan, Zerodha Kite Connect — CSV import first, API sync in v2
- TradingView: Chart links, screenshots — manual entry in Phase 1, integration in v2
- Frontend: Vite + React + Tailwind + shadcn/ui stack

</code_context>

<specifics>
## Specific Ideas

- "Natural language entry should feel like talking to Hermes" (from Trade Journal Ideas.md) — zero friction is key
- "If logging a trade takes >60 seconds, we failed" (from PROJECT.md) — speed matters
- Indian market conventions: NSE: prefix for symbols, INR currency, STT/GST calculations needed
- Predefined setup types: EP, VCP, breakout, pullback, parabolic long (from requirements)
- Emotion tags for future phases: CALM, FOMO, REVENGE, CONFIDENT, UNCERTAIN, BORED

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 1 scope.

### Reviewed Todos (not folded)
None — no todos were cross-referenced for Phase 1.

</deferred>

---
*Phase: 01-foundation-trade-logging*
*Context gathered: 2026-04-23*