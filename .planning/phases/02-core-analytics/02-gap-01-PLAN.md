---
phase: 02-core-analytics
plan: gap-01
type: execute
wave: 1
depends_on: []
gap_closure: true
files_modified:
  - src/app/api/analytics/performance/route.ts
autonomous: true
requirements: [ANLY-05]
user_setup: []
must_haves:
  truths:
    - "performance/route.ts imports computeSharpe, computeSortino, computeMaxDrawdown, computeRecoveryFactor from calculator"
    - "No duplicate local implementations of these functions exist"
    - "Endpoint still returns same JSON shape (sharpe, sortino, maxDrawdown, recoveryFactor, tradesCount)"
  artifacts:
    - path: "src/app/api/analytics/performance/route.ts"
      provides: "Performance endpoint using shared calculator functions"
      contains: "import { computeSharpe, computeSortino, computeMaxDrawdown, computeRecoveryFactor } from '@/lib/analytics/calculator'"
      not_contains: ["function computeSharpe", "function computeSortino", "function computeMaxDrawdown", "function computeRecoveryFactor"]
  key_links:
    - from: "performance/route.ts"
      to: "src/lib/analytics/calculator.ts"
      via: "imports computeSharpe, computeSortino, computeMaxDrawdown, computeRecoveryFactor"
      pattern: "import.*compute(Sharpe|Sortino|MaxDrawdown|RecoveryFactor).*calculator"
---

<objective>
Refactor performance endpoint to use shared calculator functions instead of duplicate local implementations.

Purpose: Fix architectural breach — all analytics computation must live in the calculator module to avoid divergence and maintain single source of truth.

Output: performance/route.ts imports and uses calculator functions; local duplicate code removed.
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
@.planning/phases/02-core-analytics/02-02-PLAN.md (original intent)
@.planning/phases/02-core-analytics/02-02-SUMMARY.md (what was built)

<interfaces>
Dependencies:
- src/lib/analytics/calculator.ts exports: computeSharpe, computeSortino, computeMaxDrawdown, computeRecoveryFactor
- Existing: performance/route.ts has local implementations — replace with imports
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Refactor performance endpoint to import calculator functions</name>
  <files>src/app/api/analytics/performance/route.ts</files>
  <action>
  1. Read current performance/route.ts to see local implementations.
  2. Remove local definitions of computeSharpe, computeSortino, computeMaxDrawdown, computeRecoveryFactor.
  3. Add import: `import { computeSharpe, computeSortino, computeMaxDrawdown, computeRecoveryFactor } from '@/lib/analytics/calculator'`
  4. Replace all calls to local functions with imported calculator functions.
  5. Ensure endpoint logic unchanged (same input/output).
  6. Run typecheck to verify imports resolve.
  7. Commit with message: `fix(phase2-gap): refactor performance endpoint to use shared calculator`
</action>
  <verify>
    <automated>grep -q "import.*computeSharpe.*calculator" src/app/api/analytics/performance/route.ts && grep -q "import.*computeSortino.*calculator" src/app/api/analytics/performance/route.ts && echo "Imports present" && ! grep -q "function computeSharpe" src/app/api/analytics/performance/route.ts && echo "No local duplicates"</automated>
  </verify>
  <done>Performance endpoint refactored to use shared calculator module</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-----------|
| API route → calculator | Internal module call; trusted |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation |
|-----------|----------|-----------|-------------|------------|
| T-GAP-01 | Tampering | Calculator import could be broken | accept | TypeScript compile-time check ensures import validity |
</threat_model>

<verification>
1. performance/route.ts imports all four calculator functions
2. No local function definitions for these four exist
3. TypeScript compiles without errors
4. Endpoint still returns correct JSON shape
</verification>

<success_criteria>
- [x] performance/route.ts uses calculator imports
- [x] DRY principle restored; single source of truth for analytics computations
</success_criteria>

<output>
After completion, create `.planning/phases/02-core-analytics/02-gap-01-SUMMARY.md`
</output>

</plan>
