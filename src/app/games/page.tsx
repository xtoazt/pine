"use client"

import { useEffect, useRef, useState, Suspense, lazy, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Game } from '@/types/game'
import { Search, Filter, Gamepad2, Loader2, ListFilter } from 'lucide-react'
import { buildUserSignalsHeaders } from '@/lib/user-signals'

// Lazy load heavy components for better performance
const GameGrid = lazy(() => import('@/components/game/game-grid').then(module => ({ default: module.GameGrid })))

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('alphabetical')
  const [sourceFilters, setSourceFilters] = useState<string[]>([])
  const [loadedCount, setLoadedCount] = useState(0)
  const [totalGames, setTotalGames] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoadingExternal, setIsLoadingExternal] = useState(false)
  const [gamedistMultiplier, setGamedistMultiplier] = useState(1)
  const [isExpandingGamedist, setIsExpandingGamedist] = useState(false)
  const [gamemonetizeGames, setGamemonetizeGames] = useState<Game[]>([])
  const [gamemonetizeLoaded, setGamemonetizeLoaded] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const LOAD_SIZE = 400 // Larger page size to reach 20,000 faster while scrolling
  const [page, setPage] = useState(1)

  // Fetch GameMonetize games directly from client (real-time)
  useEffect(() => {
    if (gamemonetizeLoaded) return
    
    const fetchGameMonetize = async () => {
      try {
        console.log('[client] Fetching GameMonetize games...')
        const response = await fetch('https://gamemonetize.com/feed.php?format=json', {
          cache: 'force-cache'
        })
        
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        
        if (Array.isArray(data) && data.length > 0) {
          const gmGames: Game[] = data.map((game: any) => {
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
          
          console.log(`[client] Loaded ${gmGames.length} GameMonetize games`)
          setGamemonetizeGames(gmGames)
          setGamemonetizeLoaded(true)
        }
      } catch (error) {
        console.error('[client] Failed to fetch GameMonetize:', error)
      }
    }
    
    fetchGameMonetize()
  }, [gamemonetizeLoaded])

  // Debounce search query for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchGames = async (loadMore: boolean = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true)
      } else {
        setLoading(true)
      }

      const nextOffset = loadMore ? loadedCount : 0

      // Check for source filter using URL params
      const urlParams = new URLSearchParams(window.location.search)
      const sourceFilter = urlParams.get('source') || ''
      const sourceParam = sourceFilter ? `&source=${sourceFilter}` : ''

      // Load games in chunks
      const sourcesParam = sourceFilters.length ? `&sources=${encodeURIComponent(sourceFilters.join(','))}` : ''
      const multiplierParam = gamedistMultiplier > 1 ? `&gamedistMultiplier=${gamedistMultiplier}` : ''
      const response = await fetch(`/api/games?limit=${LOAD_SIZE}&offset=${nextOffset}&page=${page}${sourceParam}${sourcesParam}${multiplierParam}&external=true&sortBy=${sortBy}`, {
        headers: buildUserSignalsHeaders()
      })
      const data = await response.json()
      const newGames: Game[] = Array.isArray(data.games) ? data.games : []

      if (loadMore) {
        setGames(prev => [...prev, ...newGames])
        setLoadedCount(prev => prev + newGames.length)
        if ((data.total || 0) > totalGames) setTotalGames(data.total)
      } else {
        setGames(newGames)
        setLoadedCount(newGames.length)
        setTotalGames(data.total || 0)
      }

      setLoading(false)
      setIsLoadingMore(false)
    } catch (e) {
      console.error('Error fetching games:', e)
      setLoading(false)
      setIsLoadingMore(false)
    }
  }

  // Function to expand GameDistribution games
  const expandGamedistGames = async () => {
    setIsExpandingGamedist(true)
    const newMultiplier = gamedistMultiplier + 1
    setGamedistMultiplier(newMultiplier)
    
    // Reset and refetch with new multiplier
    setGames([])
    setLoadedCount(0)
    setPage(1)
    
    try {
      const sourcesParam = sourceFilters.length ? `&sources=${encodeURIComponent(sourceFilters.join(','))}` : ''
      const response = await fetch(`/api/games?limit=${LOAD_SIZE}&page=1${sourcesParam}&gamedistMultiplier=${newMultiplier}&external=true&sortBy=${sortBy}`, {
        headers: buildUserSignalsHeaders()
      })
      const data = await response.json()
      const newGames: Game[] = Array.isArray(data.games) ? data.games : []
      
      setGames(newGames)
      setLoadedCount(newGames.length)
      setTotalGames(data.total || 0)
    } catch (e) {
      console.error('Error expanding GameDist games:', e)
    } finally {
      setIsExpandingGamedist(false)
    }
  }

  // Initial load only
  useEffect(() => {
    fetchGames(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When filters change, smoothly refetch without resetting scroll
  useEffect(() => {
    if (games.length === 0) return // Skip if initial load
    
    const refetchWithFilters = async () => {
      setLoading(true)
      try {
        const sourcesParam = sourceFilters.length ? `&sources=${encodeURIComponent(sourceFilters.join(','))}` : ''
        const multiplierParam = gamedistMultiplier > 1 ? `&gamedistMultiplier=${gamedistMultiplier}` : ''
        const response = await fetch(`/api/games?limit=${LOAD_SIZE}&offset=0&page=1${sourcesParam}${multiplierParam}&external=true&sortBy=${sortBy}`, {
          headers: buildUserSignalsHeaders()
        })
        const data = await response.json()
        const newGames: Game[] = Array.isArray(data.games) ? data.games : []
        
        setGames(newGames)
        setLoadedCount(newGames.length)
        setTotalGames(data.total || 0)
        setPage(1)
      } catch (e) {
        console.error('Error refetching games:', e)
      } finally {
        setLoading(false)
      }
    }
    
    refetchWithFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sourceFilters])

  // Infinite scroll via IntersectionObserver (smooth + efficient)
  useEffect(() => {
    if (!sentinelRef.current) return
    const el = sentinelRef.current
    
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        // Only load more if:
        // 1. Sentinel is visible
        // 2. Not already loading
        // 3. There are more games to load
        // 4. We have games already loaded (prevents double initial load)
        if (first.isIntersecting && !isLoadingMore && !loading && loadedCount < totalGames && games.length > 0) {
          setIsLoadingMore(true)
          
          // Fetch next batch without changing page state (to avoid resets)
          const nextOffset = loadedCount
          const sourcesParam = sourceFilters.length ? `&sources=${encodeURIComponent(sourceFilters.join(','))}` : ''
          const multiplierParam = gamedistMultiplier > 1 ? `&gamedistMultiplier=${gamedistMultiplier}` : ''
          
          fetch(`/api/games?limit=${LOAD_SIZE}&offset=${nextOffset}${sourcesParam}${multiplierParam}&external=true&sortBy=${sortBy}`, {
            headers: buildUserSignalsHeaders()
          })
            .then(r => r.json())
            .then(data => {
              const newGames: Game[] = Array.isArray(data.games) ? data.games : []
              if (newGames.length > 0) {
                setGames(prev => [...prev, ...newGames])
                setLoadedCount(prev => prev + newGames.length)
                if ((data.total || 0) > totalGames) setTotalGames(data.total)
              }
            })
            .catch(e => console.error('Error loading more games:', e))
            .finally(() => setIsLoadingMore(false))
        }
      },
      { root: null, rootMargin: '1000px 0px', threshold: 0.1 }
    )
    
    observer.observe(el)
    return () => observer.disconnect()
  }, [isLoadingMore, loading, loadedCount, totalGames, games.length, sourceFilters, gamedistMultiplier, sortBy])

  // Memoize filtered and sorted games for better performance
  // Combine server games with client-side GameMonetize games
  const filteredGames = useMemo(() => {
    const allGames = [...games, ...gamemonetizeGames]
    
    return allGames.filter(game => {
      let query = debouncedSearchQuery.toLowerCase()
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
  }, [games, gamemonetizeGames, debouncedSearchQuery])

  const sortedGames = useMemo(() => {
    return [...filteredGames].sort((a, b) => {
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
  }, [filteredGames, sortBy])

  return (
    <div className="container py-8 space-y-8 relative">
      <div className="absolute inset-0 -z-10 hero-gradient opacity-50" />
      {/* Header */}
      <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">All Games</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our complete collection from multiple sources.
              From classic arcade to modern adventures, find your next favorite game.
            </p>
            <div className="flex flex-col items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Showing {(loadedCount + gamemonetizeGames.length).toLocaleString()} of {(totalGames + gamemonetizeGames.length).toLocaleString()} games
              </Badge>
              {gamemonetizeLoaded && gamemonetizeGames.length > 0 && (
                <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600">
                  ✨ {gamemonetizeGames.length.toLocaleString()} GameMonetize games loaded
                </Badge>
              )}
              {isLoadingExternal && (
                <Badge variant="outline" className="text-xs animate-pulse">
                  Loading more games from external sources...
                </Badge>
              )}
              <Button
                onClick={expandGamedistGames}
                disabled={isExpandingGamedist}
                variant="outline"
                size="sm"
                className="mt-2 glass-card hover-lift"
              >
                {isExpandingGamedist ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading More Games...
                  </>
                ) : (
                  <>
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Load More GameDist Games ({gamedistMultiplier}x → {gamedistMultiplier + 1}x)
                  </>
                )}
              </Button>
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
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="most-played">Most Played</option>
              <option value="alphabetical">A-Z</option>
            </select>
            <div className="flex items-center gap-3 flex-wrap">
              <ListFilter className="h-4 w-4 text-muted-foreground" />
              {['poki', 'playgama', 'gamemonetize', 'lessons', 'arcade', 'gnmath', 'radon', 'classwork', 'gamesnacks', 'fortnite'].map(src => (
                <label key={src} className="flex items-center gap-1.5 text-xs cursor-pointer hover:text-primary transition-colors">
                  <input 
                    type="checkbox" 
                    checked={sourceFilters.includes(src)} 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSourceFilters(prev => [...prev, src])
                      } else {
                        setSourceFilters(prev => prev.filter(s => s !== src))
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <span className="capitalize">{src === 'gnmath' ? 'gn-math' : src}</span>
                </label>
              ))}
            </div>
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
        
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading games...</span>
          </div>
        }>
          <GameGrid games={sortedGames} loading={loading} />
        </Suspense>

        {/* Infinite scroll sentinel (optional fallback button hidden) */}
        {!loading && (
          <div ref={sentinelRef} className="flex justify-center py-8 text-sm text-muted-foreground">
            {loadedCount < totalGames ? (isLoadingMore ? 'Loading more games...' : 'Loading ready…') : 'All games loaded'}
          </div>
        )}

        {/* All games loaded message */}
        {!loading && loadedCount >= totalGames && totalGames > 0 && (
          <div className="text-center py-8">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              All {totalGames.toLocaleString()} games loaded!
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
