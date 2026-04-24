'use client';

import { useEffect, useState } from 'react';
import PerformanceMetricsCard from '@/components/analytics/PerformanceMetricsCard';

interface PerformanceResponse {
  sharpe: number;
  sortino: number;
  maxDrawdown: number;
  recoveryFactor: number;
  tradesCount: number;
}

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/analytics/performance');
        if (!res.ok) throw new Error('Failed to fetch performance data');
        const json = await res.json();
        setData(json);
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
          <p className="text-muted-foreground">Loading performance metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-medium">Error loading performance metrics</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Performance Metrics</h1>

      {/* Metric Cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PerformanceMetricsCard
            label="Sharpe Ratio"
            value={data.sharpe}
            subtitle="Risk-adjusted return"
          />
          <PerformanceMetricsCard
            label="Sortino Ratio"
            value={data.sortino}
            subtitle="Downside deviation"
          />
          <PerformanceMetricsCard
            label="Max Drawdown"
            value={data.maxDrawdown}
            subtitle="Largest peak-to-trough decline"
          />
          <PerformanceMetricsCard
            label="Recovery Factor"
            value={data.recoveryFactor}
            subtitle="Profit vs max drawdown"
          />
        </div>
      )}
    </div>
  );
}
