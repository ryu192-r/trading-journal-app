'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ imported: number; failed: number; errors?: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Import failed');
        if (data.details) setResult({ imported: 0, failed: 0, errors: data.details });
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Import Trades</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Upload Broker CSV</CardTitle>
          <CardDescription>
            Supported brokers: Zerodha, Dhan, AngelOne, ICICI Direct.
            Export your tradebook CSV from the broker portal and upload here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={uploading}
            />
            <Button type="submit" disabled={!file || uploading} className="w-full">
              {uploading ? 'Importing...' : 'Import CSV'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 border border-red-300 bg-red-50 text-red-700 rounded">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 border border-green-300 bg-green-50 rounded">
              <p className="font-semibold text-green-700">
                Imported {result.imported} trade{result.imported !== 1 ? 's' : ''}
                {result.failed > 0 ? `, ${result.failed} failed` : ''}
              </p>
              {result.errors && result.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Row errors:</p>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {result.errors.map((err, i) => (
                      <li key={i} className="text-red-600">{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
