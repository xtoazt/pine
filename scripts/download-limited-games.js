const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
const MAX_GAMES = 4500; // Limit to 4,500 games
const ZIP_URL = 'https://www.hdun.org/games/alotofgames/?get=zip';
const ZIP_FILE = 'hdun-games-limited.zip';
const EXTRACT_DIR = 'hdun-games-extracted';
const OUTPUT_FILE = 'src/data/hdun-games-limited.json';

async function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    const request = https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    });
    
    request.on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

function extractZip(zipFile, extractDir) {
  try {
    // Create extract directory
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
    }
    
    // Extract zip file
    execSync(`unzip -q "${zipFile}" -d "${extractDir}"`);
    console.log(`Extracted ${zipFile} to ${extractDir}`);
  } catch (error) {
    console.error('Error extracting zip:', error.message);
    throw error;
  }
}

function processGames(extractDir, maxGames) {
  const games = [];
  let gameCount = 0;
  
  function processDirectory(dirPath, relativePath = '') {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      if (gameCount >= maxGames) break;
      
      const itemPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Check if this directory contains game files
        const gameFiles = fs.readdirSync(itemPath).filter(file => 
          file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.swf')
        );
        
        if (gameFiles.length > 0) {
          // This is a game directory
          const gameId = `hdun-${item.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
          const mainFile = gameFiles.find(file => file.endsWith('.html')) || gameFiles[0];
          
          // Determine category based on directory structure or filename
          let category = 'arcade';
          if (itemRelativePath.includes('action') || itemRelativePath.includes('shooter')) {
            category = 'action';
          } else if (itemRelativePath.includes('puzzle') || itemRelativePath.includes('brain')) {
            category = 'puzzle';
          } else if (itemRelativePath.includes('racing') || itemRelativePath.includes('car')) {
            category = 'racing';
          } else if (itemRelativePath.includes('sports')) {
            category = 'sports';
          } else if (itemRelativePath.includes('strategy')) {
            category = 'strategy';
          } else if (itemRelativePath.includes('adventure')) {
            category = 'adventure';
          }
          
          const game = {
            id: gameId,
            title: item.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `Play ${item.replace(/[-_]/g, ' ')} - an exciting HTML5 game with engaging gameplay.`,
            thumbnail: `/games/hdun/${itemRelativePath}/thumbnail.png`, // Placeholder
            category: category,
            tags: [category, 'html5', 'hdun'],
            playUrl: `/play/${gameId}`,
            upvotes: Math.floor(Math.random() * 1000) + 100,
            downvotes: Math.floor(Math.random() * 50),
            playCount: Math.floor(Math.random() * 10000) + 1000,
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            source: 'hdun'
          };
          
          games.push(game);
          gameCount++;
          
          if (gameCount % 100 === 0) {
            console.log(`Processed ${gameCount} games...`);
          }
        }
        
        // Recursively process subdirectories
        if (gameCount < maxGames) {
          processDirectory(itemPath, itemRelativePath);
        }
      }
    }
  }
  
  processDirectory(extractDir);
  return games;
}

async function main() {
  try {
    console.log('Starting limited HDUN games download and processing...');
    console.log(`Target: ${MAX_GAMES} games`);
    
    // Download the zip file
    console.log('Downloading games zip file...');
    await downloadFile(ZIP_URL, ZIP_FILE);
    
    // Extract the zip file
    console.log('Extracting games...');
    extractZip(ZIP_FILE, EXTRACT_DIR);
    
    // Process games (limited to MAX_GAMES)
    console.log('Processing games...');
    const games = processGames(EXTRACT_DIR, MAX_GAMES);
    
    // Save to JSON file
    console.log(`Saving ${games.length} games to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(games, null, 2));
    
    // Cleanup
    console.log('Cleaning up temporary files...');
    fs.unlinkSync(ZIP_FILE);
    execSync(`rm -rf "${EXTRACT_DIR}"`);
    
    console.log(`✅ Successfully processed ${games.length} HDUN games!`);
    console.log(`📁 Games saved to: ${OUTPUT_FILE}`);
    
    // Show some statistics
    const categories = {};
    games.forEach(game => {
      categories[game.category] = (categories[game.category] || 0) + 1;
    });
    
    console.log('\n📊 Game Statistics:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} games`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
