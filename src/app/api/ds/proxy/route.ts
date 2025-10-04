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
    if (!rawUrl) {
      return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
    }

    let target: URL
    try {
      target = new URL(rawUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
    }

    const res = await fetch(target.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': target.origin,
        'Origin': target.origin,
      },
      redirect: 'follow',
    })

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
    if (html.trim().length < 64) {
      // Attempt fetching index.html if we landed on a directory
      const alt = new URL('index.html', base)
      const r2 = await fetch(alt.toString(), { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': target.origin } })
      if (r2.ok && isHtml(r2.headers.get('content-type'))) {
        html = await r2.text()
      }
    }

    const rewritten = rewriteHtml(base, html)
    return new NextResponse(rewritten, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=120',
      }
    })
  } catch (e) {
    console.error('DS proxy error', e)
    return NextResponse.json({ error: 'Proxy failure' }, { status: 500 })
  }
}


