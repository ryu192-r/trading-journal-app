'use client';

import { useEffect, useState } from 'react';
import { TradeList } from '@/components/TradeList';
import { TradeForm } from '@/components/TradeForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export default function TradesPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nlInput, setNlInput] = useState('');
  const [nlLoading, setNlLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    symbol: '',
    direction: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'entryDate',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.symbol) params.set('symbol', filters.symbol);
      if (filters.direction !== 'all') params.set('direction', filters.direction);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);

      const res = await fetch(`/api/trades?${params}`);
      if (res.ok) {
        const data = await res.json();
        const normalized = (data.trades || []).map((t: any) => ({
          ...t,
          exitPrice: t.exitPrice ?? null,
          pnl: t.pnl ?? null,
          setupType: t.setupType ?? null,
        }));
        setTrades(normalized);
      }
    } catch (err) {
      console.error('Failed to fetch trades', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [filters]);

  const handleNlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlInput.trim()) return;
    setNlLoading(true);
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: nlInput }),
      });
      if (res.ok) {
        setNlInput('');
        await fetchTrades();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to parse');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setNlLoading(false);
    }
  };

  const handleTradeCreated = () => {
    setDialogOpen(false);
    fetchTrades();
  };

  // Build filters prop for TradeList export
  const exportFilters = {
    symbol: filters.symbol,
    direction: filters.direction,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trades</h1>
        <Button onClick={() => setDialogOpen(true)}>Add Trade</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Filter by symbol..."
              value={filters.symbol}
              onChange={(e) => setFilters({ ...filters, symbol: e.target.value })}
            />
            <Select
              value={filters.direction}
              onValueChange={(v) => setFilters({ ...filters, direction: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="LONG">LONG</SelectItem>
                <SelectItem value="SHORT">SHORT</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              placeholder="Start date"
            />
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              placeholder="End date"
            />
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(v) => {
                const [sortBy, sortOrder] = v.split('-') as ['entryDate' | 'symbol' | 'pnl' | 'createdAt', 'asc' | 'desc'];
                setFilters({ ...filters, sortBy, sortOrder });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entryDate-desc">Newest First</SelectItem>
                <SelectItem value="entryDate-asc">Oldest First</SelectItem>
                <SelectItem value="symbol-asc">Symbol A-Z</SelectItem>
                <SelectItem value="pnl-desc">Highest P&L</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* NL Quick Entry */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleNlSubmit} className="flex gap-2">
            <Input
              placeholder='Quick add: "bought HDFC at 730, stop 710, target 760"'
              value={nlInput}
              onChange={(e) => setNlInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={nlLoading}>
              {nlLoading ? 'Adding...' : 'Quick Add'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Trade List with export */}
      {loading ? (
        <p>Loading trades...</p>
      ) : (
        <TradeList trades={trades} filters={exportFilters} />
      )}

      {/* Modal Trade Form */}
      <TradeForm open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleTradeCreated} />
    </div>
  );
}
