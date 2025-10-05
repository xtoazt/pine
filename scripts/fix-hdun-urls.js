const fs = require('fs');
const path = require('path');

// Read the curated HDUN games
const hdunGamesPath = path.join(__dirname, '../src/data/hdun-games-curated.json');
const hdunGames = JSON.parse(fs.readFileSync(hdunGamesPath, 'utf-8'));

// Function to convert game title to HDUN slug
function titleToHdunSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '') // Remove spaces
    .replace(/-+/g, ''); // Remove hyphens
}

// Update each HDUN game with proper playUrl
const updatedGames = hdunGames.map(game => {
  if (game.source === 'hdun') {
    // Extract the actual game name from title
    const hdunSlug = titleToHdunSlug(game.title);
    
    return {
      ...game,
      playUrl: `/api/hdun/proxy?id=${hdunSlug}`,
      thumbnail: `/api/hdun/proxy?id=${hdunSlug}&path=thumbnail.png`
    };
  }
  return game;
});

// Write the updated data back
fs.writeFileSync(hdunGamesPath, JSON.stringify(updatedGames, null, 2));

console.log(`✅ Fixed ${updatedGames.filter(g => g.source === 'hdun').length} HDUN game URLs`);
console.log('Sample URLs:');
updatedGames.filter(g => g.source === 'hdun').slice(0, 5).forEach(g => {
  console.log(`  ${g.title}: ${g.playUrl}`);
});
