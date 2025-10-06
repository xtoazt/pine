import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// In-memory cache
let cachedGames: any[] | null = null

// Load PlayGama games from JSON file
function loadPlayGamaGames() {
  if (cachedGames) {
    return cachedGames
  }

  try {
    const filePath = join(process.cwd(), 'playgama-games.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // Extract games from the segments
    const games: any[] = []
    
    if (data.segments && Array.isArray(data.segments)) {
      for (const segment of data.segments) {
        if (segment.hits && Array.isArray(segment.hits)) {
          for (const game of segment.hits) {
            games.push({
              id: game.id,
              slug: game.slug,
              title: game.title,
              description: game.description || '',
              howToPlay: game.howToPlayText || '',
              gameURL: game.gameURL,
              playgamaUrl: game.playgamaGameUrl,
              thumbnail: game.thumbnail || game.image || '',
              genres: game.genres || [],
              tags: game.tags || [],
              platforms: game.platforms || [],
              orientation: game.orientation || 'any',
              source: 'playgama'
            })
          }
        }
      }
    }
    
    cachedGames = games
    console.log(`[playgama] Loaded ${games.length} games from JSON file`)
    return games
  } catch (error) {
    console.error('[playgama] Error loading games:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const games = loadPlayGamaGames()
    
    return NextResponse.json({
      success: true,
      count: games.length,
      games
    })
  } catch (error) {
    console.error('[playgama] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load PlayGama games',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
