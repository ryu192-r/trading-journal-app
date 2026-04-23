# Trading Journal App — Project Guide

## GSD Workflow

This project uses the **Get Shit Done (GSD)** workflow for systematic development.

### Quick Commands

- `/gsd-new-project` — Initialize a new project (already completed)
- `/gsd-discuss-phase N` — Discuss approach for phase N
- `/gsd-plan-phase N` — Create execution plan for phase N
- `/gsd-execute-phase N` — Execute all plans in phase N
- `/gsd-verify-phase N` — Verify phase N deliverables
- `/gsd-transition` — Transition to next phase
- `/gsd-progress` — Show project progress

### Project Context

**Project:** Trading Journal App (TJA)
**Core Value:** Every trade logged automatically, every pattern surfaced, every mistake caught — so you become a consistently profitable trader.

**v1 Scope:**
- 30 requirements across 5 phases
- Indian equity markets focus (NSE/BSE)
- Web-first (responsive), mobile app in v2
- Zero-friction data capture (natural language, CSV import, broker API sync)
- Deep behavioral analytics (emotions, patterns, MAE/MFE)
- Actionable insights (stop optimization, setup scorecards, ghost tracking)

**Tech Stack (from research):**
- Frontend: React + TypeScript (recommended)
- Backend: Node.js + Express OR Python + FastAPI
- Database: PostgreSQL + TimescaleDB (time-series for equity curves)
- Caching: Redis (real-time dashboard)
- Deployment: Vercel (frontend) + Railway/Render (backend)

**Key Files:**
- `.planning/PROJECT.md` — Project context and vision
- `.planning/REQUIREMENTS.md` — 30 v1 requirements with traceability
- `.planning/ROADMAP.md` — 5 phases with success criteria
- `.planning/STATE.md` — Current project state
- `.planning/config.json` — Workflow preferences (YOLO, standard granularity, parallel execution)
- `.planning/research/` — Stack, features, architecture, pitfalls research

**Current Phase:** Ready to start Phase 1 (Foundation & Trade Logging)

---

## Development Principles

1. **Zero Friction** — If logging a trade takes >60 seconds, we failed
2. **Actionable Insights** — Every metric needs a recommendation ("Set stop at 2%")
3. **Behavioral Focus** — P&L alone doesn't improve trading; behavior change does
4. **Indian Market Specific** — Nifty/Sensex context, STCG/LTCG tax, FII-DII data
5. **Data Privacy** — Traders are paranoid about trade data; secure + encrypted + self-hostable option

---

## Next Steps

After reading this file, run:
```
/gsd-discuss-phase 1
```

This will gather context and clarify the approach for Phase 1 (Foundation & Trade Logging).
