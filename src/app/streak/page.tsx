"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useGameStats } from '@/hooks/useGameStats'
import { useAuth } from '@/contexts/auth-context'
import { Flame, Trophy, Calendar, Shield, Zap, TrendingUp, Award } from 'lucide-react'
import Link from 'next/link'

export default function StreakPage() {
  const { stats } = useGameStats()
  const { user } = useAuth()
  const [streakCalendar, setStreakCalendar] = useState<boolean[]>([])
  const [longestStreak, setLongestStreak] = useState(0)

  useEffect(() => {
    // Generate last 30 days calendar
    const last30Days = Array(30).fill(false).map((_, i) => {
      // Simulate streak data - in real app, would come from Firestore
      return i < stats.streak
    }).reverse()
    setStreakCalendar(last30Days)

    // Calculate longest streak (would be from Firestore in real app)
    setLongestStreak(Math.max(stats.streak, 0))
  }, [stats.streak])

  const getStreakMessage = () => {
    if (stats.streak === 0) return "Start your streak by playing a game today!"
    if (stats.streak === 1) return "Great start! Come back tomorrow to build your streak!"
    if (stats.streak < 7) return `${stats.streak} days! Keep it going!`
    if (stats.streak < 30) return `${stats.streak} days! You're on fire!`
    if (stats.streak < 100) return `${stats.streak} days! Legendary streak!`
    return `${stats.streak} days! You're unstoppable!`
  }

  const getStreakColor = () => {
    if (stats.streak === 0) return "text-gray-400"
    if (stats.streak < 7) return "text-orange-500"
    if (stats.streak < 30) return "text-red-500"
    return "text-purple-500"
  }

  return (
    <div className="container py-8 space-y-8 relative">
      <div className="absolute inset-0 -z-10 hero-gradient opacity-35" />
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Flame className={`h-12 w-12 ${getStreakColor()}`} />
          <h1 className="text-5xl font-bold">{stats.streak} Day Streak</h1>
        </div>
        <p className="text-muted-foreground text-xl">
          {getStreakMessage()}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-orange-500">{stats.streak}</p>
            <p className="text-sm text-muted-foreground mt-2">days in a row</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-purple-500">{longestStreak}</p>
            <p className="text-sm text-muted-foreground mt-2">personal best</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Total XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-blue-500">{stats.xp + (stats.level - 1) * 100}</p>
            <p className="text-sm text-muted-foreground mt-2">all time</p>
          </CardContent>
        </Card>
      </div>

      {/* Streak Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Last 30 Days
          </CardTitle>
          <CardDescription>Your activity over the past month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 md:grid-cols-15 gap-2">
            {streakCalendar.map((active, index) => (
              <div
                key={index}
                className={`aspect-square rounded-md transition-colors ${
                  active
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-muted hover:bg-muted-foreground/20'
                }`}
                title={`Day ${30 - index}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>

      {/* Streak Freeze Feature */}
      <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Streak Freeze
          </CardTitle>
          <CardDescription>Protect your streak from breaks (Coming Soon)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-semibold">Equipped Streak Freezes</p>
              <p className="text-sm text-muted-foreground">0 available</p>
            </div>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Streak Freezes allow you to maintain your streak even if you miss a day. 
            Earn them by completing daily goals or reaching milestones!
          </p>
        </CardContent>
      </Card>

      {/* Streak Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Streak Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
              {[
              { days: 3, reward: 'Bronze Streak', unlocked: stats.streak >= 3 },
              { days: 7, reward: 'Silver Streak', unlocked: stats.streak >= 7 },
              { days: 14, reward: 'Gold Streak', unlocked: stats.streak >= 14 },
              { days: 30, reward: 'Platinum Streak', unlocked: stats.streak >= 30 },
              { days: 100, reward: 'Diamond Streak', unlocked: stats.streak >= 100 },
              { days: 365, reward: 'Legendary Streak', unlocked: stats.streak >= 365 },
            ].map((milestone) => (
              <div
                key={milestone.days}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  milestone.unlocked
                    ? 'bg-primary/5 border-primary/30'
                    : 'bg-muted/30 border-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${milestone.unlocked ? 'text-yellow-500' : 'text-muted-foreground opacity-50'}`}>
                    {milestone.unlocked ? <Trophy className="h-8 w-8" /> : <Award className="h-8 w-8" />}
                  </div>
                  <div>
                    <p className="font-semibold">{milestone.reward}</p>
                    <p className="text-sm text-muted-foreground">{milestone.days} day streak</p>
                  </div>
                </div>
                {milestone.unlocked ? (
                  <Badge variant="secondary" className="bg-primary/20">Unlocked ✓</Badge>
                ) : (
                  <Badge variant="outline">
                    {milestone.days - stats.streak} days to go
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      {!user && (
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
          <CardContent className="p-6 text-center space-y-4">
            <Flame className="h-12 w-12 mx-auto text-orange-500" />
            <p className="text-lg font-medium">
              Sign in to save your streak and compete with friends!
            </p>
            <Link href="/stats">
              <Button size="lg">Create Account</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {stats.streak === 0 && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <CardContent className="p-6 text-center space-y-4">
            <Gamepad2 className="h-12 w-12 mx-auto text-primary" />
            <p className="text-lg font-medium">
              Start your streak today by playing a game!
            </p>
            <Link href="/games">
              <Button size="lg" className="gap-2">
                <Gamepad2 className="h-5 w-5" />
                Browse Games
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Gamepad2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  )
}
