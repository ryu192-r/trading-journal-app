import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getUserIdFromToken } from '@/middleware/auth'
import { detectRevengeTrading, detectOvertrading, computeEmotionCorrelation } from '@/lib/analytics/behavioral'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    const userId = await getUserIdFromToken()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(request.url)
    const pathname = url.pathname

    if (pathname.includes('patterns')) {
      const [revenge, overtrading] = await Promise.all([
        detectRevengeTrading(userId),
        detectOvertrading(userId)
      ])
      const patterns = [...revenge, ...overtrading].sort((a, b) => b.date.localeCompare(a.date))
      return NextResponse.json({ patterns })
    }

    if (pathname.includes('emotion-correlation')) {
      const correlation = await computeEmotionCorrelation(userId)
      return NextResponse.json({ correlation })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    console.error('Behavioral analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
