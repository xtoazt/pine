"use client"

import React, { useEffect, useState, useMemo, Suspense, lazy } from 'react'
// Lazy load GameGrid for better performance
const GameGrid = lazy(() => import('@/components/game/game-grid').then(module => ({ default: module.GameGrid })))
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Game } from '@/types/game'
import { Gamepad2, Zap, TrendingUp, Sword, Puzzle, Users, Trophy, Car, Map, Target, Crown, Monitor, LucideIcon } from 'lucide-react'
import Link from 'next/link'

// Map category icon names to Lucide components
const categoryIconMap = {
  Sword,
  Puzzle,
  Gamepad2,
  Users,
  Trophy,
  Car,
  Map,
  Target,
  Crown,
  Zap,
  Monitor,
}

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
    { name: 'Action', slug: 'action', icon: 'Sword' },
    { name: 'Puzzle', slug: 'puzzle', icon: 'Puzzle' },
    { name: 'Arcade', slug: 'arcade', icon: 'Gamepad2' },
    { name: 'Multiplayer', slug: 'multiplayer', icon: 'Users' },
    { name: 'Sports', slug: 'sports', icon: 'Trophy' },
    { name: 'Racing', slug: 'racing', icon: 'Car' },
    { name: 'Adventure', slug: 'adventure', icon: 'Map' },
    { name: 'Strategy', slug: 'strategy', icon: 'Chess' },
    { name: 'Shooter', slug: 'shooter', icon: 'Target' },
    { name: 'RPG', slug: 'rpg', icon: 'Crown' },
    { name: 'Platformer', slug: 'platformer', icon: 'Zap' },
    { name: 'Simulation', slug: 'simulation', icon: 'Monitor' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="container py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <span className="pill">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Safe & Unblocked
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="text-primary">pine</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience unblocked games with exciting streaks, challenging levels, and diverse categories.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="btn-soft" asChild>
                <Link href="/play">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Play Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="glass" asChild>
                <Link href="/games">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Browse Games
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">No installs. No paywalls. Just play.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
          <Button variant="ghost" asChild>
            <Link href="/category">See all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
              <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border border-border glass">
                <CardContent className="p-4 text-center space-y-2">
                  <div className="text-3xl">
                    {React.createElement(categoryIconMap[cat.icon as keyof typeof categoryIconMap] || Gamepad2, { className: "w-8 h-8 mx-auto" })}
                  </div>
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Game Sources Section */}
      <section className="container pb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Source</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 's16.lol', source: 's16', color: 'bg-red-500/10 text-red-600' },
            { name: 'GameSnacks', source: 'gamesnacks', color: 'bg-pink-500/10 text-pink-600' },
            { name: 'gn-math', source: 'gnmath', color: 'bg-yellow-500/10 text-yellow-600' },
            { name: 'Radon', source: 'radon', color: 'bg-orange-500/10 text-orange-600' },
            { name: 'Classwork', source: 'classwork', color: 'bg-indigo-500/10 text-indigo-600' },
            { name: 'Arcade', source: 'arcade', color: 'bg-green-500/10 text-green-600' },
            { name: 'Lessons', source: 'lessons', color: 'bg-blue-500/10 text-blue-600' },
            { name: 'Fortnite', source: 'fortnite', color: 'bg-purple-500/10 text-purple-600' },
          ].map((src) => (
            <Link key={src.source} href={src.source === 's16' ? '/s16' : `/games?source=${src.source}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer glass">
                <CardContent className="p-4">
                  <Badge className={`${src.color} mb-2`}>{src.name}</Badge>
                  <p className="text-xs text-muted-foreground">Browse games</p>
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
                <Suspense fallback={
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <Card key={i} className="animate-pulse glass">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-muted rounded-lg mb-3"></div>
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                }>
                  <GameGrid games={games.slice(0, 12)} loading={loading} />
                </Suspense>
      </section>
    </div>
  )
}