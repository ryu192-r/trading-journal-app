# STATE.md

## Project Reference

**Core Value:** Every trade logged automatically, every pattern surfaced, every mistake caught — so you become a consistently profitable trader.

**Current Focus:** Indian equity markets (NSE/BSE); v1 web-first application; zero-friction data capture; behavioral performance improvement.

**Technical Environment:** React frontend, Node.js/Python backend TBD; PostgreSQL + TimescaleDB; Redis; integrations with TradingView, Dhan, Zerodha Kite Connect; mobile-responsive first, native app v2.

**Constraints:**
- Indian equity markets only (v1 scope)
- Data privacy — secure, encrypted, self-hostable option
- Zero friction — natural language entry, CSV import, mobile quick-entry
- Precision P&L — STT, GST, brokerage, slippage accounted for
- Handles 1000s of trades without lag
- Solo developer budget — use free tiers or self-hosted

## Current Position

**Phase:** None (roadmap draft created; awaiting approval)
**Plan:** None
**Status:** Not started
**Progress:** 0% complete

**Progress Bar:** [          ] 0/5 phases

## Performance Metrics

- **Requirements Coverage:** 0/31 (0% in-progress)
- **Phases Planned:** 5/5
- **Completed Phases:** 0
- **In Progress:** 0

## Accumulated Context

### Decisions Made
- [2026-04-23] Clean-slate web app (not upgrading Python scripts)
- [2026-04-23] Indian equity markets focus for v1
- [2026-04-23] Web-first, mobile-responsive; native app deferred to v2
- [2026-04-23] Actionable insights required — every metric must have recommendation
- [2026-04-23] Behavioral focus — track emotions, patterns, psychological drivers
- [2026-04-23] 5-phase roadmap derived from requirements; 100% coverage validated (31/31)
- [2026-04-23] Success criteria defined per phase using goal-backward approach (observable user behaviors)

### Open Questions
- Technology stack finalization (React frontend; Node.js vs Python backend) — to be resolved in Phase 1 planning
- Database schema design for Indian market trade data — validate early in Phase 1
- Broker API sync sequence order (which broker first) — Phase 5
- Emotion tagging UI flow and heatmap visualization design — Phase 3

### Risks / Blockers
- Database schema changes post-launch are expensive — invest validation in Phase 1
- Behavioral heuristics may need adjustment based on real usage — monitor Phase 3
- Broker API rate limits and downtime handling — design resilience in Phase 5
- v1 scope creep risk — some v2 features (broker API) pulled into Phase 5 but noted as deferred; clarify during planning

---

## Session Continuity

**Last Updated:** 2026-04-23T19:47:42+05:30
**Context:** Roadmap draft created; 5 phases; all 31 v1 requirements mapped; traceability ready to update in REQUIREMENTS.md.

**Next Steps after Approval:**
- `/gsd-plan-phase 1` → break Foundation into executable plans
- Re-validate database schema design against Indian market timezone and equity-specific fields

---

*State auto-maintained by GSD workflow*
