import { NextRequest, NextResponse } from 'next/server'

// In-memory cache for GameMonetize games
let cachedGames: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

// Fetch games from GameMonetize JSON feed
// This endpoint returns cached games and instructs the client to fetch fresh data
export async function GET(request: NextRequest) {
  try {
    const now = Date.now()
    
    // Return cached data if available and fresh
    if (cachedGames && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log(`[gamemonetize] Returning ${cachedGames.length} cached games`)
      return NextResponse.json({
        success: true,
        count: cachedGames.length,
        games: cachedGames,
        cached: true,
        cacheAge: Math.floor((now - cacheTimestamp) / 1000),
        timestamp: new Date(cacheTimestamp).toISOString()
      })
    }
    
    // Tell client to fetch directly (CORS should work from browser)
    // But also try to fetch server-side for caching
    const FEED_URL = 'https://gamemonetize.com/feed.php?format=json'
    
    console.log('[gamemonetize] Fetching fresh games from feed...')
    
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      
      const response = await fetch(FEED_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeout)
      
      if (response.ok) {
        const text = await response.text()
        const data = JSON.parse(text)
        
        if (Array.isArray(data) && data.length > 0) {
          // Process and cache games
          const games = data.map((game: any) => {
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
              id: game.id,
              title: game.title,
              description,
              category,
              thumbnail: game.thumb,
              playUrl: game.url,
              width: game.width || 800,
              height: game.height || 600,
              tags: game.tags ? game.tags.split(',').map((t: string) => t.trim()) : [],
              source: 'gamemonetize'
            }
          })
          
          cachedGames = games
          cacheTimestamp = now
          
          console.log(`[gamemonetize] Successfully fetched and cached ${games.length} games`)
          
          return NextResponse.json({
            success: true,
            count: games.length,
            games,
            cached: false,
            timestamp: new Date().toISOString()
          })
        }
      }
    } catch (fetchError) {
      console.log('[gamemonetize] Server-side fetch failed:', fetchError instanceof Error ? fetchError.message : 'Unknown error')
    }
    
    // If server-side fetch failed but we have old cache, return it
    if (cachedGames && cachedGames.length > 0) {
      console.log(`[gamemonetize] Returning stale cache (${cachedGames.length} games)`)
      return NextResponse.json({
        success: true,
        count: cachedGames.length,
        games: cachedGames,
        cached: true,
        stale: true,
        cacheAge: Math.floor((now - cacheTimestamp) / 1000),
        timestamp: new Date(cacheTimestamp).toISOString()
      })
    }
    
    // No cache and fetch failed - return instructions for client-side fetch
    return NextResponse.json({
      success: false,
      error: 'Server-side fetch unavailable',
      message: 'Please fetch directly from client',
      feedUrl: FEED_URL
    }, { status: 503 })
    
  } catch (error) {
    console.error('[gamemonetize] Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch GameMonetize feed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}