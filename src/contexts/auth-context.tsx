"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { isStackConfigured } from '@/lib/stack'

interface User {
  id: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

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

export function AuthProvider({ children }: { children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Only use Stack Auth if configured
  let stackUser: any = null
  if (isStackConfigured && typeof window !== 'undefined') {
    try {
      const { useUser } = require('@stackframe/stack')
      stackUser = useUser()
    } catch (e) {
      // Stack Auth not available
    }
  }

  useEffect(() => {
    if (stackUser) {
      setUser({
        id: stackUser.id,
        email: stackUser.primaryEmail || null,
        displayName: stackUser.displayName || stackUser.primaryEmail || null,
        photoURL: stackUser.profileImageUrl || null,
      })
      
      // Sync user to Neon database
      syncUserToDatabase(stackUser).catch(console.error)
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [stackUser])

  const syncUserToDatabase = async (stackUser: any) => {
    try {
      // Upsert user to Neon database and get API key
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: stackUser.id,
          email: stackUser.primaryEmail,
          displayName: stackUser.displayName || stackUser.primaryEmail,
          photoUrl: stackUser.profileImageUrl,
        }),
      })
      
      const data = await response.json()
      if (data.apiKey) {
        // Store API key in localStorage for client-side use
        localStorage.setItem('pine-api-key', data.apiKey)
      }
    } catch (error) {
      console.error('[auth] Error syncing user to database:', error)
    }
  }

  const signUp = async (username: string, password: string) => {
    try {
      // Stack Auth handles signup via their UI components
      // This is a placeholder for compatibility
      throw new Error('Please use the Stack Auth signup UI')
    } catch (error: any) {
      throw error
    }
  }

  const signIn = async (username: string, password: string) => {
    try {
      // Stack Auth handles signin via their UI components
      // This is a placeholder for compatibility
      throw new Error('Please use the Stack Auth signin UI')
    } catch (error: any) {
      throw error
    }
  }

  const signOut = async () => {
    // Clear API key from localStorage
    localStorage.removeItem('pine-api-key')
    
    // Stack Auth sign out - redirect to home
    if (typeof window !== 'undefined') {
      window.location.href = '/api/auth/signout'
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}