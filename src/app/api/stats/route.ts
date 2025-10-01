import { NextResponse } from 'next/server'
import { GameStats } from '@/types/game'

export async function GET() {
  try {
    const stats: GameStats = {
      totalGames: 500,
      totalCategories: 12,
      totalPlays: 2500000,
      topCategories: [
        {
          id: "action",
          name: "Action",
          slug: "action",
          gameCount: 45
        },
        {
          id: "puzzle",
          name: "Puzzle", 
          slug: "puzzle",
          gameCount: 40
        },
        {
          id: "platform",
          name: "Platform",
          slug: "platform", 
          gameCount: 35
        },
        {
          id: "adventure",
          name: "Adventure",
          slug: "adventure",
          gameCount: 35
        },
        {
          id: "racing",
          name: "Racing",
          slug: "racing",
          gameCount: 25
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
