import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proxy game requests to classroom.mathify.space
  if (pathname.startsWith('/proxy/classroom/')) {
    const gamePath = pathname.replace('/proxy/classroom/', '')
    const targetUrl = `https://classroom.mathify.space/${gamePath}`
    
    return NextResponse.rewrite(new URL(targetUrl))
  }

  // Proxy lessons requests
  if (pathname.startsWith('/proxy/lessons/')) {
    const lessonPath = pathname.replace('/proxy/lessons/', '')
    const targetUrl = `https://classroom.mathify.space/lessons/${lessonPath}`
    
    return NextResponse.rewrite(new URL(targetUrl))
  }

  // Proxy lesson images
  if (pathname.startsWith('/proxy/lessons-img/')) {
    const imagePath = pathname.replace('/proxy/lessons-img/', '')
    const targetUrl = `https://classroom.mathify.space/lessons-img/${imagePath}`
    
    return NextResponse.rewrite(new URL(targetUrl))
  }

  // Proxy HDUN games
  if (pathname.startsWith('/proxy/hdun/')) {
    const gamePath = pathname.replace('/proxy/hdun/', '')
    const targetUrl = `https://www.hdun.org/games/alotofgames/${gamePath}`
    
    return NextResponse.rewrite(new URL(targetUrl))
  }

  // Handle the new play.html system
  if (pathname.startsWith('/play/') && !pathname.includes('/api/')) {
    // Extract game ID from path
    const gameId = pathname.split('/play/')[1]
    
    // Check if this is a request for the play page itself
    if (gameId && !gameId.includes('.')) {
      // This is a game ID, serve the play page
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/proxy/:path*',
    '/play/:path*'
  ]
}
