"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useGameStats } from '@/hooks/useGameStats'
import { Trophy, Flame, Star, Target, Award } from 'lucide-react'
import { StatsPanel } from '@/components/gamification/stats-panel'

export default function StatsPage() {
  const { stats, achievements } = useGameStats()
  
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const completionPercentage = (unlockedCount / achievements.length) * 100

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Your Progress</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Track your gaming journey and unlock achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsPanel stats={stats} achievements={achievements} />
        
        <Card className="bg-gradient-to-br from-purple-500/5 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Achievement Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {unlockedCount} / {achievements.length} Unlocked
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
            
            {stats.streak >= 7 && (
              <div className="mt-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Flame className="h-5 w-5" />
                  <span className="font-semibold">Amazing {stats.streak} day streak! 🔥</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id}
              className={`transition-all ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/50' 
                  : 'opacity-60 grayscale'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      ✓ Unlocked
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span className="font-mono">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Motivational Messages */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-medium">
            {unlockedCount === 0 && "Start playing games to unlock your first achievement! 🎮"}
            {unlockedCount > 0 && unlockedCount < 3 && "Great start! Keep playing to unlock more achievements! 🌟"}
            {unlockedCount >= 3 && unlockedCount < 6 && "You're on fire! More achievements await! 🔥"}
            {unlockedCount >= 6 && unlockedCount < achievements.length && "Almost there! Can you unlock them all? 👑"}
            {unlockedCount === achievements.length && "Congratulations! You've unlocked everything! You're a legend! ⭐"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
