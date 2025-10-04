"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Key, Gamepad2, Code, ExternalLink, CheckCircle } from 'lucide-react'

export default function ApiPage() {
  const [apiKey, setApiKey] = useState('')
  const [generatedKey, setGeneratedKey] = useState('')
  const [copied, setCopied] = useState('')

  const generateApiKey = async () => {
    try {
      const response = await fetch('/api/key')
      const data = await response.json()
      setGeneratedKey(data.apiKey)
    } catch (error) {
      console.error('Error generating API key:', error)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const htmlSnippet = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pine Games</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .games-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .game-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .game-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .game-description { color: #666; margin-bottom: 15px; }
        .game-stats { display: flex; gap: 15px; font-size: 14px; color: #888; }
        .play-button { background: #007bff; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
        .play-button:hover { background: #0056b3; }
        .loading { text-align: center; padding: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎮 Pine Games Collection</h1>
            <p>Powered by Pine Games API</p>
        </div>
        <div id="games-container" class="loading">Loading games...</div>
    </div>

    <script>
        // Replace with your API key (optional but recommended)
        const API_KEY = '${generatedKey || 'your_api_key_here'}';
        
        async function loadGames() {
            try {
                const url = API_KEY ? 
                    \`https://pine-games.vercel.app/api/games?api_key=\${API_KEY}\` :
                    'https://pine-games.vercel.app/api/games?limit=50';
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.games && data.games.length > 0) {
                    displayGames(data.games);
                } else {
                    document.getElementById('games-container').innerHTML = 
                        '<div class="loading">No games found</div>';
                }
            } catch (error) {
                console.error('Error loading games:', error);
                document.getElementById('games-container').innerHTML = 
                    '<div class="loading">Error loading games</div>';
            }
        }
        
        function displayGames(games) {
            const container = document.getElementById('games-container');
            container.innerHTML = \`
                <div class="games-grid">
                    \${games.map(game => \`
                        <div class="game-card">
                            <div class="game-title">\${game.title}</div>
                            <div class="game-description">\${game.description || 'No description available'}</div>
                            <div class="game-stats">
                                <span>👍 \${game.upvotes}</span>
                                <span>👁️ \${game.playCount}</span>
                                <span>🏷️ \${game.category}</span>
                            </div>
                            <button class="play-button" onclick="window.open('\${game.playUrl}', '_blank')">
                                Play Game
                            </button>
                        </div>
                    \`).join('')}
                </div>
            \`;
        }
        
        // Load games when page loads
        loadGames();
    </script>
</body>
</html>`

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Code className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Pine Games API</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Simple, powerful API for accessing our complete collection of 6,000+ games. 
          No authentication required, but API keys unlock unlimited access.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">6,000+ Games</Badge>
          <Badge variant="secondary">No Rate Limits</Badge>
          <Badge variant="secondary">JSON API</Badge>
          <Badge variant="secondary">Free to Use</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="html-snippet">HTML Snippet</TabsTrigger>
          <TabsTrigger value="developer">Developer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  API Key Generation
                </CardTitle>
            <CardDescription>
                  Generate an API key for unlimited access to all games
            </CardDescription>
          </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={generateApiKey} className="w-full">
                  <Key className="mr-2 h-4 w-4" />
                  Generate API Key
                </Button>
                {generatedKey && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input value={generatedKey} readOnly className="font-mono text-sm" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generatedKey, 'key')}
                      >
                        {copied === 'key' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use this key to access all games: ?api_key={generatedKey}
                    </p>
                  </div>
                )}
              </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
                <CardTitle className="flex items-center">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Quick Start
                </CardTitle>
            <CardDescription>
                  Get started with our API in seconds
            </CardDescription>
          </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Without API Key (Limited)</h4>
                  <code className="block p-2 bg-muted rounded text-sm">
                    GET /api/games?limit=50
                  </code>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">With API Key (Unlimited)</h4>
                  <code className="block p-2 bg-muted rounded text-sm">
                    GET /api/games?api_key=your_key
              </code>
            </div>
          </CardContent>
        </Card>
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
                <CardTitle>GET /api/games</CardTitle>
                <CardDescription>Retrieve games with optional filtering and pagination</CardDescription>
          </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Query Parameters</h4>
                  <div className="space-y-2 text-sm">
                    <div><code>api_key</code> - Your API key (optional, enables unlimited access)</div>
                    <div><code>limit</code> - Number of games to return (default: 50, max: unlimited with API key)</div>
                    <div><code>offset</code> - Number of games to skip (default: 0)</div>
                    <div><code>search</code> - Search games by title, description, or tags</div>
                    <div><code>category</code> - Filter by category (action, puzzle, car, shooter, etc.)</div>
                    <div><code>sortBy</code> - Sort by: popular, newest, most-played, alphabetical</div>
                    <div><code>all</code> - Set to 'true' to get all games (requires API key)</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Response Format</h4>
                  <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`{
  "games": [
    {
      "id": "game-id",
      "title": "Game Title",
      "description": "Game description",
      "thumbnail": "image-url",
      "category": "action",
      "tags": ["tag1", "tag2"],
      "playUrl": "/play/game-id",
      "upvotes": 100,
      "downvotes": 5,
      "playCount": 1000,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 6000,
  "hasMore": false,
  "apiKey": "valid",
  "message": "All games included"
}`}
                  </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
                <CardTitle>GET /api/categories</CardTitle>
                <CardDescription>Get all available game categories with counts</CardDescription>
          </CardHeader>
          <CardContent>
                <div className="space-y-2 text-sm">
                  <div>Returns all categories with game counts and icons</div>
                  <div>No parameters required</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
                <CardTitle>GET /api/key</CardTitle>
                <CardDescription>Generate a new API key</CardDescription>
          </CardHeader>
          <CardContent>
                <div className="space-y-2 text-sm">
                  <div>Generates a new API key for unlimited access</div>
                  <div>No parameters required</div>
            </div>
          </CardContent>
        </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
                <CardTitle>JavaScript Examples</CardTitle>
          </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Fetch All Games</h4>
                  <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`// With API key
const response = await fetch('https://pine-games.vercel.app/api/games?api_key=your_key');
const data = await response.json();
console.log(data.games); // All 6000+ games

// Without API key (limited)
const response = await fetch('https://pine-games.vercel.app/api/games?limit=50');
const data = await response.json();
console.log(data.games); // 50 games`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Search Games</h4>
                  <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`const response = await fetch('https://pine-games.vercel.app/api/games?search=car&category=racing');
const data = await response.json();
console.log(data.games); // Car racing games`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Get Categories</h4>
                  <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`const response = await fetch('https://pine-games.vercel.app/api/categories');
const data = await response.json();
console.log(data.categories); // All categories with counts`}
              </pre>
            </div>
          </CardContent>
        </Card>
          </div>
        </TabsContent>

        <TabsContent value="html-snippet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complete HTML Example</CardTitle>
              <CardDescription>
                Copy this HTML code to display all games on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  This snippet will display all games in a responsive grid layout
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(htmlSnippet, 'html')}
                >
                  {copied === 'html' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy HTML
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto max-h-96">
                {htmlSnippet}
                </pre>
              <div className="flex gap-2">
                <Button asChild>
                  <a href="data:text/html;charset=utf-8,${encodeURIComponent(htmlSnippet)}" download="pine-games.html">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Download HTML File
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`data:text/html;charset=utf-8,${encodeURIComponent(htmlSnippet)}`} target="_blank">
                    Preview
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
          
        <TabsContent value="developer" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  Game Sources & Data
                </CardTitle>
                <CardDescription>
                  Information about where games come from and how to identify them
                </CardDescription>
            </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Game Sources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium text-green-600">Lessons Data</h5>
                      <p className="text-sm text-muted-foreground">606 games</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Educational and classic games from the original lessons collection
                      </p>
                    </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium text-blue-600">HDUN Games</h5>
                          <p className="text-sm text-muted-foreground">417 games</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Curated collection of high-quality HTML5 games
                          </p>
                        </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium text-purple-600">Fortnite Games</h5>
                      <p className="text-sm text-muted-foreground">35 games</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Games from the Fortnite game repository
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Identifying Game Sources</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded">
                      <h5 className="font-medium">By Game ID Pattern</h5>
                      <pre className="text-xs mt-2">
{`// Lessons games
"lesson-1", "lesson-2", etc.

// HDUN games  
"hdun-action-1", "hdun-puzzle-5", etc.

// Fortnite games
"fortnite-game-1", "fortnite-game-2", etc.`}
                      </pre>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <h5 className="font-medium">By Source Property</h5>
                      <pre className="text-xs mt-2">
{`// API Response includes source field
{
  "id": "hdun-action-1",
  "title": "Game Title",
  "source": "hdun",  // "lessons", "hdun", or "fortnite"
  ...
}`}
                </pre>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">API Endpoints for Source Data</h4>
                  <div className="space-y-2 text-sm">
                    <div><code>GET /api/games?source=lessons</code> - Get only lessons games</div>
                    <div><code>GET /api/games?source=hdun</code> - Get only HDUN games</div>
                    <div><code>GET /api/games?source=fortnite</code> - Get only Fortnite games</div>
                    <div><code>GET /api/games?api_key=key</code> - Get all games with source info</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Game Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 border rounded">
                      <div className="text-2xl font-bold text-green-600">606</div>
                      <div className="text-xs text-muted-foreground">Lessons</div>
                    </div>
                        <div className="p-3 border rounded">
                          <div className="text-2xl font-bold text-blue-600">417</div>
                          <div className="text-xs text-muted-foreground">HDUN</div>
                        </div>
                    <div className="p-3 border rounded">
                      <div className="text-2xl font-bold text-purple-600">35</div>
                      <div className="text-xs text-muted-foreground">Fortnite</div>
                    </div>
                    <div className="p-3 border rounded">
                        <div className="text-2xl font-bold text-primary">1,058</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}