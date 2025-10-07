import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, getUserById } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ user: null })
    }
    
    // Verify token
    const payload = await verifyToken(token)
    
    if (!payload) {
      return NextResponse.json({ user: null })
    }
    
    // Get user
    const user = await getUserById(payload.userId)
    
    if (!user) {
      return NextResponse.json({ user: null })
    }
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    })
  } catch (error) {
    console.error('[me] Error:', error)
    return NextResponse.json({ user: null })
  }
}
