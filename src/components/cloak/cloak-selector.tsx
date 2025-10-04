"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, Eye, EyeOff } from 'lucide-react'

// Define cloak configurations
const cloaks = [
  { 
    name: "default", 
    icon: "/favicon.ico", 
    title: "pine - Minimalist Game Platform",
    description: "Default appearance"
  },
  { 
    name: "google", 
    icon: "https://www.google.com/favicon.ico", 
    title: "Google",
    description: "Google search appearance"
  },
  { 
    name: "wikipedia", 
    icon: "https://en.wikipedia.org/favicon.ico", 
    title: "Wikipedia",
    description: "Wikipedia appearance"
  },
  { 
    name: "github", 
    icon: "https://github.com/favicon.ico", 
    title: "GitHub",
    description: "GitHub appearance"
  },
  { 
    name: "stackoverflow", 
    icon: "https://stackoverflow.com/favicon.ico", 
    title: "Stack Overflow",
    description: "Stack Overflow appearance"
  },
  { 
    name: "reddit", 
    icon: "https://www.reddit.com/favicon.ico", 
    title: "Reddit",
    description: "Reddit appearance"
  },
  { 
    name: "youtube", 
    icon: "https://www.youtube.com/favicon.ico", 
    title: "YouTube",
    description: "YouTube appearance"
  },
  { 
    name: "discord", 
    icon: "https://discord.com/favicon.ico", 
    title: "Discord",
    description: "Discord appearance"
  }
]

declare global {
  interface Window {
    cloak: {
      getTitle: () => string
      setTitle: (title: string) => void
      getFavicon: () => string
      setFavicon: (url: string) => void
      setCloak: (title: string, url: string) => void
      reset: (refresh?: boolean) => void
      aboutBlank: (url?: string) => void
    }
  }
}

export function CloakSelector() {
  const [selectedCloak, setSelectedCloak] = useState<string>("default")
  const [isCloaked, setIsCloaked] = useState(false)

  useEffect(() => {
    // Check if cloak is available
    if (typeof window !== 'undefined' && window.cloak) {
      // Load saved cloak from localStorage
      const savedCloak = localStorage.getItem('selectedCloak')
      if (savedCloak && cloaks.find(c => c.name === savedCloak)) {
        setSelectedCloak(savedCloak)
        applyCloak(savedCloak)
      }
    }
  }, [])

  const applyCloak = (cloakName: string) => {
    if (typeof window !== 'undefined' && window.cloak) {
      const cloak = cloaks.find(c => c.name === cloakName)
      if (cloak) {
        window.cloak.setCloak(cloak.title, cloak.icon)
        localStorage.setItem('selectedCloak', cloakName)
        setIsCloaked(cloakName !== 'default')
      }
    }
  }

  const handleCloakChange = (value: string) => {
    setSelectedCloak(value)
    applyCloak(value)
  }

  const resetCloak = () => {
    if (typeof window !== 'undefined' && window.cloak) {
      window.cloak.reset(false)
      setSelectedCloak('default')
      localStorage.removeItem('selectedCloak')
      setIsCloaked(false)
    }
  }

  const openAboutBlank = () => {
    if (typeof window !== 'undefined' && window.cloak) {
      window.cloak.aboutBlank(window.location.href)
    }
  }

  if (typeof window === 'undefined') {
    return null
  }

  return (
    <div className="flex items-center space-x-1">
      <Select value={selectedCloak} onValueChange={handleCloakChange}>
        <SelectTrigger className="w-[100px] h-7 text-xs">
          <SelectValue placeholder="Cloak" />
        </SelectTrigger>
        <SelectContent>
          {cloaks.map((cloak) => (
            <SelectItem key={cloak.name} value={cloak.name}>
              <div className="flex items-center space-x-2">
                <img 
                  src={cloak.icon} 
                  alt={cloak.name} 
                  className="w-3 h-3"
                  onError={(e) => {
                    e.currentTarget.src = '/favicon.ico'
                  }}
                />
                <span className="text-xs">{cloak.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isCloaked && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetCloak}
          className="h-7 w-7 p-0"
          title="Reset cloak"
        >
          <EyeOff className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
