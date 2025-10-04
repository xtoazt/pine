import { NextRequest, NextResponse } from 'next/server'

// Very lightweight scraper using public sitemap endpoints if available, otherwise a heuristic list
const CANDIDATES = [
  'https://gamesnacks.com/sitemap.xml',
  'https://www.gamesnacks.com/sitemap.xml'
]

export async function GET(_req: NextRequest) {
  try {
    for (const url of CANDIDATES) {
      try {
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) continue
        const xml = await res.text()
        const ids = Array.from(xml.matchAll(/https?:\/\/[^\s<]+\/games\/([a-zA-Z0-9-_]+)/g)).map(m => m[1])
        if (ids.length > 0) {
          return NextResponse.json({ source: url, ids: Array.from(new Set(ids)) })
        }
      } catch {}
    }
    // Fallback small seed list if sitemap unavailable
    const seed = [
      'stack-bounce','snake','jumping-jack','space-purge','color-pinch','ice-hockey','speed-racer','galactic-war','break-bricks','minigolf-3d'
    ]
    return NextResponse.json({ source: 'seed', ids: seed })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch GameSnacks list' }, { status: 500 })
  }
}


