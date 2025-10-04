const fs = require('fs');
const path = require('path');

// HDUN Games data structure
const hdunGames = [
  // Action Games
  { id: "hdun-action-1", title: "Super Mario Bros", category: "action", tags: ["mario", "platform", "classic"], source: "hdun" },
  { id: "hdun-action-2", title: "Pac-Man", category: "arcade", tags: ["pacman", "maze", "classic"], source: "hdun" },
  { id: "hdun-action-3", title: "Tetris", category: "puzzle", tags: ["tetris", "blocks", "classic"], source: "hdun" },
  { id: "hdun-action-4", title: "Space Invaders", category: "shooter", tags: ["space", "invaders", "classic"], source: "hdun" },
  { id: "hdun-action-5", title: "Donkey Kong", category: "platform", tags: ["donkey", "kong", "classic"], source: "hdun" },
  
  // Racing Games
  { id: "hdun-racing-1", title: "Need for Speed", category: "car", tags: ["racing", "cars", "speed"], source: "hdun" },
  { id: "hdun-racing-2", title: "Mario Kart", category: "car", tags: ["mario", "kart", "racing"], source: "hdun" },
  { id: "hdun-racing-3", title: "Gran Turismo", category: "car", tags: ["racing", "simulation", "cars"], source: "hdun" },
  
  // Puzzle Games
  { id: "hdun-puzzle-1", title: "Candy Crush", category: "puzzle", tags: ["candy", "crush", "match"], source: "hdun" },
  { id: "hdun-puzzle-2", title: "Bejeweled", category: "puzzle", tags: ["jewels", "match", "puzzle"], source: "hdun" },
  { id: "hdun-puzzle-3", title: "Sudoku", category: "puzzle", tags: ["sudoku", "numbers", "logic"], source: "hdun" },
  
  // Adventure Games
  { id: "hdun-adventure-1", title: "Zelda", category: "adventure", tags: ["zelda", "adventure", "rpg"], source: "hdun" },
  { id: "hdun-adventure-2", title: "Final Fantasy", category: "rpg", tags: ["final", "fantasy", "rpg"], source: "hdun" },
  { id: "hdun-adventure-3", title: "Pokemon", category: "rpg", tags: ["pokemon", "catch", "rpg"], source: "hdun" },
  
  // Sports Games
  { id: "hdun-sports-1", title: "FIFA", category: "sports", tags: ["fifa", "soccer", "football"], source: "hdun" },
  { id: "hdun-sports-2", title: "NBA 2K", category: "sports", tags: ["nba", "basketball", "sports"], source: "hdun" },
  { id: "hdun-sports-3", title: "Tennis", category: "sports", tags: ["tennis", "sports", "racket"], source: "hdun" },
  
  // Strategy Games
  { id: "hdun-strategy-1", title: "Chess", category: "strategy", tags: ["chess", "strategy", "board"], source: "hdun" },
  { id: "hdun-strategy-2", title: "Risk", category: "strategy", tags: ["risk", "strategy", "world"], source: "hdun" },
  { id: "hdun-strategy-3", title: "Civilization", category: "strategy", tags: ["civilization", "strategy", "empire"], source: "hdun" },
  
  // Simulation Games
  { id: "hdun-simulation-1", title: "SimCity", category: "simulation", tags: ["simcity", "city", "simulation"], source: "hdun" },
  { id: "hdun-simulation-2", title: "The Sims", category: "simulation", tags: ["sims", "life", "simulation"], source: "hdun" },
  { id: "hdun-simulation-3", title: "Flight Simulator", category: "simulation", tags: ["flight", "simulator", "flying"], source: "hdun" },
  
  // Fighting Games
  { id: "hdun-fighting-1", title: "Street Fighter", category: "fighting", tags: ["street", "fighter", "fighting"], source: "hdun" },
  { id: "hdun-fighting-2", title: "Mortal Kombat", category: "fighting", tags: ["mortal", "kombat", "fighting"], source: "hdun" },
  { id: "hdun-fighting-3", title: "Tekken", category: "fighting", tags: ["tekken", "fighting", "martial"], source: "hdun" },
  
  // Horror Games
  { id: "hdun-horror-1", title: "Resident Evil", category: "horror", tags: ["resident", "evil", "horror"], source: "hdun" },
  { id: "hdun-horror-2", title: "Silent Hill", category: "horror", tags: ["silent", "hill", "horror"], source: "hdun" },
  { id: "hdun-horror-3", title: "Amnesia", category: "horror", tags: ["amnesia", "horror", "scary"], source: "hdun" },
  
  // Educational Games
  { id: "hdun-educational-1", title: "Math Blaster", category: "educational", tags: ["math", "education", "learning"], source: "hdun" },
  { id: "hdun-educational-2", title: "Typing Tutor", category: "educational", tags: ["typing", "education", "keyboard"], source: "hdun" },
  { id: "hdun-educational-3", title: "Geography Quiz", category: "educational", tags: ["geography", "quiz", "education"], source: "hdun" },
  
  // Multiplayer Games
  { id: "hdun-multiplayer-1", title: "Among Us", category: "multiplayer", tags: ["among", "us", "multiplayer"], source: "hdun" },
  { id: "hdun-multiplayer-2", title: "Fortnite", category: "battle", tags: ["fortnite", "battle", "royale"], source: "hdun" },
  { id: "hdun-multiplayer-3", title: "Minecraft", category: "building", tags: ["minecraft", "building", "creative"], source: "hdun" },
  
  // Arcade Games
  { id: "hdun-arcade-1", title: "Galaga", category: "arcade", tags: ["galaga", "arcade", "space"], source: "hdun" },
  { id: "hdun-arcade-2", title: "Centipede", category: "arcade", tags: ["centipede", "arcade", "insect"], source: "hdun" },
  { id: "hdun-arcade-3", title: "Asteroids", category: "arcade", tags: ["asteroids", "arcade", "space"], source: "hdun" },
  
  // Card Games
  { id: "hdun-card-1", title: "Solitaire", category: "board", tags: ["solitaire", "cards", "classic"], source: "hdun" },
  { id: "hdun-card-2", title: "Poker", category: "board", tags: ["poker", "cards", "gambling"], source: "hdun" },
  { id: "hdun-card-3", title: "Blackjack", category: "board", tags: ["blackjack", "cards", "casino"], source: "hdun" },
  
  // Platform Games
  { id: "hdun-platform-1", title: "Sonic", category: "platform", tags: ["sonic", "hedgehog", "platform"], source: "hdun" },
  { id: "hdun-platform-2", title: "Mega Man", category: "platform", tags: ["mega", "man", "platform"], source: "hdun" },
  { id: "hdun-platform-3", title: "Castlevania", category: "platform", tags: ["castlevania", "vampire", "platform"], source: "hdun" },
  
  // Tower Defense
  { id: "hdun-tower-1", title: "Plants vs Zombies", category: "tower-defense", tags: ["plants", "zombies", "tower"], source: "hdun" },
  { id: "hdun-tower-2", title: "Bloons TD", category: "tower-defense", tags: ["bloons", "tower", "defense"], source: "hdun" },
  { id: "hdun-tower-3", title: "Kingdom Rush", category: "tower-defense", tags: ["kingdom", "rush", "tower"], source: "hdun" },
  
  // Idle Games
  { id: "hdun-idle-1", title: "Cookie Clicker", category: "idle", tags: ["cookie", "clicker", "idle"], source: "hdun" },
  { id: "hdun-idle-2", title: "Adventure Capitalist", category: "idle", tags: ["adventure", "capitalist", "idle"], source: "hdun" },
  { id: "hdun-idle-3", title: "Clicker Heroes", category: "idle", tags: ["clicker", "heroes", "idle"], source: "hdun" }
];

// Generate more games to reach 6000+
function generateMoreGames() {
  const categories = ['action', 'puzzle', 'arcade', 'racing', 'adventure', 'sports', 'strategy', 'simulation', 'fighting', 'horror', 'educational', 'multiplayer', 'building', 'tower-defense', 'idle', 'board', 'rpg', 'shooter', 'platform', 'car'];
  const prefixes = ['Super', 'Ultimate', 'Mega', 'Turbo', 'Hyper', 'Pro', 'Elite', 'Master', 'Champion', 'Legendary'];
  const suffixes = ['Deluxe', 'Plus', 'HD', '3D', 'Remastered', 'Classic', 'Gold', 'Platinum', 'Diamond', 'Ultimate'];
  const gameTypes = ['Quest', 'Adventure', 'Challenge', 'Battle', 'Race', 'Puzzle', 'Maze', 'Shooter', 'Platformer', 'Simulator'];
  
  const additionalGames = [];
  
  for (let i = 1; i <= 6000; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const gameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
    
    const title = `${prefix} ${gameType} ${suffix}`;
    const id = `hdun-${category}-${i}`;
    
    additionalGames.push({
      id,
      title,
      category,
      tags: [category, gameType.toLowerCase(), 'hdun'],
      source: 'hdun',
      description: `Play ${title} - an exciting ${category} game with engaging gameplay and fun challenges.`,
      thumbnail: `https://hdun.org/games/alotofgames/img/${id}.png`,
      playUrl: `/play/${id}`,
      upvotes: Math.floor(Math.random() * 5000) + 100,
      downvotes: Math.floor(Math.random() * 200) + 10,
      playCount: Math.floor(Math.random() * 100000) + 1000,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return additionalGames;
}

// Combine all games
const allHdunGames = [...hdunGames, ...generateMoreGames()];

// Convert to the format expected by the API
const formattedGames = allHdunGames.map(game => ({
  id: game.id,
  title: game.title,
  description: game.description || `Play ${game.title} - an exciting game with engaging gameplay and fun challenges.`,
  thumbnail: game.thumbnail || `https://hdun.org/games/alotofgames/img/${game.id}.png`,
  category: game.category,
  tags: game.tags,
  playUrl: game.playUrl || `/play/${game.id}`,
  upvotes: game.upvotes || Math.floor(Math.random() * 5000) + 100,
  downvotes: game.downvotes || Math.floor(Math.random() * 200) + 10,
  playCount: game.playCount || Math.floor(Math.random() * 100000) + 1000,
  createdAt: game.createdAt || new Date(),
  updatedAt: game.updatedAt || new Date()
}));

// Write to a JSON file
const outputPath = path.join(__dirname, '../src/data/hdun-games.json');
fs.writeFileSync(outputPath, JSON.stringify(formattedGames, null, 2));

console.log(`Generated ${formattedGames.length} HDUN games and saved to ${outputPath}`);
console.log('Categories included:', [...new Set(formattedGames.map(g => g.category))]);
console.log('Sample games:', formattedGames.slice(0, 5).map(g => g.title));
