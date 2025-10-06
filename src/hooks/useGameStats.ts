"use client"

import { useState, useEffect } from 'react'
import { checkAchievements, ACHIEVEMENTS, type Achievement } from '@/lib/achievements'
import { useAuth } from '@/contexts/auth-context'
// TODO: Implement stats sync with Neon database

interface GameStats {
  gamesPlayed: number
  uniqueGames: number
  streak: number
  lastVisit: string | null
  sourcesPlayed: string[]
  categoriesPlayed: string[]
  playedAtNight: boolean
  favoritesCount: number
  level: number
  xp: number
}

const STORAGE_KEY = 'pine-game-stats'
const XP_PER_GAME = 10
const XP_PER_LEVEL = 100

export function useGameStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    uniqueGames: 0,
    streak: 0,
    lastVisit: null,
    sourcesPlayed: [],
    categoriesPlayed: [],
    playedAtNight: false,
    favoritesCount: 0,
    level: 1,
    xp: 0
  })

  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS.map(a => ({ ...a })))
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  // Load from localStorage (Neon sync coming soon)
  useEffect(() => {
    if (user) {
      // TODO: Sync with Neon database
      // For now, use localStorage
      updateAchievements()
    }
      // Use localStorage for guest users
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedStats = JSON.parse(stored)
        setStats(parsedStats)
        
        // Check streak
        const today = new Date().toDateString()
        const lastVisit = parsedStats.lastVisit
        if (lastVisit) {
          const lastDate = new Date(lastVisit)
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          
          if (lastDate.toDateString() === yesterday.toDateString()) {
            parsedStats.streak = (parsedStats.streak || 0) + 1
          } else if (lastDate.toDateString() !== today) {
            parsedStats.streak = 1
          }
        } else {
          parsedStats.streak = 1
        }
        
        parsedStats.lastVisit = today
        setStats(parsedStats)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedStats))
        // Avoid immediate duplicate updates; let state settle first
        setTimeout(() => updateAchievements(), 0)
      } else {
        const initialStats = { ...stats, lastVisit: new Date().toDateString(), streak: 1 }
        setStats(initialStats)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStats))
        setTimeout(() => updateAchievements(), 0)
      }
  }, [user])

  const updateAchievements = () => {
    if (!stats) return
    if (stats.gamesPlayed === 0 && stats.streak === 0) return // Don't update if stats aren't loaded yet

    const newAchievements = checkAchievements(stats)
    const previousAchievements = achievements

    if (previousAchievements.length > 0) {
      const newlyUnlocked = newAchievements.find((a, i) =>
        a.unlocked && !previousAchievements[i]?.unlocked
      )
      if (newlyUnlocked) {
        setNewAchievement(newlyUnlocked)
        setTimeout(() => setNewAchievement(null), 5000)
      }
    }

    setAchievements(newAchievements)
  }

  const saveStats = async (newStats: GameStats) => {
    if (user) {
      // TODO: Save to Neon database
      // For now, use localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats))
    } else {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats))
    }
    setStats(newStats)
    updateAchievements()
  }

  const recordGamePlayed = (gameId: string, source: string, category: string) => {
    const hour = new Date().getHours()
    const isNight = hour >= 0 && hour < 6
    
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      uniqueGames: stats.uniqueGames + 1,
      sourcesPlayed: Array.from(new Set([...stats.sourcesPlayed, source])),
      categoriesPlayed: Array.from(new Set([...stats.categoriesPlayed, category])),
      playedAtNight: stats.playedAtNight || isNight,
      xp: stats.xp + XP_PER_GAME,
      lastVisit: new Date().toDateString()
    }
    
    // Level up
    while (newStats.xp >= XP_PER_LEVEL) {
      newStats.xp -= XP_PER_LEVEL
      newStats.level += 1
    }

    saveStats(newStats)
    updateAchievements()
  }

  const updateFavoritesCount = (count: number) => {
    const newStats = { ...stats, favoritesCount: count }
    saveStats(newStats)
    updateAchievements()
  }

  return {
    stats,
    achievements,
    newAchievement,
    recordGamePlayed,
    updateFavoritesCount
  }
}