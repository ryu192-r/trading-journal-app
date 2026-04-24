'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function BehavioralPage() {
  const [emotionStats, setEmotionStats] = useState<any>(null)
  const [patterns, setPatterns] = useState<any[]>([])
  const [ghosts, setGhosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [corrRes, patRes, ghostRes] = await Promise.all([
          fetch('/api/analytics/behaviors/emotion-correlation'),
          fetch('/api/analytics/behaviors/patterns'),
          fetch('/api/analytics/behaviors/ghosts?limit=10'),
        ])
        const corrData = await corrRes.json()
        const patData = await patRes.json()
        const ghostData = await ghostRes.json()
        setEmotionStats(corrData.correlation)
        setPatterns(patData.patterns || [])
        setGhosts(ghostData.ghosts || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <div className="p-8">Loading behavioral analytics...</div>

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Emotion Correlation */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Emotion → Outcome Correlation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['pre', 'during', 'post'].map((phase) => (
            <Card key={phase}>
              <CardHeader><CardTitle className="capitalize">{phase}-Trade Emotion</CardTitle></CardHeader>
              <CardContent>
                {emotionStats?.[phase] ? (
                  <ul className="space-y-2">
                    {Object.entries(emotionStats[phase]).map(([emotion, stats]: [string, any]) => (
                      <li key={emotion} className="flex items-center justify-between border-b pb-1">
                        <span className="capitalize">{emotion.toLowerCase()}</span>
                        <div className="text-sm">
                          <span className="mr-2">WR: {stats.winRate.toFixed(1)}%</span>
                          <span className="mr-2">Avg R: {stats.avgR.toFixed(2)}</span>
                          <span>PF: {stats.profitFactor.toFixed(2)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Not enough data (min 3 trades per emotion state required)</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Behavioral Patterns */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Behavioral Pattern Detection</h2>
        {patterns.length === 0 ? (
          <Card><CardContent className="py-8">No harmful patterns detected in the last 30 days. Keep it up!</CardContent></Card>
        ) : (
          <div className="space-y-2">
            {patterns.map((p, i) => (
              <Card key={i} className={`border-l-4 ${p.severity === 'HIGH' ? 'border-red-500' : p.severity === 'MEDIUM' ? 'border-yellow-500' : 'border-blue-500'}`}>
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold capitalize">{p.pattern.replace('_', ' ')} — {p.date}</div>
                    <div className="text-sm text-muted-foreground">{p.description}</div>
                  </div>
                  <Badge variant={p.severity === 'HIGH' ? 'destructive' : 'secondary'}>{p.severity}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Ghost Trades */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Ghost Trade Tracker — What Happened After Exit?</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Exit Date</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Exit Price</TableHead>
                  <TableHead>Missed Profit</TableHead>
                  <TableHead>Missed R</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ghosts.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8">No ghost data available — close some trades and check back in 30 days</TableCell></TableRow>
                ) : (
                  ghosts.map((g) => (
                    <TableRow key={g.tradeId}>
                      <TableCell className="font-mono">{g.symbol}</TableCell>
                      <TableCell>{new Date(g.exitDate).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell className={g.direction === 'LONG' ? 'text-green-600' : 'text-red-600'}>{g.direction}</TableCell>
                      <TableCell>₹{g.exitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-orange-600 font-semibold">₹{g.missedProfit.toFixed(2)}</TableCell>
                      <TableCell>{g.missedR != null ? `${g.missedR.toFixed(2)}R` : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="py-4 text-center"><div className="text-sm text-muted-foreground">Avg Sleep (hrs)</div><div className="text-2xl font-bold">—</div></CardContent></Card>
          <Card><CardContent className="py-4 text-center"><div className="text-sm text-muted-foreground">Avg Fatigue</div><div className="text-2xl font-bold">—</div></CardContent></Card>
          <Card><CardContent className="py-4 text-center"><div className="text-sm text-muted-foreground">Top Emotion</div><div className="text-2xl font-bold">—</div></CardContent></Card>
          <Card><CardContent className="py-4 text-center"><div className="text-sm text-muted-foreground">Ghost Opportunities</div><div className="text-2xl font-bold">{ghosts.length}</div></CardContent></Card>
        </div>
      </section>
    </div>
  )
}
