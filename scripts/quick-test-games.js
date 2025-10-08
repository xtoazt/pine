#!/usr/bin/env node

/**
 * Quick Game Tester
 * 
 * Tests a small sample of games quickly to identify issues
 * 
 * Usage:
 *   node scripts/quick-test-games.js
 */

const { validateGame, makeRequest } = require('./validate-and-cleanup-games.js')
const fs = require('fs').promises
const path = require('path')

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}

function log(msg, color = 'reset') {
  console.log(`${COLORS[color]}${msg}${COLORS.reset}`)
}

async function quickTest() {
  log('\n🎮 Quick Game Test (First 5 from each source)\n', 'cyan')
  
  const results = {
    poki: { tested: 0, working: 0, broken: 0 },
    playgama: { tested: 0, working: 0, broken: 0 }
  }
  
  // Test Poki games
  try {
    const pokiContent = await fs.readFile(path.join(process.cwd(), 'poki-games.json'), 'utf8')
    const pokiData = JSON.parse(pokiContent)
    const testGames = pokiData.games?.slice(0, 5) || []
    
    log('📦 Testing Poki games:', 'cyan')
    for (const game of testGames) {
      results.poki.tested++
      // Construct full Poki URL (matching API route logic)
      const url = game.url ? `https://poki.com${game.url}` : game.playUrl
      process.stdout.write(`  Testing: ${game.title?.substring(0, 40).padEnd(40)} `)
      
      try {
        const result = await makeRequest(url, 'HEAD')
        if (result.ok) {
          log('✅', 'green')
          results.poki.working++
        } else {
          log(`❌ (${result.status})`, 'red')
          results.poki.broken++
        }
      } catch (err) {
        log(`❌ (${err.message})`, 'red')
        results.poki.broken++
      }
    }
  } catch (err) {
    log(`  ⚠️  Could not load poki-games.json: ${err.message}`, 'yellow')
  }
  
  log('')
  
  // Test PlayGama games
  try {
    const playgamaContent = await fs.readFile(path.join(process.cwd(), 'playgama-games.json'), 'utf8')
    const playgamaData = JSON.parse(playgamaContent)
    
    let testGames = []
    if (playgamaData.segments?.[0]?.hits) {
      testGames = playgamaData.segments[0].hits.slice(0, 5)
    }
    
    log('📦 Testing PlayGama games:', 'cyan')
    for (const game of testGames) {
      results.playgama.tested++
      const url = game.gameURL || game.playUrl
      process.stdout.write(`  Testing: ${game.title?.substring(0, 40).padEnd(40)} `)
      
      try {
        const result = await makeRequest(url, 'HEAD')
        if (result.ok) {
          log('✅', 'green')
          results.playgama.working++
        } else {
          log(`❌ (${result.status})`, 'red')
          results.playgama.broken++
        }
      } catch (err) {
        log(`❌ (${err.message})`, 'red')
        results.playgama.broken++
      }
    }
  } catch (err) {
    log(`  ⚠️  Could not load playgama-games.json: ${err.message}`, 'yellow')
  }
  
  // Summary
  log('\n' + '='.repeat(60), 'cyan')
  log('📊 Quick Test Summary:', 'cyan')
  log('='.repeat(60), 'cyan')
  
  Object.entries(results).forEach(([source, data]) => {
    if (data.tested > 0) {
      const percent = ((data.working / data.tested) * 100).toFixed(0)
      const color = percent >= 80 ? 'green' : percent >= 50 ? 'yellow' : 'red'
      log(`\n${source}:`, 'cyan')
      log(`  Tested: ${data.tested}`, 'gray')
      log(`  Working: ${data.working}/${data.tested} (${percent}%)`, color)
      log(`  Broken: ${data.broken}`, data.broken > 0 ? 'red' : 'gray')
    }
  })
  
  log('\n💡 To validate all games and remove broken ones:', 'cyan')
  log('   node scripts/validate-and-cleanup-games.js --dry-run', 'gray')
  log('\n')
}

quickTest().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})

