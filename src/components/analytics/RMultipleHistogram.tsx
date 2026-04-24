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
}

export default function RMultipleHistogram({ bins }: RMultipleHistogramProps) {
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
  );
}
