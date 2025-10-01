"use client"

import { useEffect, useState } from 'react'
import { GameGrid } from '@/components/game/game-grid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Game, GameCategory, GameStats } from '@/types/game'
import { Gamepad2, Users, Zap, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([])
  const [categories, setCategories] = useState<GameCategory[]>([])
  const [stats, setStats] = useState<GameStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, categoriesRes, statsRes] = await Promise.all([
          fetch('/api/games?limit=12'),
          fetch('/api/categories'),
          fetch('/api/stats')
        ])

        const gamesData = await gamesRes.json()
        const categoriesData = await categoriesRes.json()
        const statsData = await statsRes.json()

        setGames(gamesData.games)
        setCategories(categoriesData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome to pine
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern, developer-friendly game platform. No ads, no tracking, just pure gaming fun.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/category/popular">
              <Gamepad2 className="mr-2 h-5 w-5" />
              Play Popular Games
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/api">
              <Zap className="mr-2 h-5 w-5" />
              View API
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGames.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlays.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Game Categories</h2>
          <Button variant="outline" asChild>
            <Link href="/category">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {category.gameCount} games
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Games</h2>
          <Button variant="outline" asChild>
            <Link href="/category/new">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <GameGrid games={games} loading={loading} />
      </section>

      {/* Developer Section */}
      <section className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
        <h2 className="text-3xl font-bold">Built for Developers</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          pine provides a clean, modern API for developers to easily integrate games into their own applications. 
          No complex authentication, no rate limits, just simple HTTP requests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/api">
              <Zap className="mr-2 h-4 w-4" />
              API Documentation
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://github.com/rohan/pine">
              View on GitHub
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
