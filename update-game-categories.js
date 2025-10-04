const fs = require('fs');

// Read the current games API
const gamesApiPath = '/Users/rohan/pine/src/app/api/games/route.ts';
let gamesApiContent = fs.readFileSync(gamesApiPath, 'utf8');

// Category mapping for better categorization
const categoryMapping = {
  // Lessons games - map based on game names
  'yohoho': 'adventure',
  'paperio': 'multiplayer',
  '2048': 'puzzle',
  'free-kick': 'sports',
  'combines': 'casual',
  'anxiety': 'adventure',
  'drivers': 'car',
  'devil': 'horror',
  'traffic': 'car',
  'escape': 'adventure',
  'fighter': 'fighting',
  'shooter': 'shooter',
  'zombie': 'horror',
  'racing': 'car',
  'battle': 'battle',
  'horror': 'horror',
  'space': 'adventure',
  'tower': 'tower-defense',
  'platform': 'platform',
  'jumper': 'platform',
  'quest': 'rpg',
  'rpg': 'rpg',
  'simulation': 'simulation',
  'city': 'simulation',
  'building': 'building',
  'idle': 'idle',
  'clicker': 'idle',
  'educational': 'educational',
  'math': 'educational',
  'strategy': 'strategy',
  'board': 'board',
  'chess': 'board',
  'card': 'board',
  'poker': 'board',
  'blackjack': 'board',
  'solitaire': 'board',
  'mahjong': 'board',
  'dominoes': 'board',
  'backgammon': 'board',
  'connect': 'board',
  'othello': 'board',
  'reversi': 'board',
  'gomoku': 'board',
  'go': 'board',
  'shogi': 'board',
  'xiangqi': 'board',
  'checkers': 'board',
  'tic-tac': 'board',
  'hangman': 'word',
  'wordle': 'word',
  'crossword': 'word',
  'scrabble': 'word',
  'boggle': 'word',
  'memory': 'puzzle',
  'snake': 'arcade',
  'tetris': 'puzzle',
  'pacman': 'arcade',
  'minesweeper': 'puzzle',
  'sudoku': 'puzzle',
  'chrome': 'arcade',
  'dino': 'arcade',
  'cookie': 'idle',
  'metroidvania': 'platform',
  'rogue': 'rpg',
  'dungeon': 'rpg',
  'turn-based': 'rpg',
  'action-rpg': 'rpg',
  'mmorpg': 'rpg',
  'farm': 'simulation',
  'business': 'simulation',
  'transport': 'simulation',
  'tycoon': 'simulation',
  'mining': 'idle',
  'fantasy': 'rpg',
  'classic': 'tower-defense',
  '3d': 'tower-defense',
  'sci-fi': 'tower-defense',
  'science': 'educational',
  'language': 'educational',
  'history': 'educational',
  'geography': 'educational'
};

// Function to determine category based on game title and tags
function determineCategory(game) {
  const title = game.title.toLowerCase();
  const tags = game.tags.map(tag => tag.toLowerCase());
  
  // Check for specific keywords in title
  for (const [keyword, category] of Object.entries(categoryMapping)) {
    if (title.includes(keyword)) {
      return category;
    }
  }
  
  // Check tags
  for (const tag of tags) {
    if (categoryMapping[tag]) {
      return categoryMapping[tag];
    }
  }
  
  // Default fallback
  return game.category || 'casual';
}

// Function to update game categories
function updateGameCategories() {
  // Extract games array from the file
  const gamesMatch = gamesApiContent.match(/const mockGames: Game\[\] = \[([\s\S]*?)\];/);
  if (!gamesMatch) {
    console.error('Could not find games array');
    return;
  }
  
  const gamesString = gamesMatch[1];
  
  // Parse games (this is a simplified approach)
  const gameMatches = gamesString.match(/\{[^{}]*\}/g);
  if (!gameMatches) {
    console.error('Could not parse games');
    return;
  }
  
  console.log(`Found ${gameMatches.length} games to update`);
  
  // Update categories in the content
  let updatedContent = gamesApiContent;
  
  // Update each game's category
  gameMatches.forEach((gameMatch, index) => {
    const titleMatch = gameMatch.match(/title: "([^"]+)"/);
    const categoryMatch = gameMatch.match(/category: "([^"]+)"/);
    
    if (titleMatch && categoryMatch) {
      const title = titleMatch[1];
      const oldCategory = categoryMatch[1];
      const newCategory = determineCategory({ title, tags: [oldCategory] });
      
      if (newCategory !== oldCategory) {
        console.log(`Updating "${title}": ${oldCategory} -> ${newCategory}`);
        updatedContent = updatedContent.replace(
          new RegExp(`(title: "${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?)category: "${oldCategory}"`),
          `$1category: "${newCategory}"`
        );
      }
    }
  });
  
  // Write updated content
  fs.writeFileSync(gamesApiPath, updatedContent);
  console.log('Game categories updated successfully!');
}

// Run the update
updateGameCategories();
