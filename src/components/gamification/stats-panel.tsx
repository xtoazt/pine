"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Flame, Star, Target } from 'lucide-react'

interface StatsPanelProps {
  stats: {
    gamesPlayed: number
    streak: number
    level: number
    xp: number
  }
  achievements: any[]
}

const XP_PER_LEVEL = 100

export function StatsPanel({ stats, achievements }: StatsPanelProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const xpProgress = (stats.xp / XP_PER_LEVEL) * 100

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">Level {stats.level}</span>
            </div>
            <span className="text-xs text-muted-foreground">{stats.xp}/{XP_PER_LEVEL} XP</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-background/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-blue-500" />
              <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
            </div>
            <div className="text-xs text-muted-foreground">Games Played</div>
          </div>
          
          <div className="text-center p-3 bg-background/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <div className="text-2xl font-bold">{stats.streak}</div>
            </div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          
          <div className="text-center p-3 bg-background/50 rounded-lg col-span-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <div className="text-2xl font-bold">{unlockedCount}/{achievements.length}</div>
            </div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </div>
        </div>

        {/* Streak Encouragement */}
        {stats.streak >= 3 && (
          <Badge variant="secondary" className="w-full justify-center bg-orange-500/10 text-orange-600 dark:text-orange-400">
            🔥 {stats.streak} day streak! Keep it up!
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
