import { NextRequest, NextResponse } from 'next/server'
import { Game } from '@/types/game'
import { getAllGames } from '@/data/games'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params
    
    // Get all games
    const allGames = getAllGames()
    
    // Find the specific game by ID
    const game = allGames.find((g: Game) => g.id === gameId)
    
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }
    
    return NextResponse.json({ game })
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
