import { NextRequest, NextResponse } from 'next/server'

function isHtml(contentType: string | null): boolean {
  return !!contentType && contentType.toLowerCase().includes('text/html')
}

function rewriteHtml(baseUrl: string, html: string): string {
  let modified = html
  // Insert base tag
  if (!/\<base\s+/i.test(modified)) {
    const baseTag = `<base href="${baseUrl}" />`
    modified = modified.replace(/<head(\s[^>]*)?>/i, (m) => `${m}\n${baseTag}`)
  }
  // Rewrite src/href attributes
  modified = modified.replace(/(src|href)="(.*?)"/gi, (_m, attr, url) => {
    if (!url || /^https?:\/\//i.test(url) || /^data:/i.test(url)) return _m
    const abs = url.startsWith('/') ? url : `${baseUrl}${url}`
    return `${attr}="${abs}"
`
  })
  return modified
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params
    const base = `https://classroom.mathify.space/lessons/${gameId}/`
    const targetUrl = `${base}index.html`
    
    let response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': base
      }
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }
    
    const ct = response.headers.get('content-type') || ''

    // Stream non-HTML assets (when this route is used for assets)
    if (!isHtml(ct)) {
      const body = await response.arrayBuffer()
      return new NextResponse(Buffer.from(body), {
        headers: {
          'Content-Type': ct || 'application/octet-stream',
          'Cache-Control': 'public, max-age=3600'
        }
      })
    }

    let content = await response.text()

    // Basic anti-bot fallback (if empty/placeholder)
    if (content.trim().length < 64) {
      const alt = await fetch(base, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': base } })
      if (alt.ok && isHtml(alt.headers.get('content-type'))) {
        content = await alt.text()
      }
    }

    const rewritten = rewriteHtml(base, content)
    
    return new NextResponse(rewritten, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        'X-Frame-Options': 'SAMEORIGIN',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
      }
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to load game' }, { status: 500 })
  }
}
