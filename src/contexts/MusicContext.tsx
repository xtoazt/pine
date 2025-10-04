"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface MusicContextType {
  isMusicVisible: boolean
  toggleMusic: () => void
  showMusic: () => void
  hideMusic: () => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isMusicVisible, setIsMusicVisible] = useState(false)

  const toggleMusic = () => {
    setIsMusicVisible(prev => !prev)
  }

  const showMusic = () => {
    setIsMusicVisible(true)
  }

  const hideMusic = () => {
    setIsMusicVisible(false)
  }

  return (
    <MusicContext.Provider value={{
      isMusicVisible,
      toggleMusic,
      showMusic,
      hideMusic
    }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}
