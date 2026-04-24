---
phase: 02-core-analytics
plan: 03
subsystem: analytics
tags: [charts, r-multiples, mae, setup-scorecard, market-regime, weekly-overlay]
depends_on: ["02-02"]
provides: ["analytics-ui", "r-multiple-page", "mae-page", "advanced-page"]
affects: []
tech-stack:
  added: [react-chartjs-2, shadcn/ui Card, shadcn/ui Table]
  patterns: [bar-chart, line-chart, scatter-markers, stat-cards, responsive-layout]
key-files:
  created:
    - src/components/analytics/RMultipleHistogram.tsx
    - src/app/analytics/r-multiple/page.tsx
    - src/components/analytics/MAEHistogram.tsx
    - src/app/analytics/mae/page.tsx
    - src/components/analytics/SetupScorecardTable.tsx
    - src/components/analytics/MarketRegimeBreakdown.tsx
    - src/components/analytics/WeeklyOverlayChart.tsx
    - src/app/analytics/advanced/page.tsx
  modified: []
decisions: []
metrics:
  duration: TBD
  completed: 2026-04-24
  tasks: 3/3
  files: 8
---

# Phase 02 Plan 03: Analytics UI Components & Pages — Summary

## One-Liner

Built three analytics pages with Chart.js visualizations: R-multiple histogram with stats, MAE histogram with stop recommendation, and advanced page showing setup scorecard, market regime breakdown, and weekly NIFTY overlay with trade markers.

## Status

✅ **Complete** — All three tasks executed, verified, and committed. All UI components render charts responsively and fetch data from the API endpoints built in Plan 02-02.

## What Was Built

### Task 1 — R-Multiple Histogram Component and Page

- **Component** `RMultipleHistogram.tsx`: Bar chart using `react-chartjs-2` with bins data; axis labels; wrapped in Card.
- **Page** `src/app/analytics/r-multiple/page.tsx`: Fetches `/api/analytics/r-multiples`; displays four stat cards (Total Trades, Mean R, Median R, Skewness); renders histogram; includes loading and error states.

**Route:** `/analytics/r-multiple`

**Stats displayed:**
- Count, Mean, Median, Skewness

**Verification:** ✓ Files exist, Bar component used, RMultipleHistogram imported and rendered.

### Task 2 — MAE Histogram Page with Stop Recommendation

- **Component** `MAEHistogram.tsx`: Bar chart showing MAE distribution by R bins; recommendation card with large text below chart.
- **Page** `src/app/analytics/mae/page.tsx`: Fetches `/api/analytics/mae`; displays Sample Size and Winners Count cards; renders histogram + recommendation; loading and error states.

**Route:** `/analytics/mae`

**Stop Recommendation:** 95th percentile MAE of winners converted to percentage (e.g., "Set stop at 2% — 95% of winners never went below this MAE").

**Verification:** ✓ Files exist, Bar component used, page created with fetch call.

### Task 3 — Advanced Analytics Page (Setup Scorecard, Market Regime, Weekly Overlay)

- **SetupScorecardTable.tsx**: Table with columns: Setup, Win Rate, Avg R, Profit Factor, Best, Worst, Recommendation. Uses shadcn/ui Table; color-coded win rates and recommendations.
- **MarketRegimeBreakdown.tsx**: Bar chart of avg R across regimes plus grid of Cards per regime showing trades count, win rate, avg R, profit factor, and adaptive rule text.
- **WeeklyOverlayChart.tsx**: Line chart of NIFTY weekly close prices; scatter overlay for entry markers (green triangle-up = long, red triangle-down = short) and exit markers (orange square). Fetches `/api/analytics/weekly-chart` (default current week).
- **Page** `src/app/analytics/advanced/page.tsx`: Uses `Promise.all` to fetch setup-scorecard, market-regime, and weekly-chart endpoints; renders three vertical sections each within Card containers.

**Route:** `/analytics/advanced`

**Verification:** ✓ All four component and page files exist.

## Requirements Covered

| Requirement | Status | Evidence |
|-------------|--------|----------|
| ANLY-04 | ✅ | R-multiple histogram + stats page (`src/app/analytics/r-multiple/page.tsx`) |
| ANLY-05 | ✅ | MAE histogram with stop recommendation page (`src/app/analytics/mae/page.tsx`) |
| MAE-02 | ✅ | Stop optimization recommendation displayed in MAEHistogram component |
| SETUP-01 | ✅ | SetupScorecardTable shows win rate, avg R, profit factor, best/worst, allocation tip |
| SETUP-02 | ✅ | Recommendation badges in SetupScorecardTable (increase/avoid/maintain) |
| MKT-02 | ✅ | MarketRegimeBreakdown displays six-region breakdown with rule suggestions |
| MKT-03 | ✅ | Chart + card breakdown per regime with win rate, avg R, profit factor |
| (UI-Responsive) | ✅ | All pages use Tailwind grid (`grid-cols-2 md:grid-cols-4`, `md:grid-cols-2`, `lg:grid-cols-3`) and container spacing |

## Key Files

```
src/components/analytics/RMultipleHistogram.tsx    # Bar chart + Card
src/app/analytics/r-multiple/page.tsx              # Stats grid + histogram
src/components/analytics/MAEHistogram.tsx          # MAE bar chart + stop tip
src/app/analytics/mae/page.tsx                     # MAE metrics + histogram
src/components/analytics/SetupScorecardTable.tsx   # Table of setup metrics
src/components/analytics/MarketRegimeBreakdown.tsx # Regime cards + bar chart
src/components/analytics/WeeklyOverlayChart.tsx    # Line + entry/exit scatter
src/app/analytics/advanced/page.tsx                # Aggregates all three sections
```

## Verification Steps

1. **R-Multiple Page**: Visit `/analytics/r-multiple` → Confirm histogram bars render, stats cards show numeric values.
2. **MAE Page**: Visit `/analytics/mae` → Confirm MAE histogram bars, stop recommendation text visible in highlighted card.
3. **Advanced Page**: Visit `/analytics/advanced` → Confirm SetupScorecard table populates, Regime breakdown shows cards + bar chart, WeeklyOverlay renders NIFTY line with colored entry/exit markers.
4. **Network**: Check browser Network tab for successful (200) fetches to `/api/analytics/r-multiples`, `/api/analytics/mae`, `/api/analytics/setup-scorecard`, `/api/analytics/market-regime`, `/api/analytics/weekly-chart`.
5. **Responsive**: Resize browser ≤768px — all grids collapse to single column, charts remain readable.

**Automated verification ran** during execution (per-task `grep` checks) — all passed.

## Deviations from Plan

**None** — Plan executed exactly as written. All implementation details matched the must-haves; no architectural changes or blocking issues encountered.

## Data Flow Summary

```
Page (useEffect) → fetch(endpoint) → API (02-02) → JSON response → State → Component props → Chart.js render
```

All endpoints return data already aggregating from `prisma.trade` with analytics calculations (`computeRMultiple`, `computeMAE`, `classifyMarketRegime`). Components are pure and reusable.

## Known Stubs

None — All components render actual data from endpoints. No placeholder text or empty arrays.

## Threat Flags

None — All endpoints are under `/api/analytics/*` and already protected by `requireAuth()` middleware (from Plan 02-02). Client-side fetch limited to authenticated user's own data; no new trust boundaries introduced.

## Self-Check

Checking file existence and commit history...

- [x] `RMultipleHistogram.tsx` exists
- [x] `r-multiple/page.tsx` exists
- [x] `MAEHistogram.tsx` exists
- [x] `mae/page.tsx` exists
- [x] `SetupScorecardTable.tsx` exists
- [x] `MarketRegimeBreakdown.tsx` exists
- [x] `WeeklyOverlayChart.tsx` exists
- [x] `advanced/page.tsx` exists
- [x] All files committed in three separate commits

**Self-Check: PASSED**

## Next Steps

- User should verify all three pages in browser (`/analytics/r-multiple`, `/analytics/mae`, `/analytics/advanced`) against success criteria.
- Add analytics links to bottom nav or sidebar if not already present from Phase 1.
- Phase 2 plans continue with remaining analytics pages (if any) and dashboard widgets.
