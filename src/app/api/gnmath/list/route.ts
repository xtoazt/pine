import { NextRequest, NextResponse } from 'next/server'

const GH_API = 'https://api.github.com/repos/gn-math/html/contents'
const JSDELIVR_STATS = 'https://data.jsdelivr.com/v1/stats/packages/gh/gn-math/html@main/files?period=year'

export async function GET(_req: NextRequest) {
  try {
    // Try GitHub API directory listing first
    try {
      const res = await fetch(GH_API, { cache: 'no-store', headers: { 'User-Agent': 'pine' } })
      if (res.ok) {
        const json = await res.json()
        const ids = (Array.isArray(json) ? json : [])
          .filter((e: any) => e && e.type === 'file' && /\.html$/i.test(e.name))
          .map((e: any) => e.name.replace(/\.html$/i, ''))
        if (ids.length > 0) {
          return NextResponse.json({ source: 'github', ids })
        }
      }
    } catch {}

    // Fallback to jsDelivr stats API
    try {
      const res = await fetch(JSDELIVR_STATS, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        const files = Array.isArray(json?.files) ? json.files : []
        const ids = files
          .map((f: any) => (typeof f.name === 'string' ? f.name : ''))
          .filter((n: string) => n.endsWith('.html'))
          .map((n: string) => n.replace(/\.html$/i, ''))
        if (ids.length > 0) {
          return NextResponse.json({ source: 'jsdelivr', ids: Array.from(new Set(ids)) })
        }
      }
    } catch {}

    return NextResponse.json({ source: 'none', ids: [] })
  } catch {
    return NextResponse.json({ source: 'error', ids: [] }, { status: 500 })
  }
}


