import { NextResponse } from 'next/server'
import { GameStats } from '@/types/game'

export async function GET() {
  try {
    const stats: GameStats = {
      totalGames: 12,
      totalCategories: 12,
      totalPlays: 287000,
      topCategories: [
        {
          id: "arcade",
          name: "Arcade",
          slug: "arcade",
          gameCount: 3
        },
        {
          id: "racing",
          name: "Racing", 
          slug: "racing",
          gameCount: 2
        },
        {
          id: "adventure",
          name: "Adventure",
          slug: "adventure", 
          gameCount: 1
        },
        {
          id: "puzzle",
          name: "Puzzle",
          slug: "puzzle",
          gameCount: 1
        },
        {
          id: "shooting",
          name: "Shooting",
          slug: "shooting",
          gameCount: 1
        }
      ]
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
