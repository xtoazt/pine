"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
// TODO: Implement user profile with Neon database

export interface UserProfile {
  username: string
  createdAt: string
  level: number
  xp: number
  streak: number
  lastPlayedDate: string | null
  gamesPlayed: number
  totalPlayTime: number
  achievements: string[]
  likedGames: string[]
  gameHistory: Array<{
    gameId: string
    playedAt: string
    source: string
    category: string
  }>
}

export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    // TODO: Load user profile from Neon database
    // For now, profile features are disabled during migration
    setLoading(false)
  }, [user])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    // TODO: Update profile in Neon database
    console.log('Profile update temporarily disabled during migration')
  }

  const likeGame = async (gameId: string) => {
    if (!user || !profile) return

    const likedGames = profile.likedGames || []
    const isLiked = likedGames.includes(gameId)

    const updatedLikes = isLiked
      ? likedGames.filter((id) => id !== gameId)
      : [...likedGames, gameId]

    await updateProfile({ likedGames: updatedLikes })
  }

  const addGameToHistory = async (gameId: string, source: string, category: string) => {
    if (!user || !profile) return

    const gameHistory = profile.gameHistory || []
    gameHistory.unshift({
      gameId,
      playedAt: new Date().toISOString(),
      source,
      category,
    })

    // Keep only last 100 games
    if (gameHistory.length > 100) {
      gameHistory.pop()
    }

    await updateProfile({ gameHistory })
  }

  return {
    profile,
    loading,
    updateProfile,
    likeGame,
    addGameToHistory,
  }
}
