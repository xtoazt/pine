const fs = require('fs');
const path = require('path');

// Curated list of popular HTML5 game categories and titles
const gameTemplates = [
  // Action Games
  { category: 'action', titles: [
    'Super Mario Bros', 'Pac-Man', 'Space Invaders', 'Galaga', 'Donkey Kong',
    'Street Fighter', 'Mortal Kombat', 'Tekken', 'Soul Calibur', 'King of Fighters',
    'Metal Slug', 'Contra', 'Castlevania', 'Mega Man', 'Sonic the Hedgehog',
    'Crash Bandicoot', 'Spyro the Dragon', 'Rayman', 'Prince of Persia', 'Tomb Raider'
  ]},
  
  // Puzzle Games
  { category: 'puzzle', titles: [
    'Tetris', 'Bejeweled', 'Candy Crush', '2048', 'Sudoku',
    'Crossword', 'Word Search', 'Mahjong', 'Solitaire', 'Chess',
    'Checkers', 'Go', 'Connect Four', 'Jenga', 'Rubik\'s Cube',
    'Portal', 'The Witness', 'Baba is You', 'Monument Valley', 'Lumines'
  ]},
  
  // Racing Games
  { category: 'racing', titles: [
    'Need for Speed', 'Gran Turismo', 'Forza', 'Mario Kart', 'F-Zero',
    'Burnout', 'Ridge Racer', 'OutRun', 'Daytona USA', 'Sega Rally',
    'Wipeout', 'F1', 'NASCAR', 'Dirt', 'Project Cars',
    'Asphalt', 'Real Racing', 'CSR Racing', 'Hill Climb Racing', 'Beach Buggy Racing'
  ]},
  
  // Sports Games
  { category: 'sports', titles: [
    'FIFA', 'PES', 'NBA 2K', 'Madden NFL', 'NHL',
    'Tennis', 'Golf', 'Baseball', 'Soccer', 'Basketball',
    'Football', 'Hockey', 'Volleyball', 'Badminton', 'Table Tennis',
    'Bowling', 'Pool', 'Darts', 'Archery', 'Boxing'
  ]},
  
  // Adventure Games
  { category: 'adventure', titles: [
    'The Legend of Zelda', 'Final Fantasy', 'Chrono Trigger', 'Secret of Mana',
    'Earthbound', 'Dragon Quest', 'Pokemon', 'Digimon', 'Yu-Gi-Oh',
    'Kingdom Hearts', 'Persona', 'Fire Emblem', 'Xenoblade', 'Tales of',
    'Ni No Kuni', 'Octopath Traveler', 'Bravely Default', 'Dragon Age', 'Mass Effect'
  ]},
  
  // Strategy Games
  { category: 'strategy', titles: [
    'Civilization', 'Age of Empires', 'Command & Conquer', 'StarCraft',
    'Warcraft', 'Total War', 'Crusader Kings', 'Europa Universalis', 'Hearts of Iron',
    'Company of Heroes', 'Dawn of War', 'Supreme Commander', 'Sins of a Solar Empire',
    'Endless Space', 'XCOM', 'Fire Emblem', 'Advance Wars', 'Final Fantasy Tactics',
    'Disgaea', 'Valkyria Chronicles'
  ]},
  
  // Simulation Games
  { category: 'simulation', titles: [
    'The Sims', 'SimCity', 'Cities: Skylines', 'RollerCoaster Tycoon',
    'Zoo Tycoon', 'Theme Park', 'Theme Hospital', 'Two Point Hospital',
    'Prison Architect', 'RimWorld', 'Factorio', 'Satisfactory', 'Dyson Sphere Program',
    'Stardew Valley', 'Harvest Moon', 'Animal Crossing', 'FarmVille', 'Hay Day',
    'Clash of Clans', 'Clash Royale'
  ]},
  
  // Arcade Games
  { category: 'arcade', titles: [
    'Pong', 'Breakout', 'Asteroids', 'Centipede', 'Frogger',
    'Q*bert', 'Dig Dug', 'Bubble Bobble', 'Bomberman', 'Puzzle Bobble',
    'Metal Slug', 'Contra', 'Gradius', 'R-Type', 'Ikaruga',
    'Cave Story', 'Shovel Knight', 'Hollow Knight', 'Celeste', 'Ori'
  ]},
  
  // Shooter Games
  { category: 'shooter', titles: [
    'Doom', 'Quake', 'Half-Life', 'Counter-Strike', 'Call of Duty',
    'Battlefield', 'Halo', 'Gears of War', 'Destiny', 'Overwatch',
    'Team Fortress', 'Left 4 Dead', 'Borderlands', 'BioShock', 'Metro',
    'Far Cry', 'Crysis', 'Titanfall', 'Apex Legends', 'Valorant'
  ]},
  
  // Platform Games
  { category: 'platform', titles: [
    'Super Mario Bros', 'Sonic the Hedgehog', 'Crash Bandicoot', 'Spyro the Dragon',
    'Rayman', 'Donkey Kong Country', 'Kirby', 'Yoshi', 'Wario', 'Mega Man',
    'Castlevania', 'Metroid', 'Hollow Knight', 'Ori', 'Celeste',
    'Shovel Knight', 'Cuphead', 'A Hat in Time', 'Yooka-Laylee', 'Super Meat Boy'
  ]},
  
  // Educational Games
  { category: 'educational', titles: [
    'Math Blaster', 'Reader Rabbit', 'JumpStart', 'Carmen Sandiego',
    'Oregon Trail', 'Number Munchers', 'Word Munchers', 'Typing Tutor',
    'Mavis Beacon', 'Rosetta Stone', 'Duolingo', 'Khan Academy', 'Scratch',
    'Code.org', 'Tynker', 'Lightbot', 'Human Resource Machine', '7 Billion Humans',
    'Shenzhen I/O', 'TIS-100'
  ]},
  
  // Multiplayer Games
  { category: 'multiplayer', titles: [
    'Among Us', 'Fall Guys', 'Rocket League', 'Fortnite', 'Apex Legends',
    'Call of Duty: Warzone', 'PlayerUnknown\'s Battlegrounds', 'Valorant',
    'League of Legends', 'Dota 2', 'Counter-Strike: Global Offensive',
    'Overwatch', 'Team Fortress 2', 'Left 4 Dead 2', 'Garry\'s Mod',
    'Minecraft', 'Terraria', 'Stardew Valley', 'Don\'t Starve Together',
    'Human: Fall Flat', 'Gang Beasts'
  ]},
  
  // Building Games
  { category: 'building', titles: [
    'Minecraft', 'Terraria', 'Stardew Valley', 'SimCity', 'Cities: Skylines',
    'RollerCoaster Tycoon', 'Zoo Tycoon', 'Theme Park', 'Theme Hospital',
    'Two Point Hospital', 'Prison Architect', 'RimWorld', 'Factorio',
    'Satisfactory', 'Dyson Sphere Program', 'Astroneer', 'No Man\'s Sky',
    'Subnautica', 'The Forest', 'Raft'
  ]},
  
  // Tower Defense Games
  { category: 'tower-defense', titles: [
    'Plants vs Zombies', 'Bloons TD', 'Kingdom Rush', 'Defense Grid',
    'Orcs Must Die', 'Sanctum', 'Dungeon Defenders', 'Anomaly Warzone Earth',
    'Fieldrunners', 'GemCraft', 'Cursed Treasure', 'Desktop Tower Defense',
    'Vector TD', 'Flash Element TD', 'Onslaught', 'Crystal Defenders',
    'PixelJunk Monsters', 'Defense Grid 2', 'X-Morph Defense', 'They Are Billions'
  ]},
  
  // Idle Games
  { category: 'idle', titles: [
    'Cookie Clicker', 'Adventure Capitalist', 'Clicker Heroes', 'Idle Miner Tycoon',
    'Idle Skilling', 'Realm Grinder', 'Ngu Idle', 'Melvor Idle', 'Idle Wizard',
    'Idle Skilling', 'Idle Breakout', 'Idle Slayer', 'Idle Dice', 'Idle Skilling',
    'Idle Breakout', 'Idle Slayer', 'Idle Dice', 'Idle Skilling', 'Idle Breakout'
  ]},
  
  // Board Games
  { category: 'board', titles: [
    'Chess', 'Checkers', 'Go', 'Backgammon', 'Scrabble',
    'Monopoly', 'Risk', 'Settlers of Catan', 'Ticket to Ride', 'Pandemic',
    'Carcassonne', 'Puerto Rico', 'Agricola', 'Power Grid', 'Dominion',
    '7 Wonders', 'Splendor', 'Azul', 'Wingspan', 'Gloomhaven'
  ]},
  
  // RPG Games
  { category: 'rpg', titles: [
    'Final Fantasy', 'Dragon Quest', 'The Elder Scrolls', 'Fallout', 'The Witcher',
    'Mass Effect', 'Dragon Age', 'Persona', 'Fire Emblem', 'Xenoblade',
    'Tales of', 'Ni No Kuni', 'Octopath Traveler', 'Bravely Default', 'Chrono Trigger',
    'Secret of Mana', 'Earthbound', 'Pokemon', 'Digimon', 'Yu-Gi-Oh'
  ]},
  
  // Fighting Games
  { category: 'fighting', titles: [
    'Street Fighter', 'Mortal Kombat', 'Tekken', 'Soul Calibur', 'King of Fighters',
    'Guilty Gear', 'BlazBlue', 'Skullgirls', 'Injustice', 'Dragon Ball FighterZ',
    'Marvel vs Capcom', 'Super Smash Bros', 'Killer Instinct', 'Virtua Fighter',
    'Dead or Alive', 'Soul Calibur', 'Tekken', 'Street Fighter', 'Mortal Kombat'
  ]},
  
  // Horror Games
  { category: 'horror', titles: [
    'Resident Evil', 'Silent Hill', 'Dead Space', 'Amnesia', 'Outlast',
    'Alien: Isolation', 'The Evil Within', 'Until Dawn', 'Man of Medan',
    'Little Hope', 'House of Ashes', 'The Quarry', 'Phasmophobia', 'Dead by Daylight',
    'Friday the 13th', 'Left 4 Dead', 'Dying Light', 'The Forest', 'Subnautica'
  ]},
  
  // Car Games
  { category: 'car', titles: [
    'Need for Speed', 'Gran Turismo', 'Forza', 'Mario Kart', 'F-Zero',
    'Burnout', 'Ridge Racer', 'OutRun', 'Daytona USA', 'Sega Rally',
    'Wipeout', 'F1', 'NASCAR', 'Dirt', 'Project Cars',
    'Asphalt', 'Real Racing', 'CSR Racing', 'Hill Climb Racing', 'Beach Buggy Racing'
  ]},
  
  // Casual Games
  { category: 'casual', titles: [
    'Candy Crush', 'Bejeweled', 'Angry Birds', 'Cut the Rope', 'Plants vs Zombies',
    'Temple Run', 'Subway Surfers', 'Fruit Ninja', 'Doodle Jump', 'Flappy Bird',
    '2048', 'Threes', 'Two Dots', 'Dots', 'Crossy Road',
    'Monument Valley', 'Lumines', 'Peggle', 'Zuma', 'Bookworm'
  ]}
];

function generateGames() {
  const games = [];
  let gameId = 1;
  
  gameTemplates.forEach(template => {
    template.titles.forEach(title => {
      // Generate realistic stats
      const upvotes = Math.floor(Math.random() * 5000) + 100;
      const downvotes = Math.floor(Math.random() * 200) + 10;
      const playCount = Math.floor(Math.random() * 50000) + 1000;
      
      // Generate creation date (random date in the last 2 years)
      const createdAt = new Date(Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000);
      const updatedAt = new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      // Generate tags based on category
      const baseTags = [template.category, 'html5'];
      const additionalTags = [];
      
      if (template.category === 'action') {
        additionalTags.push('fast-paced', 'combat');
      } else if (template.category === 'puzzle') {
        additionalTags.push('brain-teaser', 'logic');
      } else if (template.category === 'racing') {
        additionalTags.push('speed', 'cars');
      } else if (template.category === 'sports') {
        additionalTags.push('competitive', 'athletic');
      } else if (template.category === 'adventure') {
        additionalTags.push('exploration', 'story');
      } else if (template.category === 'strategy') {
        additionalTags.push('tactical', 'planning');
      } else if (template.category === 'simulation') {
        additionalTags.push('management', 'realistic');
      } else if (template.category === 'arcade') {
        additionalTags.push('classic', 'retro');
      } else if (template.category === 'shooter') {
        additionalTags.push('fps', 'combat');
      } else if (template.category === 'platform') {
        additionalTags.push('jumping', 'precision');
      } else if (template.category === 'educational') {
        additionalTags.push('learning', 'kids');
      } else if (template.category === 'multiplayer') {
        additionalTags.push('online', 'social');
      } else if (template.category === 'building') {
        additionalTags.push('construction', 'creative');
      } else if (template.category === 'tower-defense') {
        additionalTags.push('strategy', 'defense');
      } else if (template.category === 'idle') {
        additionalTags.push('incremental', 'passive');
      } else if (template.category === 'board') {
        additionalTags.push('tabletop', 'classic');
      } else if (template.category === 'rpg') {
        additionalTags.push('role-playing', 'character');
      } else if (template.category === 'fighting') {
        additionalTags.push('combat', 'versus');
      } else if (template.category === 'horror') {
        additionalTags.push('scary', 'survival');
      } else if (template.category === 'car') {
        additionalTags.push('vehicles', 'racing');
      } else if (template.category === 'casual') {
        additionalTags.push('relaxing', 'easy');
      }
      
      const tags = [...baseTags, ...additionalTags];
      
      const game = {
        id: `hdun-${template.category}-${gameId}`,
        title: title,
        description: `Play ${title} - an exciting ${template.category} game with engaging gameplay and fun challenges.`,
        thumbnail: `/games/hdun/${template.category}/${gameId}/thumbnail.png`,
        category: template.category,
        tags: tags,
        playUrl: `/play/hdun-${template.category}-${gameId}`,
        upvotes: upvotes,
        downvotes: downvotes,
        playCount: playCount,
        createdAt: createdAt,
        updatedAt: updatedAt,
        source: 'hdun'
      };
      
      games.push(game);
      gameId++;
    });
  });
  
  return games;
}

function main() {
  console.log('Generating curated HDUN games...');
  
  const games = generateGames();
  
  // Save to JSON file
  const outputFile = 'src/data/hdun-games-curated.json';
  fs.writeFileSync(outputFile, JSON.stringify(games, null, 2));
  
  console.log(`✅ Generated ${games.length} curated HDUN games!`);
  console.log(`📁 Games saved to: ${outputFile}`);
  
  // Show statistics
  const categories = {};
  games.forEach(game => {
    categories[game.category] = (categories[game.category] || 0) + 1;
  });
  
  console.log('\n📊 Game Statistics:');
  Object.entries(categories).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} games`);
  });
  
  console.log(`\n🎮 Total games: ${games.length}`);
}

main();
