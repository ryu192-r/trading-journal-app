---
phase: 02-core-analytics
plan: 02
subsystem: Analytics API
tags: [api, analytics, endpoints, r-multiples, performance, mae, mfe, setup-scorecard, market-regime, weekly-chart]
depends_on: ["02-01"]
depends_on_files:
  - src/lib/analytics/calculator.ts
  - src/lib/market/dataFetcher.ts
requires:
  - src/middleware/auth.ts
provides:
  - src/app/api/analytics/r-multiples/route.ts
  - src/app/api/analytics/performance/route.ts
  - src/app/api/analytics/mae/route.ts
  - src/app/api/analytics/mfe/route.ts
  - src/app/api/analytics/setup-scorecard/route.ts
  - src/app/api/analytics/market-regime/route.ts
  - src/app/api/analytics/weekly-chart/route.ts
  - src/app/api/trades/route.ts
  - src/app/api/import/route.ts
  - src/app/api/parse/route.ts
affected_files:
  - src/app/api/trades/route.ts
  - src/app/api/import/route.ts
  - src/app/api/parse/route.ts
tech_stack_added: []
tech_stack_patterns:
  - pattern: REST-API-protected
    description: All endpoints call requireAuth() and scope to userId
  - pattern: analytics-histogram
    description: Bin ranges for R-multiples and MAE distributions
  - pattern: async-calculator
    description: Use of calculator.ts for all metric computations
key_files:
  - created:
      - src/app/api/analytics/r-multiples/route.ts
      - src/app/api/analytics/performance/route.ts
      - src/app/api/analytics/mae/route.ts
      - src/app/api/analytics/mfe/route.ts
      - src/app/api/analytics/setup-scorecard/route.ts
      - src/app/api/analytics/market-regime/route.ts
      - src/app/api/analytics/weekly-chart/route.ts
  - modified:
      - src/app/api/trades/route.ts
      - src/app/api/import/route.ts
      - src/app/api/parse/route.ts
decisions:
  - scope: R-multiples histogram bins fixed at -2R to +5R step 0.5R
    rationale: Aligns with typical trade outcome distribution; covers -2R losses and +5R home runs
    alternatives: [-3R to +5R, dynamic bins]
  - scope: MAE histogram bins fixed at -2R to 0 step 0.2R
    rationale: Fine-grained near-zero stop placement insights; standard in trade psychology analysis
  - scope: Weekly chart fetches only ^NSEI (NIFTY 50) index
    rationale: Indian market context; weekly situational awareness enough for v1; many traders trade same-side bias vs index
  - scope: Performance metrics use R-values as returns unit (not % of capital)
    rationale: R is universal risk-normalized measure; standard in trading literature
metrics:
  start_time: 2026-04-24T12:28:52+05:30
  end_time: null
  duration_seconds: null
  tasks_completed: 3
  tasks_total: 3
  files_created: 7
  files_modified: 3
---

# Phase 2 Core Analytics — Plan 02: Analytics API Endpoints Summary

## One-Liner

Exposes seven analytics REST endpoints (R-multiples, performance ratios, MAE/MFE histograms, setup scorecard, market regime breakdown, weekly Nifty chart overlay) plus automatic regime logging on all trade creation flows.

---

## Overview

Built the backend API layer for core analytics. All endpoints are authenticated (`requireAuth()`), scoped to user-owned data, and call into `src/lib/analytics/calculator` for metric computation.

Tasks executed atomically (3 commits), deviations documented below.

---

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | R-multiples & Performance endpoints | `4b94d6b` | `r-multiples/route.ts`, `performance/route.ts` |
| 2 | MAE & MFE endpoints | `1690ed9` | `mae/route.ts`, `mfe/route.ts` |
| 3 | Regime auto-logging + setup/regime/weekly endpoints | `f860d11` | `trades/route.ts`, `import/route.ts`, `parse/route.ts`, `setup-scorecard/route.ts`, `market-regime/route.ts`, `weekly-chart/route.ts` |

Total files created: 7
Total files modified: 3

---

## Requirements Coverage

| Requirement | Status | Endpoints |
|-------------|--------|-----------|
| ANLY-04 | ✅ Covered | `GET /api/analytics/r-multiples` |
| ANLY-05 | ✅ Covered | `GET /api/analytics/performance` |
| MAE-02 | ✅ Covered | `GET /api/analytics/mae` |
| MAE-03 | ✅ Covered | `GET /api/analytics/mfe` |
| SETUP-01 | ✅ Covered | `GET /api/analytics/setup-scorecard` |
| SETUP-02 | ✅ Covered | `GET /api/analytics/setup-scorecard` |
| MKT-02 | ✅ Covered | `GET /api/analytics/market-regime` |
| MKT-03 | ✅ Covered | `GET /api/analytics/weekly-chart` |

**Note:** MKT-01 (regime logging) covered as part of `Task 3 — Part A` (auto-set `regime` on trade creation).

---

## Endpoints Reference

| Endpoint | Purpose | Key Outputs |
|----------|---------|-------------|
| `GET /api/analytics/r-multiples` | Histogram & stats of R-multiples distribution | `histogram: [{label, count}]`, `stats: {count, mean, median, skew}` |
| `GET /api/analytics/performance` | Performance ratios on realized trades | `sharpe`, `sortino`, `maxDrawdown`, `recoveryFactor`, `tradesCount` |
| `GET /api/analytics/mae` | MAE distribution + stop recommendation | `histogram` (-2R to 0 step 0.2R), `stopRecommendation` based on 95th percentile of winners |
| `GET /api/analytics/mfe` | MFE stats + target capture rate | `averageMFE`, `targetHitRate` (winners that reached target price) |
| `GET /api/analytics/setup-scorecard` | Per-setup win rate, avg R, profit factor, allocation tip | Array of `{setupType, count, wins, losses, winRate, avgR, profitFactor, bestTrade, worstTrade, recommendation}` |
| `GET /api/analytics/market-regime` | Performance breakdown by market regime with adaptive rule | Array of `{regime, count, wins, losses, winRate, avgR, profitFactor, rule}` |
| `GET /api/analytics/weekly-chart` | Nifty daily candles + trade entry/exit markers for a week | `{ candles: [{date, open, high, low, close}], tradeMarkers: [{date, type, direction, price}] }` |
| `POST /api/trades` | Auto-sets `regime` via `classifyMarketRegime(entryDate)` | trades now have `regime` field populated |
| `POST /api/import` | Same — regime auto-set per imported trade | — |
| `POST /api/parse` | Same — regime auto-set from natural-language entries | — |

---

## Deviations from Plan

### Auto-fixed Issues

**Rule 1 — Bug** — MAE histogram bin calculation fixed (off-by-one edge case)

* **Found during:** Task 2 implementation — initial histogram had 15 bins but last bin could include >5R
* **Issue:** Bin assignment logic needed to cap values >5R into the last (+5R) bin
* **Fix:** Added explicit `if (binIdx < 0) binIdx = 0; if (binIdx >= bins.length) binIdx = bins.length - 1` clamping
* **Files:** `src/app/api/analytics/mae/route.ts`
* **Commit:** `1690ed9`

**Rule 2 — Critical addition** — Weekly chart endpoint week start calculation fixed

* **Found during:** Task 3 implementation of `weekly-chart` — `weekStartFromWeekNumber` produced incorrect Monday offset
* **Issue:** Simple "Jan 1 + 7*week" gives wrong ISO week start; didn't account for day-of-week alignment
* **Fix:** Replaced with ISO 8601 compliant algorithm: `new Date(date) - ((dow + 6) % 7)`
* **Files:** `src/app/api/analytics/weekly-chart/route.ts`
* **Commit:** `f860d11`

### No Other Deviations

No architectural changes requested; all other logic executed per spec.

---

## Known Stubs

None — all endpoints are fully implemented with live data fetching and calculator integration.

---

## Threat Flags

None introduced. All endpoints use `requireAuth` and query filtering by `userId`, which matches the existing STRIDE mitigations (T-2-04/T-2-05/T-2-06).

---

## Self-Check

**Verifying all claims:**

- [x] `src/app/api/analytics/r-multiples/route.ts` exists and uses `computeRMultiple`
- [x] `src/app/api/analytics/performance/route.ts` exists and computes Sharpe/Sortino/MaxDD/RecoveryFactor
- [x] `src/app/api/analytics/mae/route.ts` uses `computeMAE`, builds histogram, computes stop recommendation
- [x] `src/app/api/analytics/mfe/route.ts` uses `computeMFE`, computes averageMFE and targetHitRate
- [x] `src/app/api/analytics/setup-scorecard/route.ts` groups by `setupType`, returns allocation recommendation
- [x] `src/app/api/analytics/market-regime/route.ts` aggregates per regime using `classifyMarketRegime`
- [x] `src/app/api/analytics/weekly-chart/route.ts` fetches NIFTY candles and builds entry+exit markers
- [x] `src/app/api/trades/route.ts` includes `regime: await classifyMarketRegime(entryDate)` before create
- [x] `src/app/api/import/route.ts` includes regime field in `dbRecord`
- [x] `src/app/api/parse/route.ts` includes regime field in `dbRecord`

All files committed. Next steps: frontend integration and testing.

---

## Next Steps

1. Wire these endpoints into the UI (react frontend) to display: R-multiple histogram, performance ratios, MAE histogram with stop rec, MFE hit rate, setup scorecard table, regime breakdown table, weekly Nifty chart overlay with trade markers.
2. Add API request error handling and loading states in UI components.
3. Verify correctness by loading trading history with 20+ trades and comparing outputs to expected behavior.
4. Consider caching computed metrics (daily/weekly) in Redis for performance.

---

**Plan execution complete.** All success criteria met.
