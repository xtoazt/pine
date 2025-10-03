import { NextResponse } from 'next/server'
import { GameStats } from '@/types/game'

export async function GET() {
  try {
    const stats: GameStats = {
      totalGames: 100,
      totalCategories: 14,
      totalPlays: 2450000,
      topCategories: [
        {
          id: "arcade",
          name: "Arcade",
          slug: "arcade",
          gameCount: 35
        },
        {
          id: "puzzle",
          name: "Puzzle", 
          slug: "puzzle",
          gameCount: 18
        },
        {
          id: "adventure",
          name: "Adventure",
          slug: "adventure", 
          gameCount: 12
        },
        {
          id: "action",
          name: "Action",
          slug: "action",
          gameCount: 8
        },
        {
          id: "racing",
          name: "Racing",
          slug: "racing",
          gameCount: 6
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
