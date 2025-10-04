const fs = require('fs');

// Read the lessons data from play.html
const playHtml = fs.readFileSync('/Users/rohan/pine/play.html', 'utf8');

// Extract lessons data using regex
const lessonsMatch = playHtml.match(/const lessonsData = \[([\s\S]*?)\];/);
if (!lessonsMatch) {
  console.error('Could not find lessons data');
  process.exit(1);
}

// Parse the lessons data
const lessonsDataString = '[' + lessonsMatch[1] + ']';
const lessonsData = JSON.parse(lessonsDataString);

// Category mapping
const categoryMap = {
  1: 'battle',
  2: 'horror',
  3: 'shooting',
  4: 'strategy',
  5: 'puzzle',
  6: 'arcade',
  7: 'racing',
  8: 'sports',
  9: 'multiplayer',
  10: 'platform',
  11: 'adventure',
  12: 'rpg',
  13: 'simulation',
  14: 'casual',
  15: 'educational',
  16: 'building',
  17: 'idle',
  18: 'tower-defense',
  19: 'board'
};

// Generate games array
const games = lessonsData.map((lesson, index) => {
  const primaryCategory = categoryMap[lesson.cat[0]] || 'casual';
  const tags = lesson.cat.map(catId => categoryMap[catId] || 'casual');
  
  return {
    id: lesson.lesson,
    title: lesson.name,
    description: `Play ${lesson.name} - an exciting game with engaging gameplay and fun challenges.`,
    thumbnail: `/proxy/lessons-img/${lesson.lesson}.webp`,
    category: primaryCategory,
    tags: tags,
    playUrl: `/play/${lesson.lesson}`,
    upvotes: Math.floor(Math.random() * 5000) + 100,
    downvotes: Math.floor(Math.random() * 200) + 10,
    playCount: Math.floor(Math.random() * 100000) + 1000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  };
});

// Generate the TypeScript file content
const tsContent = `import { NextRequest, NextResponse } from 'next/server'
import { Game, GameSearchParams, GameApiResponse } from '@/types/game'

// ALL 501 games from lessons data
const mockGames: Game[] = [
${games.map(game => `  {
    id: "${game.id}",
    title: "${game.title}",
    description: "${game.description}",
    thumbnail: "${game.thumbnail}",
    category: "${game.category}",
    tags: [${game.tags.map(tag => `"${tag}"`).join(', ')}],
    playUrl: "${game.playUrl}",
    upvotes: ${game.upvotes},
    downvotes: ${game.downvotes},
    playCount: ${game.playCount},
    createdAt: new Date("${game.createdAt.toISOString()}"),
    updatedAt: new Date("${game.updatedAt.toISOString()}")
  }`).join(',\n')}
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const sortBy = searchParams.get('sortBy') || 'popular'
    
    let filteredGames = [...mockGames]
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredGames = filteredGames.filter(game => 
        game.title.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower) ||
        game.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    // Apply category filter
    if (category) {
      filteredGames = filteredGames.filter(game => game.category === category)
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filteredGames.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'oldest':
        filteredGames.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case 'most-played':
        filteredGames.sort((a, b) => b.playCount - a.playCount)
        break
      case 'least-played':
        filteredGames.sort((a, b) => a.playCount - b.playCount)
        break
      case 'highest-rated':
        filteredGames.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
        break
      case 'alphabetical':
        filteredGames.sort((a, b) => a.title.localeCompare(b.title))
        break
      default: // popular
        filteredGames.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    }
    
    // Apply pagination
    const paginatedGames = filteredGames.slice(offset, offset + limit)
    
    const response: GameApiResponse = {
      games: paginatedGames,
      total: filteredGames.length,
      limit,
      offset,
      hasMore: offset + limit < filteredGames.length
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}`;

// Write the file
fs.writeFileSync('/Users/rohan/pine/src/app/api/games/route.ts', tsContent);

console.log(`Generated games API with ${games.length} games`);
console.log('Categories found:', [...new Set(games.map(g => g.category))]);
