import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';

export interface Trade {
  id: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number | null;
  pnl: number | null;
  entryDate: string;
  setupType: string | null;
}

export function TradeList({
  trades,
  filters,
}: {
  trades: Trade[];
  filters?: {
    symbol?: string;
    direction?: string;
    startDate?: string;
    endDate?: string;
  };
}) {
  const buildExportUrl = (format: 'csv' | 'json') => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.symbol) params.set('symbol', filters.symbol);
      if (filters.direction && filters.direction !== 'all') params.set('direction', filters.direction);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
    }
    return `/api/trades/export?format=${format}&${params.toString()}`;
  };

  const handleExport = (format: 'csv' | 'json') => {
    const url = buildExportUrl(format);
    window.location.href = url;
  };

  return (
    <div>
      {/* Export dropdown */}
      <div className="flex justify-end mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead>Exit</TableHead>
              <TableHead>P&L</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Setup</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>
                  <Badge variant={trade.direction === 'LONG' ? 'default' : 'destructive'}>
                    {trade.direction}
                  </Badge>
                </TableCell>
                <TableCell>₹{trade.entryPrice}</TableCell>
                <TableCell>{trade.exitPrice ? `₹${trade.exitPrice}` : '-'}</TableCell>
                <TableCell
                  className={trade.pnl && trade.pnl > 0 ? 'text-green-600' : 'text-red-600'}
                >
                  {trade.pnl ? `₹${trade.pnl.toFixed(2)}` : '-'}
                </TableCell>
                <TableCell>{new Date(trade.entryDate).toLocaleDateString('en-IN')}</TableCell>
                <TableCell>{trade.setupType || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
