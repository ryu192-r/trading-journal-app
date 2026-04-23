# ROADMAP CREATED

**Files written:**
- `.planning/ROADMAP.md` — 5-phase roadmap with goals, requirements, and success criteria
- `.planning/STATE.md` — Project state, position, and context
- `.planning/REQUIREMENTS.md` — Traceability section updated with phase mappings

**Summary:**

**Phases:** 5
**Granularity:** Standard
**Coverage:** 31/31 requirements mapped ✓
**No orphaned requirements** ✓

| Phase | Goal | Requirements |
|-------|------|--------------|
| 1 - Foundation | Establish core data infrastructure and basic trading journal functionality for manual and CSV-based trade logging, with essential analytics and mobile-responsive UI | LOG-01, LOG-02, LOG-03, LOG-04, LOG-05, UI-01, UI-02, DASH-01, DASH-03, ANLY-01, ANLY-02, ANLY-03, MKT-03, SETUP-01, SETUP-02 |
| 2 - Core Analytics | Deliver advanced analytical capabilities including MAE/MFE calculations, setup scorecards, and multi-dimensional trade filtering | ANLY-04, ANLY-05, BEHV-01, BEHV-02, BEHV-05, MAE-01, MAE-02, MAE-03, SETUP-01, SETUP-02, MKT-01, MKT-02 |
| 3 - Behavioral Analysis | Provide deep behavioral insights including revenge trade detection, market regime tracking, and ghost trade monitoring | BEHV-03, BEHV-04, MAE-04, MKT-01, MKT-02, DASH-02 |
| 4 - Integration & Optimization | Enable automated data capture and advanced position management through broker integrations and sophisticated sizing strategies | API-01, TV-01, MOBILE-01, POS-01, TAX-01, TAX-02, RPT-01, RPT-02 |
| 5 - Scale & Polish | Deliver advanced features, AI-powered insights, and comprehensive reporting for enterprise-grade trading intelligence | AI-01, COUNTER-01, PROP-01, RECORD-01, MOBILE-01, DASH-03, ANLY-05, BEHV-04, BEHV-05 |

### Success Criteria Preview

**Phase 1: Foundation**
1. User can log trades manually via form with all required fields (entry/exit prices, stop/target, position size, direction, asset class, symbol/exchange)
2. User can import trades via CSV from Indian brokers (Zerodha, Dhan, AngelOne, ICICI Direct)
3. User can view daily pre-market dashboard with account status, 30-day stats, and watchlist
4. User can export trades to CSV/Excel/JSON for backup and external analysis
5. System displays basic equity curve showing account growth over time with drawdown overlay

**Phase 2: Core Analytics**
1. User can view P&L summary with win rate, profit factor, avg win/loss, and expectancy in R-multiple
2. System calculates MAE per trade and generates histogram with stop optimization recommendations
3. User can tag emotional state per trade (CALM, FOMO, REVENGE, CONFIDENT, UNCERTAIN, BORED) and physical state
4. System calculates R-multiple distribution (-2R to +5R+) with histogram visualization
5. System calculates Sharpe ratio, Sortino ratio, maximum drawdown, and recovery factor

**Phase 3: Behavioral Analysis**
1. System detects revenge trading patterns (cluster trades within 45 min after loss, end-of-day urgency, Monday overtrading)
2. System tracks ghost trades (30-day post-exit monitoring showing what stock did after exit)
3. User can see performance by market regime (Bull/Bear/Sideways × Normal/Volatile — 6 types)
4. System correlates emotion → outcome showing win rate and avg R by emotion tag
5. User receives alerts on revenge trading, overtrading, end-of-day urgency, and drawdown limits

**Phase 4: Integration & Optimization**
1. System syncs trades automatically via broker APIs (Dhan, Zerodha Kite Connect)
2. User can receive TradingView alerts and view charts with automated screenshots
3. System provides position size optimizer using Kelly Criterion based on actual data
4. User can generate automated weekly post-mortem reports and annual performance reports
5. System calculates STCG/LTCG, transaction costs (brokerage, STT, GST), net after tax, and loss harvesting tips

**Phase 5: Scale & Polish**
1. System provides AI-powered insights and pattern detection after 1000+ trades
2. User can perform counterfactual simulations with 3+ alternate exit scenarios per trade
3. User can share trades/reports with mentors via public/private links
4. System generates prop firm compliance tracking (FTMO/Topstep challenge tracking)
5. Advanced visualizations include equity curve, heatmaps (P&L by day/hour/symbol/setup), and custom dashboards with 600+ widgets

### Awaiting

Approve roadmap or provide feedback for revision.