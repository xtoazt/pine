"use client"

import { useEffect, useState } from 'react'
import { Achievement } from '@/lib/achievements'
import { Card } from '@/components/ui/card'

interface AchievementToastProps {
  achievement: Achievement | null
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => setIsVisible(false), 4500)
      return () => clearTimeout(timer)
    }
  }, [achievement])

  if (!achievement || !isVisible) return null

  return (
    <div className="fixed top-20 right-4 z-[100] animate-in slide-in-from-right duration-500">
      <Card className="p-4 bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{achievement.icon}</div>
          <div>
            <div className="font-bold text-sm">Achievement Unlocked!</div>
            <div className="text-sm font-semibold">{achievement.title}</div>
            <div className="text-xs text-muted-foreground">{achievement.description}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
