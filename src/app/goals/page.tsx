"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useGameStats } from '@/hooks/useGameStats'
import { useAuth } from '@/contexts/auth-context'
import { Target, Flame, Trophy, Calendar, CheckCircle, Zap, Award } from 'lucide-react'
import { db } from '@/lib/firebase'
import {
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'

interface DailyGoal {
  targetXP: number
  currentXP: number
  completed: boolean
  streak: number
  lastCompleted: string | null
}

export default function GoalsPage() {
  const { user } = useAuth()
  const { stats } = useGameStats()
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({
    targetXP: 50,
    currentXP: 0,
    completed: false,
    streak: 0,
    lastCompleted: null,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !db) return

    // Listen to user's daily goal data
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const userData = doc.data()
        setDailyGoal({
          targetXP: userData.dailyGoalTarget || 50,
          currentXP: userData.dailyXP || 0,
          completed: userData.dailyGoalCompleted || false,
          streak: userData.dailyGoalStreak || 0,
          lastCompleted: userData.lastDailyGoalCompleted,
        })
      }
    })

    return () => unsubscribe()
  }, [user])

  const updateGoal = async (newTarget: number) => {
    if (!user || !db) return

    setLoading(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        dailyGoalTarget: newTarget,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating goal:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetDailyProgress = async () => {
    if (!user || !db) return

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        dailyXP: 0,
        dailyGoalCompleted: false,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error resetting daily progress:', error)
    }
  }

  const progressPercentage = Math.min((dailyGoal.currentXP / dailyGoal.targetXP) * 100, 100)
  const isCompleted = dailyGoal.currentXP >= dailyGoal.targetXP

  const getGoalMessage = () => {
    if (isCompleted) {
      return `Goal completed! ${dailyGoal.streak} day streak!`
    }
    if (dailyGoal.currentXP === 0) {
      return `Start playing games to reach your ${dailyGoal.targetXP} XP goal!`
    }
    return `${dailyGoal.targetXP - dailyGoal.currentXP} XP to go!`
  }

  const getGoalColor = () => {
    if (isCompleted) return 'text-green-500'
    if (progressPercentage >= 75) return 'text-yellow-500'
    if (progressPercentage >= 50) return 'text-orange-500'
    return 'text-red-500'
  }

  return (
    <div className="container py-8 space-y-8 relative">
      <div className="absolute inset-0 -z-10 hero-gradient opacity-40" />
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Target className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Daily Goals</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Set daily XP targets and build consistency streaks
        </p>
      </div>

      {/* Main Goal Card */}
      <Card className={`${isCompleted ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20' : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className={`h-5 w-5 ${getGoalColor()}`} />
              Today's Goal
            </div>
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
          </CardTitle>
          <CardDescription>{getGoalMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-mono">
                {dailyGoal.currentXP} / {dailyGoal.targetXP} XP
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {isCompleted && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-green-600 dark:text-green-400">
                Goal completed! Come back tomorrow for your next goal.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goal Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Goal Settings
          </CardTitle>
          <CardDescription>Customize your daily XP target</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[30, 50, 100, 150].map((target) => (
              <Button
                key={target}
                variant={dailyGoal.targetXP === target ? 'default' : 'outline'}
                onClick={() => updateGoal(target)}
                disabled={loading}
                className="flex flex-col h-auto p-4"
              >
                <span className="font-bold">{target} XP</span>
                <span className="text-xs opacity-70">
                  {target === 30 ? 'Easy' : target === 50 ? 'Normal' : target === 100 ? 'Hard' : 'Expert'}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Goal Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">{dailyGoal.streak}</p>
            <p className="text-sm text-muted-foreground mt-2">consecutive days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Today's XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{dailyGoal.currentXP}</p>
            <p className="text-sm text-muted-foreground mt-2">earned today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              Total XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-500">{stats.xp + (stats.level - 1) * 100}</p>
            <p className="text-sm text-muted-foreground mt-2">all time</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Goal Streak Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { days: 3, reward: 'Goal Starter', unlocked: dailyGoal.streak >= 3 },
              { days: 7, reward: 'Weekly Warrior', unlocked: dailyGoal.streak >= 7 },
              { days: 14, reward: 'Consistent Player', unlocked: dailyGoal.streak >= 14 },
              { days: 30, reward: 'Monthly Master', unlocked: dailyGoal.streak >= 30 },
              { days: 100, reward: 'Goal Legend', unlocked: dailyGoal.streak >= 100 },
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
                    <p className="text-sm text-muted-foreground">{milestone.days} day goal streak</p>
                  </div>
                </div>
                {milestone.unlocked ? (
                  <Badge variant="secondary" className="bg-primary/20">Unlocked ✓</Badge>
                ) : (
                  <Badge variant="outline">
                    {milestone.days - dailyGoal.streak} days to go
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <p>Start with a smaller goal (30 XP) and gradually increase</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <p>Play games consistently rather than trying to complete everything in one session</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <p>Use streak freezes (coming soon) to protect your progress</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <p>Share your progress with friends for motivation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      {!user && (
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
          <CardContent className="p-6 text-center space-y-4">
            <Target className="h-12 w-12 mx-auto text-primary" />
            <p className="text-lg font-medium">
              Sign in to set daily goals and track your progress!
            </p>
            <Button size="lg">Create Account</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
