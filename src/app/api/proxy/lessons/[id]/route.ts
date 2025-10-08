import { NextRequest, NextResponse } from 'next/server'

/**
 * Lessons Proxy - NOW USES UV
 * 
 * This endpoint redirects lesson games to use UV proxy
 * 
 * Usage: /api/proxy/lessons/[id]
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params
    const targetUrl = `https://classroom.mathify.space/lessons/${gameId}/index.html`
    
    // Redirect to UV proxy
    const uvRedirectUrl = `/api/uv-redirect?url=${encodeURIComponent(targetUrl)}`
    
    // Return HTML page that loads via UV
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading Lesson...</title>
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
        'Cache-Control': 'public, max-age=300',
        'X-Frame-Options': 'SAMEORIGIN',
      }
    })
  } catch (error) {
    console.error('[Lessons Proxy] Error:', error)
    return NextResponse.json({ error: 'Failed to load lesson' }, { status: 500 })
  }
}
