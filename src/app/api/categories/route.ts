import { NextRequest, NextResponse } from 'next/server'
import hdunGames from '@/data/hdun-games.json'

// Get all unique categories from games
export async function GET(request: NextRequest) {
  try {
    // Get all games (original + HDUN)
    const allGames = [
      // Original games categories
      'action', 'adventure', 'arcade', 'puzzle', 'racing', 'sports', 'strategy', 
      'simulation', 'fighting', 'horror', 'educational', 'multiplayer', 'building', 
      'tower-defense', 'idle', 'board', 'rpg', 'shooter', 'platform', 'car', 'casual'
    ]
    
    // Add HDUN game categories
    const hdunCategories = Array.isArray(hdunGames) ? 
      Array.from(new Set(hdunGames.map(game => game && game.category ? game.category : 'unknown').filter(cat => cat !== 'unknown'))) : 
      []
    
    // Combine and deduplicate
    const allCategories = Array.from(new Set([...allGames, ...hdunCategories]))
    
    // Create category objects with counts
    const categoriesWithCounts = allCategories.map(category => {
      const count = Array.isArray(hdunGames) ? hdunGames.filter(game => game && game.category === category).length : 0
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
        gameCount: hdunGames.length + 606,
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