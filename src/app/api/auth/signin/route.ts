import { NextRequest, NextResponse } from 'next/server'
import { signInUser, createToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }
    
    // Sign in user
    const user = await signInUser(email, password)
    
    // Create token
    const token = await createToken(user.id)
    
    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    })
  } catch (error: any) {
    console.error('[signin] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sign in' },
      { status: 400 }
    )
  }
}
