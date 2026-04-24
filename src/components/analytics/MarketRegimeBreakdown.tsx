'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

interface MarketRegimeBreakdownProps {
  regimes: RegimeData[];
}

export default function MarketRegimeBreakdown({ regimes }: MarketRegimeBreakdownProps) {
  // Optional bar chart: avg R across regimes
  const chartData = {
    labels: regimes.map((r) => r.regime),
    datasets: [
      {
        label: 'Avg R',
        data: regimes.map((r) => r.avgR),
        backgroundColor: regimes.map((r) => (r.avgR >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)')),
        borderColor: regimes.map((r) => (r.avgR >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)')),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Average R by Market Regime' },
    },
    scales: {
      y: {
        title: { display: true, text: 'Avg R' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Regime Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '300px' }}>
            {regimes.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No regime data available. Trade across different market conditions to build insights.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {regimes.map((regime) => (
          <Card key={regime.regime} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">{regime.regime}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trades:</span>
                <span className="font-medium">{regime.count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="font-medium">{(regime.winRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg R:</span>
                <span className={`font-medium ${regime.avgR >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {regime.avgR >= 0 ? '+' : ''}{regime.avgR.toFixed(2)}R
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Profit Factor:</span>
                <span className="font-medium">{regime.profitFactor.toFixed(2)}</span>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground leading-relaxed">{regime.rule}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
