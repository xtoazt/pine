import { NextResponse } from 'next/server'
import { GameCategory } from '@/types/game'

// Categories based on actual games from fortnite-game.github.io
const mockCategories: GameCategory[] = [
  {
    id: "new",
    name: "New Games",
    slug: "new",
    description: "Latest games added to the platform",
    gameCount: 12
  },
  {
    id: "popular",
    name: "Popular Games",
    slug: "popular", 
    description: "Most played games on the platform",
    gameCount: 12
  },
  {
    id: "arcade",
    name: "Arcade",
    slug: "arcade",
    description: "Classic and modern arcade games",
    gameCount: 3
  },
  {
    id: "racing",
    name: "Racing",
    slug: "racing",
    description: "High-speed racing and driving games",
    gameCount: 2
  },
  {
    id: "adventure",
    name: "Adventure",
    slug: "adventure",
    description: "Epic adventure and RPG games",
    gameCount: 1
  },
  {
    id: "puzzle",
    name: "Puzzle",
    slug: "puzzle",
    description: "Brain-teasing puzzle games",
    gameCount: 1
  },
  {
    id: "shooting",
    name: "Shooting",
    slug: "shooting",
    description: "Action-packed shooting games",
    gameCount: 1
  },
  {
    id: "sports",
    name: "Sports",
    slug: "sports",
    description: "Sports and athletic games",
    gameCount: 1
  },
  {
    id: "multiplayer",
    name: "Multiplayer",
    slug: "multiplayer",
    description: "Online multiplayer games",
    gameCount: 1
  },
  {
    id: "platform",
    name: "Platform",
    slug: "platform",
    description: "Jump and run platform games",
    gameCount: 1
  },
  {
    id: "fighting",
    name: "Fighting",
    slug: "fighting",
    description: "Combat and fighting games",
    gameCount: 1
  },
  {
    id: "strategy",
    name: "Strategy",
    slug: "strategy",
    description: "Strategic thinking games",
    gameCount: 1
  }
]

export async function GET() {
  try {
    return NextResponse.json(mockCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
