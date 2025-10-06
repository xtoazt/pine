import { NextRequest, NextResponse } from 'next/server'
// TODO: Implement stats API with Neon database

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'global'

    if (type === 'leaderboard') {
      // TODO: Get leaderboard from Neon database
      return NextResponse.json({ leaderboard: [] })
    }

    if (type === 'global') {
      // TODO: Calculate global statistics from Neon database
      return NextResponse.json({
        totalUsers: 0,
        totalGamesPlayed: 0,
        totalAchievements: 0,
        highestStreak: 0,
        highestLevel: 0
      })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}