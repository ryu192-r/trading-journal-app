import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

// Fail fast if JWT_SECRET is not configured
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

export interface JwtPayload {
  userId: string
  email: string
}

export async function getUserIdFromToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    return payload.userId
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<JwtPayload> {
  const userId = await getUserIdFromToken()
  if (!userId) throw new Error('Unauthorized')
  
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')
  
  return { userId: user.id, email: user.email }
}
