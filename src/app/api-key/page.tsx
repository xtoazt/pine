"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Key, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react'
import { AuthModal } from '@/components/auth/auth-modal'

export default function ApiKeyPage() {
  const { user } = useAuth()
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    if (user) {
      // API key is returned when user syncs
      // For now, we'll fetch it from localStorage or show a message
      const storedKey = localStorage.getItem('pine-api-key')
      if (storedKey) {
        setApiKey(storedKey)
      }
    }
    setLoading(false)
  }, [user])

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const regenerateKey = async () => {
    if (!user) return
    
    setRegenerating(true)
    try {
      // Call sync-user to regenerate API key
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          photoUrl: user.photoURL,
        }),
      })
      
      const data = await response.json()
      if (data.apiKey) {
        setApiKey(data.apiKey)
        localStorage.setItem('pine-api-key', data.apiKey)
      }
    } catch (error) {
      console.error('Error regenerating API key:', error)
    } finally {
      setRegenerating(false)
    }
  }

  if (!user) {
    return (
      <div className="container py-8 relative">
        <div className="absolute inset-0 -z-10 hero-gradient opacity-40" />
        <Card className="max-w-2xl mx-auto liquid-glass">
          <CardContent className="p-12 text-center space-y-4">
            <Key className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">API Key Required</h2>
            <p className="text-muted-foreground">
              Sign up for a free account to get your API key and access thousands of games!
            </p>
            <Button onClick={() => setShowAuthModal(true)} size="lg">
              Sign Up for Free API Key
            </Button>
          </CardContent>
        </Card>
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8 relative">
      <div className="absolute inset-0 -z-10 section-gradient" />
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Key className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">API Key</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Your free API key for accessing Pine games
        </p>
      </div>

      {/* API Key Card */}
      <Card className="max-w-3xl mx-auto liquid-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Your API Key
          </CardTitle>
          <CardDescription>
            Use this key to access the Pine games API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Loading your API key...</p>
            </div>
          ) : apiKey ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <div className="flex gap-2">
                  <Input
                    value={apiKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="icon"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Copied to clipboard!
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Button
                  onClick={regenerateKey}
                  variant="outline"
                  disabled={regenerating}
                >
                  {regenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate API Key
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Regenerating will invalidate your old key
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-yellow-500" />
              <div>
                <p className="font-semibold">No API Key Found</p>
                <p className="text-sm text-muted-foreground">
                  Click below to generate your free API key
                </p>
              </div>
              <Button onClick={regenerateKey} disabled={regenerating}>
                {regenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Generate API Key
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="max-w-3xl mx-auto liquid-glass">
        <CardHeader>
          <CardTitle>How to Use Your API Key</CardTitle>
          <CardDescription>
            Include your API key in requests to access games
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Method 1: Query Parameter</h3>
            <code className="block p-3 bg-muted rounded-md text-xs overflow-x-auto">
              /api/games?api_key=YOUR_API_KEY
            </code>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Method 2: Header</h3>
            <code className="block p-3 bg-muted rounded-md text-xs overflow-x-auto">
              x-api-key: YOUR_API_KEY
            </code>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-1">Your API key is automatically included</p>
              <p>When you're signed in, Pine automatically includes your API key in all requests. No manual configuration needed!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="max-w-3xl mx-auto liquid-glass">
        <CardHeader>
          <CardTitle>What You Get</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Free</Badge>
              <div>
                <p className="font-semibold text-sm">Unlimited Access</p>
                <p className="text-xs text-muted-foreground">Access to 20,000+ games</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">Fast</Badge>
              <div>
                <p className="font-semibold text-sm">High Performance</p>
                <p className="text-xs text-muted-foreground">Optimized API with caching</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400">Secure</Badge>
              <div>
                <p className="font-semibold text-sm">Protected</p>
                <p className="text-xs text-muted-foreground">Your key, your access</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400">Updated</Badge>
              <div>
                <p className="font-semibold text-sm">Always Fresh</p>
                <p className="text-xs text-muted-foreground">New games added regularly</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
