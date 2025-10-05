import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { initializeApp, getApps } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyDtaYf6FLsPL9FsTqFEE6lJlxPepxnSOKg",
  authDomain: "pine-744dd.firebaseapp.com",
  projectId: "pine-744dd",
  storageBucket: "pine-744dd.firebasestorage.app",
  messagingSenderId: "266139672867",
  appId: "1:266139672867:web:2c6215cc3661d9652bac96",
  measurementId: "G-PHTMKDR4B0"
}

// Initialize Firebase for server-side
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'global'

    if (type === 'leaderboard') {
      // Get top users by level and XP
      const usersRef = collection(db, 'users')
      const q = query(usersRef, orderBy('level', 'desc'), orderBy('xp', 'desc'), limit(100))
      const snapshot = await getDocs(q)
      
      const leaderboard = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          username: data.username,
          level: data.level || 1,
          xp: data.xp || 0,
          gamesPlayed: data.gamesPlayed || 0,
          streak: data.streak || 0,
          achievements: data.achievements?.length || 0
        }
      })

      return NextResponse.json({ leaderboard })
    }

    if (type === 'global') {
      // Calculate global statistics
      const usersRef = collection(db, 'users')
      const snapshot = await getDocs(usersRef)
      
      let totalUsers = 0
      let totalGamesPlayed = 0
      let totalAchievements = 0
      let highestStreak = 0
      let highestLevel = 0

      snapshot.docs.forEach(doc => {
        const data = doc.data()
        totalUsers++
        totalGamesPlayed += data.gamesPlayed || 0
        totalAchievements += data.achievements?.length || 0
        highestStreak = Math.max(highestStreak, data.streak || 0)
        highestLevel = Math.max(highestLevel, data.level || 1)
      })

      return NextResponse.json({
        totalUsers,
        totalGamesPlayed,
        totalAchievements,
        highestStreak,
        highestLevel
      })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}