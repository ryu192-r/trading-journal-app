import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json()
  
  // Validation (Zod would be added later, inline for now)
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }
  
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }
  
  // Simple hash (bcrypt would be added in refinement)
  const passwordHash = Buffer.from(password).toString('base64') // TEMP — replace with bcrypt in Phase 2
  
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
  })
  
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
  
  const response = NextResponse.json({ user: { id: user.id, email: user.email } })
  response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 604800 })
  return response
}
