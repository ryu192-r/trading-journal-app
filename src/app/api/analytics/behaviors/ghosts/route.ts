import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getUserIdFromToken } from '@/middleware/auth'
import { prisma } from '@/lib/db'
import { computeGhostTrade } from '@/lib/analytics/calculator'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    const userId = await getUserIdFromToken()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const [total, closedTrades] = await Promise.all([
      prisma.trade.count({ where: { userId, exitPrice: { not: null } } }),
      prisma.trade.findMany({
        where: { userId, exitPrice: { not: null } },
        select: { id: true },
        orderBy: { exitDate: 'desc' },
        skip: offset,
        take: limit,
      })
    ])

    const ghostPromises = closedTrades.map(async (trade) => {
      try {
        return await computeGhostTrade(trade.id, userId)
      } catch (error) {
        console.error(`Ghost trade error for ${trade.id}:`, error)
        return null
      }
    })

    const ghosts = (await Promise.all(ghostPromises)).filter((g): g is NonNullable<typeof g> => g !== null)

    return NextResponse.json({
      ghosts,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    })
  } catch (error) {
    console.error('Ghost trades error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
