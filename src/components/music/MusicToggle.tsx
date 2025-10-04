"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Music, VolumeX } from 'lucide-react'

interface MusicToggleProps {
  onToggle: () => void
  isVisible: boolean
}

export function MusicToggle({ onToggle, isVisible }: MusicToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="fixed bottom-4 left-4 z-50 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background/90 transition-all duration-200"
      title={isVisible ? "Hide Music Player" : "Show Music Player"}
    >
      {isVisible ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Music className="h-5 w-5" />
      )}
    </Button>
  )
}
