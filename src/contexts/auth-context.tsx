"use client"

import { createContext, useContext, useEffect, useState } from 'react'

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
  loading: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Auth is disabled for now - can be implemented with Neon Auth or another solution
  useEffect(() => {
    setLoading(false)
  }, [])

  const signUp = async (username: string, password: string) => {
    // TODO: Implement authentication
    console.log('Sign up not yet implemented')
    throw new Error('Authentication not yet implemented')
  }

  const signIn = async (username: string, password: string) => {
    // TODO: Implement authentication
    console.log('Sign in not yet implemented')
    throw new Error('Authentication not yet implemented')
  }

  const signOut = async () => {
    // TODO: Implement authentication
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}