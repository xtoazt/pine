"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { GameGrid } from '@/components/game/game-grid'
import { Game } from '@/types/game'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search, Gamepad2 } from 'lucide-react'
import Link from 'next/link'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      searchGames(query)
    }
  }, [query])

  const searchGames = async (searchQuery: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/games?search=${encodeURIComponent(searchQuery)}&limit=50`)
      
      if (!response.ok) {
        throw new Error('Failed to search games')
      }
      
      const data = await response.json()
      setGames(data.games || [])
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search games. Please try again.')
      setGames([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Search Results</h1>
            {query && (
              <p className="text-muted-foreground mt-2">
                Results for "{query}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Searching games...</p>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Search Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => searchGames(query)}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : games.length > 0 ? (
        <div>
          <div className="mb-6">
            <p className="text-muted-foreground">
              Found {games.length} game{games.length !== 1 ? 's' : ''} matching "{query}"
            </p>
          </div>
          <GameGrid games={games} loading={false} />
        </div>
      ) : query ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No games found</h3>
            <p className="text-muted-foreground mb-4">
              No games match your search for "{query}". Try different keywords.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Browse All Games
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/category/popular">
                  Popular Games
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Search Games</h3>
            <p className="text-muted-foreground mb-4">
              Enter a search term to find games.
            </p>
            <Button asChild>
              <Link href="/">
                <Gamepad2 className="mr-2 h-4 w-4" />
                Browse All Games
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
