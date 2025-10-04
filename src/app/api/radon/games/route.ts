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
      return NextResponse.json({ source: url, games: json })
    } catch {
      // try next
    }
  }
  return NextResponse.json({ error: 'Unable to load Radon games list' }, { status: 502 })
}


