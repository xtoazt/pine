import { NextRequest, NextResponse } from 'next/server'

// Popular games from classwork.cc based on the provided list
const classworkGames = [
  'minecraft', 'slope', 'roblox', 'google-baseball', 'smash-karts',
  '1v1lol', 'monkey-mart', 'tunnel-rush', 'moto-x3m', 'bitlife',
  'drift-hunters', 'geometry-dash', 'cookie-clicker', 'gun-spin',
  'fortnite', 'bottle-flip-3d', 'getting-over-it', 'basketball-legends',
  'fnaf-2', 'shell-shockers', 'ovo', 'a-small-world-cup', 'pixel-gun-3d',
  'paperio-2', 'dune', 'retro-bowl', 'friday-night-funkin', 'rocket-league',
  'subway-surfers', 'basket-bros', 'run-3', 'fnaf-1', 'pixel-combat-2',
  'drive-mad', 'csgo-surfing', 'call-of-ops', 'grand-shift-auto',
  'moto-x3m-pool-party', 'espn-baseball', 'happy-wheels', 'aquapark-io',
  'dreadhead-parkour', 'vex-5', 'snow-rider-3d', 'eggy-car', 'among-us',
  'moto-x3m-winter', 'chrome-dino-runner', 'hole-io', 'justfall-lol',
  'flappy-bird', 'paperio', '4th-and-goal-22', 'stumble-guys',
  'worlds-hardest-game', 'color-switch', 'burnout-drift-3',
  'fireboy-and-watergirl-1', 'drift-boss', 'piano-tiles', 'temple-run',
  'rooftop-snipers', 'head-soccer-22', 'crossy-road', 'cluster-truck',
  '8-ball-pool', 'tank-trouble', 'johnny-trigger', 'paper-minecraft',
  'papas-burgeria', 'cannon-basketball', 'slither-io', 'hill-climb-racing',
  'duck-life', 'pac-man', 'getaway-shootout', 'lol-beans', 'terraria',
  'flick-soccer', 'rolling-sky', 'yohoho-io', 'krunker-io', 'doodle-jump',
  'fruit-ninja', 'papas-tacoria', 'cut-the-rope', '2048',
  'fireboy-and-watergirl-2', 'jetpack-joyride', 'osu', 'atari-breakout',
  'papas-hot-doggeria', 'fireboy-and-watergirl-4', '2048-cupcakes',
  'fireboy-and-watergirl-3', 'bus-and-subway-runner', 'bloons-td-6'
]

// Map game slugs to categories
function getCategoryFromSlug(slug: string): string {
  if (slug.includes('soccer') || slug.includes('basketball') || slug.includes('baseball') || 
      slug.includes('sport') || slug.includes('bowl') || slug.includes('goal')) {
    return 'sports'
  }
  if (slug.includes('drift') || slug.includes('moto') || slug.includes('drive') || 
      slug.includes('racing') || slug.includes('rider')) {
    return 'racing'
  }
  if (slug.includes('gun') || slug.includes('shoot') || slug.includes('combat') || 
      slug.includes('ops') || slug.includes('tank')) {
    return 'shooter'
  }
  if (slug.includes('papa') || slug.includes('burger') || slug.includes('taco') || 
      slug.includes('doggeria')) {
    return 'cooking'
  }
  if (slug.includes('fireboy') || slug.includes('watergirl')) {
    return 'puzzle'
  }
  if (slug.includes('fnaf')) {
    return 'horror'
  }
  if (slug.includes('io')) {
    return 'multiplayer'
  }
  if (slug.includes('monkey') || slug.includes('mart') || slug.includes('life')) {
    return 'simulation'
  }
  return 'arcade'
}

export async function GET(request: NextRequest) {
  try {
    const games = classworkGames.map(slug => {
      const title = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/lol/gi, 'LOL')
        .replace(/io/gi, '.io')
        .replace(/3d/gi, '3D')
        .replace(/2d/gi, '2D')
        .replace(/Fnaf/g, 'FNAF')
        .replace(/Csgo/g, 'CS:GO')
        .replace(/Espn/g, 'ESPN')
        .replace(/Ovo/g, 'OvO')
        .replace(/1v1/g, '1v1')
      
      return {
        slug,
        title,
        category: getCategoryFromSlug(slug)
      }
    })

    return NextResponse.json({ games })
  } catch (error) {
    console.error('Error fetching classwork games:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classwork games' },
      { status: 500 }
    )
  }
}
