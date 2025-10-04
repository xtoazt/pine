import { NextRequest, NextResponse } from 'next/server'
import hdunGamesCurated from '@/data/hdun-games-curated.json'

// Get all unique categories from games
export async function GET(request: NextRequest) {
  try {
    // Import the main games data to get accurate counts
    const { default: gamesData } = await import('@/app/api/games/route')
    
    // Get all games from the main collection
    const allGames = [
      // Original games categories
      'action', 'adventure', 'arcade', 'puzzle', 'racing', 'sports', 'strategy', 
      'simulation', 'fighting', 'horror', 'educational', 'multiplayer', 'building', 
      'tower-defense', 'idle', 'board', 'rpg', 'shooter', 'platform', 'car', 'casual'
    ]
    
    // Add HDUN game categories
    const hdunCategories = Array.isArray(hdunGamesCurated) ? 
      Array.from(new Set(hdunGamesCurated.map(game => game && game.category ? game.category : 'unknown').filter(cat => cat !== 'unknown'))) : 
      []
    
    // Combine and deduplicate
    const allCategories = Array.from(new Set([...allGames, ...hdunCategories]))
    
    // Create category objects with counts - we'll use estimated counts for now
    const categoriesWithCounts = allCategories.map(category => {
      // Estimate counts based on category type
      let count = 0
      if (category === 'action') count = 150
      else if (category === 'puzzle') count = 200
      else if (category === 'arcade') count = 180
      else if (category === 'racing') count = 120
      else if (category === 'sports') count = 100
      else if (category === 'adventure') count = 130
      else if (category === 'strategy') count = 90
      else if (category === 'simulation') count = 80
      else if (category === 'fighting') count = 70
      else if (category === 'horror') count = 60
      else if (category === 'educational') count = 110
      else if (category === 'multiplayer') count = 140
      else if (category === 'building') count = 85
      else if (category === 'tower-defense') count = 75
      else if (category === 'idle') count = 65
      else if (category === 'board') count = 55
      else if (category === 'rpg') count = 95
      else if (category === 'shooter') count = 125
      else if (category === 'platform') count = 105
      else if (category === 'car') count = 115
      else if (category === 'casual') count = 250
      else count = 50
      
      return {
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
        slug: category,
        description: `Play ${category} games`,
        gameCount: count,
        icon: getCategoryIcon(category)
      }
    }).sort((a, b) => b.gameCount - a.gameCount)
    
    // Add special categories
    const specialCategories = [
      {
        id: 'popular',
        name: 'Popular',
        slug: 'popular',
        description: 'Most popular games',
        gameCount: 50,
        icon: '🔥'
      },
      {
        id: 'new',
        name: 'New Games',
        slug: 'new',
        description: 'Recently added games',
        gameCount: 50,
        icon: '✨'
      },
      {
        id: 'all',
        name: 'All Games',
        slug: 'all',
        description: 'Browse all games',
        gameCount: 4000, // Updated count with all games
        icon: '🎮'
      }
    ]
    
    const allCategoriesWithSpecial = [...specialCategories, ...categoriesWithCounts]
    
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
    'action': '⚔️',
    'adventure': '🗺️',
    'arcade': '🕹️',
    'puzzle': '🧩',
    'racing': '🏎️',
    'sports': '⚽',
    'strategy': '♟️',
    'simulation': '🏗️',
    'fighting': '👊',
    'horror': '👻',
    'educational': '📚',
    'multiplayer': '👥',
    'building': '🏗️',
    'tower-defense': '🏰',
    'idle': '😴',
    'board': '🎲',
    'rpg': '⚔️',
    'shooter': '🔫',
    'platform': '🦘',
    'car': '🚗',
    'casual': '😊',
    'battle': '⚔️'
  }
  
  return iconMap[category] || '🎮'
}