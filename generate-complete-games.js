const fs = require('fs');

// Read the lessons data from play.html
const playHtml = fs.readFileSync('/Users/rohan/pine/play.html', 'utf8');
const lessonsMatch = playHtml.match(/const lessonsData = \[([\s\S]*?)\];/);
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

// Generate lessons games
const lessonsGames = lessonsData.map((lesson, index) => {
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

// All Fortnite games (35 games)
const fortniteGames = [
  { id: "class-273", title: "Classic Arcade", category: "arcade", tags: ["classic", "arcade", "retro"] },
  { id: "class-356", title: "Level Devil", category: "platform", tags: ["platform", "challenge", "devil"] },
  { id: "class-357", title: "Traffic Escape", category: "racing", tags: ["traffic", "escape", "driving"] },
  { id: "class-402", title: "Stickman Fighter", category: "fighting", tags: ["stickman", "fighting", "action"] },
  { id: "class-403", title: "Zombie Shooter", category: "shooting", tags: ["zombie", "shooting", "survival"] },
  { id: "class-404", title: "Racing Master", category: "racing", tags: ["racing", "cars", "speed"] },
  { id: "class-405", title: "Puzzle Quest", category: "puzzle", tags: ["puzzle", "brain", "challenge"] },
  { id: "class-406", title: "Space Adventure", category: "adventure", tags: ["space", "adventure", "exploration"] },
  { id: "class-407", title: "Tower Defense", category: "tower-defense", tags: ["tower", "defense", "strategy"] },
  { id: "class-408", title: "Platform Jumper", category: "platform", tags: ["platform", "jumping", "precision"] },
  { id: "class-409", title: "Battle Royale", category: "battle", tags: ["battle", "royale", "multiplayer"] },
  { id: "class-410", title: "Horror House", category: "horror", tags: ["horror", "scary", "survival"] },
  { id: "class-411", title: "Shooting Gallery", category: "shooting", tags: ["shooting", "targets", "arcade"] },
  { id: "class-412", title: "Strategy War", category: "strategy", tags: ["strategy", "war", "tactics"] },
  { id: "class-413", title: "Puzzle Master", category: "puzzle", tags: ["puzzle", "master", "challenge"] },
  { id: "class-414", title: "Arcade Classic", category: "arcade", tags: ["arcade", "classic", "retro"] },
  { id: "class-415", title: "Racing Pro", category: "racing", tags: ["racing", "pro", "cars"] },
  { id: "class-416", title: "Sports Champion", category: "sports", tags: ["sports", "champion", "competition"] },
  { id: "class-417", title: "Multiplayer Arena", category: "multiplayer", tags: ["multiplayer", "arena", "online"] },
  { id: "class-418", title: "Platform Hero", category: "platform", tags: ["platform", "hero", "adventure"] },
  { id: "class-419", title: "Adventure Quest", category: "adventure", tags: ["adventure", "quest", "exploration"] },
  { id: "class-420", title: "RPG Legend", category: "rpg", tags: ["rpg", "legend", "roleplay"] },
  { id: "class-421", title: "Simulation City", category: "simulation", tags: ["simulation", "city", "building"] },
  { id: "class-422", title: "Casual Fun", category: "casual", tags: ["casual", "fun", "relaxing"] },
  { id: "class-423", title: "Educational Math", category: "educational", tags: ["educational", "math", "learning"] },
  { id: "class-424", title: "Building Blocks", category: "building", tags: ["building", "blocks", "construction"] },
  { id: "class-425", title: "Idle Clicker", category: "idle", tags: ["idle", "clicker", "incremental"] },
  { id: "class-426", title: "Tower Builder", category: "tower-defense", tags: ["tower", "builder", "defense"] },
  { id: "class-427", title: "Board Game", category: "board", tags: ["board", "game", "strategy"] },
  { id: "class-428", title: "Action Packed", category: "action", tags: ["action", "packed", "exciting"] },
  { id: "class-429", title: "Puzzle Solver", category: "puzzle", tags: ["puzzle", "solver", "brain"] },
  { id: "class-430", title: "Racing Speed", category: "racing", tags: ["racing", "speed", "fast"] },
  { id: "class-431", title: "Shooting Action", category: "shooting", tags: ["shooting", "action", "guns"] },
  { id: "class-432", title: "Platform Adventure", category: "platform", tags: ["platform", "adventure", "jumping"] },
  { id: "class-433", title: "Multiplayer Battle", category: "multiplayer", tags: ["multiplayer", "battle", "online"] }
].map(game => ({
  ...game,
  description: `Play ${game.title} - an exciting game with engaging gameplay and fun challenges.`,
  thumbnail: `https://fortnite-game.github.io/img/${game.id}.png`,
  playUrl: `/play/${game.id}`,
  upvotes: Math.floor(Math.random() * 5000) + 100,
  downvotes: Math.floor(Math.random() * 200) + 10,
  playCount: Math.floor(Math.random() * 100000) + 1000,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15")
}));

// All HTML5 Games (65+ games)
const html5Games = [
  { id: "2048", title: "2048", category: "puzzle", tags: ["2048", "puzzle", "numbers"] },
  { id: "cookie-clicker", title: "Cookie Clicker", category: "idle", tags: ["cookie", "clicker", "idle"] },
  { id: "chrome-dino", title: "Chrome Dino", category: "arcade", tags: ["chrome", "dino", "jump"] },
  { id: "snake", title: "Snake Game", category: "arcade", tags: ["snake", "classic", "arcade"] },
  { id: "tetris", title: "Tetris", category: "puzzle", tags: ["tetris", "puzzle", "blocks"] },
  { id: "pacman", title: "Pac-Man", category: "arcade", tags: ["pacman", "arcade", "classic"] },
  { id: "minesweeper", title: "Minesweeper", category: "puzzle", tags: ["minesweeper", "puzzle", "logic"] },
  { id: "sudoku", title: "Sudoku", category: "puzzle", tags: ["sudoku", "puzzle", "numbers"] },
  { id: "chess", title: "Chess", category: "board", tags: ["chess", "board", "strategy"] },
  { id: "checkers", title: "Checkers", category: "board", tags: ["checkers", "board", "strategy"] },
  { id: "tic-tac-toe", title: "Tic Tac Toe", category: "board", tags: ["tic-tac-toe", "board", "simple"] },
  { id: "hangman", title: "Hangman", category: "word", tags: ["hangman", "word", "guessing"] },
  { id: "wordle", title: "Wordle", category: "word", tags: ["wordle", "word", "puzzle"] },
  { id: "crossword", title: "Crossword", category: "word", tags: ["crossword", "word", "puzzle"] },
  { id: "scrabble", title: "Scrabble", category: "word", tags: ["scrabble", "word", "board"] },
  { id: "boggle", title: "Boggle", category: "word", tags: ["boggle", "word", "letters"] },
  { id: "memory", title: "Memory Game", category: "puzzle", tags: ["memory", "puzzle", "cards"] },
  { id: "solitaire", title: "Solitaire", category: "card", tags: ["solitaire", "card", "puzzle"] },
  { id: "poker", title: "Poker", category: "card", tags: ["poker", "card", "casino"] },
  { id: "blackjack", title: "Blackjack", category: "card", tags: ["blackjack", "card", "casino"] },
  { id: "spider-solitaire", title: "Spider Solitaire", category: "card", tags: ["spider", "solitaire", "card"] },
  { id: "freecell", title: "FreeCell", category: "card", tags: ["freecell", "card", "puzzle"] },
  { id: "hearts", title: "Hearts", category: "card", tags: ["hearts", "card", "trick"] },
  { id: "spades", title: "Spades", category: "card", tags: ["spades", "card", "trick"] },
  { id: "bridge", title: "Bridge", category: "card", tags: ["bridge", "card", "trick"] },
  { id: "rummy", title: "Rummy", category: "card", tags: ["rummy", "card", "matching"] },
  { id: "go-fish", title: "Go Fish", category: "card", tags: ["go-fish", "card", "matching"] },
  { id: "war", title: "War", category: "card", tags: ["war", "card", "simple"] },
  { id: "uno", title: "Uno", category: "card", tags: ["uno", "card", "color"] },
  { id: "skip-bo", title: "Skip-Bo", category: "card", tags: ["skip-bo", "card", "sequence"] },
  { id: "mahjong", title: "Mahjong", category: "tile", tags: ["mahjong", "tile", "matching"] },
  { id: "dominoes", title: "Dominoes", category: "tile", tags: ["dominoes", "tile", "matching"] },
  { id: "backgammon", title: "Backgammon", category: "board", tags: ["backgammon", "board", "strategy"] },
  { id: "checkers-king", title: "King Checkers", category: "board", tags: ["checkers", "king", "strategy"] },
  { id: "connect-four", title: "Connect Four", category: "board", tags: ["connect-four", "board", "strategy"] },
  { id: "othello", title: "Othello", category: "board", tags: ["othello", "board", "strategy"] },
  { id: "reversi", title: "Reversi", category: "board", tags: ["reversi", "board", "strategy"] },
  { id: "gomoku", title: "Gomoku", category: "board", tags: ["gomoku", "board", "strategy"] },
  { id: "go", title: "Go", category: "board", tags: ["go", "board", "strategy"] },
  { id: "shogi", title: "Shogi", category: "board", tags: ["shogi", "board", "strategy"] },
  { id: "xiangqi", title: "Xiangqi", category: "board", tags: ["xiangqi", "board", "strategy"] },
  { id: "checkers-variants", title: "Checkers Variants", category: "board", tags: ["checkers", "variants", "strategy"] },
  { id: "chess-variants", title: "Chess Variants", category: "board", tags: ["chess", "variants", "strategy"] },
  { id: "puzzle-platformer", title: "Puzzle Platformer", category: "platform", tags: ["puzzle", "platform", "challenge"] },
  { id: "metroidvania", title: "Metroidvania", category: "platform", tags: ["metroidvania", "platform", "exploration"] },
  { id: "rogue-like", title: "Rogue-like", category: "rpg", tags: ["rogue-like", "rpg", "procedural"] },
  { id: "rogue-lite", title: "Rogue-lite", category: "rpg", tags: ["rogue-lite", "rpg", "procedural"] },
  { id: "dungeon-crawler", title: "Dungeon Crawler", category: "rpg", tags: ["dungeon", "crawler", "rpg"] },
  { id: "turn-based-rpg", title: "Turn-based RPG", category: "rpg", tags: ["turn-based", "rpg", "strategy"] },
  { id: "action-rpg", title: "Action RPG", category: "rpg", tags: ["action", "rpg", "real-time"] },
  { id: "mmorpg", title: "MMORPG", category: "rpg", tags: ["mmorpg", "rpg", "multiplayer"] },
  { id: "simulation-city", title: "City Simulation", category: "simulation", tags: ["city", "simulation", "building"] },
  { id: "simulation-life", title: "Life Simulation", category: "simulation", tags: ["life", "simulation", "virtual"] },
  { id: "simulation-farm", title: "Farm Simulation", category: "simulation", tags: ["farm", "simulation", "agriculture"] },
  { id: "simulation-business", title: "Business Simulation", category: "simulation", tags: ["business", "simulation", "management"] },
  { id: "simulation-transport", title: "Transport Simulation", category: "simulation", tags: ["transport", "simulation", "logistics"] },
  { id: "simulation-tycoon", title: "Tycoon Simulation", category: "simulation", tags: ["tycoon", "simulation", "business"] },
  { id: "idle-incremental", title: "Idle Incremental", category: "idle", tags: ["idle", "incremental", "clicker"] },
  { id: "idle-mining", title: "Idle Mining", category: "idle", tags: ["idle", "mining", "incremental"] },
  { id: "idle-space", title: "Idle Space", category: "idle", tags: ["idle", "space", "incremental"] },
  { id: "idle-fantasy", title: "Idle Fantasy", category: "idle", tags: ["idle", "fantasy", "incremental"] },
  { id: "tower-defense-classic", title: "Classic Tower Defense", category: "tower-defense", tags: ["tower", "defense", "classic"] },
  { id: "tower-defense-3d", title: "3D Tower Defense", category: "tower-defense", tags: ["tower", "defense", "3d"] },
  { id: "tower-defense-fantasy", title: "Fantasy Tower Defense", category: "tower-defense", tags: ["tower", "defense", "fantasy"] },
  { id: "tower-defense-sci-fi", title: "Sci-Fi Tower Defense", category: "tower-defense", tags: ["tower", "defense", "sci-fi"] },
  { id: "educational-math", title: "Math Educational", category: "educational", tags: ["math", "educational", "learning"] },
  { id: "educational-science", title: "Science Educational", category: "educational", tags: ["science", "educational", "learning"] },
  { id: "educational-language", title: "Language Educational", category: "educational", tags: ["language", "educational", "learning"] },
  { id: "educational-history", title: "History Educational", category: "educational", tags: ["history", "educational", "learning"] },
  { id: "educational-geography", title: "Geography Educational", category: "educational", tags: ["geography", "educational", "learning"] }
].map(game => ({
  ...game,
  description: `Play ${game.title} - an exciting game with engaging gameplay and fun challenges.`,
  thumbnail: `https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/${game.id}/thumbnail.png`,
  playUrl: `/play/${game.id}`,
  upvotes: Math.floor(Math.random() * 5000) + 100,
  downvotes: Math.floor(Math.random() * 200) + 10,
  playCount: Math.floor(Math.random() * 100000) + 1000,
  createdAt: new Date("2023-12-01"),
  updatedAt: new Date("2023-12-01")
}));

// Combine all games
const allGames = [...lessonsGames, ...fortniteGames, ...html5Games];

// Generate the TypeScript file content
const tsContent = `import { NextRequest, NextResponse } from 'next/server'
import { Game, GameSearchParams, GameApiResponse } from '@/types/game'

// ALL games from lessons data + Fortnite games + HTML5 games (${allGames.length} total)
const mockGames: Game[] = [
${allGames.map(game => `  {
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
        (game.description && game.description.toLowerCase().includes(searchLower)) ||
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

console.log(`Generated comprehensive games API with ${allGames.length} games:`);
console.log(`- Lessons games: ${lessonsGames.length}`);
console.log(`- Fortnite games: ${fortniteGames.length}`);
console.log(`- HTML5 games: ${html5Games.length}`);
console.log('Categories found:', [...new Set(allGames.map(g => g.category))]);
