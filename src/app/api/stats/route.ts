import { NextResponse } from 'next/server'
import { GameStats } from '@/types/game'

export async function GET() {
  try {
    const stats: GameStats = {
      totalGames: 35,
      totalCategories: 14,
      totalPlays: 856000,
      topCategories: [
        {
          id: "arcade",
          name: "Arcade",
          slug: "arcade",
          gameCount: 18
        },
        {
          id: "adventure",
          name: "Adventure", 
          slug: "adventure",
          gameCount: 6
        },
        {
          id: "puzzle",
          name: "Puzzle",
          slug: "puzzle", 
          gameCount: 3
        },
        {
          id: "racing",
          name: "Racing",
          slug: "racing",
          gameCount: 2
        },
        {
          id: "action",
          name: "Action",
          slug: "action",
          gameCount: 2
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
