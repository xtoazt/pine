import { NextRequest, NextResponse } from 'next/server'

function isHtml(contentType: string | null): boolean {
  return !!contentType && contentType.toLowerCase().includes('text/html')
}

function isCss(contentType: string | null): boolean {
  return !!contentType && contentType.toLowerCase().includes('text/css')
}

function rewriteHtml(gameId: string, basePath: string, html: string): string {
  let modified = html

  // Ensure a <base> tag to help with relative URLs inside the document
  if (!/\<base\s+/i.test(modified)) {
    const baseTag = `<base href="/api/hdun/proxy?id=${gameId}&path=${encodeURIComponent(basePath)}" />`
    modified = modified.replace(/<head(\s[^>]*)?>/i, (m) => `${m}\n${baseTag}`)
  }

  // Replace src/href for common asset types
  modified = modified.replace(/(src|href)="(.*?)"/gi, (_match, attr, url) => {
    if (!url || /^https?:\/\//i.test(url) || /^data:/i.test(url)) return _match
    const path = url.startsWith('/') ? url.slice(1) : url
    const proxied = `/api/hdun/proxy?id=${gameId}&path=${encodeURIComponent(path)}`
    return `${attr}="${proxied}"`
  })

  return modified
}

function rewriteCss(gameId: string, basePath: string, css: string): string {
  // Rewrite url(...) references
  return css.replace(/url\(([^)]+)\)/gi, (m, raw) => {
    let url = String(raw).trim().replace(/^['"]|['"]$/g, '')
    if (!url || /^https?:\/\//i.test(url) || /^data:/i.test(url)) return m
    const path = url.startsWith('/') ? url.slice(1) : url
    const proxied = `/api/hdun/proxy?id=${gameId}&path=${encodeURIComponent(path)}`
    return `url(${proxied})`
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('id')
    const path = searchParams.get('path') || ''
    
    if (!gameId) {
      return NextResponse.json({ error: 'Game ID required' }, { status: 400 })
    }
    
    // Construct the HDUN game URL
    const baseUrl = `https://www.hdun.org/games/alotofgames/${gameId}`
    const targetUrl = path
      ? `${baseUrl}/${path}`
      : `${baseUrl}/index.html`
    
    // Fetch the game content
    let response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': baseUrl,
        'Origin': 'https://www.hdun.org'
      }
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }
    
    const contentType = response.headers.get('content-type') || ''

    // If not HTML, stream the asset through unchanged
    if (!isHtml(contentType)) {
      const buffer = await response.arrayBuffer()
      let body: BodyInit = Buffer.from(buffer)
      // If CSS, rewrite url(...) references
      if (isCss(contentType)) {
        const text = Buffer.from(buffer).toString('utf-8')
        const rewritten = rewriteCss(gameId, path || '', text)
        body = rewritten
      }
      return new NextResponse(body, {
        headers: {
          'Content-Type': contentType || 'application/octet-stream',
          'Cache-Control': 'public, max-age=3600'
        }
      })
    }

    // HTML: rewrite URLs
    let content = await response.text()

    // Fallback if content looks invalid (e.g., anti-bot placeholder like 'crms')
    if (/\bcrms\b/i.test(content) || content.trim().length < 64) {
      const fallbackUrl = `${baseUrl}/index.html`
      const fallbackRes = await fetch(fallbackUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': baseUrl,
          'Origin': 'https://www.hdun.org'
        }
      })
      if (fallbackRes.ok && isHtml(fallbackRes.headers.get('content-type'))) {
        content = await fallbackRes.text()
      }
    }

    let modifiedContent = rewriteHtml(gameId, path || '', content)

    // Add pine controls (lightweight)
    const pineControls = `
      <div id="pine-controls" style="position: fixed; top: 10px; right: 10px; z-index: 9999; background: rgba(0,0,0,0.6); color: white; padding: 6px 8px; border-radius: 6px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-size: 12px;">
        <button onclick="window.parent.postMessage({type: 'pine-fullscreen'}, '*')" style="background: #111827; color: white; border: none; padding: 4px 8px; margin: 0 4px; border-radius: 4px; cursor: pointer;">Fullscreen</button>
        <button onclick="window.parent.postMessage({type: 'pine-reload'}, '*')" style="background: #065f46; color: white; border: none; padding: 4px 8px; margin: 0 4px; border-radius: 4px; cursor: pointer;">Reload</button>
      </div>
    `
    if (modifiedContent.includes('</body>')) {
      modifiedContent = modifiedContent.replace('</body>', `${pineControls}</body>`)    
    } else {
      modifiedContent += pineControls
    }

    return new NextResponse(modifiedContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      }
    })
  } catch (error) {
    console.error('HDUN proxy error:', error)
    return NextResponse.json({ error: 'Failed to load game' }, { status: 500 })
  }
}
