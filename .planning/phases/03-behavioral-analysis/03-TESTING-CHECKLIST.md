# Phase 3 Testing Checklist — To Run Tomorrow

## Prerequisites
- Dev server running: `npm run dev` (from project root)
- Database migrated: `npx prisma db push --accept-data-loss` (already done)
- Auth token: Have a valid JWT for a test user

---

## Test 1 — Emotion Field Persistence ✅ (Already passed)
- [x] Verified schema columns exist in Prisma Studio
- [x] Created test trade with emotion fields
- [x] Confirmed values stored in database

---

## Test 2 — Behavioral Pattern Detection (Run tomorrow)

### Setup
Create trades in this order (adjust timestamps to be within lookback windows):

**A. CLUSTER pattern:**
1. Losing trade (direction LONG, exitPrice < entryPrice) at time T
2. 3+ more trades within 45 minutes after T (any direction, any outcome)

**B. EOD_RUSH pattern:**
3. On same day, create 2+ trades after 15:00 IST (entryDate between 15:00–15:30 IST)

**C. MONDAY_SPIKE pattern:**
4. Ensure you have at least 3 trades on a Monday
5. Your Monday total should be > 1.5× your daily average over last 30 days

### Verification
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/analytics/behaviors/patterns | jq
```

**Expected:** Response contains `patterns` array with objects:
```json
{
  "patterns": [
    {
      "pattern": "CLUSTER" | "EOD_RUSH" | "MONDAY_SPIKE" | "EXCESSIVE",
      "date": "YYYY-MM-DD",
      "description": "...",
      "severity": "HIGH" | "MEDIUM" | "LOW"
    }
  ]
}
```

---

## Test 3 — Ghost Trade Tracking

### Setup
- Use existing closed trades (exitPrice + exitDate set) OR create new ones and wait 1+ days
- Ensure symbols are NSE tickers that Yahoo Finance supports (e.g., RELIANCE, TCS, INFY)

### Verification
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/analytics/behaviors/ghosts?limit=10" | jq
```

**Expected:** Response contains `ghosts` array with objects:
```json
{
  "ghosts": [
    {
      "tradeId": "...",
      "symbol": "RELIANCE",
      "direction": "LONG" | "SHORT",
      "exitPrice": 2550.00,
      "exitDate": "2026-04-20T...",
      "maxPrice30d": 2600.00,  // highest high in 30 days after exit
      "minPrice30d": 2500.00,  // lowest low in 30 days after exit
      "missedProfit": 500.00,  // (maxPrice30d - exitPrice) * quantity for LONG
      "missedR": 2.5 | null    // null if stopPrice missing
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 10
}
```

**Note:** If Yahoo Finance fails for a symbol, that ghost is omitted (null filtered).

---

## Test 4 — Behavioral Dashboard UI

### Steps
1. Visit http://localhost:3000/analytics/behavioral in browser (ensure logged in)
2. Wait for page to load (shows "Loading behavioral analytics..." initially)

### Verify sections render:

**Emotion Correlation:**
- 3 cards side-by-side (Pre, During, Post)
- Each card lists emotion states with WR %, Avg R, PF
- If <3 trades per emotion: shows "Not enough data" message

**Behavioral Patterns:**
- Either "No harmful patterns detected" card OR
- List of pattern cards with colored left border (red=HIGH, yellow=MEDIUM, blue=LOW)
- Each card shows pattern name, date, description, severity badge

**Ghost Trades:**
- Table with 6 columns: Symbol, Exit Date, Direction, Exit Price, Missed Profit, Missed R
- Rows show actual ghost data OR "No ghost data available" message
- Direction colors: LONG = green, SHORT = red
- Missed Profit in orange, Missed R as "2.5R" or "N/A"

**Quick Stats:**
- 4 placeholder cards: Avg Sleep, Avg Fatigue, Top Emotion, Ghost Opportunities count

### Responsive check
- Resize browser to mobile width (<768px)
- Emotion cards stack vertically (1 column)
- Table scrolls horizontally if needed

---

## Test 5 — API Error Handling (Optional)

1. Unauthenticated request:
```bash
curl http://localhost:3000/api/analytics/behaviors/patterns
# Should return 401
```

2. Invalid emotion value in trade creation:
```bash
curl -X POST http://localhost:3000/api/trades \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"RELIANCE","direction":"LONG","entryPrice":2500,"emotionPre":"INVALID_EMOTION"}'
# Should return 400 with validation error
```

---

## Tomorrow's Workflow

1. Start dev server: `npm run dev`
2. Run Tests 2–4 in order (create test data as needed)
3. If any test fails, note the exact error and check browser console / API response
4. Resume verification: `/gsd-verify-phase 3` (verifier agent will ask for test results)
5. After Phase 3 verified, run `/gsd-verify-phase 1` and `/gsd-verify-phase 2` to re-verify earlier phases

---

## Notes
- Phase 1 & 2 were previously verified but user requested re-verification
- All code is committed to planning docs; no uncommitted changes pending
- TypeScript compilation passes; no build errors
