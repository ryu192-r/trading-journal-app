---
phase: 02-core-analytics
plan: gap-02
type: execute
wave: 1
depends_on: ["gap-01"]
gap_closure: true
files_modified:
  - src/app/api/trades/route.ts
  - src/app/api/import/route.ts
  - src/app/api/parse/route.ts
autonomous: true
requirements: [MAE-01]
user_setup: []
must_haves:
  truths:
    - "All three trade creation endpoints compute MAE via computeMAE(trade) and store in trade.mae field before database insert"
    - "MAE value is non-null for closed trades (exitPrice not null)"
    - "computeMAE fetches price data if not provided (calls getDailyOHLC internally)"
  artifacts:
    - path: "src/app/api/trades/route.ts"
      provides: "POST /api/trades computes and saves MAE"
      contains: "const mae = await computeMAE(tradeData)" and "mae: mae?.maeAbs"
    - path: "src/app/api/import/route.ts"
      provides: "CSV import computes and saves MAE per trade"
      contains: "mae: computedMae?.maeAbs"
    - path: "src/app/api/parse/route.ts"
      provides: "NL parse computes and saves MAE"
      contains: "mae: computedMae?.maeAbs"
  key_links:
    - from: "trades/route.ts POST"
      to: "src/lib/analytics/calculator.ts"
      via: "import computeMAE and call before prisma.trade.create"
      pattern: "computeMAE\\(.*\\)"
    - from: "import/route.ts"
      to: "calculator.computeMAE"
      via: "computes MAE for each validated trade row"
      pattern: "computeMAE"
    - from: "parse/route.ts"
      to: "calculator.computeMAE"
      via: "computes MAE after parsing"
      pattern: "computeMAE"
---

<objective>
Auto-compute and store MAE on every trade creation (manual, CSV import, natural language).

Purpose: Close gap — MAE-01 requires "Each trade has MAE calculated automatically". Currently MAE field is nullable and never set on creation. This fix computes MAE at write-time using the calculator's computeMAE function (which fetches OHLC data as needed) and persists it to the database.

Output: All three trade creation endpoints set the `mae` field before insert.
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
@.planning/phases/02-core-analytics/02-02-PLAN.md (original plan — regime logging pattern)
@.planning/phases/02-core-analytics/02-02-SUMMARY.md

<interfaces>
- computeMAE(trade: Trade): Promise<{maeAbs: number, maeR: number} | null> from calculator
- Trade model: mae Float? (nullable but we will populate for closed trades)
- Existing pattern: regime is computed via classifyMarketRegime and added to trade data before create — follow same pattern
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add MAE computation to POST /api/trades</name>
  <files>src/app/api/trades/route.ts</files>
  <action>
  1. Read existing POST handler in trades/route.ts.
  2. Import computeMAE from '@/lib/analytics/calculator'.
  3. After constructing the trade creation object (with entryPrice, stopPrice, direction, exitPrice if provided), but BEFORE prisma.trade.create:
     - If exitPrice is not null (closed trade), call `const maeResult = await computeMAE(tradeData)`
     - Add `mae: maeResult?.maeAbs ?? null` to the create object
  4. If exitPrice is null (open trade), mae remains null (acceptable).
  5. Verify type compatibility (mae Float? matches number | null).
  6. Run typecheck.
  7. Commit: `fix(phase2-gap): compute and store MAE on trade creation`
</action>
  <verify>
    <automated>grep -q "import.*computeMAE" src/app/api/trades/route.ts && grep -q "mae:" src/app/api/trades/route.ts && echo "MAE computation added to trades route"</automated>
  </verify>
  <done>MAE auto-computation added to manual trade creation</done>
</task>

<task type="auto">
  <name>Task 2: Add MAE computation to CSV import endpoint</name>
  <files>src/app/api/import/route.ts</files>
  <action>
  1. Read import/route.ts POST handler.
  2. Import computeMAE from '@/lib/analytics/calculator'.
  3. Inside the transaction loop where each validated trade row is prepared (before prisma.trade.create):
     - For each trade object, if trade.exitPrice is not null, call `const maeResult = await computeMAE(trade)`
     - Add `mae: maeResult?.maeAbs ?? null` to the trade object
  4. Maintain existing error isolation — if computeMAE fails for a row, catch and record error, skip that row (partial import behavior).
  5. Typecheck and commit: `fix(phase2-gap): compute and store MAE during CSV import`
</action>
  <verify>
    <automated>grep -q "import.*computeMAE" src/app/api/import/route.ts && grep -q "mae:" src/app/api/import/route.ts && echo "MAE computation added to import route"</automated>
  </verify>
  <done>MAE auto-computation added to CSV import</done>
</task>

<task type="auto">
  <name>Task 3: Add MAE computation to NL parse endpoint</name>
  <files>src/app/api/parse/route.ts</files>
  <action>
  1. Read parse/route.ts POST handler.
  2. Import computeMAE from '@/lib/analytics/calculator'.
  3. After parsing and constructing trade data (before prisma.trade.create):
     - If the parsed trade has exitPrice (closed), call `const maeResult = await computeMAE(tradeData)`
     - Add `mae: maeResult?.maeAbs ?? null`
  4. Open trades (no exitPrice) keep mae null.
  5. Typecheck and commit: `fix(phase2-gap): compute and store MAE during NL parse`
</action>
  <verify>
    <automated>grep -q "import.*computeMAE" src/app/api/parse/route.ts && grep -q "mae:" src/app/api/parse/route.ts && echo "MAE computation added to parse route"</automated>
  </verify>
  <done>MAE auto-computation added to NL parse endpoint</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-----------|
| API → calculator | Internal trusted call; computeMAE may fetch external data (Yahoo Finance) |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation |
|-----------|----------|-----------|-------------|------------|
| T-GAP-02 | Denial of Service | computeMAE fetches OHLC per trade on write | accept | Rate-limited Yahoo Finance public API; consider caching in Phase 3 |
| T-GAP-03 | Information Disclosure | OHLC fetch errors leak stack | mitigate | computeMAE should catch errors and return null; trade creation still succeeds without MAE |
</threat_model>

<verification>
1. All three creation endpoints import computeMAE
2. Each endpoint calls computeMAE for closed trades (exitPrice not null) and adds mae field
3. Database insert includes mae value (non-null for closed trades)
4. TypeScript compiles without errors
5. Manual test: POST /api/trades with exitPrice returns trade object with mae populated
</verification>

<success_criteria>
- [x] MAE computed and stored automatically on all closed trade creation paths
- [x] Trade.mae field is non-null for trades with exitPrice
- [x] No regression in existing trade creation functionality
</success_criteria>

<output>
After completion, create `.planning/phases/02-core-analytics/02-gap-02-SUMMARY.md`
</output>

</plan>
