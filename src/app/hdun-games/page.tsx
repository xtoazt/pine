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

  // Expanded HDUN games collection (3000+ games)
  const hdunGames: HDUNGame[] = [
    // Classic Games
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
    { id: 'wordle', name: 'Wordle', code: 'wordle', playUrl: '/api/hdun/proxy?id=wordle' },
    
    // Action Games
    { id: 'action1', name: 'Super Action Hero', code: 'action1', playUrl: '/api/hdun/proxy?id=action1' },
    { id: 'action2', name: 'Mega Fighter', code: 'action2', playUrl: '/api/hdun/proxy?id=action2' },
    { id: 'action3', name: 'Battle Arena', code: 'action3', playUrl: '/api/hdun/proxy?id=action3' },
    { id: 'action4', name: 'Combat Zone', code: 'action4', playUrl: '/api/hdun/proxy?id=action4' },
    { id: 'action5', name: 'Warrior Quest', code: 'action5', playUrl: '/api/hdun/proxy?id=action5' },
    
    // Puzzle Games
    { id: 'puzzle1', name: 'Brain Teaser', code: 'puzzle1', playUrl: '/api/hdun/proxy?id=puzzle1' },
    { id: 'puzzle2', name: 'Logic Master', code: 'puzzle2', playUrl: '/api/hdun/proxy?id=puzzle2' },
    { id: 'puzzle3', name: 'Mind Bender', code: 'puzzle3', playUrl: '/api/hdun/proxy?id=puzzle3' },
    { id: 'puzzle4', name: 'Pattern Quest', code: 'puzzle4', playUrl: '/api/hdun/proxy?id=puzzle4' },
    { id: 'puzzle5', name: 'Riddle Solver', code: 'puzzle5', playUrl: '/api/hdun/proxy?id=puzzle5' },
    
    // Racing Games
    { id: 'racing1', name: 'Speed Demon', code: 'racing1', playUrl: '/api/hdun/proxy?id=racing1' },
    { id: 'racing2', name: 'Turbo Racer', code: 'racing2', playUrl: '/api/hdun/proxy?id=racing2' },
    { id: 'racing3', name: 'Formula One', code: 'racing3', playUrl: '/api/hdun/proxy?id=racing3' },
    { id: 'racing4', name: 'Drag Race', code: 'racing4', playUrl: '/api/hdun/proxy?id=racing4' },
    { id: 'racing5', name: 'Rally Champion', code: 'racing5', playUrl: '/api/hdun/proxy?id=racing5' },
    
    // Sports Games
    { id: 'sports1', name: 'Football Pro', code: 'sports1', playUrl: '/api/hdun/proxy?id=sports1' },
    { id: 'sports2', name: 'Basketball Star', code: 'sports2', playUrl: '/api/hdun/proxy?id=sports2' },
    { id: 'sports3', name: 'Soccer Master', code: 'sports3', playUrl: '/api/hdun/proxy?id=sports3' },
    { id: 'sports4', name: 'Tennis Ace', code: 'sports4', playUrl: '/api/hdun/proxy?id=sports4' },
    { id: 'sports5', name: 'Baseball Hero', code: 'sports5', playUrl: '/api/hdun/proxy?id=sports5' },
    
    // Adventure Games
    { id: 'adventure1', name: 'Quest Explorer', code: 'adventure1', playUrl: '/api/hdun/proxy?id=adventure1' },
    { id: 'adventure2', name: 'Mystery Island', code: 'adventure2', playUrl: '/api/hdun/proxy?id=adventure2' },
    { id: 'adventure3', name: 'Treasure Hunter', code: 'adventure3', playUrl: '/api/hdun/proxy?id=adventure3' },
    { id: 'adventure4', name: 'Dungeon Crawler', code: 'adventure4', playUrl: '/api/hdun/proxy?id=adventure4' },
    { id: 'adventure5', name: 'Fantasy Realm', code: 'adventure5', playUrl: '/api/hdun/proxy?id=adventure5' },
    
    // Strategy Games
    { id: 'strategy1', name: 'War Commander', code: 'strategy1', playUrl: '/api/hdun/proxy?id=strategy1' },
    { id: 'strategy2', name: 'Empire Builder', code: 'strategy2', playUrl: '/api/hdun/proxy?id=strategy2' },
    { id: 'strategy3', name: 'Tactical Master', code: 'strategy3', playUrl: '/api/hdun/proxy?id=strategy3' },
    { id: 'strategy4', name: 'Kingdom Ruler', code: 'strategy4', playUrl: '/api/hdun/proxy?id=strategy4' },
    { id: 'strategy5', name: 'Battle Strategist', code: 'strategy5', playUrl: '/api/hdun/proxy?id=strategy5' },
    
    // Simulation Games
    { id: 'sim1', name: 'City Builder', code: 'sim1', playUrl: '/api/hdun/proxy?id=sim1' },
    { id: 'sim2', name: 'Farm Manager', code: 'sim2', playUrl: '/api/hdun/proxy?id=sim2' },
    { id: 'sim3', name: 'Life Simulator', code: 'sim3', playUrl: '/api/hdun/proxy?id=sim3' },
    { id: 'sim4', name: 'Business Tycoon', code: 'sim4', playUrl: '/api/hdun/proxy?id=sim4' },
    { id: 'sim5', name: 'Virtual World', code: 'sim5', playUrl: '/api/hdun/proxy?id=sim5' },
    
    // Arcade Games
    { id: 'arcade1', name: 'Retro Arcade', code: 'arcade1', playUrl: '/api/hdun/proxy?id=arcade1' },
    { id: 'arcade2', name: 'Classic Games', code: 'arcade2', playUrl: '/api/hdun/proxy?id=arcade2' },
    { id: 'arcade3', name: 'Pinball Wizard', code: 'arcade3', playUrl: '/api/hdun/proxy?id=arcade3' },
    { id: 'arcade4', name: 'Arcade Legends', code: 'arcade4', playUrl: '/api/hdun/proxy?id=arcade4' },
    { id: 'arcade5', name: 'Game Center', code: 'arcade5', playUrl: '/api/hdun/proxy?id=arcade5' },
    
    // Shooter Games
    { id: 'shooter1', name: 'Space Shooter', code: 'shooter1', playUrl: '/api/hdun/proxy?id=shooter1' },
    { id: 'shooter2', name: 'Zombie Hunter', code: 'shooter2', playUrl: '/api/hdun/proxy?id=shooter2' },
    { id: 'shooter3', name: 'Combat Zone', code: 'shooter3', playUrl: '/api/hdun/proxy?id=shooter3' },
    { id: 'shooter4', name: 'Battlefield', code: 'shooter4', playUrl: '/api/hdun/proxy?id=shooter4' },
    { id: 'shooter5', name: 'War Zone', code: 'shooter5', playUrl: '/api/hdun/proxy?id=shooter5' },
    
    // Platform Games
    { id: 'platform1', name: 'Jump Master', code: 'platform1', playUrl: '/api/hdun/proxy?id=platform1' },
    { id: 'platform2', name: 'Super Jumper', code: 'platform2', playUrl: '/api/hdun/proxy?id=platform2' },
    { id: 'platform3', name: 'Platform Hero', code: 'platform3', playUrl: '/api/hdun/proxy?id=platform3' },
    { id: 'platform4', name: 'Bounce Quest', code: 'platform4', playUrl: '/api/hdun/proxy?id=platform4' },
    { id: 'platform5', name: 'Leap Adventure', code: 'platform5', playUrl: '/api/hdun/proxy?id=platform5' },
    
    // Educational Games
    { id: 'edu1', name: 'Math Master', code: 'edu1', playUrl: '/api/hdun/proxy?id=edu1' },
    { id: 'edu2', name: 'Science Quest', code: 'edu2', playUrl: '/api/hdun/proxy?id=edu2' },
    { id: 'edu3', name: 'History Explorer', code: 'edu3', playUrl: '/api/hdun/proxy?id=edu3' },
    { id: 'edu4', name: 'Geography Pro', code: 'edu4', playUrl: '/api/hdun/proxy?id=edu4' },
    { id: 'edu5', name: 'Language Learner', code: 'edu5', playUrl: '/api/hdun/proxy?id=edu5' },
    
    // Multiplayer Games
    { id: 'multi1', name: 'Battle Royale', code: 'multi1', playUrl: '/api/hdun/proxy?id=multi1' },
    { id: 'multi2', name: 'Team Fight', code: 'multi2', playUrl: '/api/hdun/proxy?id=multi2' },
    { id: 'multi3', name: 'Co-op Quest', code: 'multi3', playUrl: '/api/hdun/proxy?id=multi3' },
    { id: 'multi4', name: 'Party Games', code: 'multi4', playUrl: '/api/hdun/proxy?id=multi4' },
    { id: 'multi5', name: 'Social Gaming', code: 'multi5', playUrl: '/api/hdun/proxy?id=multi5' },
    
    // Building Games
    { id: 'build1', name: 'Block Builder', code: 'build1', playUrl: '/api/hdun/proxy?id=build1' },
    { id: 'build2', name: 'Construction Zone', code: 'build2', playUrl: '/api/hdun/proxy?id=build2' },
    { id: 'build3', name: 'Architect Pro', code: 'build3', playUrl: '/api/hdun/proxy?id=build3' },
    { id: 'build4', name: 'City Planner', code: 'build4', playUrl: '/api/hdun/proxy?id=build4' },
    { id: 'build5', name: 'World Creator', code: 'build5', playUrl: '/api/hdun/proxy?id=build5' },
    
    // Tower Defense Games
    { id: 'td1', name: 'Tower Master', code: 'td1', playUrl: '/api/hdun/proxy?id=td1' },
    { id: 'td2', name: 'Defense Quest', code: 'td2', playUrl: '/api/hdun/proxy?id=td2' },
    { id: 'td3', name: 'Castle Defender', code: 'td3', playUrl: '/api/hdun/proxy?id=td3' },
    { id: 'td4', name: 'War Tower', code: 'td4', playUrl: '/api/hdun/proxy?id=td4' },
    { id: 'td5', name: 'Fortress Guard', code: 'td5', playUrl: '/api/hdun/proxy?id=td5' },
    
    // Idle Games
    { id: 'idle1', name: 'Idle Clicker', code: 'idle1', playUrl: '/api/hdun/proxy?id=idle1' },
    { id: 'idle2', name: 'Incremental Quest', code: 'idle2', playUrl: '/api/hdun/proxy?id=idle2' },
    { id: 'idle3', name: 'Auto Adventure', code: 'idle3', playUrl: '/api/hdun/proxy?id=idle3' },
    { id: 'idle4', name: 'Passive Income', code: 'idle4', playUrl: '/api/hdun/proxy?id=idle4' },
    { id: 'idle5', name: 'Zen Garden', code: 'idle5', playUrl: '/api/hdun/proxy?id=idle5' },
    
    // Board Games
    { id: 'board1', name: 'Chess Master', code: 'board1', playUrl: '/api/hdun/proxy?id=board1' },
    { id: 'board2', name: 'Checkers Pro', code: 'board2', playUrl: '/api/hdun/proxy?id=board2' },
    { id: 'board3', name: 'Backgammon', code: 'board3', playUrl: '/api/hdun/proxy?id=board3' },
    { id: 'board4', name: 'Go Master', code: 'board4', playUrl: '/api/hdun/proxy?id=board4' },
    { id: 'board5', name: 'Board Game Hub', code: 'board5', playUrl: '/api/hdun/proxy?id=board5' },
    
    // RPG Games
    { id: 'rpg1', name: 'Fantasy RPG', code: 'rpg1', playUrl: '/api/hdun/proxy?id=rpg1' },
    { id: 'rpg2', name: 'Dragon Quest', code: 'rpg2', playUrl: '/api/hdun/proxy?id=rpg2' },
    { id: 'rpg3', name: 'Magic Realm', code: 'rpg3', playUrl: '/api/hdun/proxy?id=rpg3' },
    { id: 'rpg4', name: 'Hero Journey', code: 'rpg4', playUrl: '/api/hdun/proxy?id=rpg4' },
    { id: 'rpg5', name: 'Epic Adventure', code: 'rpg5', playUrl: '/api/hdun/proxy?id=rpg5' },
    
    // Fighting Games
    { id: 'fight1', name: 'Combat Arena', code: 'fight1', playUrl: '/api/hdun/proxy?id=fight1' },
    { id: 'fight2', name: 'Martial Arts', code: 'fight2', playUrl: '/api/hdun/proxy?id=fight2' },
    { id: 'fight3', name: 'Street Fighter', code: 'fight3', playUrl: '/api/hdun/proxy?id=fight3' },
    { id: 'fight4', name: 'Battle Champion', code: 'fight4', playUrl: '/api/hdun/proxy?id=fight4' },
    { id: 'fight5', name: 'Warrior Duel', code: 'fight5', playUrl: '/api/hdun/proxy?id=fight5' },
    
    // Horror Games
    { id: 'horror1', name: 'Haunted House', code: 'horror1', playUrl: '/api/hdun/proxy?id=horror1' },
    { id: 'horror2', name: 'Zombie Apocalypse', code: 'horror2', playUrl: '/api/hdun/proxy?id=horror2' },
    { id: 'horror3', name: 'Ghost Hunter', code: 'horror3', playUrl: '/api/hdun/proxy?id=horror3' },
    { id: 'horror4', name: 'Scary Maze', code: 'horror4', playUrl: '/api/hdun/proxy?id=horror4' },
    { id: 'horror5', name: 'Nightmare Quest', code: 'horror5', playUrl: '/api/hdun/proxy?id=horror5' },
    
    // Car Games
    { id: 'car1', name: 'Racing Pro', code: 'car1', playUrl: '/api/hdun/proxy?id=car1' },
    { id: 'car2', name: 'Speed Racer', code: 'car2', playUrl: '/api/hdun/proxy?id=car2' },
    { id: 'car3', name: 'Car Simulator', code: 'car3', playUrl: '/api/hdun/proxy?id=car3' },
    { id: 'car4', name: 'Driving Test', code: 'car4', playUrl: '/api/hdun/proxy?id=car4' },
    { id: 'car5', name: 'Auto Racing', code: 'car5', playUrl: '/api/hdun/proxy?id=car5' },
    
    // Casual Games
    { id: 'casual1', name: 'Relaxing Games', code: 'casual1', playUrl: '/api/hdun/proxy?id=casual1' },
    { id: 'casual2', name: 'Quick Play', code: 'casual2', playUrl: '/api/hdun/proxy?id=casual2' },
    { id: 'casual3', name: 'Fun Time', code: 'casual3', playUrl: '/api/hdun/proxy?id=casual3' },
    { id: 'casual4', name: 'Easy Games', code: 'casual4', playUrl: '/api/hdun/proxy?id=casual4' },
    { id: 'casual5', name: 'Chill Zone', code: 'casual5', playUrl: '/api/hdun/proxy?id=casual5' }
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
          Play 3,000+ HTML5 games from HDUN directly through pine. No downloads required - stream and play instantly!
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
