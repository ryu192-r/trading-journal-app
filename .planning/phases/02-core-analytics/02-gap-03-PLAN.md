---
phase: 02-core-analytics
plan: gap-03
type: execute
wave: 1
depends_on: ["gap-02"]
gap_closure: true
files_modified:
  - src/app/api/analytics/r-multiples/route.ts
  - src/components/analytics/RMultipleHistogram.tsx
  - src/app/analytics/r-multiple/page.tsx
autonomous: true
requirements: [ANLY-04]
user_setup: []
must_haves:
  truths:
    - "R-multiples endpoint includes exit efficiency metrics (average MFE/R for winners, percentage of winners that hit target)"
    - "R-multiples page displays exit efficiency scoring alongside histogram and stats"
    - "Exit efficiency shows how close winners came to target (MFE-based) — helps users optimize exits"
  artifacts:
    - path: "src/app/api/analytics/r-multiples/route.ts"
      provides: "Enhanced r-multiples endpoint with exit efficiency data"
      contains: "exitEfficiency: { averageMFE, targetHitRate, sampleSize }"
    - path: "src/components/analytics/RMultipleHistogram.tsx"
      provides: "Component optionally renders exit efficiency card"
      contains: "exitEfficiency && ("
    - path: "src/app/analytics/r-multiple/page.tsx"
      provides: "Page passes exitEfficiency data to histogram component"
      contains: "exitEfficiency={response.exitEfficiency}"
  key_links:
    - from: "r-multiples/route.ts"
      to: "src/lib/analytics/calculator.ts"
      via: "calls computeMFE to calculate exit efficiency for winners"
      pattern: "computeMFE"
    - from: "RMultipleHistogram"
      to: "exit efficiency UI"
      via: "renders card with averageMFE and targetHitRate"
      pattern: "exitEfficiency"
---

<objective>
Add exit efficiency scoring to the R-multiples analytics page.

Purpose: Close gap — Success Criteria 1 requires "exit efficiency scoring" on the R-multiple distribution. Currently the page shows histogram and basic stats only. Exit efficiency uses MFE (Maximum Favorable Excursion) to show how close winners came to their target, helping users optimize exit decisions.

Output: Enhanced r-multiples endpoint returns exitEfficiency object; UI displays it in a prominent card.
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
@.planning/phases/02-core-analytics/02-02-SUMMARY.md (r-multiples endpoint)
@.planning/phases/02-core-analytics/02-03-SUMMARY.md (R-multiples page)

<interfaces>
- computeMFE(trade) from calculator returns {mfeAbs, mfeR}
- Existing r-multiples endpoint already queries closed trades; can reuse that dataset
- UI: RMultipleHistogram component accepts bins prop; extend to accept exitEfficiency prop
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Enhance r-multiples API with exit efficiency metrics</name>
  <files>src/app/api/analytics/r-multiples/route.ts</files>
  <action>
  1. Read existing r-multiples/route.ts.
  2. After computing R-multiples histogram, also compute exit efficiency:
     - Filter to winner trades (pnl > 0) that have targetPrice set.
     - For each winner, call computeMFE(trade) to get mfeAbs.
     - Compute averageMFE = mean of mfeR across winners.
     - Compute targetHitRate = count where mfeAbs >= (targetPrice - entryPrice) / winners count.
  3. Add to response: `exitEfficiency: { averageMFE, targetHitRate, sampleSize: winnersCount }`
  4. Keep existing histogram and stats unchanged.
  5. Typecheck and commit: `feat(phase2-gap): add exit efficiency metrics to r-multiples endpoint`
</action>
  <verify>
    <automated>grep -q "exitEfficiency" src/app/api/analytics/r-multiples/route.ts && echo "Exit efficiency added to endpoint"</automated>
  </verify>
  <done>R-multiples endpoint enhanced with exit efficiency data</done>
</task>

<task type="auto">
  <name>Task 2: Update RMultipleHistogram component to display exit efficiency</name>
  <files>src/components/analytics/RMultipleHistogram.tsx</files>
  <action>
  1. Read existing RMultipleHistogram.tsx.
  2. Add optional prop: `exitEfficiency?: { averageMFE: number, targetHitRate: number, sampleSize: number }`
  3. If exitEfficiency provided, render a Card below histogram showing:
     - "Exit Efficiency" heading
     - Average MFE: {averageMFE.toFixed(2)}R
     - Target Hit Rate: {(targetHitRate * 100).toFixed(1)}%
     - Sample size note
  4. Style with Tailwind (text-lg for values, muted color for label).
  5. Commit: `feat(phase2-gap): display exit efficiency card in R-multiple histogram`
</action>
  <verify>
    <automated>grep -q "exitEfficiency" src/components/analytics/RMultipleHistogram.tsx && echo "Component accepts exitEfficiency prop"</automated>
  </verify>
  <done>RMultipleHistogram component renders exit efficiency card</done>
</task>

<task type="auto">
  <name>Task 3: Wire exitEfficiency from page to component</name>
  <files>src/app/analytics/r-multiple/page.tsx</files>
  <action>
  1. Read r-multiple/page.tsx.
  2. In the fetch response handling, extract `exitEfficiency` from response.
  3. Pass it to RMultipleHistogram component: `<RMultipleHistogram bins={response.histogram} exitEfficiency={response.exitEfficiency} />`
  4. Ensure TypeScript types align (extend component prop interface if used).
  5. Commit: `feat(phase2-gap): wire exit efficiency data to R-multiple page`
</action>
  <verify>
    <automated>grep -q "exitEfficiency" src/app/analytics/r-multiple/page.tsx && echo "Page passes exitEfficiency to component"</automated>
  </verify>
  <done>R-multiple page wired to display exit efficiency</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-----------|
| Client → API | Standard authenticated fetch |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation |
|-----------|----------|-----------|-------------|------------|
| T-GAP-04 | Tampering | Client could manipulate MFE display | accept | Data sourced from server; client only renders |
</threat_model>

<verification>
1. GET /api/analytics/r-multiples returns exitEfficiency object with averageMFE, targetHitRate, sampleSize
2. R-multiple page renders exit efficiency card with numeric values
3. Card appears below histogram, styled consistently
4. TypeScript compiles without errors
</verification>

<success_criteria>
- [x] Exit efficiency scoring displayed on R-multiples page (MFE-based)
- [x] Shows average MFE in R units and target hit rate percentage
- [x] Based on winner trades only; sample size indicated
</success_criteria>

<output>
After completion, create `.planning/phases/02-core-analytics/02-gap-03-SUMMARY.md`
</output>

</plan>
