"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Game } from '@/types/game'
import { ArrowLeft, Play, ThumbsUp, Eye, Share2, Maximize, Minimize } from 'lucide-react'
import Link from 'next/link'
import { VirtualController } from '@/components/game/virtual-controller'
import { useVirtualController } from '@/hooks/use-virtual-controller'

export default function GamePage() {
  const params = useParams()
  const gameId = params.id as string
  
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const virtualController = useVirtualController()

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true)
        // Fetch all games and find the specific one by ID
        const response = await fetch(`/api/games?limit=1000`)
        const data = await response.json()
        
        // Find the specific game by ID
        const foundGame = data.games.find((g: Game) => g.id === gameId)
        setGame(foundGame)
      } catch (error) {
        console.error('Error fetching game:', error)
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      fetchGame()
    }
  }, [gameId])

  const toggleFullscreen = () => {
    const gameContainer = document.getElementById('game-container')
    if (!gameContainer) return

    if (!document.fullscreenElement) {
      gameContainer.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch((err) => {
        console.error('Error attempting to exit fullscreen:', err)
      })
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
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

  if (!game) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Game not found</h1>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const rating = game.upvotes + game.downvotes > 0 
    ? (game.upvotes / (game.upvotes + game.downvotes)) * 5 
    : 0

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
            <h1 className="text-3xl font-bold">{game.title}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary">{game.category}</Badge>
              {game.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
        
            <div className="flex space-x-2">
              <Button onClick={() => window.location.reload()}>
                <Play className="mr-2 h-4 w-4" />
                Reload Game
              </Button>
              <Button variant="outline" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <>
                    <Minimize className="mr-2 h-4 w-4" />
                    Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize className="mr-2 h-4 w-4" />
                    Fullscreen
                  </>
                )}
              </Button>
            </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Player */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div id="game-container" className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
                    <iframe
                      src={game.source === 'hdun' ? `/play.html?game=${gameId}` : `/api/proxy/lessons/${gameId}`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      title={game.title}
                  onError={(e) => {
                    console.error('Game failed to load:', gameId)
                    // Fallback to a simple error message
                    e.currentTarget.style.display = 'none'
                    const errorDiv = document.createElement('div')
                    errorDiv.className = 'flex items-center justify-center h-full bg-muted text-muted-foreground'
                    errorDiv.innerHTML = `
                      <div class="text-center">
                        <h3 class="text-lg font-semibold mb-2">Game Not Available</h3>
                        <p class="text-sm">This game is currently unavailable.</p>
                        <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                          Try Again
                        </button>
                      </div>
                    `
                    e.currentTarget.parentNode?.appendChild(errorDiv)
                  }}
                />
                
                {/* Fullscreen overlay controls */}
                {isFullscreen && (
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="bg-black/50 text-white hover:bg-black/70"
                    >
                      <Minimize className="h-4 w-4 mr-2" />
                      Exit Fullscreen
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {game.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{game.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2">Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Upvotes
                    </span>
                    <span>{game.upvotes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      Plays
                    </span>
                    <span>{game.playCount.toLocaleString()}</span>
                  </div>
                  {rating > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Rating</span>
                      <span className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        {rating.toFixed(1)}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/play/${game.id}`}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Game
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Virtual Controller */}
      <VirtualController
        isVisible={virtualController.isVisible}
        onToggle={virtualController.toggleController}
        onKeyPress={virtualController.handleKeyPress}
        onKeyRelease={virtualController.handleKeyRelease}
      />
    </div>
  )
}
