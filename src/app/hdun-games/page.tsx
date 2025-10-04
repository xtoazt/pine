"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Search, Gamepad2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HDUNGame {
  id: string
  name: string
  code: string
  playUrl: string
  category?: string
}

export default function HDUNGamesPage() {
  const router = useRouter()
  const [games, setGames] = useState<HDUNGame[]>([])
  const [filteredGames, setFilteredGames] = useState<HDUNGame[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Sample HDUN games with their codes (you can expand this list)
  const hdunGames: HDUNGame[] = [
    { id: '99balls', name: '99 Balls', code: '9007199254740992', playUrl: '/api/hdun/proxy?id=99balls' },
    { id: '2048', name: '2048', code: '2048', playUrl: '/api/hdun/proxy?id=2048' },
    { id: 'agar', name: 'Agar.io', code: 'agar', playUrl: '/api/hdun/proxy?id=agar' },
    { id: 'amongus', name: 'Among Us', code: 'amongus', playUrl: '/api/hdun/proxy?id=amongus' },
    { id: 'angrybirds', name: 'Angry Birds', code: 'angrybirds', playUrl: '/api/hdun/proxy?id=angrybirds' },
    { id: 'asteroids', name: 'Asteroids', code: 'asteroids', playUrl: '/api/hdun/proxy?id=asteroids' },
    { id: 'battleship', name: 'Battleship', code: 'battleship', playUrl: '/api/hdun/proxy?id=battleship' },
    { id: 'breakout', name: 'Breakout', code: 'breakout', playUrl: '/api/hdun/proxy?id=breakout' },
    { id: 'chess', name: 'Chess', code: 'chess', playUrl: '/api/hdun/proxy?id=chess' },
    { id: 'connect4', name: 'Connect 4', code: 'connect4', playUrl: '/api/hdun/proxy?id=connect4' },
    { id: 'crossyroad', name: 'Crossy Road', code: 'crossyroad', playUrl: '/api/hdun/proxy?id=crossyroad' },
    { id: 'flappybird', name: 'Flappy Bird', code: 'flappybird', playUrl: '/api/hdun/proxy?id=flappybird' },
    { id: 'frogger', name: 'Frogger', code: 'frogger', playUrl: '/api/hdun/proxy?id=frogger' },
    { id: 'galaga', name: 'Galaga', code: 'galaga', playUrl: '/api/hdun/proxy?id=galaga' },
    { id: 'hextris', name: 'Hextris', code: 'hextris', playUrl: '/api/hdun/proxy?id=hextris' },
    { id: 'minesweeper', name: 'Minesweeper', code: 'minesweeper', playUrl: '/api/hdun/proxy?id=minesweeper' },
    { id: 'pacman', name: 'Pac-Man', code: 'pacman', playUrl: '/api/hdun/proxy?id=pacman' },
    { id: 'pong', name: 'Pong', code: 'pong', playUrl: '/api/hdun/proxy?id=pong' },
    { id: 'snake', name: 'Snake', code: 'snake', playUrl: '/api/hdun/proxy?id=snake' },
    { id: 'solitaire', name: 'Solitaire', code: 'solitaire', playUrl: '/api/hdun/proxy?id=solitaire' },
    { id: 'spaceinvaders', name: 'Space Invaders', code: 'spaceinvaders', playUrl: '/api/hdun/proxy?id=spaceinvaders' },
    { id: 'sudoku', name: 'Sudoku', code: 'sudoku', playUrl: '/api/hdun/proxy?id=sudoku' },
    { id: 'tetris', name: 'Tetris', code: 'tetris', playUrl: '/api/hdun/proxy?id=tetris' },
    { id: 'tictactoe', name: 'Tic Tac Toe', code: 'tictactoe', playUrl: '/api/hdun/proxy?id=tictactoe' },
    { id: 'wordle', name: 'Wordle', code: 'wordle', playUrl: '/api/hdun/proxy?id=wordle' }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setGames(hdunGames)
      setFilteredGames(hdunGames)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = games.filter(game =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredGames(filtered)
    } else {
      setFilteredGames(games)
    }
  }, [searchQuery, games])

  const handlePlay = (game: HDUNGame) => {
    // Navigate to the game player with HDUN proxy URL
    router.push(`/play/hdun-${game.id}`)
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">HDUN Games</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Play thousands of HTML5 games from HDUN directly through pine. No downloads required - stream and play instantly!
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search HDUN games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading HDUN games...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGames.map((game) => (
            <Card key={game.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{game.name}</CardTitle>
                <CardDescription>
                  Game ID: {game.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">HDUN</Badge>
                    <Badge variant="outline">HTML5</Badge>
                  </div>
                  <Button
                    onClick={() => handlePlay(game)}
                    className="w-full"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Play Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredGames.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No games found matching your search.</p>
        </div>
      )}

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>About HDUN Games</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            HDUN (HTML5 Games Unblocked) provides thousands of free HTML5 games that are streamed directly through pine. 
            No downloads, no files on your device - just pure gaming through your browser.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Instant Play</h4>
              <p className="text-muted-foreground">Click and play immediately - no waiting</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">No Downloads</h4>
              <p className="text-muted-foreground">Stream games directly - no files on your device</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Always Updated</h4>
              <p className="text-muted-foreground">Always get the latest version of each game</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
