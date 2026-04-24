'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SetupScorecardItem {
  setupType: string;
  count: number;
  wins: number;
  losses: number;
  winRate: number;
  avgR: number;
  profitFactor: number;
  bestTrade: number;
  worstTrade: number;
  recommendation: string;
}

interface SetupScorecardTableProps {
  setups: SetupScorecardItem[];
}

export default function SetupScorecardTable({ setups }: SetupScorecardTableProps) {
  if (!setups || setups.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No setup data available yet. Start logging trades with setup types.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Setup</TableHead>
          <TableHead className="text-center">Win Rate</TableHead>
          <TableHead className="text-center">Avg R</TableHead>
          <TableHead className="text-center">Profit Factor</TableHead>
          <TableHead className="text-center">Best</TableHead>
          <TableHead className="text-center">Worst</TableHead>
          <TableHead>Recommendation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {setups.map((item) => (
          <TableRow key={item.setupType}>
            <TableCell className="font-medium">{item.setupType}</TableCell>
            <TableCell className="text-center">{(item.winRate * 100).toFixed(1)}%</TableCell>
            <TableCell className="text-center">{item.avgR.toFixed(2)}R</TableCell>
            <TableCell className="text-center">{item.profitFactor.toFixed(2)}</TableCell>
            <TableCell className="text-center text-green-600 font-medium">
              +{item.bestTrade.toFixed(2)}R
            </TableCell>
            <TableCell className="text-center text-red-600 font-medium">
              {item.worstTrade.toFixed(2)}R
            </TableCell>
            <TableCell>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  item.recommendation.includes('increasing')
                    ? 'bg-green-100 text-green-800'
                    : item.recommendation.includes('Avoid')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {item.recommendation}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
