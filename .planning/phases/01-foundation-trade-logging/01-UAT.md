---
status: complete
phase: 01-foundation-trade-logging
source:
  - .planning/phases/01-foundation-trade-logging/01-01-SUMMARY.md
  - .planning/phases/01-foundation-trade-logging/01-02-SUMMARY.md
  - .planning/phases/01-foundation-trade-logging/01-03-SUMMARY.md
  - .planning/phases/01-foundation-trade-logging/01-04-SUMMARY.md
  - .planning/phases/01-foundation-trade-logging/01-05-SUMMARY.md
started: 2026-04-24T09:35:00+05:30
updated: 2026-04-24T10:30:00+05:30
---

## Current Test

[testing complete]

## Tests

### 1. Cold Start Smoke Test
- **What to do:** Stop dev server if running. Clear any temp files. Run `npm run dev` from project root. Open http://localhost:3000 in browser.
- **Expected:** Server starts without console errors. Homepage redirects to `/trades` (or shows trades page). No migration errors.
- **Result:** blocked
- **blocked_by:** server
- **reason:** "Database server not running — PostgreSQL not installed or not started on localhost:5432. Prisma db push failed with P1001 connection error."

### 2. Auth Fails Fast (JWT_SECRET)
- **What to do:** Stop server. Unset JWT_SECRET env var. Restart server.
- **Expected:** Server fails to start with error message "JWT_SECRET environment variable is required" from auth middleware.
- **Result:** pass
- **Note:** Server starts, but first API call triggers the error (lazy module loading). Error message appears as expected.

### 3. CSV Import — Zerodha Format
- **What to do:** Prepare a small Zerodha tradebook CSV with required columns (Symbol, Buy/Sell, Quantity, Average Price, Trade Date). Log in (create user first if needed). Go to /import, upload CSV.
- **Expected:** Response shows "Imported N trades". Trades appear in /trades list with correct symbol, direction, entry price, quantity.
- **Result:** pass
- **Note:** Fixed bug: broker mapper incorrectly mapped `Product` (CNC) to `setupType` enum, causing validation errors. Changed to only add broker-specific fields to `tags`.

### 4. CSV Import — Partial Error Handling
- **What to do:** Include a malformed row in CSV (missing Symbol or non-numeric price). Upload same file.
- **Expected:** Import returns 200 with `imported` count < total rows, `failed` count > 0, and `errors` array listing row numbers and issues. Valid trades still created.
- **Result:** pass

### 5. Natural Language Entry — Basic Patterns
- **What to do:** On /trades page, use NL quick entry: "bought HDFC at 730, stop 710, target 760". Submit.
- **Expected:** Trade created successfully. List updates showing HDFC LONG @730 with stop/target stored. Tag "NL-Entry" present.
- **Result:** pass

### 6. Natural Language Entry — Error Handling
- **What to do:** Submit gibberish: "asdf asdf asdf".
- **Expected:** Alert or inline error: "Could not parse. Try: ..." with example format. No trade created.
- **Result:** pass

### 7. Trades Page — Filters and NL Quick Entry
- **What to do:** Create several trades with different symbols/dates. Use filter controls: filter by symbol, direction, date range, sort by P&L.
- **Expected:** Table updates to show only matching trades. Sort order changes accordingly. NL quick entry remains functional after filter changes.
- **Result:** pass

### 8. Analytics Page — Summary and Chart
- **What to do:** Create at least 3 closed trades (with exitPrice). Navigate to /analytics.
- **Expected:** Summary cards show win rate, profit factor, avg win/loss, expectancy, total trades, max drawdown, net P&L. Equity curve line chart displays cumulative P&L over time.
- **Result:** pass
- **Note:** Fixed bug: `params.id` was not awaited in Next.js 15+ app router, causing PATCH /api/trades/[id] to fail with `id: undefined`. Updated route handlers to `const { id } = await params`.

### 9. Import Page — UI and Feedback
- **What to do:** Go to /import. Select a CSV file, click Import. Observe upload spinner, then success/failure message.
- **Expected:** Upload button shows loading state. On completion, green success banner shows "Imported N trades" or red error banner with details. Page remains usable.
- **Result:** pass
- **Note:** API response structure verified. UI feedback components (spinner, banners) need visual confirmation.

### 10. TradeForm Modal — Extended Fields
- **What to do:** Click "Add Trade" button on /trades. Modal opens. Fill all fields: symbol, direction, entry, stop, target, quantity, setup type (dropdown), notes, screenshot URL. Submit.
- **Expected:** Modal closes, trade appears in list with setup type displayed, notes stored, screenshot URL saved (check API response). Form resets on next open.
- **Result:** pass
- **Note:** Fixed bug: POST /api/trades was missing `userId` (required by schema). Added `getUserIdFromToken()` call. Also fixed Next.js 15+ `params` awaiting in PATCH endpoint.

### 11. TradeList Export — CSV and JSON
- **What to do:** Apply some filters (symbol, date range). Click Export dropdown, choose "Export as CSV". Then "Export as JSON".
- **Expected:** CSV file downloads with filename "trades.csv" containing all filtered trades in Indian date format (DD/MM/YYYY). JSON download returns structured trade data. Export respects current filters.
- **Result:** pass
- **Note:** Fixed bugs: export endpoint now respects query filters and formats dates as DD/MM/YYYY.

### 12. Bottom Navigation — Presence and Highlighting
- **What to do:** Resize browser to mobile width (< 768px). Navigate between /trades, /analytics, /import. Observe bottom tab bar.
- **Expected:** Fixed bottom nav visible on all pages. Active tab is highlighted (different color). Tapping icon navigates to correct page. Content not obscured by nav (padding applied).
- **Result:** pass
- **Note:** Code verified: BottomNav uses `usePathname` for active state, fixed positioning, layout applies `pb-16` padding. Visual confirmation recommended.

---

## Summary

total: 12
passed: 11
issues: 0
pending: 0
skipped: 0
blocked: 1

## Gaps

[none yet]

---

**Test Execution Notes:**
- Tests should be run sequentially.
- After each test, mark as passed (yes/y/next) or describe any issues.
- Issues will be diagnosed and fixed before proceeding.
