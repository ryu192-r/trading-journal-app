# Requirements: Trading Journal App

**Defined:** 2026-04-23
**Core Value:** Every trade logged automatically, every pattern surfaced, every mistake caught — so you become a consistently profitable trader

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Trade Logging

- [ ] **LOG-01**: User can log trades manually with entry/exit prices, stop/target, position size, direction (long/short), asset class, symbol/exchange
- [ ] **LOG-02**: User can import trades via CSV from Indian brokers (Zerodha, Dhan, AngelOne, ICICI Direct)
- [ ] **LOG-03**: User can tag trades with setup type (EP, VCP, breakout, pullback, parabolic long) and custom tags
- [ ] **LOG-04**: User can add notes and upload screenshots to trades
- [ ] **LOG-05**: User can log trades via natural language ("bought HDFC at 730, stop 710, target 760")

### Core Analytics

- [ ] **ANLY-01**: User can view P&L summary (win rate, profit factor, avg win/loss, expectancy in R-multiple)
- [ ] **ANLY-02**: User can see equity curve (account growth over time with drawdown overlay)
- [ ] **ANLY-03**: User can filter/sort trades by date, symbol, setup, P&L, tags, emotion
- [ ] **ANLY-04**: System calculates R-multiple distribution (-2R to +5R+) with histogram visualization
- [ ] **ANLY-05**: System calculates Sharpe ratio, Sortino ratio, maximum drawdown, recovery factor

### Behavioral Analytics

- [ ] **BEHV-01**: User can tag emotional state per trade (CALM, FOMO, REVENGE, CONFIDENT, UNCERTAIN, BORED)
- [ ] **BEHV-02**: User can log physical state (sleep hours, fatigue level, distractions)
- [ ] **BEHV-03**: System detects revenge trading patterns (cluster trades within 45 min after loss)
- [ ] **BEHV-04**: System detects overtrading (trades per day, end-of-day urgency, Monday spikes)
- [ ] **BEHV-05**: System correlates emotion → outcome (win rate, avg R by emotion tag)

### MAE/MFE Analysis

- [ ] **MAE-01**: System calculates Maximum Adverse Excursion (MAE) per trade automatically
- [ ] **MAE-02**: System generates MAE histogram with stop optimization recommendations ("Set stop at 2% — 95% of winners never went below")
- [ ] **MAE-03**: System calculates Maximum Favorable Excursion (MFE) to detect early exits
- [ ] **MAE-04**: System tracks ghost trades (30-day post-exit monitoring of what stock did after exit)

### Setup & Market Analytics

- [ ] **SETUP-01**: System tracks performance by setup type (win rate, avg R, profit factor, best/worst trade)
- [ ] **SETUP-02**: System provides setup scorecard with allocation recommendations
- [ ] **MKT-01**: System logs market regime per trade (Bull/Bear/Sideways × Normal/Volatile — 6 types)
- [ ] **MKT-02**: System shows performance by market regime with adaptive rules (e.g., "When VIX > 25 → sit out")
- [ ] **MKT-03**: System maps trades on Nifty/Sensex chart weekly (situational awareness)

### Dashboard & Alerts

- [ ] **DASH-01**: User sees daily pre-market dashboard (account status, 30-day stats, watchlist, emotion check, rules reminder)
- [ ] **DASH-02**: System alerts on revenge trading, overtrading, end-of-day urgency, drawdown limits
- [ ] **DASH-03**: System shows blowup calculator (portfolio risk, correlation risk, worst-case scenario)

### UI & Export

- [ ] **UI-01**: User can access responsive web interface (mobile + desktop)
- [ ] **UI-02**: User can export trades to CSV/Excel/JSON for backup/external analysis
- [ ] **UI-03**: User can view performance reports (weekly post-mortem, annual report)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Analytics

- **COUNTER-01**: System simulates counterfactual scenarios (3+ alternate exit scenarios per trade)
- **POS-01**: System optimizes position sizing (Kelly Criterion based on actual data)
- **DEC-01**: User can rate decision quality (process score 1-10 independent of outcome)
- **REPLAY-01**: System provides tick-by-tick market replay for trade review

### Automation & Integration

- **API-01**: System syncs trades automatically via broker APIs (Dhan, Zerodha Kite Connect)
- **TV-01**: System integrates with TradingView (alerts, charts, automated screenshots)
- **MOBILE-01**: Native iOS/Android app for quick logging and dashboard access

### Tax & Compliance

- **TAX-01**: System calculates STCG/LTCG, transaction costs (brokerage, STT, GST), net after tax
- **TAX-02**: System provides tax reports and loss harvesting recommendations
- **RPT-01**: System generates automated weekly post-mortem reports
- **RPT-02**: System generates annual performance reports with evolution, breakthroughs, goals

### Advanced Features

- **AI-01**: System provides AI-powered insights and pattern detection (requires 1000+ trades)
- **MENTOR-01**: User can share trades/reports with mentors via public/private links
- **PROP-01**: System supports prop firm compliance (FTMO/Topstep challenge tracking)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Social trading / copy trading | Focus is individual improvement, not following others |
| Brokerage services / trade execution | Journal only; don't execute trades |
| Crypto/Forex/International markets (v1) | Indian equity focus first; others deferred to v2+ |
| Proprietary real-time market data feed | Use TradingView/broker APIs; don't build feed |
| Gamification / badges | Avoid distractions; focus on serious improvement |
| Live trading chat rooms | Not a social platform; keep focused |
| AI trade recommendations | Analyze what they traded; don't tell them what to trade |
| White-label SaaS for mentors (v1) | Personal tool first; commercial features deferred |
| Native mobile app (v1) | Web-first responsive; native in v2 |
| Backtesting engine | Heavy lift; consider separate product extension |
| Options-specific features (Greeks) | Equity focus first; options in v2 if demanded |
| Desktop apps (Windows/Mac) | Web app covers both; no native desktop needed |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| LOG-01 | Phase 1 | Pending |
| LOG-02 | Phase 1 | Pending |
| LOG-03 | Phase 1 | Pending |
| LOG-04 | Phase 1 | Pending |
| LOG-05 | Phase 1 | Pending |
| ANLY-01 | Phase 1 | Pending |
| ANLY-02 | Phase 1 | Pending |
| ANLY-03 | Phase 1 | Pending |
| ANLY-04 | Phase 2 | Pending |
| ANLY-05 | Phase 2 | Pending |
| BEHV-01 | Phase 3 | Pending |
| BEHV-02 | Phase 3 | Pending |
| BEHV-03 | Phase 3 | Pending |
| BEHV-04 | Phase 3 | Pending |
| BEHV-05 | Phase 3 | Pending |
| MAE-01 | Phase 2 | Pending |
| MAE-02 | Phase 2 | Pending |
| MAE-03 | Phase 2 | Pending |
| MAE-04 | Phase 3 | Pending |
| SETUP-01 | Phase 2 | Pending |
| SETUP-02 | Phase 2 | Pending |
| MKT-01 | Phase 2 | Pending |
| MKT-02 | Phase 2 | Pending |
| MKT-03 | Phase 2 | Pending |
| DASH-01 | Phase 4 | Pending |
| DASH-02 | Phase 4 | Pending |
| DASH-03 | Phase 4 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-23*
*Last updated: 2026-04-23 after initial definition*
