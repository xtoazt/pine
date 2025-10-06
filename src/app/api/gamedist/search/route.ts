import { NextRequest, NextResponse } from 'next/server'

// GameDistribution API integration - provides access to 20,000+ games
// Enhanced with caching, parallel processing, and optimized image checking

const API_GRAPHQL = 'https://api.gamedistribution.com/graphql'
const LINK_BASE = 'https://gamedistribution.com/games/'
const LINK_SUFFIX = ''
const IMAGE_BASE = 'https://img.gamedistribution.com/'

interface GameDistGame {
  objectID: string
  type?: string
  title: string
  description?: string
  instruction?: string
  tags?: string[]
  categories?: string[]
  company?: string
  mobile?: string[]
  keyFeatures?: string[]
  slugs?: { name: string; active: boolean }[]
  publishedAt?: string
  lastPublishedAt?: string
  languages?: string[]
}

interface ProcessedGame {
  id: string
  title: string
  description?: string
  link: string
  img?: string
  tags?: string[]
  categories?: string[]
  company?: string
  mobile?: string[]
  [key: string]: any
}

// In-memory cache with TTL
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 6 * 60 * 1000 // 6 minutes
const MAX_CACHE_SIZE = 1000

function cleanupCache() {
  if (cache.size <= MAX_CACHE_SIZE) return
  
  const entries = Array.from(cache.entries())
  entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
  
  const toDelete = entries.slice(0, Math.floor(MAX_CACHE_SIZE * 0.2))
  for (const [key] of toDelete) {
    cache.delete(key)
  }
}

async function checkImageStatus(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // Reduced to 2s for speed
    
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    return res.ok ? url : null
  } catch {
    return null
  }
}

async function processGameResult(result: GameDistGame): Promise<ProcessedGame> {
  const id = result.objectID
  const link = `${LINK_BASE}${id}${LINK_SUFFIX}`
  
  // Try multiple image formats in parallel for speed
  const possibleImageUrls = [
    `${IMAGE_BASE}${id}-512x512.jpg`,
    `${IMAGE_BASE}${id}-512x512.jpeg`,
    `${IMAGE_BASE}${id}-512x384.jpg`,
    `${IMAGE_BASE}${id}-512x384.jpeg`,
  ]
  
  // Check all images in parallel, take first successful one
  const imageResults = await Promise.allSettled(
    possibleImageUrls.map(url => checkImageStatus(url))
  )
  
  let imageUrl: string | undefined
  for (const result of imageResults) {
    if (result.status === 'fulfilled' && result.value) {
      imageUrl = result.value
      break
    }
  }
  
  const { objectID: _, ...rest } = result
  
  return {
    id,
    ...rest,
    link,
    ...(imageUrl && { img: imageUrl }),
    mobile: result.mobile?.map(m => 
      m === 'ForIOS' ? 'IOS' : m === 'ForAndroid' ? 'Android' : m
    ),
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const searchTerm = searchParams.get('q') || ''
  let quantity = parseInt(searchParams.get('quantity') || '1000')
  const sortByTitle = searchParams.has('sortByTitle')
  
  // Limit to reasonable size for performance
  if (quantity > 1000) quantity = 1000
  
  const cacheKey = `${searchTerm}-${quantity}-${sortByTitle}`
  
  // Check cache first
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('[gamedist] Cache hit:', cacheKey)
      return NextResponse.json(cached.data)
    }
    cache.delete(cacheKey)
  }
  
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  
  try {
    const query = `
      query SearchGames($search: String!, $hits: Int!) {
        gamesSearched(input: { search: $search, hitsPerPage: $hits }) {
          hits {
            objectID
            type
            title
            description
            instruction
            tags
            categories
            company
            mobile
            keyFeatures
            slugs { name active }
            publishedAt
            lastPublishedAt
            languages
          }
        }
      }
    `
    
    const resp = await fetch(API_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://gamedistribution.com',
        'Referer': 'https://gamedistribution.com/',
      },
      body: JSON.stringify({
        query,
        variables: {
          search: searchTerm,
          hits: quantity,
        },
      }),
      signal: controller.signal,
    })
    
    if (!resp.ok) {
      const errText = await resp.text()
      console.error(`[gamedist] GraphQL error ${resp.status}: ${errText}`)
      return NextResponse.json(
        { error: `Fetch failed: ${errText}` },
        { status: resp.status }
      )
    }
    
    const data = await resp.json()
    
    if (data.errors) {
      console.error('[gamedist] GraphQL errors:', data.errors)
      return NextResponse.json(
        { error: 'GraphQL errors', details: data.errors },
        { status: 500 }
      )
    }
    
    const hits: GameDistGame[] = data?.data?.gamesSearched?.hits ?? []
    
    if (hits.length === 0) {
      return NextResponse.json(
        { error: 'No games found' },
        { status: 404 }
      )
    }
    
    // Process all games in parallel for speed
    const results = await Promise.all(
      hits.map(game => processGameResult(game))
    )
    
    if (sortByTitle) {
      results.sort((a, b) => a.title.localeCompare(b.title))
    }
    
    // Store in cache
    cleanupCache()
    cache.set(cacheKey, {
      data: results,
      timestamp: Date.now(),
    })
    
    console.log(`[gamedist] Fetched ${results.length} games for "${searchTerm}"`)
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('[gamedist] Error:', error)
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    clearTimeout(timeout)
  }
}
