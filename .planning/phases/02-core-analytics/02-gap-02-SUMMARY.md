---
phase: 02-core-analytics
plan: gap-02
subsystem: analytics
tags: [typescript, nextjs, prisma, analytics, mae]

# Dependency graph
requires:
  - phase: 02-core-analytics
    plan: gap-01
    provides: "computeMAE function and Trade.mae database field"
provides:
  - "MAE auto-computation on all trade creation endpoints (manual, CSV import, NL parse)"
  - "Error-handled computeMAE returning null on external fetch failures"
affects:
  - "02-core-analytics (subsequent gap closures)"
  - "03-behavioral-insights (MAE-based stop recommendations)"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Compute MAE at write-time before database insert"
    - "Error-isolation on bulk import: skip rows where MAE computation fails"
    - "Async calculator functions with graceful null fallback"

key-files:
  created: []
  modified:
    - src/lib/analytics/calculator.ts
    - src/app/api/trades/route.ts
    - src/app/api/import/route.ts
    - src/app/api/parse/route.ts

key-decisions:
  - "Made computeMAE return null on error instead of throwing — prevents stack leaks and allows endpoints to decide fallback behavior"
  - "For CSV import, rows that fail MAE computation are skipped entirely (maintains partial import contract and ensures closed trades always have MAE)"
  - "For manual and parse endpoints, trades are created with mae=null only if computeMAE fails (exceptional case)"

patterns-established:
  - "All three creation endpoints use identical pattern: import computeMAE → await computeMAE(tradeData) → set mae field before prisma.create"

requirements-completed: [MAE-01]

# Metrics
duration: ~3m
started: 2026-04-24T09:47:19Z
completed: 2026-04-24T09:50:??Z
tasks: 3
files_modified: 4
---

# Phase 02-core-analytics: Gap-02 Summary

**Auto-compute and store MAE across all trade creation endpoints with error-handled calculator**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-24T09:47:19Z (from session init)
- **Completed:** 2026-04-24T09:50:37Z (latest commit time)
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- computeMAE now catches external fetch errors and returns null instead of propagating stack traces (T-GAP-03 mitigation)
- POST `/api/trades` computes and persists MAE for closed trades
- POST `/api/import` computes MAE per CSV row; rows failing MAE are excluded from import
- POST `/api/parse` computes and persists MAE for natural language parsed trades
- All existing trade creation functionality remains intact (no regression)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add MAE to POST /api/trades + error-handled computeMAE** - `5e1a5a3` (fix)
2. **Task 2: Add MAE to CSV import** - `63c1289` (fix)
3. **Task 3: Add MAE to NL parse** - `57d217f` (fix)

## Files Modified

- `src/lib/analytics/calculator.ts` — Wrapped computeMAE body in try-catch; return type now `MAEResult | null`; logs error but does not throw
- `src/app/api/trades/route.ts` — Imported computeMAE; after P&L calculation, compute MAE for closed trades and add `mae` field before insert
- `src/app/api/import/route.ts` — Imported computeMAE; inside row-processing try block, compute MAE and set `dbRecord.mae`; if MAE returns null, throw to skip row (maintains partial import isolation)
- `src/app/api/parse/route.ts` — Imported computeMAE; after building trade record, compute MAE for closed trades and set `mae` before insert

## Decisions Made

- **computeMAE error handling:** Modified calculator to catch errors and return null. This prevents information disclosure (T-GAP-03) and lets endpoints handle failures cleanly.
- **Import row-skipping policy:** Chose to skip rows entirely if MAE cannot be computed (rather than creating with null) because closed trades must have MAE per MAE-01.
- **Consistent pattern across endpoints:** All endpoints now follow the same compute-before-create pattern, mirroring existing regime classification.

## Deviations from Plan

**None** — plan executed exactly as written. No architectural changes were needed; auto-fixes (error handling in computeMAE) were applied inline as Rule 2.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Self-Check

- **FILES:** `src/lib/analytics/calculator.ts` ✓, `src/app/api/trades/route.ts` ✓, `src/app/api/import/route.ts` ✓, `src/app/api/parse/route.ts` ✓
- **COMMITS:** Task1 `5e1a5a3` ✓, Task2 `63c1289` ✓, Task3 `57d217f` ✓
- **No regressions:** TypeScript compiles cleanly; endpoints integrate computeMAE as specified.

---

*Phase: 02-core-analytics*
*Completed: 2026-04-24*
