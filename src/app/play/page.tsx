"use client"

import { useEffect, useState } from 'react'
import { Game } from '@/types/game'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, ThumbsUp, Eye, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function PlayPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games?all=true')
        const data = await response.json()
        setGames(data.games || [])
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold">All Games</h1>
            <p className="text-muted-foreground mt-2">
              Choose from {games.length} available games
            </p>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="group hover:shadow-lg transition-all duration-200">
            <div className="relative overflow-hidden">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/images/logo.png'
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button size="sm" asChild>
                  <Link href={`/play/${game.id}`}>
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Link>
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{game.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {game.description}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{game.category}</Badge>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>{game.playCount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
