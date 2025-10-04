import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('id')
    const action = searchParams.get('action') || 'list'
    
    if (action === 'list') {
      // Return list of available HDUN games
      const games = [
        { id: '99balls', name: '99 Balls', code: '9007199254740992' },
        { id: '2048', name: '2048', code: '2048' },
        { id: 'agar', name: 'Agar.io', code: 'agar' },
        { id: 'amongus', name: 'Among Us', code: 'amongus' },
        { id: 'angrybirds', name: 'Angry Birds', code: 'angrybirds' },
        { id: 'asteroids', name: 'Asteroids', code: 'asteroids' },
        { id: 'battleship', name: 'Battleship', code: 'battleship' },
        { id: 'breakout', name: 'Breakout', code: 'breakout' },
        { id: 'chess', name: 'Chess', code: 'chess' },
        { id: 'connect4', name: 'Connect 4', code: 'connect4' },
        { id: 'crossyroad', name: 'Crossy Road', code: 'crossyroad' },
        { id: 'flappybird', name: 'Flappy Bird', code: 'flappybird' },
        { id: 'frogger', name: 'Frogger', code: 'frogger' },
        { id: 'galaga', name: 'Galaga', code: 'galaga' },
        { id: 'hextris', name: 'Hextris', code: 'hextris' },
        { id: 'minesweeper', name: 'Minesweeper', code: 'minesweeper' },
        { id: 'pacman', name: 'Pac-Man', code: 'pacman' },
        { id: 'pong', name: 'Pong', code: 'pong' },
        { id: 'snake', name: 'Snake', code: 'snake' },
        { id: 'solitaire', name: 'Solitaire', code: 'solitaire' },
        { id: 'spaceinvaders', name: 'Space Invaders', code: 'spaceinvaders' },
        { id: 'sudoku', name: 'Sudoku', code: 'sudoku' },
        { id: 'tetris', name: 'Tetris', code: 'tetris' },
        { id: 'tictactoe', name: 'Tic Tac Toe', code: 'tictactoe' },
        { id: 'wordle', name: 'Wordle', code: 'wordle' }
      ]
      
      return NextResponse.json({ games })
    }
    
    if (action === 'play' && gameId) {
      // Return the game URL for playing
      const gameUrl = `https://www.hdun.org/games/alotofgames/${gameId}/`
      return NextResponse.json({ 
        gameUrl,
        playUrl: `/api/hdun/proxy?id=${gameId}`
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('HDUN API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
