'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SetupScorecardTable from '@/components/analytics/SetupScorecardTable';
import MarketRegimeBreakdown from '@/components/analytics/MarketRegimeBreakdown';
import WeeklyOverlayChart from '@/components/analytics/WeeklyOverlayChart';

interface SetupScorecardItem {
  setupType: string;
  count: number;
  wins: number;
  losses: number;
  winRate: number;
  avgR: number;
  profitFactor: number;
  bestTrade: number;
  worstTrade: number;
  recommendation: string;
}

interface RegimeData {
  regime: string;
  count: number;
  wins: number;
  losses: number;
  winRate: number;
  avgR: number;
  profitFactor: number;
  rule: string;
}

export default function AdvancedAnalyticsPage() {
  const [setups, setSetups] = useState<SetupScorecardItem[]>([]);
  const [regimes, setRegimes] = useState<RegimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [setupRes, regimeRes, weeklyRes] = await Promise.all([
          fetch('/api/analytics/setup-scorecard'),
          fetch('/api/analytics/market-regime'),
          fetch('/api/analytics/weekly-chart'),
        ]);

        if (!setupRes.ok) throw new Error('Failed to fetch setup scorecard');
        if (!regimeRes.ok) throw new Error('Failed to fetch market regime data');
        if (!weeklyRes.ok) throw new Error('Failed to fetch weekly chart');

        const [setupsData, regimesData] = await Promise.all([setupRes.json(), regimeRes.json()]);
        setSetups(setupsData);
        setRegimes(regimesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading Advanced Analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-medium">Error loading Advanced Analytics</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Advanced Analytics</h1>

      {/* Setup Scorecard */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Setup Scorecard</h2>
        <Card>
          <CardHeader>
            <CardTitle>Performance by Setup Type</CardTitle>
          </CardHeader>
          <CardContent>
            <SetupScorecardTable setups={setups} />
          </CardContent>
        </Card>
      </section>

      {/* Market Regime Breakdown */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Market Regime Analysis</h2>
        <MarketRegimeBreakdown regimes={regimes} />
      </section>

      {/* Weekly NIFTY Overlay */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Weekly NIFTY Overlay</h2>
        <WeeklyOverlayChart />
      </section>
    </div>
  );
}
