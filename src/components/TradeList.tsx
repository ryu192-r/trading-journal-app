import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export interface Trade {
  id: string
  symbol: string
  direction: 'LONG' | 'SHORT'
  entryPrice: number
  exitPrice: number | null
  pnl: number | null
  entryDate: string
  setupType: string | null
}

export function TradeList({ trades }: { trades: Trade[] }) {
  return (
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
        {trades.map(trade => (
          <TableRow key={trade.id}>
            <TableCell className="font-medium">{trade.symbol}</TableCell>
            <TableCell>
              <Badge variant={trade.direction === 'LONG' ? 'default' : 'destructive'}>
                {trade.direction}
              </Badge>
            </TableCell>
            <TableCell>₹{trade.entryPrice}</TableCell>
            <TableCell>{trade.exitPrice ? `₹${trade.exitPrice}` : '-'}</TableCell>
            <TableCell className={trade.pnl && trade.pnl > 0 ? 'text-green-600' : 'text-red-600'}>
              {trade.pnl ? `₹${trade.pnl.toFixed(2)}` : '-'}
            </TableCell>
            <TableCell>{new Date(trade.entryDate).toLocaleDateString()}</TableCell>
            <TableCell>{trade.setupType || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
