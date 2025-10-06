"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'

export function useApiKey() {
  const { user } = useAuth()
  const [apiKey, setApiKey] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      // Get API key from localStorage
      const storedKey = localStorage.getItem('pine-api-key')
      setApiKey(storedKey)
    } else {
      setApiKey(null)
    }
  }, [user])

  // Helper function to add API key to fetch requests
  const fetchWithApiKey = async (url: string, options?: RequestInit) => {
    const key = apiKey || localStorage.getItem('pine-api-key')
    
    if (!key) {
      throw new Error('API key required. Please sign in to continue.')
    }

    // Add API key to headers
    const headers = new Headers(options?.headers)
    headers.set('x-api-key', key)

    return fetch(url, {
      ...options,
      headers,
    })
  }

  // Helper function to add API key to URL
  const addApiKeyToUrl = (url: string) => {
    const key = apiKey || localStorage.getItem('pine-api-key')
    if (!key) return url

    const urlObj = new URL(url, window.location.origin)
    urlObj.searchParams.set('api_key', key)
    return urlObj.toString()
  }

  return {
    apiKey,
    hasApiKey: !!apiKey,
    fetchWithApiKey,
    addApiKeyToUrl,
  }
}
