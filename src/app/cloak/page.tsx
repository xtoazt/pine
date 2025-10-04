"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, Eye, EyeOff, Settings, Info } from 'lucide-react'
import Link from 'next/link'

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

export default function CloakPage() {
  const [selectedCloak, setSelectedCloak] = useState<string>("default")
  const [customTitle, setCustomTitle] = useState("")
  const [customIcon, setCustomIcon] = useState("")
  const [isCloaked, setIsCloaked] = useState(false)

  useEffect(() => {
    // Check if cloak is available
    if (typeof window !== 'undefined' && window.cloak) {
      // Load saved cloak from localStorage
      const savedCloak = localStorage.getItem('selectedCloak')
      if (savedCloak && cloaks.find(c => c.name === savedCloak)) {
        setSelectedCloak(savedCloak)
        setIsCloaked(savedCloak !== 'default')
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

  const applyCustomCloak = () => {
    if (typeof window !== 'undefined' && window.cloak && customTitle && customIcon) {
      window.cloak.setCloak(customTitle, customIcon)
      localStorage.setItem('selectedCloak', 'custom')
      setIsCloaked(true)
    }
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

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cloak Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure tab cloaking to make the site appear as other websites
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">
            <Settings className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preset Cloaks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Preset Cloaks
            </CardTitle>
            <CardDescription>
              Choose from popular website appearances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cloak-select">Select Cloak</Label>
              <Select value={selectedCloak} onValueChange={(value) => {
                setSelectedCloak(value)
                applyCloak(value)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a cloak" />
                </SelectTrigger>
                <SelectContent>
                  {cloaks.map((cloak) => (
                    <SelectItem key={cloak.name} value={cloak.name}>
                      <div className="flex items-center space-x-2">
                        <img 
                          src={cloak.icon} 
                          alt={cloak.name} 
                          className="w-4 h-4"
                          onError={(e) => {
                            e.currentTarget.src = '/favicon.ico'
                          }}
                        />
                        <span>{cloak.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              {isCloaked && (
                <Button variant="outline" onClick={resetCloak}>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Reset Cloak
                </Button>
              )}
              <Button onClick={openAboutBlank}>
                <Shield className="mr-2 h-4 w-4" />
                Open in about:blank
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Cloak */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Custom Cloak
            </CardTitle>
            <CardDescription>
              Create your own custom appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-title">Custom Title</Label>
              <Input
                id="custom-title"
                placeholder="Enter custom title..."
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-icon">Custom Icon URL</Label>
              <Input
                id="custom-icon"
                placeholder="Enter icon URL..."
                value={customIcon}
                onChange={(e) => setCustomIcon(e.target.value)}
              />
            </div>
            <Button 
              onClick={applyCustomCloak}
              disabled={!customTitle || !customIcon}
              className="w-full"
            >
              Apply Custom Cloak
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5" />
            How Cloaking Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Tab Cloaking</h4>
              <p className="text-sm text-muted-foreground">
                Changes the browser tab title and favicon to make the site appear as another website.
                This helps bypass content filters and restrictions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">About:Blank</h4>
              <p className="text-sm text-muted-foreground">
                Opens the current page in an about:blank iframe, making it appear as a blank page
                while still allowing access to the content.
              </p>
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Security Note</h4>
            <p className="text-sm text-muted-foreground">
              Cloaking is designed to help users access content in restricted environments.
              Always follow your organization's policies and use responsibly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
