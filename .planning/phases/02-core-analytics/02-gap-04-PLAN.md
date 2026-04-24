---
phase: 02-core-analytics
plan: gap-04
type: execute
wave: 1
depends_on: ["gap-03"]
gap_closure: true
files_modified:
  - src/app/analytics/performance/page.tsx
  - src/components/analytics/PerformanceMetricsCard.tsx
autonomous: true
requirements: [ANLY-05]
user_setup: []
must_haves:
  truths:
    - "User can navigate to /analytics/performance and see Sharpe ratio, Sortino ratio, maximum drawdown, and recovery factor"
    - "Metrics are displayed in clear cards with labels and values"
    - "Page fetches data from /api/analytics/performance"
  artifacts:
    - path: "src/app/analytics/performance/page.tsx"
      provides: "Performance metrics page"
      contains: "export default function PerformancePage"
    - path: "src/components/analytics/PerformanceMetricsCard.tsx"
      provides: "Reusable card component for displaying a metric with label and value"
      contains: "export default function PerformanceMetricsCard"
  key_links:
    - from: "src/app/analytics/performance/page.tsx"
      to: "src/app/api/analytics/performance/route.ts"
      via: "fetch('/api/analytics/performance')"
      pattern: "fetch\\(['\"]/api/analytics/performance['\"]"
---

<objective>
Create UI page to display performance metrics (Sharpe, Sortino, Max Drawdown, Recovery Factor).

Purpose: Close gap — Success Criteria 2 requires these metrics to be displayed. The API endpoint already exists and computes them. This plan adds a simple page at `/analytics/performance` with card-based display.

Output: New analytics page showing 4 performance metrics in a responsive grid.
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
@.planning/phases/02-core-analytics/02-02-SUMMARY.md (performance endpoint exists)
@.planning/phases/02-core-analytics/02-03-SUMMARY.md (UI patterns established)

<interfaces>
- API: GET /api/analytics/performance returns { sharpe, sortino, maxDrawdown, recoveryFactor, tradesCount }
- Existing UI patterns: Use shadcn/ui Card, responsive Tailwind grid (see r-multiple page)
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create PerformanceMetricsCard component</name>
  <files>src/components/analytics/PerformanceMetricsCard.tsx</files>
  <action>
  1. Create `src/components/analytics/PerformanceMetricsCard.tsx`:
     - Props: `label: string`, `value: number | string`, `subtitle?: string` (optional hint)
     - Render inside a shadcn/ui Card with title (label) and large value (text-3xl), optional subtitle in muted color.
  2. Export default.
  3. Commit: `feat(phase2-gap): create PerformanceMetricsCard component`
</action>
  <verify>
    <automated>test -f src/components/analytics/PerformanceMetricsCard.tsx && grep -q "export default function PerformanceMetricsCard" src/components/analytics/PerformanceMetricsCard.tsx && echo "Component created"</automated>
  </verify>
  <done>PerformanceMetricsCard component created</done>
</task>

<task type="auto">
  <name>Task 2: Create /analytics/performance page</name>
  <files>src/app/analytics/performance/page.tsx</files>
  <action>
  1. Create `src/app/analytics/performance/page.tsx` with `'use client'`.
  2. On mount, fetch `/api/analytics/performance`.
  3. On success, render a grid of 4 PerformanceMetricsCard components:
     - Sharpe Ratio (value: response.sharpe.toFixed(2))
     - Sortino Ratio (response.sortino.toFixed(2))
     - Max Drawdown (response.maxDrawdown.toFixed(2) + '%' or currency)
     - Recovery Factor (response.recoveryFactor.toFixed(2))
     Optionally add a card for tradesCount.
  4. Add loading spinner and error banner.
  5. Use responsive grid: `grid grid-cols-2 md:grid-cols-4 gap-4`.
  6. Commit: `feat(phase2-gap): create analytics performance page`
</action>
  <verify>
    <automated>test -f src/app/analytics/performance/page.tsx && grep -q "export default function PerformancePage" src/app/analytics/performance/page.tsx && echo "Performance page created"</automated>
  </verify>
  <done>Performance metrics page created and wired</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-----------|
| Client → API | Auth cookie required; endpoint already protected |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation |
|-----------|----------|-----------|-------------|------------|
| T-GAP-05 | Information Disclosure | Performance data visible only to authenticated user | accept | requireAuth middleware enforces scoping |
</threat_model>

<verification>
1. Navigate to /analytics/performance — page loads
2. Four metric cards display: Sharpe, Sortino, Max Drawdown, Recovery Factor with numeric values
3. Page responsive on mobile (2-column grid collapses if needed)
4. API call to /api/analytics/performance returns 200 with data
5. TypeScript compiles without errors
</verification>

<success_criteria>
- [x] Performance page displays all four required metrics
- [x] Values are formatted to 2 decimal places
- [x] Page is responsive and styled consistently
</success_criteria>

<output>
After completion, create `.planning/phases/02-core-analytics/02-gap-04-SUMMARY.md`
</output>

</plan>
