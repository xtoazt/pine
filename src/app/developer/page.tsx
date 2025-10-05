"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Code, 
  Database, 
  Activity, 
  Zap, 
  ArrowLeft, 
  Play, 
  Copy, 
  CheckCircle,
  BarChart3,
  Globe,
  Server,
  Terminal
} from 'lucide-react'
import Link from 'next/link'
import { Game } from '@/types/game'

interface SourceStats {
  source: string
  count: number
  percentage: number
}

interface ProxyStats {
  endpoint: string
  usage: number
  avgResponseTime: string
}

export default function DeveloperPage() {
  const [games, setGames] = useState<Game[]>([])
  const [sourceStats, setSourceStats] = useState<SourceStats[]>([])
  const [proxyStats, setProxyStats] = useState<ProxyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [playgroundUrl, setPlaygroundUrl] = useState('')
  const [playgroundResponse, setPlaygroundResponse] = useState('')
  const [playgroundLoading, setPlaygroundLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchDeveloperStats()
  }, [])

  const fetchDeveloperStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/games?external=true&limit=1000')
      const data = await response.json()
      const gamesList: Game[] = data.games || []
      setGames(gamesList)

      // Calculate source statistics
      const sourceCounts: Record<string, number> = {}
      gamesList.forEach(game => {
        const source = game.source || 'unknown'
        sourceCounts[source] = (sourceCounts[source] || 0) + 1
      })

      const total = gamesList.length
      const stats: SourceStats[] = Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        count,
        percentage: (count / total) * 100
      })).sort((a, b) => b.count - a.count)

      setSourceStats(stats)

      // Mock proxy stats (in production, these would come from actual analytics)
      setProxyStats([
        { endpoint: '/api/hdun/proxy', usage: 1250, avgResponseTime: '245ms' },
        { endpoint: '/api/ds/proxy', usage: 890, avgResponseTime: '312ms' },
        { endpoint: '/api/proxy/lessons', usage: 567, avgResponseTime: '189ms' },
      ])
    } catch (error) {
      console.error('Error fetching developer stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const executePlayground = async () => {
    if (!playgroundUrl) return
    
    try {
      setPlaygroundLoading(true)
      setPlaygroundResponse('')
      
      const response = await fetch(playgroundUrl)
      const data = await response.json()
      setPlaygroundResponse(JSON.stringify(data, null, 2))
    } catch (error: any) {
      setPlaygroundResponse(`Error: ${error.message}`)
    } finally {
      setPlaygroundLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      lessons: 'bg-blue-500',
      hdun: 'bg-green-500',
      fortnite: 'bg-purple-500',
      radon: 'bg-orange-500',
      gamesnacks: 'bg-pink-500',
      gnmath: 'bg-yellow-500',
      s16: 'bg-red-500',
      classwork: 'bg-indigo-500',
      unknown: 'bg-gray-500'
    }
    return colors[source] || colors.unknown
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <Code className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Developer Mode</h1>
                <Badge variant="secondary" className="ml-2">BETA</Badge>
              </div>
              <p className="text-muted-foreground mt-2">
                Advanced tools and analytics for pine developers
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{games.length.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all sources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Game Sources</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sourceStats.length}</div>
              <p className="text-xs text-muted-foreground">Active integrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proxy Endpoints</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proxyStats.length}</div>
              <p className="text-xs text-muted-foreground">Active proxies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Operational</div>
              <p className="text-xs text-muted-foreground">All systems normal</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="sources" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sources">
              <BarChart3 className="mr-2 h-4 w-4" />
              Sources
            </TabsTrigger>
            <TabsTrigger value="proxy">
              <Globe className="mr-2 h-4 w-4" />
              Proxy
            </TabsTrigger>
            <TabsTrigger value="playground">
              <Terminal className="mr-2 h-4 w-4" />
              Playground
            </TabsTrigger>
            <TabsTrigger value="api">
              <Zap className="mr-2 h-4 w-4" />
              API Docs
            </TabsTrigger>
          </TabsList>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Game Source Distribution</CardTitle>
                <CardDescription>
                  Breakdown of games by source integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading statistics...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sourceStats.map((stat) => (
                      <div key={stat.source} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getSourceColor(stat.source)}`} />
                            <span className="font-medium capitalize">{stat.source}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground">
                              {stat.count.toLocaleString()} games
                            </span>
                            <Badge variant="secondary">
                              {stat.percentage.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getSourceColor(stat.source)}`}
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Details</CardTitle>
                <CardDescription>
                  Technical information about each game source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Lessons</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Educational math games from gn-math repository
                      </p>
                      <Badge variant="outline">Static</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">HDUN</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Curated HTML5 games from HDUN platform
                      </p>
                      <Badge variant="outline">Proxied</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Fortnite Games</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Popular unblocked games collection
                      </p>
                      <Badge variant="outline">Static</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Radon Games</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Dynamic game collection via GitHub
                      </p>
                      <Badge variant="outline">Dynamic</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">GameSnacks</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Mobile-optimized HTML5 games
                      </p>
                      <Badge variant="outline">Proxied</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">s16.lol</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Large game API with 20,000+ titles
                      </p>
                      <Badge variant="outline">API</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Classwork.cc</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Popular unblocked games collection
                      </p>
                      <Badge variant="outline">Proxied</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Proxy Tab */}
          <TabsContent value="proxy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Proxy Usage Statistics</CardTitle>
                <CardDescription>
                  Real-time analytics for proxy endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proxyStats.map((proxy) => (
                    <div key={proxy.endpoint} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {proxy.endpoint}
                        </code>
                        <Badge variant="secondary">{proxy.avgResponseTime}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Requests</span>
                        <span className="font-medium">{proxy.usage.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proxy Configuration</CardTitle>
                <CardDescription>
                  Technical details about proxy setup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">HDUN Proxy</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Streams games directly from HDUN platform with URL rewriting
                    </p>
                    <code className="text-xs block bg-background p-2 rounded mt-2">
                      /api/hdun/proxy?id=&#123;gameId&#125;
                    </code>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">DS Proxy</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Generic proxy for external game sources (Definitely Science compatible)
                    </p>
                    <code className="text-xs block bg-background p-2 rounded mt-2">
                      /api/ds/proxy?url=&#123;encodedUrl&#125;
                    </code>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Lessons Proxy</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Specialized proxy for math lesson games with asset rewriting
                    </p>
                    <code className="text-xs block bg-background p-2 rounded mt-2">
                      /api/proxy/lessons/&#123;gameId&#125;
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playground Tab */}
          <TabsContent value="playground" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Playground</CardTitle>
                <CardDescription>
                  Test API endpoints in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Endpoint</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="/api/games?limit=10"
                      value={playgroundUrl}
                      onChange={(e) => setPlaygroundUrl(e.target.value)}
                    />
                    <Button onClick={executePlayground} disabled={playgroundLoading}>
                      <Play className="mr-2 h-4 w-4" />
                      Execute
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Response</label>
                    {playgroundResponse && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(playgroundResponse)}
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <Textarea
                    placeholder="Response will appear here..."
                    value={playgroundResponse}
                    readOnly
                    className="font-mono text-xs min-h-[300px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Examples</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPlaygroundUrl('/api/games?limit=5')}
                    >
                      Get 5 Games
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPlaygroundUrl('/api/games?category=action&limit=10')}
                    >
                      Action Games
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPlaygroundUrl('/api/games?source=hdun&limit=5')}
                    >
                      HDUN Games
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPlaygroundUrl('/api/categories')}
                    >
                      All Categories
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Docs Tab */}
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Complete reference for pine API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Base URL</h3>
                  <code className="block bg-muted p-3 rounded text-sm">
                    https://pine-games.vercel.app
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Endpoints</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge>GET</Badge>
                        <code className="text-sm">/api/games</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Fetch games with optional filters
                      </p>
                      <div className="text-xs space-y-1">
                        <p><strong>Parameters:</strong></p>
                        <ul className="list-disc list-inside ml-2 text-muted-foreground">
                          <li>limit - Number of games to return (default: 50)</li>
                          <li>offset - Pagination offset (default: 0)</li>
                          <li>category - Filter by category</li>
                          <li>search - Search query</li>
                          <li>source - Filter by source (lessons, hdun, etc.)</li>
                          <li>external - Include external sources (true/false)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge>GET</Badge>
                        <code className="text-sm">/api/games/[id]</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get a specific game by ID
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge>GET</Badge>
                        <code className="text-sm">/api/categories</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get all game categories with counts
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge>GET</Badge>
                        <code className="text-sm">/api/stats</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get platform statistics
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Button asChild>
                    <Link href="/api">
                      View Full API Documentation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
