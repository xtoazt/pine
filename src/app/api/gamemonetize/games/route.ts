import { NextRequest, NextResponse } from 'next/server'
import { Game } from '@/types/game'

let cachedGameMonetizeGames: Game[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

async function loadGameMonetizeGames(): Promise<Game[]> {
  const now = Date.now()
  
  // Return cached data if still valid
  if (cachedGameMonetizeGames && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedGameMonetizeGames
  }

  try {
    console.log('[gamemonetize-api] Fetching games from GameMonetize...')
    const response = await fetch('https://gamemonetize.com/feed.php', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      console.error('[gamemonetize-api] Failed to fetch:', response.status)
      return cachedGameMonetizeGames || []
    }
    
    const xmlText = await response.text()
    
    // Parse XML to extract games
    const games: any[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1]
      
      const extractTag = (tag: string): string => {
        const tagMatch = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 's').exec(itemXml)
        return tagMatch ? tagMatch[1].trim() : ''
      }
      
      const id = extractTag('id')
      const title = extractTag('title')
      const description = extractTag('description')
      const category = extractTag('category')
      const tags = extractTag('tags')
      const thumb = extractTag('thumb')
      const url = extractTag('url')
      
      if (id && title && url) {
        games.push({ id, title, description, category, tags, thumb, url })
      }
    }
    
    if (games.length === 0) {
      console.error('[gamemonetize-api] No games found in XML')
      return cachedGameMonetizeGames || []
    }
    
    const data = games
    
    const gamesList: Game[] = data.map((game: any) => {
      let category = 'arcade'
      if (game.category) {
        const cats = game.category.split(',').map((c: string) => c.trim().toLowerCase())
        category = cats[0] || 'arcade'
      }
      
      let description = game.description || `Play ${game.title}`
      description = description
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      if (description.length > 200) {
        description = description.substring(0, 197) + '...'
      }
      
      return {
        id: `gamemonetize-${game.id}`,
        title: game.title,
        description,
        thumbnail: game.thumb,
        category,
        tags: game.tags ? game.tags.split(',').map((t: string) => t.trim()) : [],
        playUrl: game.url,
        upvotes: 0,
        downvotes: 0,
        playCount: 0,
        source: 'gamemonetize',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      }
    })
    
    cachedGameMonetizeGames = gamesList
    cacheTimestamp = now
    console.log(`[gamemonetize-api] Loaded ${gamesList.length} GameMonetize games`)
    return gamesList
  } catch (error) {
    console.error('[gamemonetize-api] Error loading games:', error)
    return cachedGameMonetizeGames || []
  }
}

export async function GET(request: NextRequest) {
  try {
    const games = await loadGameMonetizeGames()
    return NextResponse.json({
      success: true,
      count: games.length,
      games: games,
    })
  } catch (error) {
    console.error('[gamemonetize-api] API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GameMonetize games' },
      { status: 500 }
    )
  }
}
