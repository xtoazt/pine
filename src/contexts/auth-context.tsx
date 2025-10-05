"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, isConfigured } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (username: string, password: string) => Promise<void>
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (username: string, password: string) => {
    if (!isConfigured || !auth || !db) {
      throw new Error('Firebase is not configured. Please set up your environment variables.')
    }

    try {
      // Use username as email (username@pine.local) to avoid requiring real email
      const email = `${username.toLowerCase()}@pine.local`
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name to username
      await updateProfile(userCredential.user, {
        displayName: username,
      })

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username,
        createdAt: new Date().toISOString(),
        level: 1,
        xp: 0,
        streak: 0,
        lastPlayedDate: null,
        gamesPlayed: 0,
        totalPlayTime: 0,
        achievements: [],
        likedGames: [],
      })
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Username already taken')
      }
      throw error
    }
  }

  const signIn = async (username: string, password: string) => {
    if (!isConfigured || !auth) {
      throw new Error('Firebase is not configured. Please set up your environment variables.')
    }

    try {
      const email = `${username.toLowerCase()}@pine.local`
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid username or password')
      }
      throw error
    }
  }

  const signOut = async () => {
    if (!isConfigured || !auth) return
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
