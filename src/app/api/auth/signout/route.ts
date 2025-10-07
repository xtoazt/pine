import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering to avoid build-time initialization
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Dynamically import Stack Auth to avoid build-time errors
    const { stackServerApp } = await import('@/lib/stack')
    
    // Get the user from Stack Auth
    const user = await stackServerApp.getUser()
    
    if (user) {
      // Sign out the user
      await user.signOut()
    }
    
    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('[signout] Error:', error)
    // Still redirect to home even if there's an error
    return NextResponse.redirect(new URL('/', request.url))
  }
}
