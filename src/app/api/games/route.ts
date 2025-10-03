import { NextRequest, NextResponse } from 'next/server'
import { Game, GameSearchParams, GameApiResponse } from '@/types/game'

// Real games from fortnite-game.github.io repository
const mockGames: Game[] = [
  {
    id: "class-357",
    title: "Traffic Escape",
    description: "Navigate through busy traffic in this exciting escape game. Avoid collisions and reach your destination safely.",
    thumbnail: "https://fortnite-game.github.io/img/class-357.png",
    category: "racing",
    tags: ["traffic", "escape", "driving", "arcade"],
    playUrl: "/play/class-357",
    upvotes: 2150,
    downvotes: 89,
    playCount: 25600,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "class-437",
    title: "Slope 2",
    description: "The sequel to the popular Slope game. Roll down the endless slope and avoid obstacles in this fast-paced arcade game.",
    thumbnail: "https://fortnite-game.github.io/img/class-437.png",
    category: "arcade",
    tags: ["slope", "endless", "runner", "arcade"],
    playUrl: "/play/class-437",
    upvotes: 3420,
    downvotes: 156,
    playCount: 45600,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14")
  },
  {
    id: "class-468",
    title: "Multiplayer Battle Arena",
    description: "Engage in epic multiplayer battles with players from around the world. Strategy and skill are key to victory.",
    thumbnail: "https://fortnite-game.github.io/img/class-468.png",
    category: "multiplayer",
    tags: ["multiplayer", "battle", "strategy", "online"],
    playUrl: "/play/class-468",
    upvotes: 1890,
    downvotes: 78,
    playCount: 32100,
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13")
  },
  {
    id: "class-435",
    title: "Puzzle Challenge",
    description: "Test your problem-solving skills with this engaging puzzle game. Multiple levels of increasing difficulty.",
    thumbnail: "https://fortnite-game.github.io/img/class-435.png",
    category: "puzzle",
    tags: ["puzzle", "brain", "challenge", "logic"],
    playUrl: "/play/class-435",
    upvotes: 1234,
    downvotes: 45,
    playCount: 18700,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12")
  },
  {
    id: "class-560",
    title: "Space Defender",
    description: "Defend Earth from alien invaders in this classic space shooter. Upgrade your ship and survive the waves.",
    thumbnail: "https://fortnite-game.github.io/img/class-560.png",
    category: "shooting",
    tags: ["space", "shooter", "defense", "arcade"],
    playUrl: "/play/class-560",
    upvotes: 1678,
    downvotes: 67,
    playCount: 22300,
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11")
  },
  {
    id: "class-527",
    title: "Platform Adventure",
    description: "Jump and run through challenging levels in this classic platformer. Collect coins and avoid enemies.",
    thumbnail: "https://fortnite-game.github.io/img/class-527.png",
    category: "platform",
    tags: ["platform", "adventure", "jump", "classic"],
    playUrl: "/play/class-527",
    upvotes: 1456,
    downvotes: 34,
    playCount: 19800,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    id: "class-782",
    title: "Stickman Fighter",
    description: "Epic stickman fighting game with amazing graphics and smooth gameplay. Choose your fighter and battle!",
    thumbnail: "https://fortnite-game.github.io/img/class-782.png",
    category: "fighting",
    tags: ["stickman", "fighting", "action", "combat"],
    playUrl: "/play/class-782",
    upvotes: 2134,
    downvotes: 89,
    playCount: 28700,
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09")
  },
  {
    id: "class-546",
    title: "Racing Championship",
    description: "High-speed racing game with multiple tracks and cars to choose from. Compete for the championship!",
    thumbnail: "https://fortnite-game.github.io/img/class-546.png",
    category: "racing",
    tags: ["racing", "cars", "speed", "championship"],
    playUrl: "/play/class-546",
    upvotes: 1789,
    downvotes: 56,
    playCount: 23400,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08")
  },
  {
    id: "class-407",
    title: "Arcade Classic",
    description: "A collection of classic arcade games. Relive the golden age of gaming with these timeless classics.",
    thumbnail: "https://fortnite-game.github.io/img/class-407.png",
    category: "arcade",
    tags: ["classic", "arcade", "retro", "collection"],
    playUrl: "/play/class-407",
    upvotes: 1234,
    downvotes: 23,
    playCount: 15600,
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-01-07")
  },
  {
    id: "class-512",
    title: "Adventure Quest",
    description: "Embark on an epic adventure in this RPG-style game. Explore dungeons, fight monsters, and find treasure.",
    thumbnail: "https://fortnite-game.github.io/img/class-512.png",
    category: "adventure",
    tags: ["adventure", "rpg", "quest", "exploration"],
    playUrl: "/play/class-512",
    upvotes: 1987,
    downvotes: 78,
    playCount: 26700,
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06")
  },
  {
    id: "class-597",
    title: "Sports Championship",
    description: "Compete in various sports in this comprehensive sports game. Football, basketball, and more!",
    thumbnail: "https://fortnite-game.github.io/img/class-597.png",
    category: "sports",
    tags: ["sports", "football", "basketball", "championship"],
    playUrl: "/play/class-597",
    upvotes: 1456,
    downvotes: 45,
    playCount: 19800,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  },
  {
    id: "class-633",
    title: "Strategy Master",
    description: "Build your empire and conquer territories in this strategic game. Plan your moves carefully to achieve victory.",
    thumbnail: "https://fortnite-game.github.io/img/class-633.png",
    category: "strategy",
    tags: ["strategy", "empire", "conquest", "planning"],
    playUrl: "/play/class-633",
    upvotes: 1678,
    downvotes: 67,
    playCount: 22300,
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04")
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
