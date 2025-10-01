import { NextResponse } from 'next/server'
import { GameCategory } from '@/types/game'

// Mock data - in a real app, this would come from a database
const mockCategories: GameCategory[] = [
  {
    id: "new",
    name: "New Games",
    slug: "new",
    description: "Latest games added to the platform",
    gameCount: 25
  },
  {
    id: "popular",
    name: "Popular Games",
    slug: "popular", 
    description: "Most played games on the platform",
    gameCount: 50
  },
  {
    id: "2-player",
    name: "2 Player Games",
    slug: "2-player",
    description: "Games you can play with a friend",
    gameCount: 30
  },
  {
    id: "action",
    name: "Action",
    slug: "action",
    description: "Fast-paced action games",
    gameCount: 45
  },
  {
    id: "adventure",
    name: "Adventure",
    slug: "adventure",
    description: "Epic adventure games",
    gameCount: 35
  },
  {
    id: "puzzle",
    name: "Puzzle",
    slug: "puzzle",
    description: "Brain-teasing puzzle games",
    gameCount: 40
  },
  {
    id: "racing",
    name: "Racing",
    slug: "racing",
    description: "High-speed racing games",
    gameCount: 25
  },
  {
    id: "shooting",
    name: "Shooting",
    slug: "shooting",
    description: "Action-packed shooting games",
    gameCount: 30
  },
  {
    id: "sports",
    name: "Sports",
    slug: "sports",
    description: "Sports and athletic games",
    gameCount: 20
  },
  {
    id: "multiplayer",
    name: "Multiplayer",
    slug: "multiplayer",
    description: "Online multiplayer games",
    gameCount: 15
  },
  {
    id: "platform",
    name: "Platform",
    slug: "platform",
    description: "Jump and run platform games",
    gameCount: 35
  },
  {
    id: "fighting",
    name: "Fighting",
    slug: "fighting",
    description: "Combat and fighting games",
    gameCount: 20
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
