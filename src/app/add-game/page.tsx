"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Upload, Download, ExternalLink, Gamepad2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const gameCategories = [
  'action', 'adventure', 'arcade', 'puzzle', 'racing', 'sports', 'strategy',
  'simulation', 'fighting', 'horror', 'educational', 'multiplayer', 'building',
  'tower-defense', 'idle', 'board', 'rpg', 'shooter', 'platform', 'car', 'casual'
]

export default function AddGamePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    gameUrl: '',
    thumbnailUrl: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Validate form
      if (!formData.title || !formData.gameUrl || !formData.category) {
        throw new Error('Please fill in all required fields')
      }

      // Create game data
      const gameData = {
        id: `custom-${Date.now()}`,
        title: formData.title,
        description: formData.description || `Play ${formData.title} - a custom game added by the community.`,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [formData.category],
        playUrl: formData.gameUrl,
        thumbnail: formData.thumbnailUrl || '/api/placeholder/300/200',
        upvotes: 0,
        downvotes: 0,
        playCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'custom'
      }

      // Store in localStorage for now (in a real app, this would go to a database)
      const existingGames = JSON.parse(localStorage.getItem('customGames') || '[]')
      existingGames.push(gameData)
      localStorage.setItem('customGames', JSON.stringify(existingGames))

      setSubmitStatus('success')
      
      // Redirect to the new game after a short delay
      setTimeout(() => {
        router.push(`/play/${gameData.id}`)
      }, 2000)

    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadGameTemplate = () => {
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Custom Game</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
        }
        .game-container {
            background: #333;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            color: white;
        }
        .game-title {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .game-area {
            width: 400px;
            height: 300px;
            background: #222;
            border: 2px solid #555;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0;
        }
        .start-button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .start-button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1 class="game-title">My Custom Game</h1>
        <div class="game-area" id="gameArea">
            <p>Click Start to begin!</p>
        </div>
        <button class="start-button" onclick="startGame()">Start Game</button>
    </div>

    <script>
        function startGame() {
            const gameArea = document.getElementById('gameArea');
            gameArea.innerHTML = '<p>Game is running! Add your game logic here.</p>';
            
            // Add your game logic here
            // Example: Simple click counter
            let score = 0;
            gameArea.innerHTML = \`
                <div>
                    <p>Score: <span id="score">0</span></p>
                    <button onclick="incrementScore()">Click Me!</button>
                </div>
            \`;
            
            window.incrementScore = function() {
                score++;
                document.getElementById('score').textContent = score;
            };
        }
    </script>
</body>
</html>`

    const blob = new Blob([template], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-custom-game.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Add Your Game</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Can't find the game you're looking for? Add it to pine! You can host it online or create your own.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Game Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add a Game</CardTitle>
            <CardDescription>
              Submit a game URL or create your own game to add to pine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Game Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter game title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your game (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="action, fun, multiplayer (comma separated)"
                />
              </div>

              <div>
                <Label htmlFor="gameUrl">Game URL *</Label>
                <Input
                  id="gameUrl"
                  type="url"
                  value={formData.gameUrl}
                  onChange={(e) => handleInputChange('gameUrl', e.target.value)}
                  placeholder="https://example.com/my-game.html"
                  required
                />
              </div>

              <div>
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                  placeholder="https://example.com/thumbnail.png (optional)"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Game added successfully! Redirecting...</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Adding Game...' : 'Add Game'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help & Resources */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How to Add Games</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Find a Game URL</h4>
                    <p className="text-sm text-muted-foreground">Get the direct URL to an HTML5 game or create your own</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Fill in Details</h4>
                    <p className="text-sm text-muted-foreground">Add title, category, and description for your game</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Submit & Play</h4>
                    <p className="text-sm text-muted-foreground">Your game will be added and you can play it immediately</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Your Own Game</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Don't have a game URL? Create your own HTML5 game using our template!
              </p>
              <Button onClick={downloadGameTemplate} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Game Template
              </Button>
              <div className="text-xs text-muted-foreground">
                <p>• Edit the template with your game logic</p>
                <p>• Host it on GitHub Pages, Netlify, or any web server</p>
                <p>• Use the hosted URL in the form above</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Game Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">itch.io</Badge>
                <Badge variant="secondary">GameJolt</Badge>
                <Badge variant="secondary">Kongregate</Badge>
                <Badge variant="secondary">Newgrounds</Badge>
                <Badge variant="secondary">GitHub</Badge>
                <Badge variant="secondary">CodePen</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Many HTML5 games from these platforms can be embedded directly
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
