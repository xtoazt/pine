"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useGameStats } from '@/hooks/useGameStats'
import { useAuth } from '@/contexts/auth-context'
import { Trophy, Flame, Star, Target, Award, Users, TrendingUp, Crown, User, Gamepad2, Map, Zap, Shuffle, Moon, Heart } from 'lucide-react'
import { StatsPanel } from '@/components/gamification/stats-panel'

interface LeaderboardEntry {
  username: string
  level: number
  xp: number
  gamesPlayed: number
  streak: number
  achievements: number
}

interface GlobalStats {
  totalUsers: number
  totalGamesPlayed: number
  totalAchievements: number
  highestStreak: number
  highestLevel: number
}

// Map icon names to Lucide components
const iconMap = {
  Gamepad2,
  Map,
  Flame,
  Crown,
  Zap,
  Star,
  Shuffle,
  Moon,
  Heart,
  Trophy,
  Award
}

export default function StatsPage() {
  const { stats, achievements } = useGameStats()
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)
  const [loadingGlobal, setLoadingGlobal] = useState(false)

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const completionPercentage = (unlockedCount / achievements.length) * 100

  useEffect(() => {
    // Fetch leaderboard
    setLoadingLeaderboard(true)
    fetch('/api/stats?type=leaderboard')
      .then(r => r.json())
      .then(data => {
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard.slice(0, 10)) // Top 10
        }
      })
      .catch(err => console.error('Failed to load leaderboard:', err))
      .finally(() => setLoadingLeaderboard(false))

    // Fetch global stats
    setLoadingGlobal(true)
    fetch('/api/stats?type=global')
      .then(r => r.json())
      .then(data => {
        setGlobalStats(data)
      })
      .catch(err => console.error('Failed to load global stats:', err))
      .finally(() => setLoadingGlobal(false))
  }, [])

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Stats & Leaderboard</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Track your gaming journey and compete with others
        </p>
      </div>

      {/* Global Stats */}
      {globalStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Users className="h-8 w-8 mx-auto text-blue-500" />
                <p className="text-3xl font-bold">{globalStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Players</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Target className="h-8 w-8 mx-auto text-green-500" />
                <p className="text-3xl font-bold">{globalStats.totalGamesPlayed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Games Played</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Award className="h-8 w-8 mx-auto text-purple-500" />
                <p className="text-3xl font-bold">{globalStats.totalAchievements.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Achievements</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Flame className="h-8 w-8 mx-auto text-orange-500" />
                <p className="text-3xl font-bold">{globalStats.highestStreak}</p>
                <p className="text-xs text-muted-foreground">Longest Streak</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Crown className="h-8 w-8 mx-auto text-yellow-500" />
                <p className="text-3xl font-bold">{globalStats.highestLevel}</p>
                <p className="text-xs text-muted-foreground">Highest Level</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                  <div className={`text-4xl mb-2 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground opacity-50'}`}>
                    {React.createElement(iconMap[achievement.icon as keyof typeof iconMap] || Trophy, { className: "w-10 h-10" })}
                  </div>
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

      {/* Leaderboard */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Top Players
        </h2>
        <Card>
          <CardContent className="p-0">
            {loadingLeaderboard ? (
              <div className="p-8 text-center text-muted-foreground">Loading leaderboard...</div>
            ) : leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No players yet. Be the first to sign up and play!
              </div>
            ) : (
              <div className="divide-y">
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = user && user.displayName === entry.username
                  return (
                    <div 
                      key={entry.username} 
                      className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                        isCurrentUser ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`font-bold w-8 text-center flex items-center justify-center ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' :
                          index === 2 ? 'text-orange-600' :
                          'text-muted-foreground'
                        }`}>
                          {index < 3 ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            <span className="text-lg">#{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            {entry.username}
                            {isCurrentUser && <Badge variant="secondary">You</Badge>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.gamesPlayed} games • {entry.achievements} achievements
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">Lv.{entry.level}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.xp} XP</p>
                        {entry.streak > 0 && (
                          <div className="flex items-center gap-1 text-xs text-orange-500">
                            <Flame className="h-3 w-3" />
                            {entry.streak}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Messages */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            {!user && <User className="h-12 w-12 text-muted-foreground" />}
            {user && unlockedCount === 0 && <Target className="h-12 w-12 text-primary" />}
            {user && unlockedCount > 0 && unlockedCount < 3 && <Star className="h-12 w-12 text-yellow-500" />}
            {user && unlockedCount >= 3 && unlockedCount < 6 && <Flame className="h-12 w-12 text-orange-500" />}
            {user && unlockedCount >= 6 && unlockedCount < achievements.length && <Crown className="h-12 w-12 text-purple-500" />}
            {user && unlockedCount === achievements.length && <Award className="h-12 w-12 text-yellow-500" />}
            <p className="text-lg font-medium">
              {!user && "Sign in to save your progress and compete on the leaderboard!"}
              {user && unlockedCount === 0 && "Start playing games to unlock your first achievement!"}
              {user && unlockedCount > 0 && unlockedCount < 3 && "Great start! Keep playing to unlock more achievements!"}
              {user && unlockedCount >= 3 && unlockedCount < 6 && "You're on fire! More achievements await!"}
              {user && unlockedCount >= 6 && unlockedCount < achievements.length && "Almost there! Can you unlock them all?"}
              {user && unlockedCount === achievements.length && "Congratulations! You've unlocked everything! You're a legend!"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
