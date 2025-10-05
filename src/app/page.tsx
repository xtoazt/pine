"use client"

import { useEffect, useState } from 'react'
import { GameGrid } from '@/components/game/game-grid'
import { Button } from '@/components/ui/button'
import { Game } from '@/types/game'
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
    
    // BACKGROUND: Load more
    fetch('/api/games?limit=100')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.games)) setGames(data.games)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="container py-8 space-y-8">
      {/* Simple Hero */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-primary">pine</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          20,000+ games • No ads • Play instantly
        </p>
        <Button size="lg" asChild>
          <Link href="/games">Browse All Games</Link>
        </Button>
      </div>

      {/* Games */}
      <GameGrid games={games} loading={loading} />
    </div>
  )
}