import { NextRequest, NextResponse } from 'next/server'

// GameDistribution API - fetch single game by ID

const API_GRAPHQL = 'https://api.gamedistribution.com/graphql'
const LINK_BASE = 'https://gamedistribution.com/games/'
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

async function checkImageStatus(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)
    
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

async function processGameResult(result: GameDistGame) {
  const id = result.objectID
  const link = `${LINK_BASE}${id}`
  
  const possibleImageUrls = [
    `${IMAGE_BASE}${id}-512x512.jpg`,
    `${IMAGE_BASE}${id}-512x512.jpeg`,
    `${IMAGE_BASE}${id}-512x384.jpg`,
    `${IMAGE_BASE}${id}-512x384.jpeg`,
  ]
  
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = params.id
  
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  
  try {
    const query = `
      query SearchGameById($search: String!) {
        gamesSearched(input: { search: $search, hitsPerPage: 1 }) {
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
          search: gameId,
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
    
    const found = data?.data?.gamesSearched?.hits?.find(
      (g: GameDistGame) => g.objectID === gameId
    )
    
    if (!found) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }
    
    const gameResult = await processGameResult(found)
    
    return NextResponse.json([gameResult])
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
