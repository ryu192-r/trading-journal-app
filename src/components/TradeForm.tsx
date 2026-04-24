import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SETUP_OPTIONS = [
  'EP',
  'VCP',
  'BREAKOUT',
  'PULLBACK',
  'PARABOLIC_LONG',
  'CUSTOM',
] as const;

export function TradeForm({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}) {
  const [form, setForm] = useState({
    symbol: '',
    direction: 'LONG' as 'LONG' | 'SHORT',
    entryPrice: '',
    exitPrice: '',
    targetPrice: '',
    quantity: '',
    setupType: '',
    notes: '',
    screenshotUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      entryPrice: parseFloat(form.entryPrice),
      exitPrice: form.exitPrice ? parseFloat(form.exitPrice) : undefined,
      quantity: form.quantity ? parseInt(form.quantity, 10) : undefined,
      setupType: form.setupType || undefined,
    });
    // Reset form and close dialog (parent will also close on success)
    setForm({
      symbol: '',
      direction: 'LONG',
      entryPrice: '',
      exitPrice: '',
      targetPrice: '',
      quantity: '',
      setupType: '',
      notes: '',
      screenshotUrl: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Trade</DialogTitle>
          <DialogDescription>
            Enter trade details. Required: symbol, direction, entry price.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Symbol</Label>
            <Input
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
              placeholder="RELIANCE"
              required
            />
          </div>

          <div>
            <Label>Direction</Label>
            <Select
              value={form.direction}
              onValueChange={(v) => setForm({ ...form, direction: v as 'LONG' | 'SHORT' })}
            >
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
            <Input
              type="number"
              step="0.01"
              value={form.entryPrice}
              onChange={(e) => setForm({ ...form, entryPrice: e.target.value })}
              placeholder="730"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Stop Price (optional)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.exitPrice ? form.exitPrice : ''}
                onChange={(e) => setForm({ ...form, exitPrice: e.target.value })}
                placeholder="710"
              />
            </div>
            <div>
              <Label>Target Price (optional)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.targetPrice || ''}
                onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
                placeholder="760"
              />
            </div>
          </div>

          <div>
            <Label>Quantity (optional)</Label>
            <Input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="50"
            />
          </div>

          <div>
            <Label>Setup Type (optional)</Label>
            <Select
              value={form.setupType}
              onValueChange={(v) => setForm({ ...form, setupType: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select setup" />
              </SelectTrigger>
              <SelectContent>
                {SETUP_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Notes (optional)</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Trade rationale, learnings..."
              maxLength={1000}
              rows={3}
            />
          </div>

          <div>
            <Label>Screenshot URL (optional)</Label>
            <Input
              type="url"
              value={form.screenshotUrl}
              onChange={(e) => setForm({ ...form, screenshotUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Trade</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
