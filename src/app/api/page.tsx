"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code, Zap, Database, Globe } from 'lucide-react'
import Link from 'next/link'

export default function ApiPage() {
  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">pine API</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A simple, powerful API for accessing our game collection. No authentication required, 
            no rate limits, just clean JSON responses.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#getting-started">
              <Zap className="mr-2 h-5 w-5" />
              Get Started
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/rohan/pine">
              <Code className="mr-2 h-5 w-5" />
              View Source
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Globe className="h-8 w-8 text-primary mb-2" />
            <CardTitle>No Authentication</CardTitle>
            <CardDescription>
              Start using the API immediately without any setup or API keys
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Fast & Reliable</CardTitle>
            <CardDescription>
              Built with modern web technologies for optimal performance
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <Database className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Rich Data</CardTitle>
            <CardDescription>
              Access game metadata, categories, stats, and more
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Getting Started */}
      <section id="getting-started" className="space-y-6">
        <h2 className="text-3xl font-bold">Getting Started</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Fetch All Games</CardTitle>
            <CardDescription>
              Get a list of all available games with pagination support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">
                GET /api/games?limit=20&offset=0
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Games</CardTitle>
            <CardDescription>
              Search games by title, description, or tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">
                GET /api/games?q=puzzle&category=puzzle
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get Categories</CardTitle>
            <CardDescription>
              Fetch all available game categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">
                GET /api/categories
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Stats</CardTitle>
            <CardDescription>
              Get platform statistics and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">
                GET /api/stats
              </code>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* API Endpoints */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">API Endpoints</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">GET /api/games</h3>
              <p className="text-sm text-muted-foreground">Fetch games with filtering and pagination</p>
            </div>
            <Badge variant="secondary">Games</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">GET /api/categories</h3>
              <p className="text-sm text-muted-foreground">Get all game categories</p>
            </div>
            <Badge variant="secondary">Categories</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">GET /api/stats</h3>
              <p className="text-sm text-muted-foreground">Platform statistics and metrics</p>
            </div>
            <Badge variant="secondary">Stats</Badge>
          </div>
        </div>
      </section>

      {/* Query Parameters */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Query Parameters</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Games API Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Filtering</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><code>q</code> - Search query</li>
                    <li><code>category</code> - Filter by category</li>
                    <li><code>tags</code> - Filter by tags (comma-separated)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Pagination & Sorting</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><code>limit</code> - Number of results (default: 20)</li>
                    <li><code>offset</code> - Skip results (default: 0)</li>
                    <li><code>sortBy</code> - Sort by: newest, popular, rating</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Example Response */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Example Response</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Games API Response</CardTitle>
            <CardDescription>
              Example response from GET /api/games
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
{`{
  "games": [
    {
      "id": "class-782",
      "title": "Stickman Fighter",
      "description": "Epic stickman fighting game...",
      "thumbnail": "https://top-vaz-online.github.io/img/class-782.png",
      "category": "fighting",
      "tags": ["stickman", "fighting", "action"],
      "playUrl": "/play/class-782",
      "upvotes": 1250,
      "downvotes": 45,
      "playCount": 15600,
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "total": 500,
  "hasMore": true
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Integration Examples */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Integration Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>JavaScript/TypeScript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm">
{`const response = await fetch('/api/games?limit=10');
const data = await response.json();
console.log(data.games);`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Python</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm">
{`import requests

response = requests.get('/api/games?limit=10')
data = response.json()
print(data['games'])`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Start building amazing game experiences with our simple, powerful API. 
          No setup required, just make a request and start coding.
        </p>
        <Button size="lg" asChild>
          <Link href="/api/games">
            <Zap className="mr-2 h-5 w-5" />
            Try the API Now
          </Link>
        </Button>
      </section>
    </div>
  )
}
