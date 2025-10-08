import { NextRequest, NextResponse } from 'next/server'

/**
 * DS Proxy - NOW USES UV PROXY
 * 
 * This endpoint redirects all game requests to use UV (Ultraviolet) proxy
 * for better CORS handling and reliability.
 * 
 * All games now load through UV service worker for:
 * - CORS bypass
 * - Better performance
 * - Client-side proxying (no server load)
 * 
 * Usage: /api/ds/proxy?url=https://example.com
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawUrl = searchParams.get('url')
    
    if (!rawUrl) {
      return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
    }

    // Validate URL
    let target: URL
    try {
      target = new URL(rawUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
    }
    
    // REDIRECT TO UV PROXY
    // Instead of server-side proxying, redirect to our UV proxy endpoint
    const uvRedirectUrl = `/api/uv-redirect?url=${encodeURIComponent(target.toString())}`
    
    // Return HTML page that loads game via UV proxy
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading...</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #000;
            overflow: hidden;
        }
        iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
    </style>
</head>
<body>
    <iframe 
        src="${uvRedirectUrl}" 
        allowfullscreen 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock allow-orientation-lock allow-top-navigation-by-user-activation"
    ></iframe>
</body>
</html>`
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Frame-Options': 'SAMEORIGIN',
      }
    })
  } catch (e) {
    console.error('[DS Proxy] Error:', e)
    return NextResponse.json(
      { error: 'Proxy error', details: e instanceof Error ? e.message : 'Unknown' },
      { status: 500 }
    )
  }
}
