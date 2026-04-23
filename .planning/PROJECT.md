# Trading Journal App

## What This Is

A comprehensive trading intelligence platform for Indian equity traders that automatically captures trades, surfaces behavioral patterns, and delivers actionable insights to systematically improve trading performance. It combines zero-friction data capture (natural language, broker API sync) with deep analytics (MAE optimization, ghost tracking, emotion correlation) and proactive guardrails (revenge trade detection, blowup calculator) — so traders can evolve from discretionary to systematic, profitable trading.

## Core Value

Every trade logged automatically, every pattern surfaced, every mistake caught — so you become a consistently profitable trader.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **Autopilot Journal**: Natural language trade entry ("bought HDFC at 730, stop 710, target 760") auto-creates journal entry with market context, setup type, TradingView chart link
- [ ] **Trade Logging**: Manual form with entry/exit prices, stop/target, position size, direction (long/short), asset class, symbol/exchange
- [ ] **MAE Histogram**: Track Maximum Adverse Excursion per trade, generate stop optimization recommendations ("Set stop at 2% — 95% of winners never went below")
- [ ] **Ghost Trade Tracker**: 30-day post-exit monitoring to reveal early exits, missed profits, or stopped-out pullbacks
- [ ] **Emotion Tagger**: Pre/during/post-trade emotion tagging (CALM, FOMO, REVENGE, CONFIDENT, UNCERTAIN, BORED) with sleep, fatigue, environment context
- [ ] **Setup Scorecard**: Track performance by setup type (EP, VCP, breakout, pullback, parabolic long) with win rate, avg R, allocation recommendations
- [ ] **Situational Awareness Mapper**: Weekly auto-plot trades on Nifty/Sensex chart to see with-trend vs counter-trend performance
- [ ] **Revenge Trade Detector**: Auto-detect cluster trading (multiple trades within 45 min after loss), end-of-day urgency, Monday overtrading patterns
- [ ] **R-Multiple Distribution**: Visualize outcomes (-2R to +5R+) with right-skewed distribution analysis and exit efficiency scoring
- [ ] **Market Regime Tracker**: Log and analyze performance by Dr. Van Tharp's 6 market types (Bull/Bear/Sideways × Normal/Volatile) with adaptive rules
- [ ] **Daily Dashboard**: Pre-market snapshot with account status, stats (30-day win rate, avg R, profit factor), watchlist, emotion check, rules reminder
- [ ] **Blowup Calculator**: Real-time portfolio risk analysis (total capital at risk, correlation risk, worst-case scenario, recovery needed)
- [ ] **Weekly Post-Mortem**: Deep-dive review with best/worst trades, missed opportunities, behavioral patterns, one thing to change
- [ ] **Catalytic Trade Monitor**: Special tracking for earnings/catalyst plays with 4-week/8-week review rules (O'Neil's 8-week rule)
- [ ] **Position Size Optimizer**: Kelly Criterion-based sizing recommendations by setup confidence using your actual data
- [ ] **Pre-Market Checklist**: Nifty/VIX/FII-DII check, emotion check, position check, rules reminder before trading
- [ ] **Decision Quality Score**: Rate trades on process (1-10) independent of outcome to separate skill from luck
- [ ] **Counterfactual Simulator**: Per-trade simulation of 3+ alternate scenarios (hold longer, trailing stop, size change) based on actual data
- [ ] **Tax & Compliance Tracker**: Automatic STCG/LTCG calculation, transaction costs (brokerage, STT, GST), net after tax, loss harvesting tips
- [ ] **Annual Performance Report**: Full-year analysis with evolution by quarter, key breakthroughs, biggest lessons, goals for next year
- [ ] **Broker API Sync**: Direct integration with Indian brokers (Dhan, Zerodha, AngelOne, ICICI Direct) for auto-import
- [ ] **TradingView Integration**: Auto-import alerts, screenshots, chart links into journal entries
- [ ] **Mobile App**: iOS/Android for quick logging, dashboard access, alerts on the go
- [ ] **Behavioral Analytics**: Tiltmeter (emotional state scoring), rule adherence tracking, mistake cost analysis, cooldown compliance
- [ ] **Advanced Visualizations**: Equity curve, heatmaps (P&L by day/hour/symbol/setup), scatter plots, MFE/MAE charts, custom dashboards (600+ widgets)
- [ ] **Alerts & Guardrails**: Revenge trade warnings, overtrading alerts, end-of-day locks, drawdown warnings, correlation risk alerts
- [ ] **Export & Reporting**: CSV/Excel/JSON export, PDF reports (tax, compliance, performance), mentor sharing, API access
- [ ] **Strategy Templates**: 25+ professional trading setups with entry/exit rules, auto-tagging
- [ ] **Market Replay**: Tick-by-tick historical replay for trade review and learning
- [ ] **AI Insights**: Conversational AI for data analysis, pattern detection, recommendation engine
- [ ] **Multi-Account Support**: Track multiple trading accounts/portfolios in one place
- [ ] **Offline Mode**: Log trades without internet, sync later

### Out of Scope

- **Social Trading/ Copy Trading** — Not a platform for following other traders; focus is individual improvement
- **Brokerage Services** — Not executing trades; only journaling and analysis
- **Crypto/Forex/International Markets (v1)** — Indian equity markets focus first; others deferred to v2
- **Real-time Market Data Feed (v1)** — Use TradingView/broker APIs; don't build proprietary feed
- **Gamification/Badges** — Avoid distractions; focus on serious performance improvement
- **Live Trading Room/Chat** — Not a social platform; keep focused on journaling
- **Mobile App (v1)** — Web-first for v1; mobile app in v2
- **AI Trade Recommendations** — Don't tell users what to trade; analyze what they traded
- **White-label/SaaS for Mentors (v1)** — Personal tool first; commercial features deferred

## Context

**Existing Work:**
- `Trade Journal Ideas.md` contains 20 detailed feature ideas inspired by Anuragg Venkatakrishnan, Jeff Sun, and TradeTM concepts
- `Autopilot Journal/` folder has Python scripts implementing MAE calculator, ghost tracker, emotion analysis, blowup calculator, setup scorecard, and more
- This project is a **clean slate web app** — not upgrading the Python scripts, but learning from them

**Trading Philosophy (from wiki):**
- Anuragg's feedback loop: Journal is a TOOL, not the goal
- Measure the intangibles: emotions, processes, conditions influence ratios
- MAE analysis: Over 85% of winners never dropped below 3% of buy price
- Market regime adaptation: 6 types (Bull/Bear/Sideways × Normal/Volatile)
- Catalytic stocks: Passive management (4-week/8-week rule) vs over-managing

**Target User:**
- Indian equity trader (NSE/BSE)
- Already tracks some trades but wants systematic improvement
- Familiar with concepts like R-multiple, setup types, market regimes
- Needs behavioral guardrails (revenge trading, overtrading, FOMO)
- Wants actionable insights, not just P&L tracking

**Technical Environment:**
- Web-based application (React + Node.js/Python backend TBD in research phase)
- Indian market focus (Nifty/Sensex, India VIX, FII/DII data, INR currency)
- Integration points: TradingView, Dhan API, Zerodha Kite Connect
- Data persistence: PostgreSQL (relational trade data) + time-series for equity curves

## Constraints

- **Market Focus**: Indian equity markets (NSE/BSE) — v1 scope limitation
- **Data Privacy**: Traders are paranoid about trade data — must be secure, encrypted, self-hostable option
- **Zero Friction**: Journal only works if it's effortless — natural language, auto-import, mobile quick-entry
- **Accuracy**: P&L calculations must be precise (including STT, GST, brokerage, slippage)
- **Performance**: Must handle 1000s of trades without lag; real-time dashboard updates
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge) — no IE11
- **Mobile Responsive**: Web app must work on mobile browsers (v1), native app (v2)
- **Budget**: Solo developer — leverage free tiers (Supabase, Vercel) or self-hosted

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Clean slate web app (not Python upgrade) | Python scripts are analysis-only; need full-stack web app for UI, real-time, mobile | — Pending |
| Indian markets focus (v1) | Know the domain well; can validate personally; crypto/forex later | — Pending |
| Web-first, mobile-responsive (v1) | Faster to build and iterate; native app in v2 if needed | — Pending |
| Actionable insights over raw data | Every metric must come with recommendation ("Set stop at 2%") | — Pending |
| Behavioral focus (emotions, patterns) | P&L alone doesn't improve trading; behavior change does | — Pending |

---
*Last updated: 2026-04-23 after initialization*
