// Achievement system for gamification

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
  unlockedAt?: Date
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    title: 'First Steps',
    description: 'Play your first game',
    icon: 'Gamepad2',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Play games from 3 different sources',
    icon: 'Map',
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Visit pine 3 days in a row',
    icon: 'Flame',
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'game-master',
    title: 'Game Master',
    description: 'Play 10 different games',
    icon: 'Crown',
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'marathon',
    title: 'Marathon',
    description: 'Play 25 games',
    icon: 'Zap',
    unlocked: false,
    progress: 0,
    maxProgress: 25
  },
  {
    id: 'legend',
    title: 'Legend',
    description: 'Play 50 games',
    icon: 'Star',
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'variety-lover',
    title: 'Variety Lover',
    description: 'Play games from all 5 categories',
    icon: 'Shuffle',
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Play a game after midnight',
    icon: 'Moon',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Add 10 games to favorites',
    icon: 'Heart',
    unlocked: false,
    progress: 0,
    maxProgress: 10
  }
]

export function checkAchievements(userStats: any): Achievement[] {
  const achievements = ACHIEVEMENTS.map(a => ({ ...a }))
  
  // First Steps
  if (userStats.gamesPlayed >= 1) {
    achievements[0].unlocked = true
    achievements[0].progress = 1
  } else {
    achievements[0].progress = userStats.gamesPlayed
  }
  
  // Explorer
  const sourcesPlayed = new Set(userStats.sourcesPlayed || []).size
  achievements[1].progress = sourcesPlayed
  if (sourcesPlayed >= 3) achievements[1].unlocked = true
  
  // Dedicated (streak)
  achievements[2].progress = Math.min(userStats.streak || 0, 3)
  if (userStats.streak >= 3) achievements[2].unlocked = true
  
  // Game Master
  achievements[3].progress = Math.min(userStats.uniqueGames || 0, 10)
  if (userStats.uniqueGames >= 10) achievements[3].unlocked = true
  
  // Marathon
  achievements[4].progress = Math.min(userStats.gamesPlayed || 0, 25)
  if (userStats.gamesPlayed >= 25) achievements[4].unlocked = true
  
  // Legend
  achievements[5].progress = Math.min(userStats.gamesPlayed || 0, 50)
  if (userStats.gamesPlayed >= 50) achievements[5].unlocked = true
  
  // Variety Lover
  const categoriesPlayed = new Set(userStats.categoriesPlayed || []).size
  achievements[6].progress = categoriesPlayed
  if (categoriesPlayed >= 5) achievements[6].unlocked = true
  
  // Night Owl
  if (userStats.playedAtNight) {
    achievements[7].unlocked = true
    achievements[7].progress = 1
  }
  
  // Completionist
  achievements[8].progress = Math.min(userStats.favoritesCount || 0, 10)
  if (userStats.favoritesCount >= 10) achievements[8].unlocked = true
  
  return achievements
}

export function getUnlockedCount(achievements: Achievement[]): number {
  return achievements.filter(a => a.unlocked).length
}
