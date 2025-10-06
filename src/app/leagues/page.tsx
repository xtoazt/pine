"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useGameStats } from '@/hooks/useGameStats'
import { useAuth } from '@/contexts/auth-context'
import { Trophy, Crown, TrendingUp, Users, Zap, Award, Target, Flame } from 'lucide-react'
// TODO: Implement leagues with Neon database

interface LeagueEntry {
  username: string
  level: number
  xp: number
  weeklyXP: number
  streak: number
  isCurrentUser?: boolean
}

interface League {
  name: string
  color: string
  bgColor: string
  borderColor: string
  icon: any
  minXP: number
  maxXP: number
  promotionXP: number
  demotionXP: number
}

const leagues: League[] = [
  {
    name: 'Bronze',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    icon: Trophy,
    minXP: 0,
    maxXP: 500,
    promotionXP: 400,
    demotionXP: 0,
  },
  {
    name: 'Silver',
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/20',
    icon: Trophy,
    minXP: 500,
    maxXP: 1000,
    promotionXP: 800,
    demotionXP: 300,
  },
  {
    name: 'Gold',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    icon: Crown,
    minXP: 1000,
    maxXP: 2000,
    promotionXP: 1600,
    demotionXP: 600,
  },
  {
    name: 'Diamond',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    icon: Crown,
    minXP: 2000,
    maxXP: 999999,
    promotionXP: 999999,
    demotionXP: 1200,
  },
]

export default function LeaguesPage() {
  const { user } = useAuth()
  const { stats } = useGameStats()
  const [currentLeague, setCurrentLeague] = useState<League>(leagues[0])
  const [leagueEntries, setLeagueEntries] = useState<LeagueEntry[]>([])
  const [userWeeklyXP, setUserWeeklyXP] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    // TODO: Implement league leaderboard with Neon database
    // For now, leagues feature is disabled during migration
  }, [user, userWeeklyXP])

  useEffect(() => {
    if (!user) return

    // TODO: Implement user weekly XP tracking with Neon database
    // For now, leagues feature is disabled during migration
  }, [user])

  const getLeagueProgress = () => {
    const progress = ((userWeeklyXP - currentLeague.minXP) / (currentLeague.maxXP - currentLeague.minXP)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  const getNextLeague = () => {
    const currentIndex = leagues.findIndex(l => l.name === currentLeague.name)
    return currentIndex < leagues.length - 1 ? leagues[currentIndex + 1] : null
  }

  const getPreviousLeague = () => {
    const currentIndex = leagues.findIndex(l => l.name === currentLeague.name)
    return currentIndex > 0 ? leagues[currentIndex - 1] : null
  }

  const nextLeague = getNextLeague()
  const previousLeague = getPreviousLeague()

  return (
    <div className="container py-8 space-y-8 relative">
      <div className="absolute inset-0 -z-10 hero-gradient opacity-40" />
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Weekly Leagues</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Compete with players worldwide and climb the ranks
        </p>
      </div>

      {/* Current League */}
      <Card className={`${currentLeague.bgColor} ${currentLeague.borderColor} border-2`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <currentLeague.icon className={`h-6 w-6 ${currentLeague.color}`} />
              <span className={currentLeague.color}>{currentLeague.name} League</span>
            </div>
            <Badge variant="secondary" className="bg-primary/20">
              Your League
            </Badge>
          </CardTitle>
          <CardDescription>
            Weekly XP: {userWeeklyXP} / {currentLeague.maxXP === 999999 ? '∞' : currentLeague.maxXP}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {nextLeague?.name || 'Max Rank'}</span>
              <span className="font-mono">
                {userWeeklyXP} / {nextLeague?.minXP || currentLeague.maxXP} XP
              </span>
            </div>
            <Progress value={getLeagueProgress()} className="h-3" />
          </div>

          {nextLeague && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm">
                {nextLeague.minXP - userWeeklyXP} XP to reach {nextLeague.name} League
              </span>
            </div>
          )}

          {previousLeague && userWeeklyXP < previousLeague.demotionXP && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <TrendingUp className="h-5 w-5 text-red-500 rotate-180" />
              <span className="text-sm text-red-600 dark:text-red-400">
                {previousLeague.demotionXP - userWeeklyXP} XP until demotion to {previousLeague.name}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* League Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {leagues.map((league) => (
          <Card 
            key={league.name}
            className={`${league.bgColor} ${league.borderColor} border ${
              league.name === currentLeague.name ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardContent className="p-4 text-center space-y-2">
              <league.icon className={`h-8 w-8 mx-auto ${league.color}`} />
              <h3 className={`font-semibold ${league.color}`}>{league.name}</h3>
              <p className="text-xs text-muted-foreground">
                {league.minXP === 0 ? '0+' : `${league.minXP}+`} XP
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current League Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {currentLeague.name} League Leaderboard
          </CardTitle>
          <CardDescription>Top players in your league this week</CardDescription>
        </CardHeader>
        <CardContent>
          {leagueEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No players in this league yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leagueEntries.slice(0, 20).map((entry, index) => (
                <div
                  key={entry.username}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    entry.isCurrentUser ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'
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
                        {entry.isCurrentUser && <Badge variant="secondary">You</Badge>}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          Lv.{entry.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {entry.streak}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="font-bold">{entry.weeklyXP} XP</span>
                    </div>
                    <p className="text-xs text-muted-foreground">this week</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* League Rules */}
      <Card className="bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            How Leagues Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Weekly Reset</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <p>Leagues reset every Monday at midnight</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <p>Your weekly XP counter resets to 0</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <p>Promotions and demotions are calculated</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Ranking System</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <p>Earn XP by playing games (10 XP per game)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <p>Top 3 in league earn bonus rewards</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <p>Bottom players get demoted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      {!user && (
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
          <CardContent className="p-6 text-center space-y-4">
            <Trophy className="h-12 w-12 mx-auto text-primary" />
            <p className="text-lg font-medium">
              Sign in to join leagues and compete with players worldwide!
            </p>
            <Button size="lg">Create Account</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
