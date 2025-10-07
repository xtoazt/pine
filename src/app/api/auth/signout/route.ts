import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Clear cookie
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[signout] Error:', error)
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Clear cookie
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')
    
    // Redirect to home
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('[signout] Error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
