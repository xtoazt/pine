import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'

export async function GET(request: NextRequest) {
  try {
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
