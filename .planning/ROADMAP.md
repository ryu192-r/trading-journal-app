# Trading Journal App — Roadmap

**Project:** Trading Journal App (TJA)
**Granularity:** Standard (5–8 phases)
**Core Value:** Every trade logged automatically, every pattern surfaced, every mistake caught — so you become a consistently profitable trader

**Total v1 Requirements:** 30
**Coverage:** 30/30 mapped ✓

---

## Phases

- [x] **Phase 1: Foundation & Trade Logging** — Core data infrastructure, manual entry, CSV import, basic UI, export
- [x] **Phase 2: Core Analytics** — MAE/MFE, setup scorecards, equity curve, R-multiple, market regime
- [ ] **Phase 3: Behavioral Analysis** — Emotion tagging, revenge/overtrading detection, ghost tracking, behavioral alerts
- [ ] **Phase 4: Dashboard & Alerts** — Daily pre-market dashboard, blowup calculator, real-time guardrails
- [ ] **Phase 5: Reports & Polish** — Weekly/annual reports viewing, UI polish, production optimization

---

## Phase Details

### Phase 1: Foundation & Trade Logging

**Goal:** Users can reliably capture trades and view basic performance metrics; the data foundation for all downstream analytics is established.

**Depends on:** None (first phase)

**Requirements:** LOG-01, LOG-02, LOG-03, LOG-04, LOG-05, ANLY-01, ANLY-02, ANLY-03, UI-01, UI-02

**Success Criteria** (what must be TRUE):
1. User can create a trade with all required fields (entry/exit prices, stop/target, position size, direction long/short, asset class, symbol/exchange)
2. User can import trades via CSV from Indian brokers (Zerodha, Dhan, AngelOne, ICICI Direct)
3. User can tag trades with setup type (EP, VCP, breakout, pullback, parabolic long) and custom tags
4. User can add notes and upload screenshots to trades
5. User can log trades via natural language ("bought HDFC at 730, stop 710, target 760") and system auto-creates journal entry with market context
6. User can view P&L summary showing win rate, profit factor, average win/loss, expectancy in R-multiple
7. User can see an equity curve with account growth over time and drawdown overlay
8. User can filter/sort trades by date, symbol, setup, P&L, and tags
9. User can export trades to CSV/Excel/JSON for backup/external analysis
10. Application is responsive and works on mobile and desktop browsers

**Plans:** TBD

### Phase 2: Core Analytics

**Goal:** Users gain deep statistical insights into trading performance; stop-loss and exit optimization recommendations are surfaced automatically from trade data.

**Depends on:** Phase 1

**Requirements:** ANLY-04, ANLY-05, MAE-01, MAE-02, MAE-03, SETUP-01, SETUP-02, MKT-01, MKT-02, MKT-03

**Success Criteria** (what must be TRUE):
1. System displays R-multiple distribution histogram (-2R to +5R+) with right-skewed distribution analysis and exit efficiency scoring
2. System calculates and displays Sharpe ratio, Sortino ratio, maximum drawdown, and recovery factor
3. Each trade has MAE (Maximum Adverse Excursion) calculated automatically
4. System shows MAE histogram with stop optimization recommendations (e.g., "Set stop at 2% — 95% of winners never went below")
5. System calculates MFE (Maximum Favorable Excursion) to detect early exits
6. System tracks ghost trades — 30-day post-exit monitoring automatically showing what happened to each stock after exit
7. User can view setup scorecard showing win rate, average R, profit factor, best/worst trade per setup type
8. Setup scorecard provides allocation recommendations per setup
9. User can see performance broken down by market regime (Bull/Bear/Sideways × Normal/Volatile — 6 types)
10. System shows adaptive rules per regime (e.g., "When VIX > 25 → sit out")
11. Weekly auto-plot of trades on Nifty/Sensex chart displays with-trend vs counter-trend performance for situational awareness

**Plans:** 3/3 complete
- [x] 02-01-PLAN.md — Analytics engine & database schema
- [x] 02-02-PLAN.md — Analytics API endpoints
- [x] 02-03-PLAN.md — Analytics UI components and pages

### Phase 3: Behavioral Analysis

**Goal:** Users understand their psychological drivers and behavioral mistakes; system proactively identifies harmful patterns and correlates emotions with outcomes.

**Depends on:** Phase 2

**Requirements:** BEHV-01, BEHV-02, BEHV-03, BEHV-04, BEHV-05, MAE-04

**Success Criteria** (what must be TRUE):
1. User can tag emotional state per trade (CALM, FOMO, REVENGE, CONFIDENT, UNCERTAIN, BORED) across pre/during/post-trade moments
2. User can log physical state per trade (sleep hours, fatigue level, distractions/environment)
3. System detects revenge trading patterns — cluster trades within 45 minutes after loss, end-of-day urgency, Monday overtrading
4. System detects overtrading patterns — excessive trades per day, end-of-day rush behavior, day-of-week spikes
5. System correlates emotion tags with outcomes showing win rate and average R per emotion state
6. System tracks and displays behavioral mistake costs quantifiably
7. User can view behavioral analytics dashboard highlighting tiltmeter scoring and rule adherence tracking
8. System enforces and monitors cooldown periods after losses automatically

**Plans:** TBD

### Phase 4: Dashboard & Alerts

**Goal:** Users have a real-time command center showing account status, risk metrics, and daily preparedness check before market opens.

**Depends on:** Phase 3

**Requirements:** DASH-01, DASH-02, DASH-03

**Success Criteria** (what must be TRUE):
1. User sees pre-market dashboard with account status, current stats, and open positions overview
2. Dashboard prominently displays 30-day win rate, average R, and profit factor
3. Dashboard includes watchlist, emotion check-in prompt, and trading rules reminder before trading starts
4. Dashboard shows blowup calculator with real-time portfolio risk analysis — total capital at risk, correlation risk, worst-case scenario, recovery needed
5. All dashboard metrics update in near-real-time as new trades are logged
6. User receives alerts for revenge trading detection, overtrading thresholds, drawdown limit warnings
7. Dashboard provides situational awareness with current market regime classification and adaptive guidance
8. Pre-market snapshot includes Nifty/VIX/FII-DII data context checks

**Plans:** TBD

### Phase 5: Reports & Polish

**Goal:** Performance reporting is complete with weekly post-mortem and annual report viewing; application is polished and production-ready.

**Depends on:** Phase 4

**Requirements:** UI-03

**Success Criteria** (what must be TRUE):
1. User can view automated weekly post-mortem reports — best/worst trades, missed opportunities, behavioral patterns, one thing to change
2. User can view annual performance reports with quarter-by-quarter evolution, key breakthroughs, biggest lessons, goals for next year
3. Performance reports are viewable in responsive, printable format with charts and insights
4. Application is production-optimized: fast load times, handles 1000s of trades smoothly
5. Mobile-responsive experience is fully polished across all screens and interactions
6. Export functionality supports CSV/Excel/JSON with clean schemas for external analysis

**Plans:** TBD

---

## Why 5 Phases (Not 4 or 6)

**Dependency-driven boundaries:**
- **Logging → Analytics**: MAE/MFE calculations require structured trade data to exist first
- **Analytics → Behavioral**: Emotion and pattern correlations require validated metrics to be meaningful
- **Behavioral → Dashboard**: Alerts and guardrails need behavioral detection pipeline running first
- **Dashboard → Reports**: Weekly/annual reports and polish depend on stable dashboard and core analytics

**Coverage check:** 30 v1 requirements distributed:
- Phase 1: 10 requirements (logging, basic analytics, UI foundation)
- Phase 2: 10 requirements (statistical analytics, MAE/MFE, setup, market regime)
- Phase 3: 6 requirements (emotion, behavior detection, ghost tracking)
- Phase 4: 3 requirements (daily dashboard, alerts, blowup calculator)
- Phase 5: 1 requirement  (weekly/annual report viewing, UI polish)

**In v1 scope (core):**
- Reports (weekly post-mortem, annual performance) — included in Phase 5 via UI-03
- UI polish, production optimization — included in Phase 5 success criteria

**Not in v1 scope (deferred to v2):**
- Broker API sync, TradingView integration
- Native mobile app, AI insights, backtesting, trade replay
- Position size optimizer, tax automation, strategy templates

---

## Progress Tracking

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Trade Logging | 5/5 | Executed (verification pending) | 2026-04-24 |
| 2. Core Analytics | 3/3 | Executed (verification pending) | - |
| 3. Behavioral Analysis | 0/3 | Not started | - |
| 4. Dashboard & Alerts | 0/3 | Not started | - |
| 5. Reports & Polish | 0/3 | Not started | - |

---

**UI Phase Detection**

- **Phase 1**: UI-01, UI-02 → UI hint
- **Phase 5**: UI-03 → UI hint
