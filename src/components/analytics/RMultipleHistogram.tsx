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

interface RMultipleHistogramProps {
  bins: Bin[];
  exitEfficiency?: {
    averageMFE: number;
    targetHitRate: number;
    sampleSize: number;
  };
}

export default function RMultipleHistogram({ bins, exitEfficiency }: RMultipleHistogramProps) {
  const data = {
    labels: bins.map((b) => b.label),
    datasets: [
      {
        label: 'Trades',
        data: bins.map((b) => b.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'R-Multiple Distribution' },
    },
    scales: {
      x: {
        title: { display: true, text: 'R Multiple' },
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
          <CardTitle>R-Multiple Histogram</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '400px' }}>
            {bins.length > 0 ? (
              <Bar data={data} options={options} />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No closed trades to display histogram.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {exitEfficiency && (
        <Card>
          <CardHeader>
            <CardTitle>Exit Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average MFE</p>
              <p className="text-2xl font-bold">{exitEfficiency.averageMFE.toFixed(2)}R</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Target Hit Rate</p>
              <p className="text-2xl font-bold">{(exitEfficiency.targetHitRate * 100).toFixed(1)}%</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Sample size: {exitEfficiency.sampleSize} winner trade{exitEfficiency.sampleSize !== 1 ? 's' : ''} with target price set
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
