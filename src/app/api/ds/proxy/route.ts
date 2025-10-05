import { NextRequest, NextResponse } from 'next/server'

function isHtml(ct: string | null): boolean {
  return !!ct && /text\/html/i.test(ct)
}

function isCss(ct: string | null): boolean {
  return !!ct && /text\/css/i.test(ct)
}

function absoluteBase(target: URL): string {
  // Ensure trailing slash
  const s = target.origin + target.pathname
  return s.endsWith('/') ? s : s + '/'
}

function rewriteHtml(baseHref: string, html: string): string {
  let out = html
  if (!/\<base\s+/i.test(out)) {
    out = out.replace(/<head(\s[^>]*)?>/i, (m) => `${m}\n<base href="${baseHref}">`)
  }
  out = out.replace(/(src|href)="(.*?)"/gi, (_m, attr, url) => {
    if (!url || /^https?:\/\//i.test(url) || /^data:/i.test(url)) return _m
    const rel = url.startsWith('/') ? url.slice(1) : url
    const proxied = `/api/ds/proxy?url=${encodeURIComponent(baseHref + rel)}`
    return `${attr}="${proxied}"`
  })
  return out
}

function rewriteCss(baseHref: string, css: string): string {
  return css.replace(/url\(([^)]+)\)/gi, (m, raw) => {
    let url = String(raw).trim().replace(/^['"]|['"]$/g, '')
    if (!url || /^https?:\/\//i.test(url) || /^data:/i.test(url)) return m
    const rel = url.startsWith('/') ? url.slice(1) : url
    const proxied = `/api/ds/proxy?url=${encodeURIComponent(baseHref + rel)}`
    return `url(${proxied})`
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawUrl = searchParams.get('url')
    const ping = searchParams.get('ping') === '1'
    const embed = searchParams.get('embed') === '1'
    const zoom = Math.max(0.5, Math.min(2, Number(searchParams.get('zoom') || '1')))
    if (!rawUrl) {
      return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
    }

    let target: URL
    try {
      target = new URL(rawUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
    }

    const buildCodetabsUrl = (u: URL) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u.toString())}`

    const fetchWithFallback = async (u: URL): Promise<Response> => {
      try {
        const primary = await fetch(u.toString(), {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': u.origin,
            'Origin': u.origin,
          },
          redirect: 'follow',
        })
        if (primary.ok) return primary
      } catch {
        // fall through to codetabs
      }
      // Try Codetabs public proxy as a fallback for CORS/restrictions
      try {
        const fallback = await fetch(buildCodetabsUrl(u), { redirect: 'follow' })
        return fallback
      } catch {
        // Surface a generic failure; caller will handle
        return new Response(null, { status: 502 })
      }
    }

    const res = await fetchWithFallback(target)

    if (ping) {
      return new NextResponse(null, { status: res.ok ? 204 : 404 })
    }

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: res.status })
    }

    const ct = res.headers.get('content-type') || ''
    const base = absoluteBase(target)

    if (!isHtml(ct)) {
      const ab = await res.arrayBuffer()
      if (isCss(ct)) {
        const text = Buffer.from(ab).toString('utf-8')
        const rewritten = rewriteCss(base, text)
        return new NextResponse(rewritten, {
          headers: {
            'Content-Type': 'text/css; charset=utf-8',
            'Cache-Control': 'public, max-age=300',
          }
        })
      }
      return new NextResponse(Buffer.from(ab), {
        headers: {
          'Content-Type': ct || 'application/octet-stream',
          'Cache-Control': 'public, max-age=300',
        }
      })
    }

    let html = await res.text()
    if (embed) {
      // Try to extract first iframe src and render a clean wrapper focusing only on the game
      const m = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i)
      if (m && m[1]) {
        const iframeUrl = new URL(m[1], base)
        const proxied = `/api/ds/proxy?url=${encodeURIComponent(iframeUrl.toString())}`
        const clean = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"/><style>
          :root{--z:${zoom};}
          html,body{margin:0;height:100%;background:#000}
          .wrap{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#000}
          /* Scale around center; fill area precisely */
          iframe{width:calc(100%/var(--z));height:calc(100%/var(--z));border:0;transform:scale(var(--z));transform-origin:center center}
        </style></head><body><div class="wrap"><iframe src="${proxied}" allowfullscreen allow="autoplay; fullscreen; gamepad; xr-spatial-tracking; clipboard-read; clipboard-write"></iframe></div></body></html>`
        return new NextResponse(clean, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=120' } })
      }
    }
    if (html.trim().length < 64) {
      // Attempt fetching index.html if we landed on a directory
      const alt = new URL('index.html', base)
      const r2 = await fetchWithFallback(alt)
      if (r2.ok && isHtml(r2.headers.get('content-type'))) {
        html = await r2.text()
      }
    }

    const rewritten = rewriteHtml(base, html)
    return new NextResponse(rewritten, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=120',
        'X-Frame-Options': 'SAMEORIGIN',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
      }
    })
  } catch (e) {
    console.error('DS proxy error', e)
    return NextResponse.json({ error: 'Proxy failure' }, { status: 500 })
  }
}


