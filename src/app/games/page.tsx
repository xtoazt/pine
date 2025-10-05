"use client"

import { useEffect, useRef, useState } from 'react'
import { GameGrid } from '@/components/game/game-grid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Game } from '@/types/game'
import { Search, Filter, Gamepad2 } from 'lucide-react'

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [offset, setOffset] = useState(0)
  const [totalGames, setTotalGames] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const PAGE_SIZE = 60

  const fetchPage = async (reset: boolean) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setIsLoadingMore(true)
      }
      const nextOffset = reset ? 0 : offset
      const resp = await fetch(`/api/games?limit=${PAGE_SIZE}&offset=${nextOffset}`)
      const data = await resp.json()
      const newList: Game[] = Array.isArray(data.games) ? data.games : []
      setGames(prev => {
        const base = reset ? [] : prev
        const dedup = new Map<string, Game>()
        for (const g of [...base, ...newList]) dedup.set(g.id, g)
        return Array.from(dedup.values())
      })
      setTotalGames(data.total || 0)
      setHasMore(Boolean(data.hasMore))
      setOffset(nextOffset + PAGE_SIZE)
    } catch (e) {
      console.error('Error fetching games:', e)
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchPage(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loadMoreRef.current) return
    const el = loadMoreRef.current
    const io = new IntersectionObserver(entries => {
      const entry = entries[0]
      if (entry.isIntersecting && hasMore && !isLoadingMore && !loading) {
        fetchPage(false)
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, isLoadingMore, loading])

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
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'most-played':
        return b.playCount - a.playCount
      case 'alphabetical':
        return a.title.localeCompare(b.title)
      default:
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    }
  })

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">All Games</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover our complete collection of {totalGames.toLocaleString()}+ carefully curated games. 
          From classic arcade to modern adventures, find your next favorite game.
        </p>
        <Badge variant="secondary" className="text-sm">
          {totalGames.toLocaleString()} total games • {games.length} loaded
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Search & Filter
          </CardTitle>
          <CardDescription>
            Find the perfect game for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search games by name, description, or tags..."
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
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="most-played">Most Played</option>
              <option value="alphabetical">A-Z</option>
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
        <div ref={loadMoreRef} />
        {!loading && hasMore && (
          <div className="flex justify-center py-4">
            <Button onClick={() => fetchPage(false)} disabled={isLoadingMore} variant="outline">
              {isLoadingMore ? 'Loading…' : 'Load more'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
