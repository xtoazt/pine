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
          fetch('/api/games?limit=20&category=popular'),
          fetch('/api/categories'),
          fetch('/api/stats')
        ])

        if (!gamesRes.ok || !categoriesRes.ok || !statsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const gamesData = await gamesRes.json()
        const categoriesData = await categoriesRes.json()
        const statsData = await statsRes.json()

        setGames(Array.isArray(gamesData.games) ? gamesData.games : [])
        setCategories(Array.isArray(categoriesData.categories) ? categoriesData.categories : [])
        setStats(statsData || null)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Set empty arrays as fallback
        setGames([])
        setCategories([])
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="space-y-6 py-8 md:py-12 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                Welcome to{" "}
                <span className="text-primary">pine</span>
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                A modern, minimalist game platform with 100+ carefully curated games. 
                Clean design, no ads, no tracking. Just pure gaming.
              </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/category/popular">
                <Gamepad2 className="mr-2 h-4 w-4" />
                Get Started
              </Link>
            </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/api">
                    <Zap className="mr-2 h-4 w-4" />
                    API Docs
                  </Link>
                </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Game Categories</h2>
          <Button variant="outline" asChild>
            <Link href="/category">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {(categories || []).slice(0, 14).map((category) => (
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
      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Games</h2>
          <Button variant="outline" asChild>
            <Link href="/category/new">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading games...</p>
              </div>
            ) : games.length > 0 ? (
              <GameGrid games={games} loading={false} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No games found</p>
                <p className="text-muted-foreground text-sm mt-2">
                  There might be an issue loading the games. Please try refreshing the page.
                </p>
              </div>
            )}
      </section>

      {/* Developer Section */}
      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
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
        </div>
      </section>
    </div>
  )
}
