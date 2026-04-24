---
phase: 02-core-analytics
plan: gap-05
type: execute
wave: 1
depends_on: ["gap-04"]
gap_closure: true
files_modified:
  - src/app/api/analytics/weekly-chart/route.ts
  - src/components/analytics/WeeklyOverlayChart.tsx
autonomous: true
requirements: [MKT-03]
user_setup: []
must_haves:
  truths:
    - "Weekly chart endpoint computes market trend (NIFTY 20-day slope or similar) and includes trend direction in response"
    - "WeeklyOverlayChart component renders entry/exit markers with visual distinction: with-trend trades use green up-arrow, counter-trend use red down-arrow (or color-coded border/shape)"
    - "Trend determination logic is documented in code comments"
  artifacts:
    - path: "src/app/api/analytics/weekly-chart/route.ts"
      provides: "Endpoint returns trend information per trade marker"
      contains: "trend: 'with' | 'counter'"
    - path: "src/components/analytics/WeeklyOverlayChart.tsx"
      provides: "Component renders markers with color/shape based on trend"
      contains: "marker.color = trend === 'with' ? '#22c55e' : '#ef4444'"
  key_links:
    - from: "weekly-chart/route.ts"
      to: "dataFetcher.getDailyOHLC"
      via: "fetches additional prior-week data to compute 20-day slope"
      pattern: "getDailyOHLC.*start.*end"
    - from: "WeeklyOverlayChart"
      to: "Chart.js marker styling"
      via: "pointBackgroundColor based on trend"
      pattern: "pointBackgroundColor.*trend"
---

<objective>
Add trend-alignment visualization to the weekly NIFTY overlay chart.

Purpose: Close gap — Success Criteria 11 requires the weekly overlay to show with-trend vs counter-trend performance. Currently the chart plots entries/exits but doesn't indicate whether each trade aligned with the prevailing market trend.

Implementation: Compute market trend (20-day slope of NIFTY close prices) in the weekly-chart endpoint. Tag each trade marker as `trend: 'with' | 'counter'`. Update WeeklyOverlayChart component to render with-trend entries as green triangles-up and counter-trend as red triangles-down (exits can be orange squares for both).

Output: Enhanced weekly-chart API and visually differentiated trade markers.
</objective>

<execution_context>
@$HOME/.config/kilo/get-shit-done/workflows/execute-plan.md
@$HOME/.config/kilo/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-core-analytics/02-VERIFICATION.md (gap source)
@.planning/phases/02-core-analytics/02-02-SUMMARY.md (weekly-chart endpoint)
@.planning/phases/02-core-analytics/02-03-SUMMARY.md (WeeklyOverlayChart component)

<interfaces>
- Weekly chart endpoint currently returns: { candles: [...], tradeMarkers: [{date, type, direction, price}] }
- Need to add: `trend: 'with' | 'counter'` to each tradeMarker
- Component currently uses Chart.js with point elements for markers
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Enhance weekly-chart endpoint to compute and return trend per trade</name>
  <files>src/app/api/analytics/weekly-chart/route.ts</files>
  <action>
  1. Read existing weekly-chart/route.ts.
  2. After fetching weekly NIFTY candles, compute market trend for the week:
     - Use the prior week's closing price (fetch 14 days total: 7 prior + 7 current) to compute slope of close prices (linear regression or simple week-over-week change).
     - Define: trend = 'with' if (currentWeekAvgClose > priorWeekAvgClose) for long trades OR (currentWeekAvgClose < priorWeekAvgClose) for short trades; else 'counter'.
     - Simpler: compute week's close vs prior week close: `weekClose = candles[candles.length-1].close`, `priorWeekClose = fetch prior week's last close`, trendUp = weekClose > priorWeekClose. For each trade: if (direction === 'LONG' && trendUp) || (direction === 'SHORT' && !trendUp) → 'with' else 'counter'.
  3. For each tradeMarker, add `trend: 'with' | 'counter'` field.
  4. Return enhanced markers array.
  5. Commit: `feat(phase2-gap): compute trend alignment for weekly overlay markers`
</action>
  <verify>
    <automated>grep -q "trend" src/app/api/analytics/weekly-chart/route.ts && echo "Trend field added to markers"</automated>
  </verify>
  <done>Weekly chart endpoint computes trend per trade marker</done>
</task>

<task type="auto">
  <name>Task 2: Update WeeklyOverlayChart to render trend-colored markers</name>
  <files>src/components/analytics/WeeklyOverlayChart.tsx</files>
  <action>
  1. Read existing WeeklyOverlayChart.tsx.
  2. When constructing marker datasets (entries and exits), set `pointBackgroundColor` (or `borderColor`) based on marker.trend:
     - With-trend: green (#22c55e) for entries, green (lighter) for exits
     - Counter-trend: red (#ef4444) for entries, red (lighter) for exits
  3. Optionally use different shapes: triangle-up for long-with-trend, triangle-down for short-counter, etc. Keep simple: color only.
  4. Ensure Chart.js dataset config uses `pointStyle` if needed; at minimum color change works.
  5. Commit: `feat(phase2-gap): render trend-aligned markers in weekly overlay chart`
</action>
  <verify>
    <automated>grep -q "trend" src/components/analytics/WeeklyOverlayChart.tsx && echo "Component uses trend for styling"</automated>
  </verify>
  <done>WeeklyOverlayChart renders trend-colored markers</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-----------|
| API → trend logic | Internal calculation; no user input |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation |
|-----------|----------|-----------|-------------|------------|
| T-GAP-06 | Tampering | Trend calculation could be wrong | accept | Simple logic; can be refined in later phases |
</threat_model>

<verification>
1. GET /api/analytics/weekly-chart returns tradeMarkers with `trend` field set to 'with' or 'counter'
2. WeeklyOverlayChart renders entry/exit points with green for with-trend, red for counter-trend
3. Chart remains responsive and legible
4. TypeScript compiles
</verification>

<success_criteria>
- [x] Weekly overlay chart visually distinguishes with-trend vs counter-trend trades
- [x] Trend determination based on NIFTY week-over-week direction
- [x] Color coding: green (aligned), red (opposite)
</success_criteria>

<output>
After completion, create `.planning/phases/02-core-analytics/02-gap-05-SUMMARY.md`
</output>

</plan>
