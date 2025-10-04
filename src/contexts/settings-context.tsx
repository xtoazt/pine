"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface Settings {
  // Theme settings
  theme: string
  accentColor: string
  fontSize: number
  boldText: boolean
  
  // Layout settings
  layout: string
  gamesPerRow: number
  showGameCounts: boolean
  compactMode: boolean
  
  // Display settings
  showThumbnails: boolean
  showDescriptions: boolean
  showTags: boolean
  showStats: boolean
  
  // Privacy settings
  enableCloaking: boolean
  rememberPreferences: boolean
  analytics: boolean
}

const defaultSettings: Settings = {
  theme: 'system',
  accentColor: 'blue',
  fontSize: 16,
  boldText: true,
  layout: 'grid',
  gamesPerRow: 4,
  showGameCounts: true,
  compactMode: false,
  showThumbnails: true,
  showDescriptions: true,
  showTags: true,
  showStats: true,
  enableCloaking: true,
  rememberPreferences: true,
  analytics: false,
}

interface SettingsContextType {
  settings: Settings
  updateSetting: (key: keyof Settings, value: any) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('pine-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  const updateSetting = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    if (settings.rememberPreferences) {
      localStorage.setItem('pine-settings', JSON.stringify(newSettings))
    }

    // Apply theme changes immediately
    if (key === 'theme' && typeof window !== 'undefined') {
      const html = document.documentElement
      if (value === 'dark') {
        html.classList.add('dark')
      } else if (value === 'light') {
        html.classList.remove('dark')
      } else {
        // System theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
          html.classList.add('dark')
        } else {
          html.classList.remove('dark')
        }
      }
    }

    // Apply font size changes
    if (key === 'fontSize') {
      document.documentElement.style.fontSize = `${value}px`
    }

    // Apply bold text changes
    if (key === 'boldText') {
      const body = document.body
      if (value) {
        body.style.fontWeight = '600'
      } else {
        body.style.fontWeight = '400'
      }
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.setItem('pine-settings', JSON.stringify(defaultSettings))
    
    // Reset theme
    if (typeof window !== 'undefined') {
      const html = document.documentElement
      html.classList.remove('dark')
      document.documentElement.style.fontSize = '16px'
      document.body.style.fontWeight = '600'
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
