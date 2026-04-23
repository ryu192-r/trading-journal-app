"use client"

import { useState, useEffect } from 'react'
import { TradeList } from '@/components/TradeList'
import { TradeForm } from '@/components/TradeForm'

export default function Home() {
  const [trades, setTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTrades = async () => {
    try {
      const res = await fetch('/api/trades')
      const data = await res.json()
      setTrades(data.trades || [])
    } catch (err) {
      console.error('Failed to fetch trades:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrades()
  }, [])

  const handleAddTrade = async (formData: any) => {
    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          entryPrice: parseFloat(formData.entryPrice),
          quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
        }),
      })
      if (res.ok) {
        await fetchTrades()
      }
    } catch (err) {
      console.error('Failed to add trade:', err)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Trading Journal</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Trade</h2>
          <TradeForm onSubmit={handleAddTrade} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Trade List</h2>
          {loading ? (
            <p className="text-gray-500">Loading trades...</p>
          ) : (
            <TradeList trades={trades} />
          )}
          {trades.length === 0 && !loading && (
            <p className="text-gray-500">No trades yet. Add your first trade above.</p>
          )}
        </div>
      </div>
    </div>
  )
}
