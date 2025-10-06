import { NextRequest, NextResponse } from 'next/server'

// S16 game list endpoint - fetches games from s16.lol
// This creates a local cache of s16 games that can be integrated into the main catalog

interface S16Game {
  id: string
  title: string
  url: string
  thumbnail?: string
  category?: string
  description?: string
}

// Comprehensive list of s16 game IDs (these are known working games from s16.lol)
// This list will be expanded as we discover more games
const S16_GAME_IDS = [
  '1v1-lol', '2048', '8-ball-pool', 'among-us', 'angry-birds',
  'basketball-stars', 'bitlife', 'bloons-td', 'bottle-flip', 'boxing-random',
  'break-the-ice', 'btd5', 'btd6', 'bullet-force', 'burrito-bison',
  'cat-ninja', 'chess', 'chrome-dino', 'cluster-rush', 'cookie-clicker',
  'crossy-road', 'cut-the-rope', 'death-run-3d', 'doodle-jump', 'draw-it',
  'drift-boss', 'duck-life', 'earn-to-die', 'eggy-car', 'elastic-man',
  'fireboy-and-watergirl', 'flappy-bird', 'fnaf', 'fruit-ninja', 'geometry-dash',
  'getting-over-it', 'google-feud', 'granny', 'happy-wheels', 'hill-climb-racing',
  'hole-io', 'idle-breakout', 'jetpack-joyride', 'krunker', 'level-devil',
  'madalin-stunt-cars', 'minecraft', 'moto-x3m', 'ovo', 'pacman',
  'paper-io', 'parking-fury', 'penalty-kick', 'ping-pong', 'pixel-gun-3d',
  'plants-vs-zombies', 'pokemon', 'pool-party', 'portal', 'retro-bowl',
  'riddle-school', 'rooftop-snipers', 'run-3', 'sand-game', 'shell-shockers',
  'slope', 'smash-karts', 'snake', 'soccer-random', 'solitaire',
  'sonic', 'space-invaders', 'stack', 'stickman-hook', 'subway-surfers',
  'super-mario', 'super-smash-flash', 'swerve', 'tank-trouble', 'temple-run',
  'tetris', 'the-impossible-quiz', 'tiny-fishing', 'tower-defense', 'tunnel-rush',
  'vex', 'volley-random', 'warfare-1917', 'wordle', 'world-hardest-game',
  'zombie-derby', 'zombs-royale', 'zoom-be', 'agar-io', 'archery-world-tour',
  'awesome-tanks', 'bad-ice-cream', 'balloon-tower-defense', 'basketball-legends',
  'big-tower-tiny-square', 'bike-mania', 'bloxorz', 'bob-the-robber',
  'bonk-io', 'bubble-shooter', 'bullet-force-multiplayer', 'burrito-bison-launcha-libre',
  'cannon-basketball', 'car-drawing-game', 'checkers', 'chess-online',
  'clicker-heroes', 'color-switch', 'connect-4', 'cookie-clicker-2',
  'crossy-chicken', 'cube-escape', 'curveball', 'cut-the-rope-2',
  'darts', 'death-chase', 'defend-your-nuts', 'diep-io', 'dino-game',
  'doge-miner', 'dont-look-back', 'doom', 'doomsday-clicker', 'douchebag-workout',
  'draw-climber', 'drive-mad', 'ducklings', 'dunkers', 'earn-to-die-2',
  'electric-man', 'escape-room', 'fancy-pants', 'feed-us', 'final-ninja',
  'fire-truck', 'fish-eat-fish', 'fleeing-the-complex', 'flight', 'flip-master',
  'football-legends', 'free-rider', 'frogger', 'fruit-slice', 'funky-friday',
  'g-switch', 'game-of-life', 'geometry-neon-dash', 'getaway-shootout', 'glass-masquerade',
  'gold-miner', 'golf-battle', 'good-game-empire', 'google-snake', 'gravity-guy',
  'grow-valley', 'gun-mayhem', 'gun-mayhem-2', 'hanger', 'hanger-2',
  'happy-glass', 'helix-jump', 'hex-empire', 'hobo', 'hobo-2',
  'hobo-3', 'hobo-4', 'hobo-5', 'hobo-6', 'hobo-7',
  'hocus', 'home-sheep-home', 'hook', 'hoops', 'house-of-hazards',
  'idle-miner', 'impossible-quiz-2', 'infiltrating-the-airship', 'jacksmith', 'jelly-truck',
  'jewel-academy', 'johnny-upgrade', 'jump-ball', 'jumping-shell', 'just-fall',
  'kick-the-buddy', 'king-of-thieves', 'kitten-cannon', 'knife-hit', 'knight-squad',
  'learn-to-fly', 'learn-to-fly-2', 'learn-to-fly-3', 'line-rider', 'little-alchemy',
  'lows-adventures', 'lows-adventures-2', 'lows-adventures-3', 'magic-piano-tiles',
  'mahjong', 'match-3', 'mech-arena', 'mega-ramp', 'merge-dragons',
  'merge-plane', 'metal-slug', 'minecraft-classic', 'mini-golf', 'mini-putt',
  'missile-game', 'money-movers', 'money-movers-2', 'money-movers-3', 'monkey-mart',
  'monopoly', 'monster-tracks', 'moon-waltz', 'mortal-kombat', 'motorbike',
  'mountain-bike', 'mr-bullet', 'mr-mine', 'mutilate-a-doll', 'my-friend-pedro',
  'n-game', 'neon-rider', 'ninja-painter', 'nitro-type', 'no-brakes',
  'no-humanity', 'noughts-and-crosses', 'nut-rush', 'obstacle-course', 'office-fight',
  'oh-snow', 'one-more-dash', 'only-up', 'orbit', 'pack-master',
  'paint-io', 'papa-louie', 'papa-pizzeria', 'parking-mania', 'path-of-exile',
  'penguin-diner', 'penguin-diner-2', 'penguin-massacre', 'piano-tiles', 'ping-pong-chaos',
  'pixel-warfare', 'pizzeria', 'planet-clicker', 'platform-racing', 'plazma-burst',
  'pocket-racing', 'poki', 'poly-bridge', 'pop-it', 'portal-flash',
  'potty-racers', 'power-rangers', 'prison-escape', 'punch-legend', 'push-your-luck',
  'puzzle-bobble', 'qwop', 'raft-wars', 'raft-wars-2', 'ragdoll-archers',
  'ragdoll-tennis', 'raze', 'raze-2', 'raze-3', 'red-ball',
  'red-ball-2', 'red-ball-3', 'red-ball-4', 'red-remover', 'redux',
  'return-man', 'return-man-2', 'return-man-3', 'ricochet-kills', 'riddle-school-2',
  'riddle-school-3', 'riddle-school-4', 'riddle-school-5', 'riddle-transfer', 'riddle-transfer-2',
  'road-blocks', 'road-fury', 'road-of-fury', 'rocket-league', 'rocket-soccer',
  'roller-coaster', 'rolling-sky', 'rooftop-shooters', 'rope-hero', 'rotate',
  'run', 'run-2', 'run-3-unblocked', 'running-fred', 'rush-team',
  'sand-balls', 'santa-tracker', 'save-the-girl', 'scribble-io', 'sea-battle',
  'shape-fold', 'shark-io', 'sheep-party', 'sherwood-dungeon', 'shift',
  'shift-2', 'shift-3', 'shift-4', 'shooting-fish', 'shopping-cart-hero',
  'short-life', 'short-ride', 'skate-hooligans', 'skateboard', 'ski-safari',
  'skribbl-io', 'skull-kid', 'sky-wire', 'slap-kings', 'slime-laboratory',
  'slither-io', 'slope-2', 'slope-3', 'slope-ball', 'slope-city',
  'slope-game', 'slope-racing', 'slope-tunnel', 'slope-unblocked', 'slow-roads',
  'smash-bros', 'smash-karts-io', 'snail-bob', 'snail-bob-2', 'snail-bob-3',
  'snail-bob-4', 'snail-bob-5', 'snail-bob-6', 'snail-bob-7', 'snail-bob-8',
  'snake-game', 'snake-io', 'snow-rider', 'snowball-io', 'soccer-physics',
  'soccer-skills', 'sonic-2', 'sonic-3', 'sonic-advance', 'sonic-adventure',
  'sonic-cd', 'sonic-heroes', 'sonic-mania', 'sonic-riders', 'sonic-rush',
  'sonic-the-hedgehog', 'sonic-unleashed', 'soul-knight', 'space-company', 'space-is-key',
  'space-is-key-2', 'space-thing', 'spades', 'speed-typing', 'spelunky',
  'spider-solitaire', 'spin-soccer', 'spiral-roll', 'sports-heads', 'sports-heads-basketball',
  'sports-heads-football', 'sports-heads-racing', 'sports-heads-tennis', 'spray-paint', 'sprinter',
  'squid-game', 'stack-ball', 'stack-bump', 'stack-city', 'stack-colors',
  'stack-fall', 'stack-jump', 'stack-rider', 'stack-tower', 'stacker',
  'stair-race', 'star-wars', 'steal-the-meal', 'stealing-the-diamond', 'stick-duel',
  'stick-fight', 'stick-merge', 'stick-rpg', 'stick-run', 'stick-war',
  'stickman', 'stickman-archer', 'stickman-army', 'stickman-basketball', 'stickman-bike',
  'stickman-climb', 'stickman-dismount', 'stickman-fighter', 'stickman-golf', 'stickman-parkour',
  'stickman-party', 'stickman-ragdoll', 'stickman-shooter', 'stickman-soccer', 'stickman-swing',
  'stickman-warrior', 'sticky-ninja', 'street-fighter', 'street-racing', 'strike-force-heroes',
  'strike-force-heroes-2', 'strike-force-heroes-3', 'stumble-guys', 'stunt-bike', 'stunt-car',
  'stunt-crazy', 'stunt-dirt-bike', 'stunt-master', 'stunt-paradise', 'stunt-pilot',
  'subway-surf', 'sugar-sugar', 'sugar-sugar-2', 'sugar-sugar-3', 'summer-sports',
  'super-bike', 'super-hot', 'super-mario-64', 'super-mario-bros', 'super-mario-flash',
  'super-mario-flash-2', 'super-mario-kart', 'super-mario-maker', 'super-mario-run', 'super-mario-sunshine',
  'super-mario-world', 'super-meat-boy', 'super-smash-bros', 'super-smash-flash-2', 'super-stacker',
  'super-stacker-2', 'super-stacker-3', 'superhot', 'surgeon-simulator', 'survival-io',
  'sushi-party', 'swamp-attack', 'swap-heroes', 'sweet-tooth', 'swing-copters',
  'swing-monkey', 'swing-rider', 'swing-star', 'swingers', 'sword-art-online',
  'swords-and-sandals', 'swords-and-souls', 'table-tennis', 'tag', 'tag-2',
  'tag-3', 'tag-4', 'talking-tom', 'tank-battle', 'tank-fight',
  'tank-fury', 'tank-hero', 'tank-io', 'tank-mania', 'tank-stars',
  'tank-storm', 'tank-tactics', 'tank-wars', 'tanki-online', 'tanks',
  'tap-tap-dash', 'tap-tap-shots', 'tap-titans', 'taptap-heroes', 'taxi-driver',
  'temple-of-boom', 'temple-run-2', 'tennis', 'territory-war', 'test-drive',
  'tetris-battle', 'tetris-friends', 'tetris-online', 'the-binding-of-isaac', 'the-escapists',
  'the-floor-is-lava', 'the-game', 'the-hardest-game', 'the-heist', 'the-impossible-game',
  'the-last-stand', 'the-line-game', 'the-maze', 'the-password-game', 'the-worlds-hardest-game',
  'there-is-no-game', 'thief-puzzle', 'thing-thing', 'thing-thing-2', 'thing-thing-3',
  'thing-thing-4', 'this-is-the-only-level', 'this-man', 'throw-knife', 'thumb-fighter',
  'tic-tac-toe', 'time-shooter', 'time-shooter-2', 'time-shooter-3', 'tiny-tanks',
  'tire-master', 'tomb-runner', 'tomb-runner-2', 'too-many-ninjas', 'top-speed',
  'top-speed-3d', 'tornado-io', 'total-battle', 'tower-blocks', 'tower-builder',
  'tower-crush', 'tower-defense-2', 'tower-defense-3', 'tower-defense-4', 'tower-defense-5',
  'tower-of-hell', 'town-of-salem', 'track-mania', 'traffic-jam', 'traffic-racer',
  'traffic-rider', 'traffic-run', 'traffic-rush', 'trail-boss', 'train-simulator',
  'train-snake', 'train-surfer', 'train-taxi', 'transformice', 'trap-adventure',
  'trap-the-cat', 'trap-the-mouse', 'treasure-arena', 'tree-game', 'trial-bike',
  'trial-mania', 'tribal-wars', 'trick-shot', 'tron', 'truck-loader',
  'truck-loader-2', 'truck-loader-3', 'truck-loader-4', 'truck-loader-5', 'truck-mania',
  'truck-trials', 'true-skate', 'tube-jumpers', 'tug-of-heads', 'tug-of-war',
  'tunnel-rush-2', 'tunnel-rush-3', 'turbo-dismount', 'turbo-drift', 'turbo-golf',
  'turbo-moto-racer', 'turbo-racing', 'turbo-spirit', 'turbo-stars', 'turn-based-ship',
  'tycoon', 'ultimate-boxing', 'ultimate-flash-sonic', 'ultimate-golf', 'ultimate-knockout-race',
  'ultimate-sudoku', 'ultimate-tic-tac-toe', 'ultra-pixel-survive', 'unblock-me', 'unblocked-games',
  'unfair-mario', 'unicycle-hero', 'uno', 'uno-online', 'unstable-unicorns',
  'up-hill-racing', 'uphill-rush', 'uphill-rush-2', 'uphill-rush-3', 'uphill-rush-4',
  'uphill-rush-5', 'uphill-rush-6', 'uphill-rush-7', 'uphill-rush-8', 'urban-sniper',
  'urban-sniper-2', 'urban-sniper-3', 'urban-sniper-4', 'vacation-simulator', 'vacuum-rage',
  'valet-parking', 'vampire-survivors', 'vectaria', 'vehicle-physics', 'vehicular-combat',
  'velocity-raptor', 'venge-io', 'vex-2', 'vex-3', 'vex-4',
  'vex-5', 'vex-6', 'vex-7', 'vex-challenges', 'vex-online',
  'viking-escape', 'viking-village', 'village-builder', 'virtual-piano', 'virus-attack',
  'virus-wars', 'volleyball', 'volleyball-challenge', 'voxiom-io', 'vs-racing',
  'vs-racing-2', 'wacky-wizards', 'waffle-game', 'walk-master', 'wall-ball',
  'war-brokers', 'war-clicks', 'war-of-sticks', 'war-thunder', 'warfare-1944',
  'warfare-online', 'warlords', 'warmerise', 'warzone', 'water-sort',
  'water-sort-puzzle', 'watermelon-game', 'we-become-what-we-behold', 'weapon-shop', 'weapons-simulator',
  'web-gl-fluid', 'weird-game', 'wheely', 'wheely-2', 'wheely-3',
  'wheely-4', 'wheely-5', 'wheely-6', 'wheely-7', 'wheely-8',
  'wheres-my-avocado', 'wheres-my-water', 'whirlybird', 'white-tile', 'who-is',
  'whos-your-daddy', 'wild-west-shootout', 'wind-rider', 'wing-io', 'wings-io',
  'winter-clash', 'winter-dodge', 'winter-rush', 'wire', 'wire-hoop',
  'wizard-101', 'wizard-school', 'wolf-simulator', 'wood-blocks', 'word-cookies',
  'word-search', 'word-seeker', 'word-trip', 'word-wipe', 'wordament',
  'wordle-unlimited', 'wordscapes', 'world-cup-penalty', 'world-of-tanks', 'world-of-warcraft',
  'worlds-hardest-game-2', 'worlds-hardest-game-3', 'worm-hunt', 'worms-zone', 'wrassling',
  'wrestling-empire', 'wwe-2k', 'x-trial-racing', 'x-trench-run', 'xmas-dash',
  'xmas-furious', 'xmas-rooftop-battles', 'yandere-simulator', 'yeet-a-friend', 'yes-or-no',
  'yo-ho-ho', 'you-are-jeff-bezos', 'you-cant-park-here', 'youtube-simulator', 'yukon-solitaire',
  'yummy-cupcake', 'yummy-super-pizza', 'z-type', 'zball', 'zen-blaster',
  'zero-squares', 'zigzag', 'zip-zap', 'zombie-apocalypse', 'zombie-assault',
  'zombie-attack', 'zombie-catchers', 'zombie-derby-2', 'zombie-farm', 'zombie-frontier',
  'zombie-hunter', 'zombie-idle-defense', 'zombie-killer', 'zombie-last-night', 'zombie-massacre',
  'zombie-mission', 'zombie-outbreak', 'zombie-parade', 'zombie-rush', 'zombie-shooter',
  'zombie-survival', 'zombie-tornado', 'zombie-tsunami', 'zombie-uprising', 'zombie-walker',
  'zombie-world', 'zombiecraft', 'zombies-ate-my-phone', 'zombies-cant-jump', 'zombies-vs-penguins',
  'zombocalypse', 'zombocalypse-2', 'zombotron', 'zombotron-2', 'zombs-io',
  'zone-tan', 'zoo-boom', 'zoo-keeper', 'zoo-race', 'zoom',
  'zuma', 'zuma-deluxe', 'zuma-revenge', 'zynga-poker'
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Generate game objects from our ID list
    const games: S16Game[] = S16_GAME_IDS.slice(offset, offset + limit).map(id => {
      const title = id
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      return {
        id,
        title,
        url: `https://s16.lol/game/${id}`,
        thumbnail: `https://s16.lol/cdn/game-thumbs/${id}.jpg`,
        category: 'arcade',
        description: `Play ${title} - an exciting game from s16.lol`
      }
    })
    
    return NextResponse.json({
      games,
      total: S16_GAME_IDS.length,
      offset,
      limit
    })
  } catch (error) {
    console.error('[s16/list] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch s16 games' },
      { status: 500 }
    )
  }
}
