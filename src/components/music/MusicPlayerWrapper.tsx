"use client"

import { useMusic } from '@/contexts/MusicContext'
import { MusicPlayer } from './MusicPlayer'

export function MusicPlayerWrapper() {
  const { isMusicVisible, toggleMusic } = useMusic()
  
  return (
    <MusicPlayer isVisible={isMusicVisible} onToggle={toggleMusic} />
  )
}
