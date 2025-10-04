export interface Game {
  id: string
  title: string
  description?: string
  thumbnail: string
  category: string
  tags: string[]
  playUrl: string
  sourceUrl?: string
  source?: string
  rating?: number
  upvotes: number
  downvotes: number
  playCount: number
  createdAt: Date
  updatedAt: Date
}

export interface GameCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  gameCount: number
}

export interface GameSearchParams {
  query?: string
  category?: string
  tags?: string[]
  sortBy?: 'newest' | 'popular' | 'rating' | 'playCount'
  limit?: number
  offset?: number
}

export interface GameApiResponse {
  games: Game[]
  total: number
  hasMore: boolean
}

export interface GameStats {
  totalGames: number
  totalCategories: number
  totalPlays: number
  topCategories: GameCategory[]
}
