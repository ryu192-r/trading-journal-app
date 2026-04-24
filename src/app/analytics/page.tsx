'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PnlSummary {
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}

interface EquityPoint {
  date: string;
  pnl: number;
  drawdown: number;
}

interface EquityCurve {
  curve: EquityPoint[];
  maxDrawdown: number;
  peak: number;
  finalPnL: number;
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<PnlSummary | null>(null);
  const [curve, setCurve] = useState<EquityCurve | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, curveRes] = await Promise.all([
          fetch('/api/analytics/pnl-summary'),
          fetch('/api/analytics/equity-curve'),
        ]);

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          setSummary(summaryData);
        }
        if (curveRes.ok) {
          const curveData = await curveRes.json();
          setCurve(curveData);
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

  const chartData = {
    labels: curve?.curve.map((p) => new Date(p.date).toLocaleDateString('en-IN')) || [],
    datasets: [
      {
        label: 'Cumulative P&L',
        data: curve?.curve.map((p) => p.pnl) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Equity Curve' },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'P&L (₹)' } },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.winRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.profitFactor.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Win</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary?.avgWin || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary?.avgLoss || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expectancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.expectancy || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalTrades || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(curve?.maxDrawdown || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(curve?.finalPnL || 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Equity Curve Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '400px' }}>
            {curve && curve.curve.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p className="text-muted-foreground">No closed trades to display equity curve.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
