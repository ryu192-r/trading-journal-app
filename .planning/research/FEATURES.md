# Feature Landscape

**Domain:** Trading Journal Web Application
**Researched:** 2026-04-23
**Scope:** Indian equity markets (NSE/BSE), web-first with mobile-responsive design

## Table Stakes

Features users expect. Missing = product feels incomplete or non-viable.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Trade Logging** (core) | Foundation of any journal. Without it, nothing else exists. | Low | Entry/exit prices, position size, direction (long/short), asset class, symbol, date/time. Indian context: support for NSE/BSE symbols, lot sizes. |
| **P&L Calculation** | Core value proposition. Users need to know if they're winning or losing. | Low | Must account for Indian taxes (STT, GST, brokerage, STCG/LTCG). Accurate per-trade and aggregate P&L. |
| **Basic Analytics Dashboard** | Users expect quick visibility into performance at a glance. | Low | Win rate, total P&L, profit factor, drawdown, equity curve. At least 10-15 core metrics visible immediately. |
| **Trade Tagging / Strategy Labels** | Without categorization, data is just a flat list. Tagging is prerequisite for meaningful filtering. | Low | Categorize by setup type (breakout, pullback, VCP, etc.). Custom tags essential for user flexibility. |
| **Trade Notes** | Users need to capture rationale and post-trade reflections. | Low | Free-text notes per trade. Often combined with screenshots. |
| **Screenshot Attachment** | Visual context is critical for review. Charts without screenshots are abstract and forgettable. | Low | Support for image uploads. Ideally link to TradingView charts. |
| **Filtering & Search** | Large trade histories (1000+ trades) require filtering to find patterns. | Medium | Filter by date range, symbol, setup type, P&L outcome, tags. |
| **Export (CSV/Excel)** | Data portability is non-negotiable. Users won't lock years of data into a proprietary system. | Low | Export full trade history for backup or external analysis. Essential for trust. |
| **Mobile-Responsive UI** | Modern web apps must work on all screen sizes. Table stakes for any 2026 web product. | Medium | Mobile browsers at minimum. Native apps are differentiators (see below). |
| **Broker Import (CSV)** | Manual entry is the #1 reason users abandon journals. At minimum, CSV import from common broker formats. | Medium | Support Zerodha, Dhan, AngelOne, ICICI Direct CSV exports. Basic mapping required. |
| **Basic Charting** | Visual P&L representations (equity curve, monthly breakdowns) are expected. | Medium | Equity curve, monthly profit/loss bars, cumulative P&L line chart. |

## Differentiators

Features that set a product apart. Not expected, but highly valued and create competitive moats.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Automatic Broker API Sync** | Zero-friction data capture. Eliminates manual work entirely. Highest user retention factor. | High | Direct API integrations with Indian brokers (Zerodha Kite, Dhan, AngelOne, Upstox). Auto-sync trades in near real-time. |
| **AI-Powered Insights** | Surfaces patterns users would miss manually. Turns data into actionable recommendations. | Very High | Per-trade pattern detection, behavioral coaching, setup performance analysis, anomaly detection. Not just a chatbot — always-on analysis. |
| **Trade Replay (Tick-by-Tick)** | Visual review tool that shows exactly how trade unfolded. Far more educational than static screenshots. | High | Candle-by-candle playback with execution markers, Level II data (optional), adjustable speed. Unique learning tool. |
| **Backtesting Engine** | Test strategies against historical data before risking capital. Bridges gap between journaling and strategy development. | Very High | Visual replay-based backtesting (not just rule-based). 10+ years of Indian market data (Nifty, stocks). |
| **Advanced Psychology Tracking** | Most traders fail due to behavior, not strategy. Quantifying emotional state creates a feedback loop for improvement. | High | Pre/during/post-trade emotion tagging (FOMO, revenge, calm, confident, etc.). Discipline scoring, mistake tagging, behavioral modifier tracking. |
| **MAE/MFE Analysis (Maximum Adverse/Favorable Excursion)** | Optimizes stop-loss placement and reveals trade management quality. Professional-grade risk metric. | High | Track deepest intra-trade drawdown (MAE) and highest interim profit (MFE). Visualize MAE vs P&L to identify premature exits or poor stop placement. |
| **Ghost Trade Tracker (Post-Exit Monitoring)** | Reveals early exit regret and missedprofits. Shows what happened 30 days after you exit. | Medium | Continue tracking position for 30 days post-exit. Compare exit price to subsequent price action. Highlights cutting winners short. |
| **Position Size Optimizer (Kelly Criterion)** | Data-driven position sizing recommendations based on your actual edge. Removes guesswork. | High | Calculate optimal position size per setup using your historical win rate and R-multiple. Kelly % + half-Kelly safety buffer. |
| **Setup Scorecard & Performance by Strategy** | Identifies which setups actually work and which to cut. Quantifies edge per strategy. | Medium | Track performance breakdown by setup type (EP, VCP, breakout, etc.). Win rate, avg R, profit factor, allocation % per setup. |
| **Market Regime Tracker** | Strategy performance varies wildly across market types. Categorizing by regime reveals adaptation needs. | Medium | Classify trades by Dr. Van Tharp's 6 types: Bull/Bear/Sideways × Normal/Volatile. Analyze performance by regime. |
| **Revenge Trade Detector** | Automatic behavioral guardrails. Flags destructive patterns in real-time. | Medium | Detect cluster trading (multiple trades within short window after loss), Monday overtrading, end-of-day urgency patterns. |
| **Risk of Ruin / Blowup Calculator** | Real-time portfolio risk analysis. Shows total capital at risk, correlation exposure, recovery needed after drawdown. | High | Monte Carlo simulation of account survival probability. Warns when portfolio heat exceeds thresholds. |
| **Prop Firm Challenge Support** | Niche but valuable segment. Dedicated tracking for prop firm rules, drawdown limits, profit targets. | Medium | PropFirm Sync: track multiple prop accounts, daily loss limits, consistency rules, pass/fail probability. |
| **Trade Replay 2.0 (Multi-Trade Session Replay)** | Review entire trading sessions contextually, not trade-by-trade. Understand session-level patterns. | High | Replay full day's trades sequentially with synchronized charts. See how one trade influenced the next. |
| **Strategy Templates & Playbooks** | Structured approach to setup documentation. Pre-built templates from professional traders. | Medium | 25+ templates with entry/exit rules, risk parameters, pre/post-trade checklists. |
| **Advanced Multi-Asset Support** | Traders often dabble across asset classes. Unified view is a strong convenience factor. | High | Stocks, options, futures, forex, crypto in one portfolio view. Options Greeks analysis for Indian options traders. |
| **Real-Time P&L & Open Position Tracking** | Live insight into unrealized gains/losses. Risk monitoring during market hours. | Medium | Unrealized P&L updates with market data. Intraday position monitoring dashboard. |
| **Native Mobile Apps (iOS/Android)** | Quick logging on the go. Full feature parity with web. | High | Separate native apps, not just responsive web. Quick trade entry, dashboard access, push notifications. |
| **Mentor / Coach Sharing Mode** | Collaborative improvement. Share journal with trading coach or community. | Medium | Read-only sharing with annotations, comment threads, mentor feedback tools. |
| **AI Chat Assistant (Conversational)** | Natural language queries: "What was my best setup last month?" "Show me all revenge trades." | High | NLP-powered query interface with full access to trade history. Context-aware insights. |
| **Custom Dashboard Builder** | Advanced users want to surface their exact metrics. Widget-based customization. | Medium | 50+ widgets, drag-and-drop layout, save multiple dashboard views. |
| **Tax & Compliance Reporting** | Automated tax calculations save hours. Must handle Indian tax code. | High | STCG/LTCG auto-calculation, transaction cost breakdown (brokerage, STT, GST, SEBI charges), loss harvesting suggestions, P&L statements for CA. |
| **Performance Calendar & Heatmaps** | Visual pattern recognition for day-of-week, month-of-year effects. | Low-Medium | Color-coded calendar view. Spot winning/losing streaks, seasonal patterns. |
| **Daily Dashboard / Pre-Market Checklist** | Starts trading day with intention. Reduces impulsive behavior. | Medium | Account status, 30-day stats, watchlist, emotion check-in, trading rules reminder, Nifty/VIX/FII-DII checks (India-specific). |
| **Weekly/Monthly Post-Mortem Automation** | Structured review process. Surfaces best/worst trades, behavioral patterns, one thing to change. | Medium | Auto-generated weekly reports with insights and action items. |
| **Catalytic Trade Monitor** | Special handling for catalyst-based trades (earnings, events). Different review cadence. | Medium | 4-week/8-week rule tracking (O'Neil). Flag earnings plays, monitor post-catalyst performance. |
| **Decision Quality Score** | Separates skill from luck. Rates trade process independent of P&L outcome. | Medium | 1-10 process rating per trade. Correlates discipline score with actual results. |
| **Counterfactual Simulator** | "What-if" analysis: What if I held longer? Used a trailing stop? Shows alternate outcomes based on actual data. | Very High | Simulate 3+ alternate exit scenarios per trade using historical price data. |
| **Monte Carlo Projections** | Projects future equity curves based on current stats. Shows range of possible outcomes. | High | Simulate thousands of trade sequences to visualize probability distributions of future performance. |
| **News & Event Calendar Integration** | Correlate trades with news events, earnings, economic data releases. | Medium | Built-in economic calendar, earnings dates, FII/DII data (India-specific). |
| **Behavioral Mistake Cost Analysis** | Quantifies exactly how much each mistake type (FOMO, moving stop, revenge) costs over time. | Medium | Tag mistakes, calculate cumulative P&L impact of each mistake category. |

## Anti-Features

Features to explicitly NOT build. These distract from core mission or violate constraints.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Social Trading / Copy Trading** | Not a platform for following other traders; focus is individual improvement. Users get distracted by social features and lose focus on their own edge. | Keep journal private by default. Optional mentor sharing only (read-only, invitation-based). No public feeds or follower systems. |
| **Brokerage / Trade Execution** | Not a brokerage; only journaling and analysis. Regulatory complexity, execution risk, compliance burden. | Focus on data import and analysis only. No order routing, no account opening, no execution services. |
| **Real-Time Market Data Feed (Proprietary)** | Building own feed is massive infrastructure cost. Use existing APIs (TradingView, broker data). | Integrate TradingView charting widgets, broker price feeds. Don't build data infrastructure. |
| **Crypto/Forex/International Markets (v1)** | Scope creep. Indian equity focus allows deeper domain expertise and personal validation. | Phase 1: NSE/BSE stocks and derivatives only. Phase 2: Expand to crypto/forex if validated. |
| **Gamification / Badges / Leaderboards** | Distracts from serious performance improvement. Encourages gaming the system rather than actual edge development. | No points, no badges, no public rankings. Focus on metrics that matter, not engagement hooks. |
| **Live Trading Room / Chat Community** | Not a social platform. Community features require moderation and divert engineering from core analytics. | Optional Discord/Telegram for user support, but no in-app chat. Keep product focused on solo reflection. |
| **AI Trade Recommendations** | Telling users what to trade is legally risky (financial advice) and shifts focus from self-analysis to dependency. | AI analyzes user's own data only. Never generates trade ideas or signals. "Here's what your data shows" vs "you should buy X." |
| **White-label / SaaS for Mentors (v1)** | B2B2C adds significant complexity: multi-tenancy, billing, support burden. Personal tool first. | v1: Single-user focus. v2+: Evaluate if mentor-org workflow is validated need. |
| **Automated Trading / Bot Execution** | Journal is for analysis, not automation. Blurs lines between analysis tool and trading system. High regulatory and reliability risk. | No API keys for execution. Journal remains read-only analysis layer. Optional alerts only (not orders). |
| **Native Desktop Applications** | Web-first strategy is faster to iterate. Desktop apps require per-OS maintenance and installation friction. | Progressive Web App (PWA) at most. Focus on responsive web first. Desktop app only if v1 web fails to meet performance needs. |
| **Complicated Multi-Currency Support (v1)** | Indian Rupee focus simplifies accounting, tax calculations, display. Multi-currency adds conversion headache and tax complexity. | v1: INR only. Display all values in INR. v2: Add multi-currency if international users emerge. |

## Feature Dependencies

```
Trade Logging → Basic Analytics (P&L, win rate, equity curve)
Trade Logging → Tagging/Labels → Filtering & Advanced Analytics (by setup, by symbol, etc.)
Trade Logging + Import → Automatic Broker Sync (requires broker API access)
Basic Analytics → AI Insights (needs data foundation)
Trade Logging → Screenshots → Trade Replay (chart context)
Trade Logging → MAE/MFE → Position Size Optimizer (uses stop-loss analysis)
Trade Logging → Setup Tags → Setup Scorecard (performance by strategy)
Trade Logging → Market Context → Market Regime Tracker (classify each trade)
Trade Logging + Emotion Tags → Behavioral Analytics (psychology correlation)
Trade Logging → Export → Tax Reporting (compliance layer)
All Features → Dashboard (custom widgets require underlying data sources)
```

## MVP Recommendation

**Prioritize:**

1. **Trade Logging** (manual entry first, CSV import second) — foundational
2. **Basic Analytics Dashboard** (win rate, P&L, equity curve, profit factor) — immediate value
3. **Tagging & Notes** (setup types, free-text notes, screenshot uploads) — data organization
4. **Filtering & Search** — makes data usable at scale
5. **Export (CSV)** — trust and data portability
6. **Mobile-Responsive UI** — modern baseline

**Defer to Phase 2:**

- **Automatic Broker API Sync** — high complexity, high impact, but MVP can start with manual/CSV
- **AI Insights** — needs data volume (1000+ trades) to be meaningful
- **Trade Replay** — advanced feature requiring significant charting infrastructure
- **Backtesting** — separate product category; complex but high differentiator
- **Advanced Psychology Tracking** — nuanced feature that benefits from user feedback on preferred emotion models
- **MAE/MFE Analysis** — requires historical intraday data; complex to compute accurately
- **Position Size Optimizer** — advanced math, needs robust statistical foundation first
- **Prop Firm Tools** — niche segment, validate demand first
- **Native Mobile Apps** — web-first, responsive minimum; native apps later if mobile usage proven

**Defer Indefinitely (Anti-Features):**

- Social trading, brokerage services, proprietary data feeds, gamification, live chat rooms, AI trade recommendations, white-label SaaS, automated trading execution.

## Complexity Scale

- **Low**: 1-3 days implementation, minimal dependencies
- **Medium**: 1-3 weeks, some integrations or complex UI
- **High**: 1-2 months, significant engineering effort or third-party integrations
- **Very High**: 3+ months, novel systems, extensive data pipelines, or multiple complex integrations

## Sources

- Competitive analysis of 15+ trading journal platforms (TradeZella, TraderSync, Edgewonk, TradesViz, Tradervue, TSB, TradeZap, UltraTrader, BetterTrade, TradeClaris, TraderLog, Tradenu, TraderLens, EdgeGhost, TraderInsight.pro) via web research, 2026
- TradingJournal.com comparative reviews and feature matrices (March 2026)
- TradersSecondBrain.com platform comparisons and methodology articles (January–April 2026)
- TradingMetrics.com MFE/MAE technical documentation (March 2026)
- TradesViz Blog: MFE/MAE chart implementations (February 2022, continuously updated)
- Tradervue MFE/MAE calculation methodology blog posts
- Behavioral finance research on trading psychology and mistake tracking (Plancana, TradeClaris, TradeFlow, PNLog)
- Industry pricing models and feature distribution across subscription tiers
- Project context: `.planning/PROJECT.md` (2026-04-23) — Indian equity focus, behavior-driven improvement philosophy, constraint definitions
