import { NextRequest, NextResponse } from 'next/server'

const CANDIDATE_URLS = [
  'https://raw.githubusercontent.com/Radon-Games/Radon-Games/main/src/data/games.json',
  'https://raw.githubusercontent.com/Radon-Games/Radon-Games/main/src/data/allGames.json',
  'https://raw.githubusercontent.com/Radon-Games/Radon-Games/main/public/games.json'
]

export async function GET(_req: NextRequest) {
  for (const url of CANDIDATE_URLS) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) continue
      const json = await res.json()

      // Recursively traverse and extract objects that look like games
      const collected: any[] = []
      const seen = new Set<any>()
      const looksLikeGame = (o: any): boolean => {
        if (!o || typeof o !== 'object') return false
        const keys = Object.keys(o)
        const titleKeys = ['title', 'name', 'game', 'label']
        const urlKeys = ['url', 'playUrl', 'link', 'src', 'href', 'gameUrl', 'embedUrl']
        const hasTitle = keys.some(k => titleKeys.includes(k))
        const hasUrlish = keys.some(k => urlKeys.includes(k))
        return hasTitle || hasUrlish
      }
      const walk = (node: any) => {
        if (!node) return
        if (Array.isArray(node)) {
          for (const item of node) walk(item)
          return
        }
        if (typeof node === 'object') {
          if (looksLikeGame(node)) {
            if (!seen.has(node)) {
              seen.add(node)
              collected.push(node)
            }
          }
          for (const v of Object.values(node)) walk(v)
        }
      }
      walk(json)
      return NextResponse.json({ source: url, games: collected })
    } catch {
      // try next
    }
  }
  return NextResponse.json({ error: 'Unable to load Radon games list' }, { status: 502 })
}


