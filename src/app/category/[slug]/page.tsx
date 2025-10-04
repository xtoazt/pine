"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { GameGrid } from '@/components/game/game-grid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Game, GameCategory } from '@/types/game'
import { Search, Filter, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [games, setGames] = useState<Game[]>([])
  const [category, setCategory] = useState<GameCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch category info
        const categoriesRes = await fetch('/api/categories')
        const categories = await categoriesRes.json()
        const currentCategory = categories.find((cat: GameCategory) => cat.slug === slug)
        setCategory(currentCategory)
        
        // Fetch games for this category
        const gamesRes = await fetch(`/api/games?category=${slug}&all=true`)
        const gamesData = await gamesRes.json()
        setGames(gamesData.games)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug])

  const filteredGames = games.filter(game => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      game.title.toLowerCase().includes(query) ||
      game.description?.toLowerCase().includes(query) ||
      game.tags.some(tag => tag.toLowerCase().includes(query))
    )
  })

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.playCount - a.playCount
      case 'rating':
        const ratingA = a.upvotes + a.downvotes > 0 ? a.upvotes / (a.upvotes + a.downvotes) : 0
        const ratingB = b.upvotes + b.downvotes > 0 ? b.upvotes / (b.upvotes + b.downvotes) : 0
        return ratingB - ratingA
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  if (!category) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{category.name}</h1>
          </div>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
          <Badge variant="secondary">
            {category.gameCount} games
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {sortedGames.length} game{sortedGames.length !== 1 ? 's' : ''} found
          </h2>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          )}
        </div>
        
        <GameGrid games={sortedGames} loading={loading} />
      </div>
    </div>
  )
}
