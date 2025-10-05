"use client"

import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/auth-context'

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
    if (!user || !db) {
      setProfile(null)
      setLoading(false)
      return
    }

    // Real-time listener for user profile
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !db) return

    try {
      await updateDoc(doc(db, 'users', user.uid), updates)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
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
