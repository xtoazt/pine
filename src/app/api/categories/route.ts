import { NextRequest, NextResponse } from 'next/server'

// Get all unique categories from games with actual counts
export async function GET(request: NextRequest) {
  try {
    // Fetch games from the main API to get actual counts
    const baseUrl = request.url.split('/api/')[0]
    // Use larger window and page ramp to capture true counts from external sources
    const gamesResponse = await fetch(`${baseUrl}/api/games?limit=5000&page=5&external=true`, { cache: 'no-store' })
    const gamesData = await gamesResponse.json()
    const games = Array.isArray(gamesData.games) ? gamesData.games : []
    
    // Count games per category
    // Allowlist of categories to avoid noise; group unknowns under 'other'
    const ALLOWED = new Set([
      'action','adventure','arcade','puzzle','racing','sports','strategy','simulation','fighting','horror','educational','multiplayer','idle','board','rpg','shooter','platform','car','casual'
    ])
    const categoryCounts: Record<string, number> = {}
    games.forEach((game: any) => {
      const raw = (game.category || 'casual').toString().toLowerCase()
      const normalized = ALLOWED.has(raw) ? raw : 'other'
      categoryCounts[normalized] = (categoryCounts[normalized] || 0) + 1
    })
    
    // Create category objects with actual counts
    const categoriesWithCounts = Object.entries(categoryCounts).map(([category, count]) => ({
      id: category,
      name: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      slug: category,
      description: `Play ${category} games`,
      gameCount: count,
      icon: getCategoryIcon(category)
    })).sort((a, b) => b.gameCount - a.gameCount)
    
    // Add special categories
    const specialCategories = [
      {
        id: 'popular',
        name: 'Popular',
        slug: 'popular',
        description: 'Most popular games',
        gameCount: Math.min(50, games.length),
        icon: 'Flame'
      },
      {
        id: 'new',
        name: 'New Games',
        slug: 'new',
        description: 'Recently added games',
        gameCount: Math.min(50, games.length),
        icon: 'Star'
      },
      {
        id: 'all',
        name: 'All Games',
        slug: 'all',
        description: 'Browse all games',
        gameCount: games.length,
        icon: 'Gamepad2'
      }
    ]
    
    // Remove tiny categories to avoid clutter and sort
    const filteredReal = categoriesWithCounts.filter(c => c.gameCount >= 10)
    const allCategoriesWithSpecial = [...specialCategories, ...filteredReal]
    
    return NextResponse.json({
      categories: allCategoriesWithSpecial,
      total: allCategoriesWithSpecial.length
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

function getCategoryIcon(category: string): string {
  const iconMap: { [key: string]: string } = {
    'action': 'Sword',
    'adventure': 'Map',
    'arcade': 'Gamepad2',
    'puzzle': 'Puzzle',
    'racing': 'Car',
    'sports': 'Trophy',
    'strategy': 'Chess',
    'simulation': 'Monitor',
    'fighting': 'Sword',
    'horror': 'Skull',
    'educational': 'BookOpen',
    'multiplayer': 'Users',
    'building': 'Hammer',
    'tower-defense': 'Shield',
    'idle': 'Clock',
    'board': 'Grid3X3',
    'rpg': 'Crown',
    'shooter': 'Target',
    'platform': 'Zap',
    'car': 'Car',
    'casual': 'Smile',
    'battle': 'Sword'
  }

  return iconMap[category] || 'Gamepad2'
}