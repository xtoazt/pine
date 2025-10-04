"use client"

import { useMusic } from '@/contexts/MusicContext'
import { MusicToggle } from './MusicToggle'

export function MusicToggleWrapper() {
  const { isMusicVisible, toggleMusic } = useMusic()
  
  return (
    <MusicToggle onToggle={toggleMusic} isVisible={isMusicVisible} />
  )
}
