"use client"

import { useState, useEffect } from 'react'
import { Game } from '@/types/game'

export function useCustomGames() {
  const [customGames, setCustomGames] = useState<Game[]>([])

  useEffect(() => {
    // Load custom games from localStorage
    const stored = localStorage.getItem('customGames')
    if (stored) {
      try {
        const games = JSON.parse(stored)
        setCustomGames(games)
      } catch (error) {
        console.error('Error loading custom games:', error)
      }
    }
  }, [])

  const addCustomGame = (game: Game) => {
    const newGames = [...customGames, game]
    setCustomGames(newGames)
    localStorage.setItem('customGames', JSON.stringify(newGames))
  }

  const removeCustomGame = (gameId: string) => {
    const newGames = customGames.filter(game => game.id !== gameId)
    setCustomGames(newGames)
    localStorage.setItem('customGames', JSON.stringify(newGames))
  }

  const getCustomGamesHeader = () => {
    return customGames.length > 0 ? JSON.stringify(customGames) : null
  }

  return {
    customGames,
    addCustomGame,
    removeCustomGame,
    getCustomGamesHeader
  }
}
