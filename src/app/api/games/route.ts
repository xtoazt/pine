import { NextRequest, NextResponse } from 'next/server'
import { Game, GameSearchParams, GameApiResponse } from '@/types/game'

// Mock data - in a real app, this would come from a database
const mockGames: Game[] = [
  {
    id: "class-782",
    title: "Stickman Fighter",
    description: "Epic stickman fighting game with amazing graphics and smooth gameplay.",
    thumbnail: "https://top-vaz-online.github.io/img/class-782.png",
    category: "fighting",
    tags: ["stickman", "fighting", "action"],
    playUrl: "/play/class-782",
    upvotes: 1250,
    downvotes: 45,
    playCount: 15600,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "class-546",
    title: "Racing Adventure",
    description: "High-speed racing game with multiple tracks and cars to choose from.",
    thumbnail: "https://top-vaz-online.github.io/img/class-546.png",
    category: "racing",
    tags: ["racing", "cars", "speed"],
    playUrl: "/play/class-546",
    upvotes: 980,
    downvotes: 23,
    playCount: 12300,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14")
  },
  {
    id: "class-435",
    title: "Puzzle Master",
    description: "Challenge your mind with this engaging puzzle game.",
    thumbnail: "https://top-vaz-online.github.io/img/class-435.png",
    category: "puzzle",
    tags: ["puzzle", "brain", "challenge"],
    playUrl: "/play/class-435",
    upvotes: 756,
    downvotes: 12,
    playCount: 8900,
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13")
  },
  {
    id: "class-560",
    title: "Space Shooter",
    description: "Defend Earth from alien invaders in this classic space shooter.",
    thumbnail: "https://top-vaz-online.github.io/img/class-560.png",
    category: "shooting",
    tags: ["space", "shooting", "arcade"],
    playUrl: "/play/class-560",
    upvotes: 1100,
    downvotes: 34,
    playCount: 14200,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12")
  },
  {
    id: "class-527",
    title: "Platform Adventure",
    description: "Jump and run through challenging levels in this platformer.",
    thumbnail: "https://top-vaz-online.github.io/img/class-527.png",
    category: "platform",
    tags: ["platform", "adventure", "jump"],
    playUrl: "/play/class-527",
    upvotes: 890,
    downvotes: 18,
    playCount: 10500,
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11")
  },
  {
    id: "class-468",
    title: "Multiplayer Battle",
    description: "Fight against other players in this exciting multiplayer game.",
    thumbnail: "https://top-vaz-online.github.io/img/class-468.png",
    category: "multiplayer",
    tags: ["multiplayer", "battle", "online"],
    playUrl: "/play/class-468",
    upvotes: 1450,
    downvotes: 67,
    playCount: 18900,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params: GameSearchParams = {
      query: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'newest',
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0')
    }

    let filteredGames = [...mockGames]

    // Filter by search query
    if (params.query) {
      const query = params.query.toLowerCase()
      filteredGames = filteredGames.filter(game => 
        game.title.toLowerCase().includes(query) ||
        game.description?.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (params.category) {
      filteredGames = filteredGames.filter(game => 
        game.category === params.category
      )
    }

    // Filter by tags
    if (params.tags && params.tags.length > 0) {
      filteredGames = filteredGames.filter(game =>
        params.tags!.some(tag => game.tags.includes(tag))
      )
    }

    // Sort games
    switch (params.sortBy) {
      case 'popular':
        filteredGames.sort((a, b) => b.playCount - a.playCount)
        break
      case 'rating':
        filteredGames.sort((a, b) => {
          const ratingA = a.upvotes + a.downvotes > 0 ? a.upvotes / (a.upvotes + a.downvotes) : 0
          const ratingB = b.upvotes + b.downvotes > 0 ? b.upvotes / (b.upvotes + b.downvotes) : 0
          return ratingB - ratingA
        })
        break
      case 'newest':
      default:
        filteredGames.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    // Pagination
    const total = filteredGames.length
    const start = params.offset || 0
    const end = start + (params.limit || 20)
    const paginatedGames = filteredGames.slice(start, end)

    const response: GameApiResponse = {
      games: paginatedGames,
      total,
      hasMore: end < total
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
