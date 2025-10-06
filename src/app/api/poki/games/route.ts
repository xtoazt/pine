import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Game } from '@/types/game'

const POKI_GAMES_FILE = path.join(process.cwd(), 'poki-games.json')
let cachedPokiGames: Game[] | null = null

async function loadPokiGames(): Promise<Game[]> {
  if (cachedPokiGames) {
    return cachedPokiGames
  }

  try {
    const fileContents = await fs.readFile(POKI_GAMES_FILE, 'utf8')
    const data = JSON.parse(fileContents)

    if (!data || !Array.isArray(data.games)) {
      console.error('[poki-api] Invalid JSON structure in poki-games.json')
      return []
    }

    const pokiGames = data.games

    const games: Game[] = pokiGames.map((g: any) => {
      // Map Poki categories to our categories
      const categoryMap: Record<string, string> = {
        'action': 'action',
        'adventure': 'adventure',
        'puzzle': 'puzzle',
        'racing': 'racing',
        'sports': 'sports',
        'strategy': 'strategy',
        'simulation': 'simulation',
        'arcade': 'arcade',
        'girls': 'girls',
        'boys': 'action',
        'multiplayer': 'multiplayer',
        '2-player': '2-player',
        'io': 'multiplayer',
        'car': 'racing',
        'shooting': 'shooting',
        'platform': 'platform',
        'skill': 'skill'
      }

      // Default category
      let category = 'arcade'

      // Try to infer category from slug or title
      const slug = g.slug || ''
      const title = g.title || ''
      const combined = (slug + ' ' + title).toLowerCase()

      for (const [key, value] of Object.entries(categoryMap)) {
        if (combined.includes(key)) {
          category = value
          break
        }
      }

      // Build thumbnail URL
      const thumbnail = g.image?.path 
        ? `https://img.poki.com/${g.image.path}`
        : '/images/logo.png'

      // Build play URL
      const playUrl = `https://poki.com${g.url}`

      return {
        id: `poki-${g.id}`,
        title: g.title,
        description: `Play ${g.title} by ${g.developer || 'Poki'} - ${g.mobile ? 'Available on mobile and desktop' : 'Desktop only'}`,
        thumbnail,
        category,
        tags: [g.developer, g.mobile ? 'mobile' : 'desktop'].filter(Boolean),
        playUrl,
        upvotes: 0,
        downvotes: 0,
        playCount: 0,
        source: 'poki',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      }
    })

    cachedPokiGames = games
    console.log(`[poki-api] Loaded ${games.length} Poki games`)
    return games
  } catch (error) {
    console.error('[poki-api] Error loading Poki games:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const games = await loadPokiGames()
    return NextResponse.json({
      success: true,
      count: games.length,
      games: games,
    })
  } catch (error) {
    console.error('[poki-api] API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Poki games' },
      { status: 500 }
    )
  }
}
