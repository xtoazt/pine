"use client"

import { useEffect, useState } from 'react'
import { GameGrid } from '@/components/game/game-grid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Game } from '@/types/game'
import { Gamepad2, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // INSTANT: Show cached games
    fetch('/api/games?limit=50&external=false', { cache: 'force-cache' })
      .then(r => r.json())
      .then(data => {
        setGames(Array.isArray(data.games) ? data.games : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
    
    // BACKGROUND: Load ALL sources for complete library
    fetch('/api/games?limit=200')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.games)) setGames(data.games)
      })
      .catch(() => {})
  }, [])

  const categories = [
    { name: 'Action', slug: 'action' },
    { name: 'Puzzle', slug: 'puzzle' },
    { name: 'Arcade', slug: 'arcade' },
    { name: 'Multiplayer', slug: 'multiplayer' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Racing', slug: 'racing' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">
            <span className="text-primary">pine</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            20,000+ games from multiple sources. No ads. Play instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/games">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Browse All Games
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/stats">
                <TrendingUp className="mr-2 h-5 w-5" />
                Track Progress
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container pb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold">{cat.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Games */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Games</h2>
          <Button variant="ghost" asChild>
            <Link href="/games">View All</Link>
          </Button>
        </div>
        <GameGrid games={games.slice(0, 12)} loading={loading} />
      </section>
    </div>
  )
}