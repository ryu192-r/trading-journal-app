'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  ScatterController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  ScatterController,
  Title,
  Tooltip,
  Legend
);

interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface TradeMarker {
  date: string;
  type: 'entry' | 'exit';
  direction: 'long' | 'short';
  price: number;
  trend: 'with' | 'counter';
}

interface WeeklyChartResponse {
  candles: Candle[];
  tradeMarkers: TradeMarker[];
}

interface WeeklyOverlayChartProps {
  weekLabel?: string;
}

export default function WeeklyOverlayChart({ weekLabel }: WeeklyOverlayChartProps) {
  const [data, setData] = useState<WeeklyChartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = weekLabel
          ? `/api/analytics/weekly-chart?week=${encodeURIComponent(weekLabel)}`
          : '/api/analytics/weekly-chart';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch weekly chart data');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [weekLabel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading weekly chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        <p className="font-medium">Error loading weekly chart</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data || data.candles.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No weekly price data available for the selected week.
      </div>
    );
  }

  const labels = data.candles.map((c) => {
    const d = new Date(c.date);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  });

  // Build datasets array
  const datasets: any[] = [];

  // Line dataset for NIFTY close
  datasets.push({
    type: 'line',
    label: 'NIFTY Close',
    data: data.candles.map((c) => c.close),
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.1)',
    fill: false,
    tension: 0.1,
    pointRadius: 0,
    yAxisID: 'y',
  });

  // Scatter entries with trend-based coloring
  const entryMarkers = data.tradeMarkers.filter((m) => m.type === 'entry');
  const entryData = entryMarkers.map((m) => ({
    x: new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    y: m.price,
  }));
  if (entryMarkers.length > 0) {
    datasets.push({
      type: 'scatter',
      label: 'Entry Markers',
      data: entryData,
      pointBackgroundColor: (context) => {
        const marker = entryMarkers[context.dataIndex];
        return marker.trend === 'with' ? '#22c55e' : '#ef4444';
      },
      pointStyle: (context) => {
        const marker = entryMarkers[context.dataIndex];
        return marker.direction === 'long' ? 'triangle-up' : 'triangle-down';
      },
      pointRadius: 8,
      yAxisID: 'y',
    });
  }

  // Scatter exits with trend-based coloring
  const exitMarkers = data.tradeMarkers.filter((m) => m.type === 'exit');
  const exitData = exitMarkers.map((m) => ({
    x: new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    y: m.price,
  }));
  if (exitMarkers.length > 0) {
    datasets.push({
      type: 'scatter',
      label: 'Exit Markers',
      data: exitData,
      pointBackgroundColor: (context) => {
        const marker = exitMarkers[context.dataIndex];
        return marker.trend === 'with' ? '#4ade80' : '#f87171'; // lighter green/red for exits
      },
      pointStyle: 'rectRot',
      pointRadius: 6,
      yAxisID: 'y',
    });
  }

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'NIFTY Weekly Price with Trade Entries & Exits' },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const raw = ctx.raw as { y?: number };
            if (ctx.dataset.type === 'scatter' && raw.y !== undefined) {
              return `${ctx.dataset.label}: ₹${raw.y.toFixed(2)}`;
            }
            if (ctx.dataset.type === 'line') {
              return `${ctx.dataset.label}: ₹${ctx.raw.toFixed(2)}`;
            }
            return ctx.dataset.label;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' },
      },
      y: {
        title: { display: true, text: 'Price (₹)' },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly NIFTY Overlay</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '450px' }}>
          <Chart type="bar" data={chartData} options={options} />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>With-Trend Entry</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>Counter-Trend Entry</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-300 rounded-full"></span>
            <span>With-Trend Exit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-300 rounded-full"></span>
            <span>Counter-Trend Exit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
            <span>NIFTY Close</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
