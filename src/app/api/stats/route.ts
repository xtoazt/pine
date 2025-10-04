import { NextResponse } from 'next/server'
import { GameStats } from '@/types/game'

export async function GET() {
  try {
        const stats: GameStats = {
          totalGames: 4000,
          totalCategories: 25,
          totalPlays: 15000000,
      topCategories: [
        {
          id: "casual",
          name: "Casual",
          slug: "casual",
          gameCount: 250
        },
        {
          id: "puzzle",
          name: "Puzzle", 
          slug: "puzzle",
          gameCount: 200
        },
        {
          id: "arcade",
          name: "Arcade",
          slug: "arcade",
          gameCount: 180
        },
        {
          id: "adventure",
          name: "Adventure",
          slug: "adventure", 
          gameCount: 130
        },
        {
          id: "action",
          name: "Action",
          slug: "action",
          gameCount: 150
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
