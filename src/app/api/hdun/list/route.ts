import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  try {
    const res = await fetch('https://www.hdun.org/games/alotofgames/', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html,application/xhtml+xml',
      },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json({ ids: [] })
    const html = await res.text()
    const ids = Array.from(html.matchAll(/\/games\/alotofgames\/([a-z0-9-]+)/gi)).map(m => m[1])
    return NextResponse.json({ ids: Array.from(new Set(ids)) })
  } catch (e) {
    return NextResponse.json({ ids: [] })
  }
}


