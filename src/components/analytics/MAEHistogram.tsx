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

interface Bin {
  label: string;
  count: number;
}

interface MAEHistogramProps {
  bins: Bin[];
  stopRecommendation: string;
}

export default function MAEHistogram({ bins, stopRecommendation }: MAEHistogramProps) {
  const data = {
    labels: bins.map((b) => b.label),
    datasets: [
      {
        label: 'Trades',
        data: bins.map((b) => b.count),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'MAE Distribution (in R)' },
    },
    scales: {
      x: {
        title: { display: true, text: 'MAE (R Multiple)' },
      },
      y: {
        title: { display: true, text: 'Number of Trades' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>MAE Histogram</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '400px' }}>
            {bins.length > 0 ? (
              <Bar data={data} options={options} />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No closed trades to display MAE histogram.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {stopRecommendation && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Stop Optimization Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold leading-relaxed">{stopRecommendation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
