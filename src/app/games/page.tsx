"use client"

import { useEffect, useRef, useState } from 'react'
import { GameGrid } from '@/components/game/game-grid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Game } from '@/types/game'
import { Search, Filter, Gamepad2 } from 'lucide-react'
import { buildUserSignalsHeaders } from '@/lib/user-signals'

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [offset, setOffset] = useState(0)
  const [totalGames, setTotalGames] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoadingExternal, setIsLoadingExternal] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const PAGE_SIZE = 500

  const fetchPage = async (reset: boolean) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setIsLoadingMore(true)
      }
      const nextOffset = reset ? 0 : offset
      
      // Check for source filter using URL params
      const urlParams = new URLSearchParams(window.location.search)
      const sourceFilter = urlParams.get('source') || ''
      const sourceParam = sourceFilter ? `&source=${sourceFilter}` : ''
      
      // INSTANT LOAD: Show static games first (< 500ms)
      const staticResponse = await fetch(`/api/games?limit=${PAGE_SIZE}&offset=${nextOffset}&external=false${sourceParam}`, { 
        headers: buildUserSignalsHeaders(),
        cache: 'force-cache'
      })
      const staticData = await staticResponse.json()
      const staticGames: Game[] = Array.isArray(staticData.games) ? staticData.games : []
      
      // Show static games immediately
      setGames(staticGames)
      setLoading(false)
      setIsLoadingMore(false)
      
      // BACKGROUND: Stream external games in without blocking
      setIsLoadingExternal(true)
      fetch(`/api/games?limit=${PAGE_SIZE}&offset=${nextOffset}${sourceParam}`, { 
        headers: buildUserSignalsHeaders()
      })
        .then(r => r.json())
        .then(data => {
          const allGames: Game[] = Array.isArray(data.games) ? data.games : []
          if (allGames.length > staticGames.length) {
            setGames(allGames)
            setTotalGames(data.total || 0)
            setHasMore(Boolean(data.hasMore))
          }
          setIsLoadingExternal(false)
        })
        .catch(err => {
          console.error('Background external fetch error:', err)
          setIsLoadingExternal(false)
        })
      
      setTotalGames(staticData.total || 0)
      setHasMore(Boolean(staticData.hasMore))
      setOffset(nextOffset + PAGE_SIZE)
    } catch (e) {
      console.error('Error fetching games:', e)
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
    }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, isLoadingMore, loading, offset])

  const filteredGames = games.filter(game => {
    let query = searchQuery.toLowerCase()
    let sourceFilter = ''
    
    // Check if search starts with @ for source filtering
    if (query.startsWith('@')) {
      const parts = query.split(' ')
      sourceFilter = parts[0].substring(1) // Remove @
      query = parts.slice(1).join(' ') // Rest of the search
      
      // Check if game matches the source
      const gameSource = (game.source || '').toLowerCase()
      const matchesSource = 
        gameSource === sourceFilter ||
        gameSource.includes(sourceFilter) ||
        sourceFilter.includes(gameSource)
      
      if (!matchesSource) return false
    }
    
    // If no search query (only source filter or empty search), show all from that source
    if (!query) return true
    
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
              Discover our complete collection of 20,000+ games from 8 different sources. 
              From classic arcade to modern adventures, find your next favorite game.
            </p>
            <div className="flex flex-col items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Loaded {games.length.toLocaleString()} games • {hasMore ? 'Scroll to load more' : 'All games loaded'}
              </Badge>
              {isLoadingExternal && (
                <Badge variant="outline" className="text-xs animate-pulse">
                  Loading more games from external sources...
                </Badge>
              )}
            </div>
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
                placeholder="Search games... (Try @s16 or @gamesnacks)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery.startsWith('@') && (
                <Badge variant="secondary" className="ml-2">
                  Source: {searchQuery.split(' ')[0].substring(1)}
                </Badge>
              )}
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
        
        {/* Navigation buttons */}
        {!loading && (
          <div className="flex justify-center items-center gap-4 py-8">
            <Button 
              onClick={() => {
                setOffset(Math.max(0, offset - PAGE_SIZE * 2))
                fetchPage(true)
              }} 
              disabled={offset === 0 || isLoadingMore} 
              variant="outline"
            >
              ← Previous Batch
            </Button>
            <span className="text-sm text-muted-foreground">
              Batch {Math.floor(offset / PAGE_SIZE)} of {Math.ceil(totalGames / PAGE_SIZE)}
            </span>
            <Button 
              onClick={() => fetchPage(false)} 
              disabled={!hasMore || isLoadingMore} 
              variant="outline"
            >
              {isLoadingMore ? 'Loading…' : 'Next Batch →'}
            </Button>
          </div>
        )}
        
        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-4" />
      </div>
    </div>
  )
}
