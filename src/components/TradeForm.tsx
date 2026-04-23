import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function TradeForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    symbol: '',
    direction: 'LONG' as const,
    entryPrice: '',
    exitPrice: '',
    quantity: '',
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <Label>Symbol</Label>
        <Input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="RELIANCE" />
      </div>
      <div>
        <Label>Direction</Label>
        <Select value={form.direction} onValueChange={(v) => setForm({ ...form, direction: v as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LONG">LONG</SelectItem>
            <SelectItem value="SHORT">SHORT</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Entry Price</Label>
        <Input type="number" value={form.entryPrice} onChange={(e) => setForm({ ...form, entryPrice: e.target.value })} placeholder="730" />
      </div>
      <Button type="submit">Add Trade</Button>
    </form>
  )
}
