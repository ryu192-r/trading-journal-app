'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MAEHistogram from '@/components/analytics/MAEHistogram';

interface HistogramBin {
  label: string;
  count: number;
}

interface MAEResponse {
  histogram: HistogramBin[];
  sampleSize: number;
  winnersCount: number;
  stopRecommendation: string;
}

export default function MAEPage() {
  const [data, setData] = useState<MAEResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/analytics/mae');
        if (!res.ok) throw new Error('Failed to fetch MAE data');
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
          <p className="text-muted-foreground">Loading MAE Analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-medium">Error loading MAE Analysis</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">MAE Analysis</h1>

      {/* Stats Cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sample Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.sampleSize}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Winners Analyzed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.winnersCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Histogram + Recommendation */}
      {data && <MAEHistogram bins={data.histogram} stopRecommendation={data.stopRecommendation} />}
    </div>
  );
}
